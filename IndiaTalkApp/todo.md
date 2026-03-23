# IndiaTalk Mobile App — Project TODO

## Setup & Configuration
- [x] Generate custom app logo and update app.config.ts
- [x] Update app name and branding in app.config.ts
- [x] Configure theme colors (saffron #FF9933, green #138808)
- [x] Update tailwind.config.js with India-themed color palette

## Core Architecture
- [x] Create TypeScript types (types/index.ts)
- [x] Create API service with mock data (services/api.ts)
- [x] Set up AsyncStorage for auth token persistence
- [x] Configure React Navigation stack and tab navigation
- [x] Create navigation types and param lists

## Screens — Phase 1: Core Screens
- [x] AuthScreen: Login/Signup with email/password
- [x] HomeScreen: Language-first feed with location filters
- [x] PostDetailScreen: Individual post view with comments
- [x] GuidesScreen: Local guides directory with filtering
- [x] JobsScreen: Job listings with filtering
- [x] MessagesScreen: Conversations list
- [x] ProfileScreen: User profile and settings

## Reusable Components
- [x] PostCard: Post display component with metadata and actions
- [ ] GuideCard: Guide profile card with rating and booking (inline in GuidesScreen)
- [ ] JobCard: Job listing card with details (inline in JobsScreen)
- [x] ConversationItem: Message preview item (inline in MessagesScreen)
- [ ] LocationFilter: Location chip selector (inline in HomeScreen)
- [ ] LanguageSelector: Language dropdown/chips (inline in HomeScreen)

## Styling & UI
- [x] Apply India-themed color palette throughout
- [x] Implement responsive layouts for all screens
- [x] Add proper spacing and padding (design.md specs)
- [x] Style buttons with saffron/green gradients
- [x] Add shadow and border styling to cards
- [ ] Implement dark mode support (optional)

## Functionality — Phase 2: Core Features
- [x] Auth flow: Login/Signup with AsyncStorage token persistence
- [x] Navigation: Proper stack and tab navigation setup
- [x] Mock data: Create realistic mock data for all screens
- [x] Post filtering: Filter by language and location
- [x] Guide filtering: Filter by language, rating, price
- [x] Job filtering: Filter by location, job type, salary
- [x] Pull-to-refresh: Implement on HomeScreen and other feeds

## Testing & Debugging
- [x] Test app launch without errors
- [x] Test navigation between all screens
- [x] Test auth flow (login/signup/logout)
- [x] Test data persistence with AsyncStorage
- [x] Test mock data rendering
- [x] Verify no TypeScript errors
- [ ] Check console for warnings
- [ ] Test on physical device with Expo Go

## Performance & Optimization
- [ ] Optimize FlatList rendering with proper keys
- [ ] Implement image caching
- [ ] Minimize re-renders with proper memoization
- [ ] Test app performance on low-end devices

## Documentation
- [ ] Update README.md with setup instructions
- [ ] Document API service structure
- [ ] Create testing guide for QR code scanning
- [ ] Document mock data structure
- [ ] Add troubleshooting guide

## Future Features (Post-MVP)
- [ ] Backend API integration (replace mock data)
- [ ] Real-time messaging with WebSocket
- [ ] Push notifications
- [ ] User verification badges
- [ ] In-app payment for guide bookings
- [ ] Analytics tracking
- [ ] Dark mode support
- [ ] Biometric authentication


## Issues Found & Fixed
- [x] Web preview not showing app screens (only default home button visible)
  - Root cause: Expo Router default layout conflicting with custom App.tsx
  - Solution: Fixed by creating proper tab routes and wrapping with AuthProvider in app/_layout.tsx
  - Status: AuthScreen now shows on preview, all 5 tabs accessible after login
