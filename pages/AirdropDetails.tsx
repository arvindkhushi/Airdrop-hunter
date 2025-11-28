import React from 'react';
import { Airdrop } from '../types';
import { ArrowLeft, ExternalLink, CheckCircle, Clock, BarChart } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';

interface Props {
  airdrop: Airdrop | null;
  onBack: () => void;
}

const AirdropDetails: React.FC<Props> = ({ airdrop, onBack }) => {
  if (!airdrop) return null;

  return (
    <div className="animate-fadeIn">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to list
      </button>

      <div className="bg-crypto-card border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-64 bg-slate-800 relative">
          <img 
            src={airdrop.imageUrl || `https://picsum.photos/seed/${airdrop.id}/800/400`} 
            alt={airdrop.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-crypto-card to-transparent">
            <div className="flex items-center gap-2 text-crypto-accent font-bold mb-2">
              {CATEGORY_ICONS[airdrop.category]} {airdrop.category}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{airdrop.name}</h1>
            <div className="flex items-center gap-4 text-slate-300">
              <span className="bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600 text-sm">
                ${airdrop.tokenSymbol}
              </span>
              <span>{airdrop.chain}</span>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">About the Project</h2>
              <p className="text-slate-300 leading-relaxed text-lg">
                {airdrop.description}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">How to Qualify</h2>
              <div className="space-y-3">
                {airdrop.tasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="mt-1 bg-crypto-accent/20 p-1 rounded-full text-crypto-accent">
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-slate-300">{task}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Estimated Value</div>
                  <div className="text-2xl font-bold text-crypto-success">{airdrop.value}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Difficulty</div>
                  <div className="text-lg font-medium text-white">{airdrop.difficulty}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">End Date</div>
                  <div className="text-lg font-medium text-white flex items-center gap-2">
                    <Clock size={16} className="text-orange-400" /> {airdrop.endDate}
                  </div>
                </div>
              </div>

              <a 
                href={airdrop.link} 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 w-full py-3 bg-crypto-accent hover:bg-violet-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Go to Project <ExternalLink size={18} />
              </a>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-xl">
               <h4 className="flex items-center gap-2 font-bold text-indigo-300 mb-2">
                 <BarChart size={16} /> Confidence Score
               </h4>
               <div className="w-full bg-slate-700 h-2 rounded-full mb-1">
                 <div className="bg-crypto-success h-full rounded-full" style={{width: '85%'}}></div>
               </div>
               <p className="text-xs text-slate-400 text-right">85/100 (Legit)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirdropDetails;