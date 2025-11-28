import React from 'react';
import { Airdrop, Difficulty } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  airdrop: Airdrop;
  onClick: () => void;
}

const AirdropCard: React.FC<Props> = ({ airdrop, onClick }) => {
  const difficultyColor = {
    [Difficulty.EASY]: 'text-green-400 bg-green-400/10',
    [Difficulty.MEDIUM]: 'text-yellow-400 bg-yellow-400/10',
    [Difficulty.HARD]: 'text-red-400 bg-red-400/10',
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-crypto-card border border-slate-700 rounded-xl overflow-hidden hover:border-crypto-accent transition-all duration-300 cursor-pointer shadow-lg hover:shadow-crypto-accent/20"
    >
      <div className="h-32 bg-slate-800 relative overflow-hidden">
        <img 
          src={airdrop.imageUrl || `https://picsum.photos/seed/${airdrop.id}/400/200`} 
          alt={airdrop.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-md ${difficultyColor[airdrop.difficulty]}`}>
            {airdrop.difficulty}
          </span>
          <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 backdrop-blur-md border border-blue-500/30 flex items-center gap-1">
             {CATEGORY_ICONS[airdrop.category]} {airdrop.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-crypto-accent transition-colors">
              {airdrop.name}
            </h3>
            <p className="text-slate-400 text-sm">{airdrop.chain} • ${airdrop.tokenSymbol}</p>
          </div>
          <div className="text-right">
             <p className="text-xs text-slate-500">Value</p>
             <p className="font-mono text-crypto-success font-bold">{airdrop.value}</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm line-clamp-2 mb-4 h-10">
          {airdrop.description}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700 pt-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Ends: {airdrop.endDate}</span>
          </div>
          <button className="flex items-center gap-1 text-crypto-accent font-medium group-hover:translate-x-1 transition-transform">
            Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirdropCard;