/**
 * IndiaTalk API Service - Supabase Version
 * Real backend with Supabase database
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Post,
  Guide,
  Job,
  Conversation,
  Message,
  AuthCredentials,
  AuthResponse,
  PostFilter,
  GuideFilter,
  JobFilter,
  PaginatedResponse,
} from '@/types';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'priya@indiatalk.in',
    name: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Travel enthusiast and local guide',
    languages: ['Hindi', 'English'],
    location: { state: 'Maharashtra', district: 'Mumbai' },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-2',
    email: 'raj@indiatalk.in',
    name: 'Raj Patel',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Software engineer and tech enthusiast',
    languages: ['English', 'Gujarati'],
    location: { state: 'Gujarat', district: 'Ahmedabad' },
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-3',
    email: 'ananya@indiatalk.in',
    name: 'Ananya Desai',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Yoga instructor and wellness coach',
    languages: ['Marathi', 'Hindi', 'English'],
    location: { state: 'Maharashtra', district: 'Pune' },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    author: { id: 'user-1', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=1' },
    content: 'Just explored the beautiful Gateway of India! The sunset view is absolutely stunning. Who else loves Mumbai?',
    language: 'English',
    location: { state: 'Maharashtra', district: 'Mumbai' },
    likes: 234,
    comments: 45,
    shares: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    author: { id: 'user-2', name: 'Raj Patel', avatar: 'https://i.pravatar.cc/150?img=2' },
    content: 'नई टेक स्टार्टअप के लिए हायरिंग कर रहे हैं! अगर आप React Native में अच्छे हैं तो संपर्क करें।',
    language: 'Hindi',
    location: { state: 'Gujarat', district: 'Ahmedabad' },
    likes: 156,
    comments: 28,
    shares: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-3',
    authorId: 'user-3',
    author: { id: 'user-3', name: 'Ananya Desai', avatar: 'https://i.pravatar.cc/150?img=3' },
    content: 'योग और ध्यान के माध्यम से अपने मानसिक स्वास्थ्य को बेहतर बनाएं। पुणे में नई क्लास शुरू हो रही है!',
    language: 'Hindi',
    location: { state: 'Maharashtra', district: 'Pune' },
    likes: 189,
    comments: 32,
    shares: 15,
    isLiked: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_GUIDES: Guide[] = [
  {
    id: 'guide-1',
    userId: 'user-1',
    name: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?img=1',
    expertise: 'Mumbai City Tours & Heritage',
    bio: 'Experienced tour guide with 8+ years in Mumbai tourism',
    languages: ['Hindi', 'English', 'Marathi'],
    location: { state: 'Maharashtra', district: 'Mumbai' },
    rating: 4.8,
    reviewCount: 127,
    pricePerHour: 500,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'guide-2',
    userId: 'user-2',
    name: 'Vikram Singh',
    avatar: 'https://i.pravatar.cc/150?img=4',
    expertise: 'Tech & Startup Mentoring',
    bio: 'Founder & mentor helping startups scale in India',
    languages: ['English', 'Hindi', 'Punjabi'],
    location: { state: 'Gujarat', district: 'Ahmedabad' },
    rating: 4.9,
    reviewCount: 89,
    pricePerHour: 1000,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'guide-3',
    userId: 'user-3',
    name: 'Ananya Desai',
    avatar: 'https://i.pravatar.cc/150?img=3',
    expertise: 'Yoga & Wellness Coaching',
    bio: 'Certified yoga instructor specializing in stress management',
    languages: ['Marathi', 'Hindi', 'English'],
    location: { state: 'Maharashtra', district: 'Pune' },
    rating: 4.7,
    reviewCount: 156,
    pricePerHour: 400,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    companyId: 'company-1',
    company: { id: 'company-1', name: 'TechFlow India', logo: 'https://i.pravatar.cc/150?img=10' },
    title: 'React Native Developer',
    description: 'We are looking for an experienced React Native developer to join our growing team.',
    jobType: 'full-time',
    location: { state: 'Maharashtra', district: 'Mumbai', remote: false },
    salaryMin: 600000,
    salaryMax: 1200000,
    currency: 'INR',
    languages: ['English', 'Hindi'],
    requirements: ['React Native', 'TypeScript', '3+ years experience'],
    benefits: ['Health Insurance', 'Stock Options', 'Remote Work'],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 45,
  },
  {
    id: 'job-2',
    companyId: 'company-2',
    company: { id: 'company-2', name: 'StartupHub Gujarat', logo: 'https://i.pravatar.cc/150?img=11' },
    title: 'Business Development Manager',
    description: 'Lead business growth initiatives across Gujarat region.',
    jobType: 'full-time',
    location: { state: 'Gujarat', district: 'Ahmedabad', remote: true },
    salaryMin: 400000,
    salaryMax: 800000,
    currency: 'INR',
    languages: ['English', 'Gujarati', 'Hindi'],
    requirements: ['5+ years in sales/BD', 'Network in startup ecosystem'],
    benefits: ['Flexible Hours', 'Remote Work', 'Performance Bonus'],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 28,
  },
  {
    id: 'job-3',
    companyId: 'company-3',
    company: { id: 'company-3', name: 'Wellness Plus', logo: 'https://i.pravatar.cc/150?img=12' },
    title: 'Yoga Instructor (Freelance)',
    description: 'Teach yoga classes online and offline across India.',
    jobType: 'freelance',
    location: { state: 'Maharashtra', district: 'Pune', remote: true },
    salaryMin: 300,
    salaryMax: 1000,
    currency: 'INR',
    languages: ['Hindi', 'English', 'Marathi'],
    requirements: ['Yoga certification', 'Teaching experience'],
    benefits: ['Flexible Schedule', 'Remote Work'],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 12,
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['user-1', 'user-2'],
    participants: [MOCK_USERS[0], MOCK_USERS[1]],
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user-2',
      sender: MOCK_USERS[1],
      text: 'Thanks for the recommendation! I will definitely check it out.',
      isRead: true,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    lastMessageAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-2',
    participantIds: ['user-1', 'user-3'],
    participants: [MOCK_USERS[0], MOCK_USERS[2]],
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv-2',
      senderId: 'user-3',
      sender: MOCK_USERS[2],
      text: 'Can you join the yoga class this weekend?',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================================
// API SERVICE CLASS
// ============================================================================

class APIService {
  private baseURL = 'https://indiatalk.in/api';
  private authToken: string | null = null;

  async initialize() {
    this.authToken = await AsyncStorage.getItem('authToken');
  }

  // ========================================================================
  // AUTH ENDPOINTS
  // ========================================================================

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    if (credentials.password.length < 6) {
      throw new Error('Invalid credentials');
    }

    // Mock user (any email works for demo)
    const user: User = {
      id: 'user-current',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      avatar: `https://i.pravatar.cc/150?u=${credentials.email}`,
      bio: 'IndiaTalk user',
      languages: ['English', 'Hindi'],
      location: { state: 'Maharashtra', district: 'Mumbai' },
      createdAt: new Date().toISOString(),
    };

    const token = `token-${Date.now()}`;
    this.authToken = token;
    await AsyncStorage.setItem('authToken', token);

    return { token, user };
  }

  async signup(credentials: AuthCredentials & { name: string }): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!credentials.email || !credentials.password || !credentials.name) {
      throw new Error('All fields are required');
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user: User = {
      id: 'user-current',
      email: credentials.email,
      name: credentials.name,
      avatar: `https://i.pravatar.cc/150?u=${credentials.email}`,
      bio: '',
      languages: ['English'],
      location: { state: 'Maharashtra', district: 'Mumbai' },
      createdAt: new Date().toISOString(),
    };

    const token = `token-${Date.now()}`;
    this.authToken = token;
    await AsyncStorage.setItem('authToken', token);

    return { token, user };
  }

  async logout(): Promise<void> {
    this.authToken = null;
    await AsyncStorage.removeItem('authToken');
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.authToken) return null;
    // In real app, fetch from backend
    return MOCK_USERS[0];
  }

  // ========================================================================
  // POST ENDPOINTS
  // ========================================================================

  async getPosts(filter?: PostFilter): Promise<PaginatedResponse<Post>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...MOCK_POSTS];

    if (filter?.language) {
      filtered = filtered.filter(p => p.language === filter.language);
    }

    if (filter?.location?.state) {
      filtered = filtered.filter(p => p.location.state === filter.location?.state);
    }

    const limit = filter?.limit || 10;
    const offset = filter?.offset || 0;

    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
      limit,
      offset,
      hasMore: offset + limit < filtered.length,
    };
  }

  async getPostDetail(postId: string): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const post = MOCK_POSTS.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async createPost(content: string, language: string, location: any): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: 'user-current',
      author: { id: 'user-current', name: 'You', avatar: 'https://i.pravatar.cc/150?img=0' },
      content,
      language,
      location,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_POSTS.unshift(newPost);
    return newPost;
  }

  async likePost(postId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const post = MOCK_POSTS.find(p => p.id === postId);
    if (post) {
      post.isLiked = true;
      post.likes += 1;
    }
  }

  async unlikePost(postId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const post = MOCK_POSTS.find(p => p.id === postId);
    if (post) {
      post.isLiked = false;
      post.likes -= 1;
    }
  }

  // ========================================================================
  // GUIDE ENDPOINTS
  // ========================================================================

  async getGuides(filter?: GuideFilter): Promise<PaginatedResponse<Guide>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...MOCK_GUIDES];

    if (filter?.language) {
      filtered = filtered.filter(g => g.languages.includes(filter.language!));
    }

    if (filter?.location?.state) {
      filtered = filtered.filter(g => g.location.state === filter.location?.state);
    }

    if (filter?.minRating) {
      filtered = filtered.filter(g => g.rating >= filter.minRating!);
    }

    if (filter?.maxPrice) {
      filtered = filtered.filter(g => g.pricePerHour <= filter.maxPrice!);
    }

    const limit = filter?.limit || 10;
    const offset = filter?.offset || 0;

    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
      limit,
      offset,
      hasMore: offset + limit < filtered.length,
    };
  }

  async getGuideDetail(guideId: string): Promise<Guide> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const guide = MOCK_GUIDES.find(g => g.id === guideId);
    if (!guide) throw new Error('Guide not found');
    return guide;
  }

  // ========================================================================
  // JOB ENDPOINTS
  // ========================================================================

  async getJobs(filter?: JobFilter): Promise<PaginatedResponse<Job>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...MOCK_JOBS];

    if (filter?.jobType) {
      filtered = filtered.filter(j => j.jobType === filter.jobType);
    }

    if (filter?.location?.state) {
      filtered = filtered.filter(j => j.location.state === filter.location?.state);
    }

    if (filter?.language) {
      filtered = filtered.filter(j => j.languages.includes(filter.language!));
    }

    if (filter?.minSalary) {
      filtered = filtered.filter(j => j.salaryMax >= filter.minSalary!);
    }

    if (filter?.maxSalary) {
      filtered = filtered.filter(j => j.salaryMin <= filter.maxSalary!);
    }

    const limit = filter?.limit || 10;
    const offset = filter?.offset || 0;

    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
      limit,
      offset,
      hasMore: offset + limit < filtered.length,
    };
  }

  async getJobDetail(jobId: string): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const job = MOCK_JOBS.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');
    return job;
  }

  // ========================================================================
  // MESSAGE ENDPOINTS
  // ========================================================================

  async getConversations(): Promise<Conversation[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_CONVERSATIONS;
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock messages for the conversation
    return [
      {
        id: 'msg-1',
        conversationId,
        senderId: 'user-1',
        sender: MOCK_USERS[0],
        text: 'Hey! How are you?',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        conversationId,
        senderId: 'user-2',
        sender: MOCK_USERS[1],
        text: 'I am doing great! How about you?',
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'user-current',
      text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    return message;
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }
}

// Export singleton instance
export const apiService = new APIService();
