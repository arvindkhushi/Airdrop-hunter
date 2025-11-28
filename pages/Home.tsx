import React, { useEffect, useState } from 'react';
import { Airdrop, User } from '../types';
import { MockStore } from '../services/mockStore';
import AirdropCard from '../components/AirdropCard';
import { ArrowRight, Flame, TrendingUp, Target, Search, Gift } from 'lucide-react';

interface Props {
  navigate: (page: string) => void;
  onSelectAirdrop: (airdrop: Airdrop) => void;
}

const Home: React.FC<Props> = ({ navigate, onSelectAirdrop }) => {
  const [trending, setTrending] = useState<Airdrop[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const allAirdrops = MockStore.getAirdrops();
    setTrending(allAirdrops.slice(0, 3)); // Just take top 3 latest
    setUser(MockStore.getCurrentUser());
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-900 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-xs font-bold mb-4 border border-white/20">
            {user ? `Welcome back, ${user.name}` : "Welcome to AirdropHunter"}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Discover the Next <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              100x Airdrop
            </span>
          </h1>
          <p className="text-indigo-200 text-lg mb-8">
            The #1 platform to find, track, and earn from the most promising crypto airdrops. 
            AI-powered insights at your fingertips.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('explore')}
              className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              Start Hunting <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('rewards')}
              className={`px-6 py-3 font-bold rounded-lg border transition-colors ${
                 user 
                 ? 'bg-indigo-800/50 text-white border-indigo-500/30 hover:bg-indigo-800'
                 : 'bg-emerald-600 border-transparent text-white hover:bg-emerald-500'
              }`}
            >
              {user ? 'Claim Daily Rewards' : 'Join to Earn Rewards'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Airdrops', val: '142+', color: 'text-blue-400' },
          { label: 'Total Value', val: '$5.2M', color: 'text-green-400' },
          { label: 'Users Hunting', val: '12.5k', color: 'text-purple-400' },
          { label: 'Avg Reward', val: '$450', color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-crypto-card border border-slate-700 p-4 rounded-xl">
            <div className="text-slate-400 text-sm mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Trending Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="text-orange-500 fill-orange-500" /> Trending Now
          </h2>
          <button 
            onClick={() => navigate('explore')}
            className="text-crypto-accent hover:text-white transition-colors text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map(airdrop => (
            <AirdropCard 
              key={airdrop.id} 
              airdrop={airdrop} 
              onClick={() => onSelectAirdrop(airdrop)} 
            />
          ))}
        </div>
      </div>

      {/* How it Works (New Section) */}
      <div className="py-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
             <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">1. Discover</h3>
             <p className="text-slate-400">Find the hottest airdrops before they go mainstream using our AI-curated lists.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
             <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
               <Target size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">2. Participate</h3>
             <p className="text-slate-400">Complete simple tasks like bridging or social engagement to qualify for rewards.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
             <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
               <Gift size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">3. Earn</h3>
             <p className="text-slate-400">Track your progress, claim tokens, and earn Hunter points on our platform.</p>
          </div>
        </div>
      </div>

      {/* Categories Teaser */}
      <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
           <TrendingUp className="text-emerald-400" />
           <h3 className="text-xl font-bold text-white">Browse by Category</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {['DeFi', 'Gaming', 'L2', 'NFT', 'Solana', 'Base', 'Testnet'].map((tag) => (
             <button
               key={tag}
               onClick={() => navigate('explore')}
               className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-full text-slate-300 hover:border-crypto-accent hover:text-white transition-all"
             >
               #{tag}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;