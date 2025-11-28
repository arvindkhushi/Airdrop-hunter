import React, { useState } from 'react';
import { MockStore } from '../services/mockStore';
import { Rocket, Mail, Lock, User, AlertCircle, X } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
  onCancel?: () => void;
}

const Auth: React.FC<Props> = ({ onLoginSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await MockStore.login(formData.email);
      } else {
        await MockStore.register(formData.email, formData.name);
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-crypto-dark p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-crypto-accent/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-crypto-card border border-slate-700 p-8 rounded-2xl shadow-2xl relative z-10">
        {onCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-crypto-accent/20 rounded-xl mb-4 text-crypto-accent">
            <Rocket size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Hunt'}
          </h1>
          <p className="text-slate-400">
            {isLogin ? 'Login to track your airdrops' : 'Start earning crypto rewards today'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-crypto-accent focus:ring-1 focus:ring-crypto-accent"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="email"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-crypto-accent focus:ring-1 focus:ring-crypto-accent"
                placeholder="name@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            {!isLogin && <p className="text-xs text-slate-500 mt-1">Tip: Use 'admin' in email to simulate admin role.</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="password"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-crypto-accent focus:ring-1 focus:ring-crypto-accent"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-crypto-accent hover:bg-violet-600 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-crypto-accent/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;