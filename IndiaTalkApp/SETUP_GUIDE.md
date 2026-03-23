# IndiaTalk Mobile App — Setup & Testing Guide

## Overview

IndiaTalk is a **language-first social and opportunity platform for India**, built with React Native, Expo, TypeScript, and React Navigation. The app enables users to connect, share opportunities, and discover local guides across India using their preferred language.

**Tech Stack:**
- React Native 0.81 with Expo SDK 54
- TypeScript 5.9
- React Navigation 7 (Stack + Tab Navigation)
- NativeWind 4 (Tailwind CSS for React Native)
- AsyncStorage for local persistence
- Mock API service with realistic data

---

## Project Structure

```
IndiaTalkApp/
├── App.tsx                          # Main entry point with navigation setup
├── app/
│   ├── screens/                     # All screen components
│   │   ├── AuthScreen.tsx          # Login/Signup
│   │   ├── HomeScreen.tsx          # Language-first feed
│   │   ├── PostDetailScreen.tsx    # Individual post view
│   │   ├── GuidesScreen.tsx        # Local guides directory
│   │   ├── JobsScreen.tsx          # Job listings
│   │   ├── MessagesScreen.tsx      # Conversations
│   │   └── ProfileScreen.tsx       # User profile
│   └── (tabs)/
│       └── index.tsx               # (Legacy, replaced by HomeScreen)
├── components/
│   ├── PostCard.tsx                # Reusable post component
│   ├── screen-container.tsx        # SafeArea wrapper
│   └── ui/
│       └── icon-symbol.tsx         # Icon mapping
├── contexts/
│   └── AuthContext.tsx             # Auth state management
├── services/
│   └── api.ts                      # API client with mock data
├── types/
│   └── index.ts                    # TypeScript type definitions
├── hooks/
│   ├── use-colors.ts              # Theme colors hook
│   ├── use-color-scheme.ts        # Dark/light mode detection
├── lib/
│   └── utils.ts                    # Utility functions (cn)
├── constants/
│   └── theme.ts                    # Runtime theme palette
├── design.md                        # Design specifications
├── todo.md                          # Feature tracking
├── app.config.ts                    # Expo configuration
├── app.json                         # Expo manifest
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js              # Tailwind CSS config
└── theme.config.js                 # Theme color tokens
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm/pnpm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (iOS/Android)
- For Android emulator: Android Studio
- For iOS simulator: Xcode (macOS only)

### Step 1: Install Dependencies

```bash
cd IndiaTalkApp
pnpm install
# or
npm install
```

### Step 2: Start the Development Server

```bash
pnpm dev
# or
npm run dev
```

This will:
- Start the Metro bundler on port 8081
- Start the backend server on port 3000 (if applicable)
- Display a QR code for Expo Go scanning

### Step 3: Test on Device

#### Option A: Expo Go (Easiest)

1. Install **Expo Go** app on your mobile device (iOS App Store or Google Play)
2. Scan the QR code displayed in the terminal
3. App will load on your device

#### Option B: Android Emulator

```bash
pnpm android
# or
npm run android
```

#### Option C: iOS Simulator (macOS only)

```bash
pnpm ios
# or
npm run ios
```

---

## Testing the App

### Demo Credentials

For testing the login flow, use:
- **Email:** demo@indiatalk.in
- **Password:** demo123

These credentials work with any password (min 6 characters) for demo purposes.

### Key Features to Test

#### 1. **Authentication Flow**
- [ ] Launch app → should show AuthScreen
- [ ] Switch between Login and Sign Up tabs
- [ ] Enter demo credentials and login
- [ ] Verify token is saved to AsyncStorage
- [ ] App navigates to HomeScreen after login

#### 2. **Home Screen (Feed)**
- [ ] Posts display with author info, content, and language badge
- [ ] Language filter works (click "🌐 Language" chip)
- [ ] Location filter works (click "📍 Location" chip)
- [ ] Pull-to-refresh reloads posts
- [ ] Like button toggles (heart icon changes)
- [ ] Tap post → navigates to PostDetailScreen

#### 3. **Post Detail Screen**
- [ ] Back button returns to HomeScreen
- [ ] Post content displays fully
- [ ] Like/comment/share action buttons work
- [ ] Comment input field is functional
- [ ] Sample comments display

#### 4. **Guides Screen**
- [ ] Guides list displays with ratings and prices
- [ ] Search bar filters guides by name/expertise
- [ ] Language filter works
- [ ] Rating filter works (⭐ 3, 4, 4.5, 5)
- [ ] "Book" button is clickable

#### 5. **Jobs Screen**
- [ ] Jobs list displays with salary and job type
- [ ] Search bar filters jobs
- [ ] Job type filter works (full-time, part-time, etc.)
- [ ] Location filter works
- [ ] "Apply Now" button is clickable

#### 6. **Messages Screen**
- [ ] Conversations list displays
- [ ] Unread count badge shows (if applicable)
- [ ] Tap conversation (future: navigate to chat)
- [ ] Compose button is visible

#### 7. **Profile Screen**
- [ ] User info displays (avatar, name, email, bio)
- [ ] Languages and location show
- [ ] Menu items are clickable
- [ ] Logout button works
- [ ] After logout → returns to AuthScreen

#### 8. **Navigation**
- [ ] Tab bar at bottom shows all 5 tabs
- [ ] Switching tabs works smoothly
- [ ] Tab icons display correctly
- [ ] Active tab is highlighted in saffron (#FF9933)

---

## Styling & Design

### Color Palette (India-Themed)

| Token | Color | Usage |
|-------|-------|-------|
| Primary | #FF9933 (Saffron) | CTAs, highlights, active states |
| Secondary | #138808 (Green) | Success states, secondary actions |
| Background | #F5F5F5 | Screen backgrounds |
| Surface | #FFFFFF | Cards, elevated surfaces |
| Foreground | #1A1A1A | Primary text |
| Muted | #666666 | Secondary text |
| Border | #E5E5E5 | Dividers, borders |
| Error | #DC3545 | Error messages |

### Responsive Design

- All screens are optimized for portrait orientation (9:16)
- One-handed usage in mind
- Proper SafeArea handling for notches and home indicators
- Tailwind CSS for responsive layouts

---

## Mock Data

The app uses realistic mock data from `services/api.ts`:

- **3 Mock Users** with avatars, languages, and locations
- **3 Mock Posts** in Hindi and English
- **3 Mock Guides** with ratings and pricing
- **3 Mock Jobs** with salary ranges
- **2 Mock Conversations** with messages

All API calls simulate network delays (500-1500ms) for realistic UX testing.

---

## Troubleshooting

### Issue: App doesn't load on Expo Go

**Solution:**
1. Ensure your phone and computer are on the same WiFi
2. Clear Expo cache: `expo start --clear`
3. Restart Expo Go app
4. Re-scan QR code

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check TypeScript
pnpm check
# or
npm run check

# Fix errors in the relevant files
```

### Issue: AsyncStorage not persisting

**Solution:**
- AsyncStorage is local to the device/emulator
- Data persists across app restarts
- Clearing app data will reset AsyncStorage

### Issue: Hot reload not working

**Solution:**
1. Save the file again
2. If still not working, restart the dev server: `Ctrl+C` then `pnpm dev`

---

## Backend Integration (Future)

Currently, the app uses mock data. To integrate with a real backend:

1. **Update API Base URL** in `services/api.ts`:
   ```typescript
   private baseURL = 'https://your-api.com/api';
   ```

2. **Replace Mock Methods** with actual HTTP calls using Axios (already configured)

3. **Update Auth Flow** to use real authentication endpoints

4. **Configure Environment Variables** in `.env`:
   ```
   EXPO_PUBLIC_API_URL=https://your-api.com/api
   ```

---

## Performance Optimization

The app is optimized for performance:

- **FlatList** used for all lists (not ScrollView + map)
- **Proper key extraction** for list items
- **Memoization** of components to prevent unnecessary re-renders
- **Image caching** with Expo Image
- **Lazy loading** of screens with React Navigation

---

## Testing Checklist

Before delivery, verify:

- [ ] App launches without crashes
- [ ] All screens accessible via tab navigation
- [ ] Login/logout flow works
- [ ] Posts display and can be liked
- [ ] Filters work (language, location, job type)
- [ ] Search functionality works
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Responsive on different screen sizes
- [ ] Performance is smooth (no lag)

---

## Next Steps

### Immediate (MVP Features)
1. Test on physical devices (iOS + Android)
2. Fix any platform-specific issues
3. Optimize performance based on testing

### Short-term (Post-MVP)
1. Connect to real backend API
2. Implement real-time messaging with WebSocket
3. Add push notifications
4. Implement user verification badges

### Long-term
1. App store submission (iOS App Store, Google Play)
2. Analytics and crash reporting (Sentry)
3. Advanced features (E2E encryption, payments)
4. Dark mode support
5. Internationalization (i18n)

---

## Support & Documentation

- **Design Specs:** See `design.md` for detailed UI/UX specifications
- **Feature Tracking:** See `todo.md` for completed and pending features
- **Type Definitions:** See `types/index.ts` for all TypeScript types
- **API Service:** See `services/api.ts` for API structure and mock data

---

## Development Commands

```bash
# Start development server
pnpm dev

# Type checking
pnpm check

# Linting
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Start on Android
pnpm android

# Start on iOS
pnpm ios

# Generate QR code
pnpm qr

# Build for production
pnpm build
```

---

## License

IndiaTalk © 2026. All rights reserved.

---

**Happy testing! 🚀 If you encounter any issues, refer to the troubleshooting section or check the console logs for detailed error messages.**
