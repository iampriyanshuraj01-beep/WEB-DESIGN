/**
 * API Handler Module
 * Manages all external API calls for fetching jokes
 */

const API_CONFIG = {
  JOKEAPI: {
    base: 'https://v2.jokeapi.dev/joke/',
    timeout: 8000,
    categories: ['General', 'Programming', 'Knock-knock', 'Dark', 'Spooky', 'Religious', 'Any']
  },
  OFFICIAL: {
    base: 'https://official-joke-api.appspot.com/jokes/',
    timeout: 5000,
    categories: ['general', 'knock-knock', 'programming']
  }
};

/**
 * Fetch joke from JokeAPI
 * @param {string} category - Joke category
 * @returns {Promise<Object>} Joke object or error
 */
async function fetchFromJokeAPI(category = 'Any') {
  try {
    const endpoint = `${API_CONFIG.JOKEAPI.base}${category}`;
    const response = await fetchWithTimeout(endpoint, API_CONFIG.JOKEAPI.timeout);
    const data = await response.json();

    if (data.error) {
      throw new Error('API returned error');
    }

    return {
      success: true,
      source: 'JokeAPI',
      data: {
        type: data.type,
        category: data.category,
        joke: data.joke || `${data.setup} ... ${data.delivery}`,
        setup: data.setup,
        delivery: data.delivery,
        id: data.id,
        safe: data.safe
      }
    };
  } catch (error) {
    console.error('JokeAPI Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch joke from Official Joke API
 * @param {string} category - Joke category
 * @returns {Promise<Object>} Joke object or error
 */
async function fetchFromOfficialAPI(category = 'general') {
  try {
    const categoryMap = {
      'General': 'general',
      'Programming': 'programming',
      'Knock-knock': 'knock-knock',
      'Any': 'random'
    };

    const mappedCategory = categoryMap[category] || 'random';
    const endpoint = `${API_CONFIG.OFFICIAL.base}${mappedCategory}/random`;
    const response = await fetchWithTimeout(endpoint, API_CONFIG.OFFICIAL.timeout);
    const data = await response.json();

    return {
      success: true,
      source: 'Official Joke API',
      data: {
        type: mappedCategory,
        category: category,
        joke: `${data.setup} ... ${data.punchline}`,
        setup: data.setup,
        delivery: data.punchline,
        id: data.id,
        safe: true
      }
    };
  } catch (error) {
    console.error('Official API Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch with timeout
 * @param {string} url - URL to fetch
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} Response object
 */
function fetchWithTimeout(url, timeout = 8000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

/**
 * Get joke from preferred API with fallback
 * @param {string} category - Joke category
 * @param {string} preferredAPI - Preferred API source
 * @returns {Promise<Object>} Joke object
 */
async function getJoke(category = 'Any', preferredAPI = 'auto') {
  let result;

  if (preferredAPI === 'jokeapi' || preferredAPI === 'auto') {
    result = await fetchFromJokeAPI(category);
    if (result.success) return result;
  }

  if (preferredAPI === 'official' || preferredAPI === 'auto') {
    result = await fetchFromOfficialAPI(category);
    if (result.success) return result;
  }

  // If all APIs fail, return cached joke or error
  return {
    success: false,
    error: 'Unable to fetch joke from any API. Please check your internet connection.'
  };
}

/**
 * Fallback jokes for offline mode
 */
const FALLBACK_JOKES = [
  {
    type: 'single',
    joke: 'Why don\'t scientists trust atoms? Because they make up everything!',
    category: 'General',
    source: 'Offline'
  },
  {
    type: 'twopart',
    setup: 'Why did the scarecrow win an award?',
    delivery: 'Because he was outstanding in his field!',
    category: 'General',
    source: 'Offline'
  },
  {
    type: 'single',
    joke: 'I told my computer I needed a break, and now it won\'t stop sending me Kit-Kat ads.',
    category: 'Programming',
    source: 'Offline'
  },
  {
    type: 'twopart',
    setup: 'Why do programmers prefer dark mode?',
    delivery: 'Because light attracts bugs!',
    category: 'Programming',
    source: 'Offline'
  },
  {
    type: 'twopart',
    setup: 'Knock knock.',
    delivery: 'Who\'s there? Interrupting programmer. Interrupting prog— SYNTAX ERROR',
    category: 'Knock-knock',
    source: 'Offline'
  }
];

/**
 * Get fallback joke
 * @returns {Object} Fallback joke object
 */
function getFallbackJoke() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_JOKES.length);
  return {
    success: true,
    source: 'Offline Cache',
    data: FALLBACK_JOKES[randomIndex]
  };
}

/**
 * Validate joke response
 * @param {Object} joke - Joke object to validate
 * @returns {boolean} True if valid
 */
function validateJoke(joke) {
  return joke && (
    (joke.joke && joke.joke.trim().length > 0) ||
    (joke.setup && joke.delivery && joke.setup.trim().length > 0)
  );
}

/**
 * Format joke for display
 * @param {Object} jokeData - Raw joke data
 * @returns {Object} Formatted joke
 */
function formatJoke(jokeData) {
  return {
    type: jokeData.type || 'single',
    content: jokeData.joke || jokeData.setup,
    setup: jokeData.setup || '',
    delivery: jokeData.delivery || '',
    category: jokeData.category || 'General',
    source: jokeData.source || 'Unknown',
    timestamp: new Date().toISOString(),
    id: Math.random().toString(36).substr(2, 9)
  };
}
