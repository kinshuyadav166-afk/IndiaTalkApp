# IndiaTalk Mobile App — Design Specification

## Overview
IndiaTalk is a **language-first social and opportunity platform for India**. The app enables users to connect, share opportunities, and discover local guides across India using their preferred language.

**Design Philosophy:** India-first aesthetic with saffron (#FF9933) and green (#138808) from the Indian flag. Clean, modern, accessible design optimized for one-handed mobile usage in portrait orientation (9:16).

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| **Primary (Saffron)** | #FF9933 | CTAs, highlights, brand accent |
| **Secondary (Green)** | #138808 | Success states, secondary actions |
| **Background** | #F5F5F5 | Screen backgrounds |
| **Card Background** | #FFFFFF | Cards, surfaces |
| **Text Primary** | #1A1A1A | Main text, headings |
| **Text Secondary** | #666666 | Metadata, descriptions |
| **Text Tertiary** | #999999 | Timestamps, captions |
| **Error** | #DC3545 | Error messages |
| **Success** | #138808 | Success feedback |
| **Border** | #E5E5E5 | Dividers, borders |

---

## Screen List & Layout Specifications

### 1. **AuthScreen** — Login/Signup
**Purpose:** User authentication entry point.

**Layout:**
- Full-screen centered content
- IndiaTalk logo at top (42px, saffron color)
- Tab selector: "Login" / "Sign Up" (underline indicator in saffron)
- Email input field (rounded 10px, light grey background, placeholder text)
- Password input field (same styling, password masked)
- "Forgot Password?" link (saffron, right-aligned)
- CTA button: "Login" or "Sign Up" (gradient saffron→green, rounded 10px, white text, 48px height)
- Switch text: "Don't have an account? Sign Up" or "Already have an account? Login" (saffron link)

**Functionality:**
- Email validation (basic format check)
- Password validation (min 6 characters)
- Save auth token to AsyncStorage on success
- Navigate to Home on successful login
- Show error toast on failure

---

### 2. **HomeScreen** — Language-First Feed
**Purpose:** Main feed showing posts filtered by language and location.

**Layout:**
- Header: "IndiaTalk" title (24px bold) + language selector (dropdown or chips)
- Location filter bar: 3 chips (All India | State | District) — tappable to filter
- Post feed: FlatList of PostCard components
- FAB (Floating Action Button): Orange, 60px diameter, bottom-right corner
- Empty state: "No posts available" with friendly icon

**Content:**
- Posts from users in selected language/location
- Each post shows: avatar, author name, location, timestamp, language badge, content, action buttons (like, comment, share)

**Functionality:**
- Fetch posts from API (mock data initially)
- Filter by language and location
- Tap post → navigate to PostDetailScreen
- Tap FAB → create new post (future feature)
- Pull-to-refresh to reload posts
- Pagination/infinite scroll as user scrolls down

---

### 3. **PostDetailScreen** — Individual Post View
**Purpose:** Full view of a single post with comments and interactions.

**Layout:**
- Header: Back button + "Post" title
- Post card: Full-width post with all details
- Comments section: List of comments (avatar, name, text, timestamp)
- Input bar at bottom: Text input + send button (saffron)
- Action buttons: Like, Comment, Share (icons with counts)

**Functionality:**
- Fetch post details by postId
- Display comments
- Allow user to add comment
- Like/unlike post
- Share post

---

### 4. **GuidesScreen** — Local Guides Directory
**Purpose:** Browse and book local guides by language and expertise.

**Layout:**
- Header: "Local Guides" title + search bar
- Filter chips: Language, Rating, Price range
- Guide cards (vertical list):
  - Avatar (45px circle, left side)
  - Name + expertise (bold, 16px)
  - Rating with stars (e.g., ⭐ 4.8 · 120 reviews)
  - Languages offered (globe icon + language names)
  - Price prominent (saffron, 18px bold)
  - "Book" button (saffron, right side)
- Empty state: "No guides available"

**Functionality:**
- Fetch guides from API
- Filter by language, rating, price
- Search guides by name/expertise
- Tap "Book" → open booking flow (future feature)

---

### 5. **JobsScreen** — Job Listings
**Purpose:** Browse job opportunities across India.

**Layout:**
- Header: "Opportunities" title + filter icon
- Filter sheet: Job type, location, salary range, language
- Job cards (vertical list):
  - Company logo/name (bold, 16px)
  - Job title (18px, bold)
  - Location + job type (secondary text)
  - Salary range (saffron, bold)
  - Languages required (badge)
  - "Apply" button (saffron)
- Empty state: "No jobs available"

**Functionality:**
- Fetch jobs from API
- Filter by location, job type, salary, language
- Tap job → expand details or navigate to job detail screen
- Tap "Apply" → open application form (future feature)

---

### 6. **MessagesScreen** — Conversations List
**Purpose:** View and manage conversations with other users.

**Layout:**
- Header: "Messages" title + compose icon
- Conversations list (FlatList):
  - Avatar (45px circle)
  - Name (bold, 16px)
  - Last message preview (secondary text, truncated)
  - Timestamp (tertiary text, right-aligned)
  - Unread indicator (saffron dot if unread)
- Empty state: "No conversations yet"

**Functionality:**
- Fetch conversations from API
- Tap conversation → navigate to chat screen (future feature)
- Tap compose → start new conversation (future feature)
- Show unread count

---

### 7. **ProfileScreen** — User Profile & Settings
**Purpose:** View user profile and manage account settings.

**Layout:**
- Header: "Profile" title + edit icon (top-right)
- Large avatar (80px circle, centered)
- Name (24px bold, centered)
- Email (secondary text, centered)
- Bio/description (if available, centered, 14px)
- Menu items (white cards, icon + text, full width):
  - 📝 My Posts
  - 💼 Applications
  - ⭐ Saved
  - 🔔 Notifications
  - ⚙️ Settings
  - 📞 Help & Support
- Logout button (red, full width, 48px height, bottom)

**Functionality:**
- Display user profile info
- Tap menu items → navigate to respective screens (future)
- Tap logout → clear AsyncStorage, navigate to Auth
- Tap edit → edit profile (future feature)

---

## Navigation Structure

```
RootStackParamList = {
  Auth: undefined
  HomeTabs: undefined
    ├── Home: undefined
    ├── Guides: undefined
    ├── Jobs: undefined
    ├── Messages: undefined
    └── Profile: undefined
  PostDetail: { postId: string }
}
```

**Navigation Flow:**
1. App checks AsyncStorage for userToken on startup
2. If token exists → navigate to HomeTabs
3. If no token → navigate to Auth
4. After login/signup → save token, navigate to HomeTabs
5. From HomeTabs, user can navigate to PostDetail
6. Logout → clear token, navigate to Auth

---

## Key User Flows

### Flow 1: Onboarding & Login
```
AuthScreen (Login tab)
  → Enter email & password
  → Tap "Login"
  → Validate credentials
  → Save token to AsyncStorage
  → Navigate to HomeScreen
```

### Flow 2: Browsing Posts
```
HomeScreen
  → Select language (dropdown)
  → Select location (chips: All India / State / District)
  → View filtered posts in feed
  → Tap post → PostDetailScreen
  → View comments, like, share
  → Back to HomeScreen
```

### Flow 3: Finding Guides
```
GuidesScreen
  → Browse guides
  → Filter by language, rating, price
  → Tap "Book" → Booking flow (future)
```

### Flow 4: Exploring Jobs
```
JobsScreen
  → Browse job listings
  → Filter by location, job type, salary, language
  → Tap job → View details
  → Tap "Apply" → Application flow (future)
```

### Flow 5: Messaging
```
MessagesScreen
  → View conversation list
  → Tap conversation → Chat screen (future)
  → Tap compose → New conversation (future)
```

### Flow 6: Profile & Logout
```
ProfileScreen
  → View profile info
  → Tap menu items → Navigate to respective screens
  → Tap "Logout" → Clear AsyncStorage → Navigate to AuthScreen
```

---

## Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Screen heading | 24px | Bold | Text Primary |
| Card title | 16px | Bold | Text Primary |
| Body text | 14px | Regular | Text Primary |
| Metadata | 12px | Regular | Text Secondary |
| Button text | 16px | Bold | White (on saffron/green) |
| Captions | 11px | Regular | Text Tertiary |

---

## Spacing & Layout

| Element | Value |
|---------|-------|
| Container padding | 16px |
| Card spacing | 12px |
| Section margin | 20px |
| Element gap | 8-12px |
| Button height | 48px |
| FAB diameter | 60px |
| Avatar (small) | 45px |
| Avatar (large) | 80px |

---

## Component Styling

### Buttons
- **Primary CTA:** Gradient saffron→green, white text, 48px height, rounded 10px, scale 0.97 on press
- **Secondary:** Saffron outline, saffron text, 48px height, rounded 10px
- **Tertiary:** No background, saffron text, 44px min height

### Input Fields
- Rounded 10px, light grey background (#F5F5F5), 12px padding
- Placeholder text in tertiary color
- Focus: saffron border (2px)
- Error: red border with error message below

### Cards
- White background, rounded 12px, shadow (iOS: 0 2px 8px rgba(0,0,0,0.1))
- Padding: 12px
- Border: 1px #E5E5E5

### Badges
- Language badge: Light grey background, saffron text, 10px padding, rounded 6px
- Status badge: Green background, white text

---

## Interaction Patterns

| Interaction | Feedback |
|-------------|----------|
| Button press | Scale 0.97 + haptic light |
| Card tap | Opacity 0.7 |
| Pull-to-refresh | Spinner with brand colors |
| Loading state | Spinner (saffron) |
| Error state | Red text + retry button |
| Success state | Green checkmark + toast |

---

## Accessibility

- Minimum touch target: 44×44px
- Color contrast: WCAG AA compliant
- Font sizes readable without zoom
- Important buttons clearly visible
- Descriptive labels for all interactive elements

---

## Platform-Specific Notes

- **iOS:** Use native-looking components, safe area handling for notch
- **Android:** Material Design principles, edge-to-edge layout
- **Both:** Consistent branding, saffron/green accent colors

---

## Future Enhancements

- Real-time messaging with WebSocket
- Push notifications for messages and opportunities
- User verification badges
- In-app payment for guide bookings
- Analytics and user engagement tracking
- Dark mode support
