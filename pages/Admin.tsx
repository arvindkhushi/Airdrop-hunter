import React, { useState } from 'react';
import { Category, Difficulty } from '../types';
import { MockStore } from '../services/mockStore';
import { generateAirdropDetails } from '../services/geminiService';
import { Sparkles, Save, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Admin: React.FC = () => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tokenSymbol: '',
    chain: '',
    value: '',
    link: '',
    endDate: '',
    // AI generated fields
    description: '',
    category: Category.DEFI,
    difficulty: Difficulty.MEDIUM,
    tasks: ''
  });

  const handleGenerateAI = async () => {
    if (!formData.name || !formData.chain) {
      alert("Please enter Name and Chain first.");
      return;
    }
    setIsLoadingAI(true);
    try {
      const result = await generateAirdropDetails(formData.name, formData.chain);
      setFormData(prev => ({
        ...prev,
        description: result.description,
        category: result.category,
        difficulty: result.difficulty,
        tasks: result.tasks.join(', ')
      }));
    } catch (e) {
      console.error(e);
      alert("AI generation failed.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await MockStore.addAirdrop({
        ...formData,
        status: 'Active',
        tasks: formData.tasks.split(',').map(t => t.trim())
      });
      alert("Airdrop Posted Successfully!");
      setFormData({
        name: '', tokenSymbol: '', chain: '', value: '', link: '', endDate: '',
        description: '', category: Category.DEFI, difficulty: Difficulty.MEDIUM, tasks: ''
      });
    } catch (e) {
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  // Mock data for chart
  const data = [
    { name: 'DeFi', value: 400 },
    { name: 'Gaming', value: 300 },
    { name: 'NFT', value: 300 },
    { name: 'L2', value: 200 },
  ];
  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Form Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-6">Post New Airdrop</h1>
          
          <form onSubmit={handleSubmit} className="bg-crypto-card border border-slate-700 p-6 rounded-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Project Name</label>
                <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Chain / Network</label>
                <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" 
                  value={formData.chain} onChange={e => setFormData({...formData, chain: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* AI Button */}
            <button 
              type="button" 
              onClick={handleGenerateAI}
              disabled={isLoadingAI}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:opacity-90"
            >
              {isLoadingAI ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              Auto-Fill with Gemini AI
            </button>

            <div>
               <label className="text-sm text-slate-400">Description</label>
               <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white h-24"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-sm text-slate-400">Category</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
               </div>
               <div>
                <label className="text-sm text-slate-400">Difficulty</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as Difficulty})}
                >
                  {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400">Symbol</label>
                <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" 
                  value={formData.tokenSymbol} onChange={e => setFormData({...formData, tokenSymbol: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Est. Value</label>
                <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" 
                  value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})}
                  placeholder="$100"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">End Date</label>
                <input 
                  type="date"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" 
                  value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

             <div>
               <label className="text-sm text-slate-400">Tasks (comma separated)</label>
               <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  value={formData.tasks} onChange={e => setFormData({...formData, tasks: e.target.value})}
                  placeholder="Bridge ETH, Follow Twitter, etc."
               />
            </div>

            <button 
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-emerald-600 rounded-lg text-white font-bold hover:bg-emerald-500 flex items-center justify-center gap-2"
            >
              <Save size={18} /> {isSaving ? 'Posting...' : 'Post Airdrop'}
            </button>
          </form>
        </div>

        {/* Analytics Section */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-crypto-card border border-slate-700 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Market Overview</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {data.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl text-sm text-blue-200">
            <h4 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={14} /> AI Tip</h4>
            <p>Gemini suggests focusing on "Layer 2" airdrops this month as activity on Ethereum L2s has increased by 40%.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;