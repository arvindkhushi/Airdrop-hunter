import React from 'react';
import { 
  Flame, 
  Gamepad2, 
  Wallet, 
  Layers, 
  Coins, 
  Image as ImageIcon 
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.DEFI]: <Coins className="w-4 h-4" />,
  [Category.GAMING]: <Gamepad2 className="w-4 h-4" />,
  [Category.NFT]: <ImageIcon className="w-4 h-4" />,
  [Category.L2]: <Layers className="w-4 h-4" />,
  [Category.MEME]: <Flame className="w-4 h-4" />,
  [Category.WALLET]: <Wallet className="w-4 h-4" />,
};

export const MOCK_ADMIN_KEY = "admin123"; // Simple key to promote user to admin for demo