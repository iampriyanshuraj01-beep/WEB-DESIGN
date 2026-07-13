# Joke Generator - Features Documentation

## Core Features

### 1. Joke Fetching
**Location:** Main interface

**Features:**
- Single-click joke fetching
- Support for different joke formats:
  - Single-line jokes
  - Multi-part jokes (Setup + Delivery)
  - Knock-knock jokes
- Automatic API selection
- Fallback to alternative APIs on failure
- Loading state with spinner animation

**API Integration:**
```
JokeAPI → Official Joke API → Fallback Jokes
```

---

### 2. Joke Categories
**Location:** Filter dropdown

**Available Categories:**
- **General** - Clean, family-friendly jokes
- **Programming** - Developer and tech jokes
- **Dark** - Dark humor (18+)
- **Knock-knock** - Classic knock-knock format
- **Spooky** - Spooky and scary jokes
- **Religious** - Religious humor
- **Random** - Mix from all categories

**Filter Features:**
- Real-time category switching
- Applies to subsequent joke requests
- Visual indicator of active category
- Quick preset buttons for popular categories

---

### 3. Copy to Clipboard
**Location:** Action buttons below joke

**Features:**
- One-click copy functionality
- Copies complete joke text
- Toast notification confirmation
- Fallback for unsupported browsers
- Keyboard shortcut: `C`

**Behavior:**
- Button shows "Copied!" briefly
- Returns to normal after 2 seconds
- Works with all joke formats

---

### 4. Favorites System
**Location:** Heart icon in action buttons

**Features:**
- Save jokes to favorites
- View all favorite jokes
- Remove from favorites
- Persistent storage (localStorage)
- Quick access tab
- Export favorites as text
- Clear all favorites

**Storage:**
- Stores up to 100 jokes
- Includes metadata (date saved, category)
- Syncs across browser sessions
- Works offline

---

### 5. History Tracking
**Location:** Separate history panel

**Features:**
- Tracks last 50 viewed jokes
- Timestamp for each joke
- Category information
- Quick re-access to previous jokes
- Search within history
- Clear history option

**Display:**
- List view with scroll
- Shows complete joke text
- Click to view details
- Favorite from history

---

### 6. Search Functionality
**Location:** Search bar at top

**Features:**
- Search in current jokes
- Search in favorites
- Search in history
- Real-time filtering
- Case-insensitive matching
- Highlight matching text

**Capabilities:**
- Keyword search
- Category filtering
- Date range filtering
- Source filtering

---

### 7. Dark Mode
**Location:** Settings/Header

**Features:**
- Toggle dark/light theme
- Smooth theme transition
- Persistent preference (localStorage)
- Eye-friendly dark colors
- Auto-detection based on system preference

**Colors:**
- Light Mode: White background, dark text
- Dark Mode: Dark background, light text
- Maintains contrast and readability

---

### 8. API Selection
**Location:** Advanced settings

**Available APIs:**
- **JokeAPI** - Primary source (Default)
  - Rich categories
  - Multi-part support
  - High joke count
  
- **Official Joke API** - Secondary source
  - Simple and fast
  - Reliable performance
  - Limited categories

- **Auto** - Automatic fallback
  - Uses JokeAPI first
  - Falls back to Official API
  - Shows which API was used

**Features:**
- Switch between APIs
- See API attribution
- Rate limit information
- Performance metrics

---

### 9. Error Handling
**Location:** Integrated throughout app

**Error Types:**
- Network errors
- API timeouts
- Rate limiting
- Invalid responses
- Offline mode

**Handling:**
- User-friendly error messages
- Automatic retry mechanism
- Fallback joke display
- Offline cached jokes
- Suggestion for resolution

---

### 10. Performance Features
**Location:** Background operations

**Features:**
- API response caching
- Minimize network requests
- Lazy load images
- Debounced search
- Optimized animations
- Minimal bundle size

**Metrics:**
- Load time tracking
- API response time display
- Cache hit/miss ratio

---

## User Interface Elements

### Header
- **Logo/Title** - App branding
- **Search Bar** - Quick search
- **Theme Toggle** - Dark/Light mode
- **Settings Button** - Advanced options

### Main Content Area
- **Joke Display** - Large, readable joke text
- **Category Badge** - Shows joke category
- **Source Badge** - Shows API source
- **Action Buttons** - Copy, Favorite, Share
- **Loading Spinner** - During API calls

### Sidebar (Mobile: Tabs)
- **Home** - Main joke display
- **Favorites** - Saved jokes
- **History** - Recently viewed
- **Settings** - Preferences

### Footer
- **API Credits** - Attribution
- **Contact Info** - Support links
- **Keyboard Shortcuts** - Help

---

## Technical Features

### API Integration
```javascript
// Fetch from JokeAPI
GET https://v2.jokeapi.dev/joke/{category}

// Fetch from Official Joke API  
GET https://official-joke-api.appspot.com/jokes/{category}/random

// Response handling with error fallback
```

### Data Storage
```javascript
// localStorage keys
jokeGeneratorFavorites - [Array of favorite jokes]
jokeGeneratorHistory - [Array of viewed jokes]
jokeGeneratorSettings - {theme, apiSource, preferences}
```

### Caching Strategy
- In-memory cache for current session
- localStorage for persistent data
- Cache invalidation: 24 hours
- LRU (Least Recently Used) eviction

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Get new joke |
| `C` | Copy to clipboard |
| `F` | Add to favorites |
| `H` | View history |
| `S` | Open settings |
| `/` | Focus search |
| `?` | Show help |
| `Esc` | Close modals |
| `→` | Next joke |
| `←` | Previous joke |

---

## Accessibility Features
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode
- Focus indicators
- Semantic HTML
- Alt text for images
- Readable font sizes

---

## Browser Storage

### localStorage Quota
- Typical: 5-10MB
- Max jokes stored: ~100
- Auto-cleanup of old entries
- User option to clear data

### Data Structure
```javascript
{
  favorites: [
    {
      id: "unique-id",
      joke: "Joke text",
      category: "General",
      source: "JokeAPI",
      savedAt: "timestamp"
    }
  ],
  history: [...],
  settings: {
    theme: "light|dark",
    apiSource: "auto|jokeapi|official",
    categories: ["General", ...]
  }
}
```

---

## Rate Limiting

### JokeAPI
- Limit: 120 requests/minute
- Reset: Every minute
- No authentication needed

### Official Joke API
- Limit: 300 requests/minute
- Reset: Every minute
- No authentication needed

### Handling
- User notification on rate limit
- Automatic retry after delay
- Switch to alternative API

---

## Mobile Experience
- Touch-optimized buttons
- Swipe to change jokes
- Responsive text sizing
- Bottom sheet for options
- Haptic feedback (if supported)
- Mobile-first design
