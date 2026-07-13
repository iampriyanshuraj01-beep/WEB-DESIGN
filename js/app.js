/**
 * Main Application Logic
 * Handles UI interactions, state management, and event listeners
 */

// Global state
let currentJoke = null;
let currentPage = 'home';
let isDarkMode = false;
let preferredAPI = 'auto';
let defaultCategory = 'Any';

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  loadSettings();
  setupEventListeners();
  loadStorageStats();
});

/**
 * Initialize application
 */
function initializeApp() {
  console.log('🎭 Joke Generator initialized');
  loadTheme();
  loadFavorites();
  loadHistory();
  updateStorageInfo();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyPress);

  // Search functionality
  document.getElementById('searchInput').addEventListener('input',
    debounce(() => searchJokes(), 300)
  );
  document.getElementById('favSearch').addEventListener('input',
    debounce(() => searchFavorites(), 300)
  );
  document.getElementById('histSearch').addEventListener('input',
    debounce(() => searchHistory(), 300)
  );

  // Theme and settings auto-save
  document.getElementById('themeToggle').addEventListener('change', saveSettings);
  document.getElementById('preferredAPI').addEventListener('change', saveSettings);
  document.getElementById('defaultCategory').addEventListener('change', saveSettings);
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyPress(event) {
  if (event.target.tagName === 'INPUT' && event.target.type !== 'checkbox') return;

  const shortcuts = {
    ' ': () => getJoke(),
    'c': () => copyToClipboard(),
    'f': () => toggleFavorite(),
    'h': () => showTab('history'),
    's': () => showTab('settings'),
    '/': (e) => { e.preventDefault(); document.getElementById('searchInput').focus(); },
    '?': () => showHelp()
  };

  const action = shortcuts[event.key.toLowerCase()];
  if (action) {
    event.preventDefault();
    action(event);
  }
}

/**
 * Get and display a joke
 */
async function getJoke() {
  const category = document.getElementById('categorySelect').value;
  const apiSource = document.getElementById('apiSelect').value;
  const loader = document.getElementById('loadingSpinner');
  const btn = document.getElementById('getJokeBtn');

  // Disable button and show loader
  btn.disabled = true;
  loader.style.display = 'block';

  try {
    const result = await getJoke(category, apiSource);

    if (!result.success) {
      showNotification('Failed to fetch joke. Using offline joke.', 'warning');
      const offlineJoke = getFallbackJoke();
      displayJoke(offlineJoke.data, offlineJoke.source);
    } else {
      displayJoke(result.data, result.source);
      addToHistory(result.data);
    }
  } catch (error) {
    console.error('Error fetching joke:', error);
    showNotification('Error fetching joke. Please try again.', 'error');
  } finally {
    loader.style.display = 'none';
    btn.disabled = false;
  }
}

/**
 * Display joke on the page
 */
function displayJoke(joke, source) {
  const content = document.getElementById('jokeContent');
  const meta = document.getElementById('jokeMeta');
  const card = document.getElementById('jokeCard');

  currentJoke = {
    ...joke,
    source: source,
    timestamp: new Date().toISOString()
  };

  // Clear previous content
  content.innerHTML = '';

  // Display joke content
  if (joke.type === 'twopart' || (joke.setup && joke.delivery)) {
    const setup = document.createElement('p');
    setup.className = 'joke-setup';
    setup.textContent = joke.setup;
    content.appendChild(setup);

    const delivery = document.createElement('p');
    delivery.className = 'joke-delivery hidden';
    delivery.textContent = joke.delivery;
    delivery.onclick = () => toggleDelivery(delivery);
    content.appendChild(delivery);
  } else {
    const jokeText = document.createElement('p');
    jokeText.className = 'joke-text';
    jokeText.textContent = joke.joke || joke.content;
    content.appendChild(jokeText);
  }

  // Display metadata
  meta.innerHTML = `
    <span class="meta-item">📁 ${joke.category || 'General'}</span>
    <span class="meta-item">🔗 ${source}</span>
    <span class="meta-item">🕐 Just now</span>
  `;

  // Enable action buttons
  document.getElementById('copyBtn').disabled = false;
  document.getElementById('favoriteBtn').disabled = false;
  document.getElementById('shareBtn').disabled = false;

  // Animate card
  card.style.animation = 'none';
  setTimeout(() => {
    card.style.animation = 'fadeIn 0.3s ease';
  }, 10);

  // Update favorite button state
  updateFavoriteButton();
}

/**
 * Toggle delivery display
 */
function toggleDelivery(element) {
  element.classList.toggle('hidden');
}

/**
 * Copy joke to clipboard
 */
function copyToClipboard() {
  if (!currentJoke) {
    showNotification('No joke to copy!', 'warning');
    return;
  }

  const jokeText = currentJoke.joke || `${currentJoke.setup} ${currentJoke.delivery}`;
  const success = copyText(jokeText);

  if (success) {
    showNotification('✅ Joke copied to clipboard!', 'success');
    const btn = document.getElementById('copyBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✓ Copied</span>';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  } else {
    showNotification('Failed to copy joke', 'error');
  }
}

/**
 * Toggle favorite status
 */
function toggleFavorite() {
  if (!currentJoke) {
    showNotification('No joke to add!', 'warning');
    return;
  }

  let favorites = Storage.get('favorites', []);
  const index = favorites.findIndex(j => j.id === currentJoke.id);

  if (index >= 0) {
    favorites.splice(index, 1);
    showNotification('❌ Removed from favorites', 'success');
  } else {
    favorites.push({
      ...currentJoke,
      savedAt: new Date().toISOString()
    });
    showNotification('❤️ Added to favorites!', 'success');
  }

  Storage.set('favorites', favorites);
  updateFavoriteButton();
  loadFavorites();
}

/**
 * Update favorite button state
 */
function updateFavoriteButton() {
  if (!currentJoke) return;

  const favorites = Storage.get('favorites', []);
  const isFavorited = favorites.some(j => j.id === currentJoke.id);
  const btn = document.getElementById('favoriteBtn');

  if (isFavorited) {
    btn.style.background = 'var(--danger)';
    btn.style.color = 'white';
    btn.style.borderColor = 'var(--danger)';
  } else {
    btn.style.background = 'var(--light-bg)';
    btn.style.color = 'var(--primary)';
    btn.style.borderColor = 'var(--primary)';
  }
}

/**
 * Share joke
 */
function shareJoke() {
  if (!currentJoke) return;

  const jokeText = currentJoke.joke || `${currentJoke.setup} ${currentJoke.delivery}`;
  const shareText = `😂 Check out this joke: "${jokeText}" - via JokeHub`;

  if (navigator.share) {
    navigator.share({
      title: 'JokeHub',
      text: shareText,
      url: window.location.href
    }).catch(err => console.log('Share failed:', err));
  } else {
    copyText(shareText);
    showNotification('Share text copied!', 'success');
  }
}

/**
 * Load favorites from storage
 */
function loadFavorites() {
  const favorites = Storage.get('favorites', []);
  const container = document.getElementById('favoritesList');

  if (favorites.length === 0) {
    container.innerHTML = '<p class="empty-state">No favorites yet. Add jokes to your favorites! ❤️</p>';
    document.getElementById('clearFavBtn').disabled = true;
    return;
  }

  document.getElementById('clearFavBtn').disabled = false;
  container.innerHTML = favorites.map(joke => `
    <div class="joke-item">
      <p class="joke-item-text">${escapeHTML(joke.joke || joke.setup)}</p>
      <div class="joke-item-meta">
        <span>📁 ${joke.category}</span>
        <span>💾 Saved ${formatDate(joke.savedAt)}</span>
      </div>
      <div class="joke-item-actions">
        <button class="btn btn-small" onclick="copyJoke('${joke.id}')">📋 Copy</button>
        <button class="btn btn-danger btn-small" onclick="removeFavorite('${joke.id}')">🗑️ Remove</button>
      </div>
    </div>
  `).join('');
}

/**
 * Load history from storage
 */
function loadHistory() {
  const history = Storage.get('history', []);
  const container = document.getElementById('historyList');

  if (history.length === 0) {
    container.innerHTML = '<p class="empty-state">No history yet. Get jokes to see them here! 📝</p>';
    document.getElementById('clearHistBtn').disabled = true;
    return;
  }

  document.getElementById('clearHistBtn').disabled = false;
  container.innerHTML = history.reverse().map((joke, index) => `
    <div class="joke-item">
      <p class="joke-item-text">${escapeHTML(joke.joke || joke.setup)}</p>
      <div class="joke-item-meta">
        <span>📁 ${joke.category}</span>
        <span>🕐 ${formatDate(joke.timestamp)}</span>
      </div>
      <div class="joke-item-actions">
        <button class="btn btn-small" onclick="copyJoke('${joke.id}')">📋 Copy</button>
        <button class="btn btn-small" onclick="addToFavoritesFromHistory('${joke.id}')">❤️ Favorite</button>
      </div>
    </div>
  `).join('');
}

/**
 * Add joke to history
 */
function addToHistory(joke) {
  let history = Storage.get('history', []);
  const maxHistory = 50;

  history.unshift({
    ...joke,
    id: generateID(),
    timestamp: new Date().toISOString()
  });

  // Keep only last 50
  if (history.length > maxHistory) {
    history = history.slice(0, maxHistory);
  }

  Storage.set('history', history);
}

/**
 * Remove favorite joke
 */
function removeFavorite(jokeId) {
  let favorites = Storage.get('favorites', []);
  favorites = favorites.filter(j => j.id !== jokeId);
  Storage.set('favorites', favorites);
  loadFavorites();
  updateFavoriteButton();
  showNotification('Removed from favorites', 'success');
}

/**
 * Copy joke from list
 */
function copyJoke(jokeId) {
  let favorites = Storage.get('favorites', []);
  let history = Storage.get('history', []);
  const allJokes = [...favorites, ...history];
  const joke = allJokes.find(j => j.id === jokeId);

  if (joke) {
    const jokeText = joke.joke || `${joke.setup} ${joke.delivery}`;
    const success = copyText(jokeText);
    if (success) {
      showNotification('✅ Copied to clipboard!', 'success');
    }
  }
}

/**
 * Add to favorites from history
 */
function addToFavoritesFromHistory(jokeId) {
  let history = Storage.get('history', []);
  let favorites = Storage.get('favorites', []);
  const historyJoke = history.find(j => j.id === jokeId);

  if (historyJoke && !favorites.find(f => f.id === jokeId)) {
    favorites.push({
      ...historyJoke,
      savedAt: new Date().toISOString()
    });
    Storage.set('favorites', favorites);
    loadFavorites();
    showNotification('❤️ Added to favorites!', 'success');
  }
}

/**
 * Clear all favorites
 */
function clearFavorites() {
  if (confirm('Are you sure you want to clear all favorites?')) {
    Storage.set('favorites', []);
    loadFavorites();
    showNotification('Favorites cleared', 'success');
  }
}

/**
 * Clear all history
 */
function clearHistory() {
  if (confirm('Are you sure you want to clear all history?')) {
    Storage.set('history', []);
    loadHistory();
    showNotification('History cleared', 'success');
  }
}

/**
 * Search jokes
 */
function searchJokes() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  if (!query) {
    // Reset display
    return;
  }
  // Search in current joke or history
  showNotification(`Searching for: ${query}`, 'info');
}

/**
 * Search favorites
 */
function searchFavorites() {
  const query = document.getElementById('favSearch').value.toLowerCase();
  const favorites = Storage.get('favorites', []);
  const container = document.getElementById('favoritesList');

  if (!query) {
    loadFavorites();
    return;
  }

  const filtered = favorites.filter(joke =>
    (joke.joke || joke.setup).toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No matching jokes found 🔍</p>';
    return;
  }

  container.innerHTML = filtered.map(joke => `
    <div class="joke-item">
      <p class="joke-item-text">${escapeHTML(joke.joke || joke.setup)}</p>
      <div class="joke-item-meta">
        <span>📁 ${joke.category}</span>
        <span>💾 Saved ${formatDate(joke.savedAt)}</span>
      </div>
      <div class="joke-item-actions">
        <button class="btn btn-small" onclick="copyJoke('${joke.id}')">📋 Copy</button>
        <button class="btn btn-danger btn-small" onclick="removeFavorite('${joke.id}')">🗑️ Remove</button>
      </div>
    </div>
  `).join('');
}

/**
 * Search history
 */
function searchHistory() {
  const query = document.getElementById('histSearch').value.toLowerCase();
  const history = Storage.get('history', []);
  const container = document.getElementById('historyList');

  if (!query) {
    loadHistory();
    return;
  }

  const filtered = history.filter(joke =>
    (joke.joke || joke.setup).toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No matching jokes found 🔍</p>';
    return;
  }

  container.innerHTML = filtered.map(joke => `
    <div class="joke-item">
      <p class="joke-item-text">${escapeHTML(joke.joke || joke.setup)}</p>
      <div class="joke-item-meta">
        <span>📁 ${joke.category}</span>
        <span>🕐 ${formatDate(joke.timestamp)}</span>
      </div>
      <div class="joke-item-actions">
        <button class="btn btn-small" onclick="copyJoke('${joke.id}')">📋 Copy</button>
        <button class="btn btn-small" onclick="addToFavoritesFromHistory('${joke.id}')">❤️ Favorite</button>
      </div>
    </div>
  `).join('');
}

/**
 * Show tab
 */
function showTab(tabName, button = null) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName).classList.add('active');

  // Update nav buttons
  if (button) {
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  } else {
    document.querySelectorAll('.nav-tab').forEach((btn, i) => {
      btn.classList.toggle('active', btn.textContent.includes(tabName));
    });
  }

  currentPage = tabName;
}

/**
 * Toggle theme
 */
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode');
  document.getElementById('themeToggle').checked = isDarkMode;
  Storage.set('theme', isDarkMode ? 'dark' : 'light');
}

/**
 * Load theme from storage
 */
function loadTheme() {
  const theme = Storage.get('theme', getSystemTheme());
  isDarkMode = theme === 'dark';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').checked = true;
  }
}

/**
 * Load settings from storage
 */
function loadSettings() {
  const settings = Storage.get('settings', {});
  preferredAPI = settings.preferredAPI || 'auto';
  defaultCategory = settings.defaultCategory || 'Any';

  document.getElementById('preferredAPI').value = preferredAPI;
  document.getElementById('defaultCategory').value = defaultCategory;
  document.getElementById('categorySelect').value = defaultCategory;
  document.getElementById('apiSelect').value = preferredAPI;
}

/**
 * Save settings to storage
 */
function saveSettings() {
  preferredAPI = document.getElementById('preferredAPI').value;
  defaultCategory = document.getElementById('defaultCategory').value;

  Storage.set('settings', {
    preferredAPI,
    defaultCategory,
    theme: isDarkMode ? 'dark' : 'light'
  });

  showNotification('Settings saved! ✅', 'success');
}

/**
 * Update storage information
 */
function updateStorageInfo() {
  const size = Storage.getSize();
  const maxSize = 5 * 1024 * 1024; // 5MB
  const percentage = (size / maxSize) * 100;

  document.getElementById('storageUsed').style.width = percentage + '%';
  document.getElementById('storageText').textContent =
    `Using ${(size / 1024).toFixed(2)}KB of ~${(maxSize / 1024 / 1024).toFixed(0)}MB`;
}

/**
 * Load storage stats
 */
function loadStorageStats() {
  updateStorageInfo();
}

/**
 * Export data as JSON
 */
function exportData() {
  const data = {
    favorites: Storage.get('favorites', []),
    history: Storage.get('history', []),
    settings: Storage.get('settings', {}),
    exportDate: new Date().toISOString()
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `joke-generator-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);

  showNotification('Data exported! 📥', 'success');
}

/**
 * Import data from JSON
 */
function importData() {
  document.getElementById('importFile').click();
}

/**
 * Handle import file
 */
function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Storage.set('favorites', data.favorites || []);
      Storage.set('history', data.history || []);
      Storage.set('settings', data.settings || {});
      loadFavorites();
      loadHistory();
      loadSettings();
      showNotification('Data imported successfully! 📤', 'success');
    } catch (error) {
      showNotification('Invalid import file!', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/**
 * Reset all data
 */
function resetAll() {
  if (confirm('⚠️ This will clear ALL data. Are you sure?')) {
    Storage.clear();
    location.reload();
  }
}

/**
 * Export favorites as text
 */
function exportFavorites() {
  const favorites = Storage.get('favorites', []);
  if (favorites.length === 0) {
    showNotification('No favorites to export!', 'warning');
    return;
  }

  let text = 'JokeHub - Exported Favorites\n';
  text += `Generated: ${new Date().toLocaleString()}\n\n`;

  favorites.forEach((joke, i) => {
    text += `${i + 1}. ${joke.joke || joke.setup}\n`;
    if (joke.delivery) text += `   ${joke.delivery}\n`;
    text += `   Category: ${joke.category}\n\n`;
  });

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `favorites-${Date.now()}.txt`;
  link.click();
  URL.revokeObjectURL(url);

  showNotification('Favorites exported! 📤', 'success');
}

/**
 * Show help modal
 */
function showHelp() {
  const shortcuts = `
    Space - Get new joke
    C - Copy to clipboard
    F - Add to favorites
    H - View history
    S - Settings
    / - Focus search
    ? - Show this help
  `;
  alert('⌨️ Keyboard Shortcuts:\n' + shortcuts);
}

/**
 * Show about modal
 */
function showAbout() {
  alert('🎭 JokeHub v1.0\n\nA fun app to get random jokes from multiple APIs.\n\nAPIs: JokeAPI, Official Joke API\n\nMade with ❤️ for you!');
}

/**
 * Show feedback modal
 */
function showFeedback() {
  const feedback = prompt('💬 Share your feedback (or press Cancel):');
  if (feedback) {
    copyText(feedback);
    showNotification('Thank you for your feedback! 🙏', 'success');
  }
}

/**
 * Open settings tab
 */
function openSettings() {
  showTab('settings');
  document.querySelectorAll('.nav-tab')[3].classList.add('active');
}
