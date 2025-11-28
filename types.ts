export enum Category {
  DEFI = 'DeFi',
  NFT = 'NFT',
  GAMING = 'Gaming',
  L2 = 'Layer 2',
  MEME = 'Meme',
  WALLET = 'Wallet'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Airdrop {
  id: string;
  name: string;
  tokenSymbol: string;
  description: string;
  category: Category;
  value: string; // e.g., "$50 - $500"
  chain: string; // e.g., Ethereum, Solana
  difficulty: Difficulty;
  endDate: string;
  status: 'Active' | 'Ended' | 'Upcoming';
  link: string;
  tasks: string[];
  imageUrl?: string;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  points: number;
  lastDailyClaim: number | null; // Timestamp
  streak: number;
  bookmarkedAirdrops: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}