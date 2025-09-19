# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2024-12-19

### Added

- Real-time threat updates every 15 seconds for authentic live monitoring experience
- Live indicator with pulsing green dot to show active monitoring status
- Enhanced threat generation with burst patterns (multiple threats added simultaneously)
- Markdown rendering for AI analysis with GitHub Flavored Markdown support
- Server-side API proxy for NVIDIA NIM to resolve CORS issues
- Function-based threat generation triggered by country selection changes
- Debounced chart updates to prevent screen flickering
- Improved data management with automatic threat limit (50 threats max)
- Country flag icons using country-flag-icons package for better visual representation
- Flag icons in threat dashboard and country selection components
- Enhanced AI Threat Analyzer with real-time streaming interface
- Stop/restart analysis functionality with abort controllers
- Advanced streaming UI with live progress indicators
- Improved error handling and stream interruption recovery
- Enhanced export functionality for both analysis and chat conversations
- Interactive chat interface with conversation context management
- Real-time streaming indicators with animated progress dots
- Comprehensive threat mitigation recommendations
- Updated threat level badge colors: Low (grey), Medium (orange), High (black), Critical (red)
- Enhanced text contrast with white text on dark badge backgrounds

### Changed

- Updated threat generation from 30-second intervals to 15-second intervals
- Increased threat addition probability from 10% to 40% for more frequent updates
- Replaced Apollo Client with direct fetch calls for simplified data fetching
- Moved from useEffect-based to function-based threat generation
- Enhanced threat dashboard with live monitoring indicator
- Improved AI analysis display with proper Markdown formatting
- Optimized component re-rendering with better memoization strategies

### Fixed

- Resolved "Maximum update depth exceeded" errors through proper dependency management
- Fixed CORS issues with NVIDIA NIM API by implementing server-side proxy
- Eliminated screen flickering during data updates
- Fixed infinite re-render loops in threat visualization components
- Resolved TypeScript errors and ESLint warnings
- Improved stability of real-time data updates

### Technical Improvements

- Added server-side API route: `/api/nim/v1/chat/completions`
- Implemented proper environment variable handling for API keys
- Enhanced error handling and user feedback
- Improved component architecture with centralized data management
- Added proper TypeScript types for all new features
- Optimized bundle size and performance

### Security

- Moved API key handling to server-side for enhanced security
- Removed client-side API key exposure
- Implemented secure proxy pattern for external API calls

## [1.1.0] - 2024-12-18

### Added

- Real-time threat monitoring with automatic updates
- Enhanced data visualization with multiple chart types
- AI-powered threat analysis with streaming responses
- Country selection with search functionality
- Export capabilities for analysis reports

### Fixed

- Initial implementation of threat generation system
- Basic error handling and loading states

## [1.0.0] - 2024-09-18

### Added

- Initial release of Zentara Global Cyber Threat Monitor
- Country selection interface with searchable dropdown
- Multi-country selection support (up to 5 countries)
- Real-time threat simulation with mock data
- Threat level classification (Low, Medium, High, Critical)
- Threat type categorization (Malware, Phishing, DDoS, Data Breach)
- Interactive data visualization with Recharts
- Bar charts for threat level distribution
- Pie charts for threat type distribution
- Country comparison charts
- Threat timeline visualization
- AI-powered threat analysis using NVIDIA NIM
- Streaming AI response interface
- Interactive chat with AI for follow-up questions
- Export functionality for analysis reports
- Responsive design for mobile and desktop
- Dark/light theme support
- TypeScript implementation throughout
- GraphQL integration with Countries API
- State management with React Query and Apollo Client
- ShadCN/UI component library integration
- Comprehensive error handling and loading states

### Technical Features

- Next.js 15 with App Router
- Tailwind CSS for styling
- Radix UI primitives
- Apollo Client for GraphQL
- TanStack React Query for data fetching
- NVIDIA NIM API integration
- Real-time streaming responses
- Component-based architecture
- Custom hooks for data management
- Type-safe implementation

### Security

- Environment variable configuration
- Input validation and sanitization
- Secure API key handling
- No sensitive data in client-side storage

### Performance

- Optimized bundle size
- Lazy loading of components
- Efficient data caching
- Responsive image handling
- Smooth animations and transitions
