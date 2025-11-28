import React, { useEffect, useState } from 'react';
import { Airdrop, Category } from '../types';
import { MockStore } from '../services/mockStore';
import AirdropCard from '../components/AirdropCard';
import { Search, Filter } from 'lucide-react';

interface Props {
  onSelectAirdrop: (airdrop: Airdrop) => void;
}

const Explore: React.FC<Props> = ({ onSelectAirdrop }) => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [filteredAirdrops, setFilteredAirdrops] = useState<Airdrop[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const data = MockStore.getAirdrops();
    setAirdrops(data);
    setFilteredAirdrops(data);
  }, []);

  useEffect(() => {
    let result = airdrops;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(lowerSearch) || 
        a.tokenSymbol.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(a => a.category === selectedCategory);
    }

    setFilteredAirdrops(result);
  }, [search, selectedCategory, airdrops]);

  const categories = ['All', ...Object.values(Category)];

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Explore Airdrops</h1>
        <p className="text-slate-400">Find the latest opportunities filtered by category and difficulty.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search by name or token..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-crypto-accent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-crypto-accent border-crypto-accent text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredAirdrops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAirdrops.map(airdrop => (
            <AirdropCard 
              key={airdrop.id} 
              airdrop={airdrop} 
              onClick={() => onSelectAirdrop(airdrop)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          <Filter size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">No airdrops found matching your criteria.</p>
          <button 
            onClick={() => {setSearch(''); setSelectedCategory('All');}}
            className="text-crypto-accent mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;