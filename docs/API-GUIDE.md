# API Integration Guide

## Overview
This document explains how the Joke Generator integrates with external APIs.

## APIs Used

### 1. JokeAPI (Primary)
**URL**: https://v2.jokeapi.dev/
**Documentation**: https://jokeapi.dev/

#### Endpoints

**Get Random Joke**
```
GET /joke/{category}
```

**Query Parameters**
- `category` - Joke category (General, Programming, Knock-knock, Dark, Spooky, Religious, Any)
- `type` - Single or Twopart
- `contains` - Filter jokes containing specific text
- `blacklist` - Exclude certain types (nsfw, religious, political, racist, sexist, explicit)

**Example Request**
```javascript
fetch('https://v2.jokeapi.dev/joke/Programming?type=single')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Response Format**
```json
{
  "error": false,
  "category": "Programming",
  "type": "single",
  "joke": "Why do Java developers wear glasses? Because they don't C#",
  "flags": {
    "nsfw": false,
    "religious": false,
    "political": false,
    "racist": false,
    "sexist": false,
    "explicit": false
  },
  "id": 24,
  "safe": true,
  "lang": "en"
}
```

**Multi-part Response**
```json
{
  "error": false,
  "category": "General",
  "type": "twopart",
  "setup": "Why did the scarecrow win an award?",
  "delivery": "Because he was outstanding in his field!",
  "flags": {...},
  "id": 1,
  "safe": true,
  "lang": "en"
}
```

#### Rate Limiting
- **Limit**: 120 requests per minute
- **Header**: `X-Rate-Limit`
- **No authentication required**

---

### 2. Official Joke API (Fallback)
**URL**: https://official-joke-api.appspot.com/
**Documentation**: https://github.com/15Dkk/official-joke-api

#### Endpoints

**Get Random Joke**
```
GET /jokes/random
```

**Get Joke by Category**
```
GET /jokes/{category}/random
```

Available categories:
- `general`
- `knock-knock`
- `programming` (custom endpoint)

**Example Request**
```javascript
fetch('https://official-joke-api.appspot.com/jokes/programming/random')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Response Format**
```json
{
  "type": "general",
  "setup": "Why did the cookie go to the doctor?",
  "punchline": "Because it felt crumbly!",
  "id": 1
}
```

#### Rate Limiting
- **Limit**: 300 requests per minute
- **No headers returned**
- **No authentication required**

---

## Implementation Details

### API Selection Logic

```javascript
// Priority order
1. Try JokeAPI (primary)
2. If JokeAPI fails, try Official Joke API
3. If both fail, use cached/fallback jokes
```

### Category Mapping

| App Category | JokeAPI | Official Joke API |
|---|---|---|
| General | General | general |
| Programming | Programming | programming |
| Dark | Dark | Not available |
| Knock-knock | Knock-knock | knock-knock |
| Spooky | Spooky | Not available |
| Religious | Religious | Not available |
| Random | Any | random |

### Error Handling

**Network Errors**
```javascript
fetch(url)
  .catch(error => {
    console.error('Network error:', error);
    // Try fallback API
    return fetchFromFallbackAPI();
  });
```

**API Errors**
```javascript
fetch(url)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .catch(error => {
    console.error('API error:', error);
    // Show user-friendly message
    displayError('Failed to fetch joke. Please try again.');
  });
```

**Rate Limiting**
```javascript
// Check rate limit headers
const remaining = res.headers.get('X-Rate-Limit-Remaining');
if (remaining < 5) {
  console.warn('Approaching rate limit');
  showWarning('Too many requests. Please wait.');
}
```

---

## Caching Strategy

### In-Memory Cache
```javascript
// Cache recent API responses
const cache = new Map();
const cacheExpiry = 5 * 60 * 1000; // 5 minutes

function getCachedJoke(category) {
  const cached = cache.get(category);
  if (cached && Date.now() - cached.timestamp < cacheExpiry) {
    return cached.data;
  }
  return null;
}
```

### localStorage Cache
```javascript
// Store jokes in browser storage
function saveFavorite(joke) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.push({
    ...joke,
    savedAt: new Date().toISOString()
  });
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
```

---

## Response Parsing

### Single Joke Format
```javascript
function parseSingleJoke(data) {
  if (data.type === 'single' || data.type === 'general') {
    return {
      text: data.joke || data.setup,
      category: data.type || data.category,
      source: 'JokeAPI',
      isPart: false
    };
  }
}
```

### Multi-part Joke Format
```javascript
function parseMultipartJoke(data) {
  if (data.type === 'twopart' || data.punchline) {
    return {
      setup: data.setup,
      delivery: data.punchline || data.delivery,
      category: data.category || data.type,
      source: 'JokeAPI',
      isPart: true
    };
  }
}
```

---

## CORS Handling

Both APIs support CORS requests from browsers:

```javascript
fetch(url, {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  },
  mode: 'cors'
})
```

**Preflight Request**
- Methods: GET, POST, OPTIONS
- Headers: Content-Type, Accept
- No authentication headers needed

---

## Performance Optimization

### Debouncing API Calls
```javascript
let debounceTimer;
function fetchJoke() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    makeAPICall();
  }, 300); // Wait 300ms before calling
}
```

### Parallel Requests
```javascript
// Fetch from multiple APIs simultaneously
Promise.race([
  fetch(jokeAPIUrl),
  fetch(officialAPIUrl)
])
.then(res => res.json())
.then(data => displayJoke(data));
```

### Request Timeout
```javascript
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}
```

---

## Testing

### Manual Testing
```bash
# Test JokeAPI
curl 'https://v2.jokeapi.dev/joke/Programming'

# Test Official Joke API
curl 'https://official-joke-api.appspot.com/jokes/random'
```

### Unit Tests
```javascript
// Test API call function
test('Should fetch joke from JokeAPI', async () => {
  const joke = await fetchJoke('Programming');
  expect(joke).toHaveProperty('joke');
  expect(joke.category).toBe('Programming');
});
```

---

## Monitoring

### Success/Failure Tracking
```javascript
const metrics = {
  totalRequests: 0,
  successCount: 0,
  failureCount: 0,
  averageResponseTime: 0
};

function trackRequest(success, time) {
  metrics.totalRequests++;
  if (success) metrics.successCount++;
  else metrics.failureCount++;
  metrics.averageResponseTime = 
    (metrics.averageResponseTime + time) / 2;
}
```

---

## Troubleshooting

### Issue: CORS Error
**Solution**: Both APIs support CORS. Check browser console for specific error.

### Issue: Rate Limited
**Solution**: Wait a few minutes or switch to Official Joke API.

### Issue: Timeout
**Solution**: Check internet connection or try again later.

### Issue: Empty Response
**Solution**: Try different category or check API status page.

---

## Future Enhancements

- [ ] Add more API sources
- [ ] Implement API status monitoring
- [ ] Add local database for offline support
- [ ] Implement subscription for premium jokes
- [ ] Add API analytics dashboard
