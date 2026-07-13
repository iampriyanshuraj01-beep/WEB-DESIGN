# Random Joke Generator

## Project Overview
A fun and interactive web application that fetches random jokes from an external API. Features multiple API sources, filtering options, and a clean, modern UI with smooth animations.

## Features

### 🎭 Joke Generation
- Fetch random jokes from multiple API sources
- Support for different joke types (General, Programming, Dark, Knock-knock)
- One-click joke generation with smooth animations
- Display joke content with smooth transitions

### 📋 Multiple APIs
- **JokeAPI** - Comprehensive joke source with categorization
- **Official Joke API** - Quick single and two-part jokes
- **Rapid API** - Alternative joke sources
- Fallback mechanisms for API failures

### 🎨 User Experience
- Modern, responsive design
- Dark mode support
- Copy to clipboard functionality
- Joke history tracking
- Search and filter capabilities
- Loading animations
- Error handling with user feedback

### 💾 Data Persistence
- Favorite jokes storage in localStorage
- History of viewed jokes
- User preferences (theme, API choice)
- Quick access to favorites

### 📱 Responsive Design
- Mobile-first design
- Works on all screen sizes
- Touch-friendly interface
- Optimized performance

## Technology Stack
- HTML5
- CSS3 (with CSS Variables and Animations)
- Vanilla JavaScript (ES6+)
- Fetch API for HTTP requests
- localStorage API

## Project Structure
```
joke-generator/
├── index.html           # Main application file
├── css/
│   └── style.css        # Styling and animations
├── js/
│   ├── app.js           # Main application logic
│   ├── api.js           # API handling
│   └── utils.js         # Utility functions
├── README.md            # Documentation
├── docs/
│   ├── FEATURES.md      # Detailed features
│   └── API-GUIDE.md     # API integration guide
└── .gitignore           # Git configuration
```

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/iampriyanshuraj01-beep/WEB-DESIGN.git
```

### 2. Switch to Branch
```bash
git checkout joke-generator
```

### 3. Open in Browser
```bash
# Simply open the index.html file in your browser
# Or use a local server for better experience
python -m http.server 8000
# Then visit http://localhost:8000
```

## Usage

### Getting a Joke
1. Click the "Get Joke" button to fetch a random joke
2. The joke will display with a smooth animation
3. If it's a multi-part joke, click to reveal the punchline

### Filtering Jokes
1. Select joke category from the dropdown
2. Choose API source if preferred
3. Click "Get Joke" to fetch jokes matching criteria

### Managing Jokes
- **Copy**: Click the copy button to copy joke to clipboard
- **Favorite**: Click the heart icon to save to favorites
- **Share**: Share jokes on social media (if enabled)
- **History**: View previously viewed jokes

### Favorites
- Access saved favorite jokes anytime
- Remove jokes from favorites
- Export favorites as text file

## APIs Used

### JokeAPI
**Endpoint**: `https://v2.jokeapi.dev/joke/`
**Categories**: General, Programming, Knock-knock, Dark, Spooky, Religious
**Features**: 
- High-quality jokes
- Multi-part support
- Blacklist options

### Official Joke API
**Endpoint**: `https://official-joke-api.appspot.com/jokes/`
**Categories**: General
**Features**:
- Simple and reliable
- Fast response
- Limited but quality jokes

## Color Theme
- Primary: #667eea (Indigo)
- Secondary: #764ba2 (Purple)
- Success: #6ab04c (Green)
- Warning: #f0ad4e (Orange)
- Error: #e74c3c (Red)
- Light Background: #f8f9fa
- Dark Background: #1a1a1a
- Text Primary: #2c3e50
- Text Secondary: #7f8c8d

## Browser Compatibility
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## Keyboard Shortcuts
- `Space` - Get new joke
- `C` - Copy to clipboard
- `F` - Add to favorites
- `H` - View history
- `?` - Show help

## Error Handling
- Graceful API failure handling
- User-friendly error messages
- Automatic retry mechanism
- Offline mode with cached jokes

## Performance
- Optimized API calls
- Caching mechanisms
- Lazy loading
- Minimal dependencies

## Notes
- All APIs are free and publicly available
- No authentication required
- Rate limiting may apply for some APIs
- Internet connection required for API calls

## Future Enhancements
- [ ] Multi-language support
- [ ] Custom joke submission
- [ ] Social sharing features
- [ ] Joke rating system
- [ ] Machine learning for personalization
- [ ] PWA functionality
- [ ] Voice API integration

## License
Open source project for educational purposes

## Author
iampriyanshuraj01-beep

## Support
For issues or suggestions, please open an issue on GitHub.
