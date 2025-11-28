import { User, Airdrop, Category, Difficulty } from '../types';

// Initial Mock Data
const INITIAL_AIRDROPS: Airdrop[] = [
  {
    id: '1',
    name: 'Blast Layer 2',
    tokenSymbol: 'BLAST',
    description: 'An EVM-compatible Optimistic Rollup with native yield. Users who bridge assets earn yield + points.',
    category: Category.L2,
    value: 'High Potential',
    chain: 'Blast',
    difficulty: Difficulty.MEDIUM,
    endDate: '2024-05-31',
    status: 'Active',
    link: 'https://blast.io',
    tasks: ['Bridge ETH', 'Invite Friends', 'Interact with dApps'],
    createdAt: Date.now(),
    imageUrl: 'https://picsum.photos/seed/blast/400/400'
  },
  {
    id: '2',
    name: 'Pixelmon Games',
    tokenSymbol: 'MON',
    description: 'Play-to-earn RPG game. Holders of NFT and early players are eligible for the MON token airdrop.',
    category: Category.GAMING,
    value: '$100 - $1000',
    chain: 'Immutable X',
    difficulty: Difficulty.EASY,
    endDate: '2024-06-15',
    status: 'Active',
    link: '#',
    tasks: ['Play Game', 'Complete Social Quests'],
    createdAt: Date.now() - 86400000,
    imageUrl: 'https://picsum.photos/seed/pixel/400/400'
  },
  {
    id: '3',
    name: 'Solana DEX Aggregator',
    tokenSymbol: 'JUP',
    description: 'The leading aggregator on Solana. Future rounds of airdrops expected for active traders.',
    category: Category.DEFI,
    value: 'Variable',
    chain: 'Solana',
    difficulty: Difficulty.EASY,
    endDate: '2024-12-31',
    status: 'Upcoming',
    link: '#',
    tasks: ['Swap Tokens', 'Use Limit Orders'],
    createdAt: Date.now() - 172800000,
    imageUrl: 'https://picsum.photos/seed/jup/400/400'
  }
];

const STORAGE_KEYS = {
  USERS: 'ah_users',
  CURRENT_USER: 'ah_current_user',
  AIRDROPS: 'ah_airdrops'
};

// Helpers
const getStorage = <T>(key: string, defaultVal: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultVal;
};

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Service Methods
export const MockStore = {
  // --- Auth ---
  login: async (email: string): Promise<User> => {
    // Simulating delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found. Please register.');
    }
    
    setStorage(STORAGE_KEYS.CURRENT_USER, user.id);
    return user;
  },

  register: async (email: string, name: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: email.includes('admin') ? 'admin' : 'user', // Auto-admin for demo if email has 'admin'
      points: 100, // Welcome bonus
      lastDailyClaim: null,
      streak: 0,
      bookmarkedAirdrops: []
    };

    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    setStorage(STORAGE_KEYS.CURRENT_USER, newUser.id);
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const userId = getStorage<string | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!userId) return null;
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    return users.find(u => u.id === userId) || null;
  },

  updateUser: (updatedUser: User) => {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      setStorage(STORAGE_KEYS.USERS, users);
    }
  },

  // --- Airdrops ---
  getAirdrops: (): Airdrop[] => {
    let airdrops = getStorage<Airdrop[]>(STORAGE_KEYS.AIRDROPS, []);
    if (airdrops.length === 0) {
      airdrops = INITIAL_AIRDROPS;
      setStorage(STORAGE_KEYS.AIRDROPS, airdrops);
    }
    return airdrops.sort((a, b) => b.createdAt - a.createdAt);
  },

  addAirdrop: async (airdrop: Omit<Airdrop, 'id' | 'createdAt'>): Promise<Airdrop> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const airdrops = getStorage<Airdrop[]>(STORAGE_KEYS.AIRDROPS, []); // Don't use getAirdrops here to avoid re-init logic if empty
    const newAirdrop: Airdrop = {
      ...airdrop,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    // Prepend to list
    setStorage(STORAGE_KEYS.AIRDROPS, [newAirdrop, ...airdrops]);
    return newAirdrop;
  },

  // --- Rewards ---
  claimDaily: (user: User): { success: boolean, pointsAdded: number, message: string } => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (user.lastDailyClaim && (now - user.lastDailyClaim) < oneDay) {
      return { success: false, pointsAdded: 0, message: 'Already claimed today. Come back tomorrow!' };
    }

    // Logic for streak
    let newStreak = 1;
    if (user.lastDailyClaim && (now - user.lastDailyClaim) < (oneDay * 2)) {
      newStreak = user.streak + 1;
    }

    const basePoints = 50;
    const streakBonus = Math.min(newStreak * 10, 100); // Cap bonus at 100
    const totalPoints = basePoints + streakBonus;

    const updatedUser = {
      ...user,
      points: user.points + totalPoints,
      lastDailyClaim: now,
      streak: newStreak
    };

    MockStore.updateUser(updatedUser);
    return { success: true, pointsAdded: totalPoints, message: `Claimed ${totalPoints} points!` };
  }
};