/**
 * IndiaTalk TypeScript Type Definitions
 * Core types for the entire application
 */

// ============================================================================
// AUTH & USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  languages: string[];
  location: {
    state: string;
    district?: string;
  };
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ============================================================================
// POST TYPES
// ============================================================================

export interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  language: string;
  location: {
    state: string;
    district?: string;
  };
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface CreatePostRequest {
  content: string;
  language: string;
  location: {
    state: string;
    district?: string;
  };
  images?: string[];
}

// ============================================================================
// GUIDE TYPES
// ============================================================================

export interface Guide {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  expertise: string;
  bio: string;
  languages: string[];
  location: {
    state: string;
    district?: string;
  };
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  createdAt: string;
}

export interface GuideBooking {
  id: string;
  guideId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

// ============================================================================
// JOB TYPES
// ============================================================================

export interface Job {
  id: string;
  companyId: string;
  company: {
    id: string;
    name: string;
    logo?: string;
  };
  title: string;
  description: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  location: {
    state: string;
    district?: string;
    remote: boolean;
  };
  salaryMin: number;
  salaryMax: number;
  currency: string;
  languages: string[];
  requirements: string[];
  benefits: string[];
  postedAt: string;
  expiresAt: string;
  applicants: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resume?: string;
  coverLetter?: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  appliedAt: string;
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: User[];
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  text: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface CreateMessageRequest {
  conversationId: string;
  text: string;
  attachments?: string[];
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface LocationFilter {
  state?: string;
  district?: string;
}

export interface PostFilter {
  language?: string;
  location?: LocationFilter;
  sortBy?: 'recent' | 'trending' | 'popular';
  limit?: number;
  offset?: number;
}

export interface GuideFilter {
  language?: string;
  location?: LocationFilter;
  minRating?: number;
  maxPrice?: number;
  minPrice?: number;
  sortBy?: 'rating' | 'price' | 'recent';
  limit?: number;
  offset?: number;
}

export interface JobFilter {
  jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  location?: LocationFilter;
  language?: string;
  minSalary?: number;
  maxSalary?: number;
  remote?: boolean;
  sortBy?: 'recent' | 'salary' | 'popular';
  limit?: number;
  offset?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export type RootStackParamList = {
  Auth: undefined;
  HomeTabs: undefined;
  PostDetail: { postId: string };
};

export type HomeTabsParamList = {
  Home: undefined;
  Guides: undefined;
  Jobs: undefined;
  Messages: undefined;
  Profile: undefined;
};

// ============================================================================
// LANGUAGE & LOCATION CONSTANTS
// ============================================================================

export const LANGUAGES = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Punjabi',
  'Urdu',
  'Odia',
] as const;

export type Language = typeof LANGUAGES[number];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

export type IndianState = typeof INDIAN_STATES[number];

// ============================================================================
// MOCK DATA STRUCTURE
// ============================================================================

export interface MockDataStore {
  users: User[];
  posts: Post[];
  guides: Guide[];
  jobs: Job[];
  conversations: Conversation[];
  messages: Message[];
}
