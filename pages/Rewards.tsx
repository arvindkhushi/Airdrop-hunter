import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { MockStore } from '../services/mockStore';
import { Gift, Zap, Calendar, Check, Trophy } from 'lucide-react';

const Rewards: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<{msg: string, type: 'success' | 'error' | ''}>({msg:'', type:''});

  useEffect(() => {
    setUser(MockStore.getCurrentUser());
  }, []);

  const handleClaim = async () => {
    if (!user) return;
    setLoading(true);
    
    // Simulate network request
    await new Promise(r => setTimeout(r, 800));
    
    const result = MockStore.claimDaily(user);
    if (result.success) {
      setClaimStatus({ msg: result.message, type: 'success' });
      // Refresh user
      setUser(MockStore.getCurrentUser());
    } else {
      setClaimStatus({ msg: result.message, type: 'error' });
    }
    setLoading(false);
  };

  if (!user) return <div className="text-white">Please login to view rewards.</div>;

  const canClaim = !user.lastDailyClaim || (Date.now() - user.lastDailyClaim) > (24 * 60 * 60 * 1000);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Hunter Rewards</h1>
        <p className="text-slate-400">Earn points daily and climb the leaderboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy size={120} />
          </div>
          <div className="relative z-10">
            <div className="text-indigo-200 font-medium mb-1">Total Points</div>
            <div className="text-5xl font-bold mb-6">{user.points.toLocaleString()}</div>
            
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-yellow-400 rounded-lg text-yellow-900">
                <Zap size={24} />
              </div>
              <div>
                <div className="font-bold text-lg">{user.streak} Day Streak</div>
                <div className="text-xs text-indigo-200">Keep it up for bonus multipliers!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Claim */}
        <div className="bg-crypto-card border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <div className="mb-6 p-4 bg-slate-800 rounded-full inline-block relative">
            <Gift size={48} className="text-crypto-accent" />
            {canClaim && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Daily Check-in</h2>
          <p className="text-slate-400 mb-8 max-w-xs">
            Claim your daily allocation of 50 points. Streak bonuses apply!
          </p>

          <button
            onClick={handleClaim}
            disabled={!canClaim || loading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all
              ${canClaim 
                ? 'bg-crypto-success hover:bg-emerald-400 text-emerald-900 shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
            `}
          >
            {loading ? 'Claiming...' : (canClaim ? 'Claim 50 Points' : 'Come back tomorrow')}
          </button>

          {claimStatus.msg && (
            <div className={`mt-4 text-sm font-medium ${claimStatus.type === 'success' ? 'text-green-400' : 'text-orange-400'}`}>
              {claimStatus.msg}
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon Store */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-white mb-4">Rewards Store (Coming Soon)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-60">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
              <div className="h-32 bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
                <Lock className="text-slate-500" />
              </div>
              <div className="h-4 w-3/4 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
import { Lock } from 'lucide-react'; // Late import for this component

export default Rewards;