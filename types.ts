
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  GOLD = 'GOLD',
  ELITE = 'ELITE',
  PLATINUM = 'PLATINUM',
  MASTER = 'MASTER',
  DIAMOND = 'DIAMOND'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  CONVERSION = 'CONVERSION',
  TASK_REWARD = 'TASK_REWARD',
  PREMIUM_UPGRADE = 'PREMIUM_UPGRADE',
  TRIAL_START = 'TRIAL_START',
  ADMIN_TRANSFER = 'ADMIN_TRANSFER'
}

export interface User {
  id: string;
  accountNumber: string; // 11-digit identifier
  email: string;
  isVerified: boolean;
  isSuspended: boolean;
  role: UserRole;
  tier: SubscriptionTier;
  cardLinked: boolean;
  trialUsed: boolean;
  createdAt: string;
  streak: number;
  xp: number;
  level: number;
  referralCode: string;
}

export interface Wallet {
  userId: string;
  balance: number; 
  points: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  points?: number;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}

export interface TikTokTask {
  id: string;
  videoId: string;
  author: string;
  reward: number;
  type: 'LIKE' | 'FOLLOW' | 'COMMENT';
  thumbnail: string;
}

export interface AdminStats {
    reserveBalance: number;
    totalUsers: number;
    pendingWithdrawals: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
