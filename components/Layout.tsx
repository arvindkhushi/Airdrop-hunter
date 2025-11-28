import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { MockStore } from '../services/mockStore';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Gift, 
  LogOut, 
  ShieldCheck, 
  PlusCircle,
  Rocket,
  LogIn
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
  activePage: string;
  navigate: (page: string) => void;
}

const Layout: React.FC<Props> = ({ children, activePage, navigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(MockStore.getCurrentUser());
  }, [activePage]); // Refresh user on page change

  const handleLogout = () => {
    MockStore.logout();
    navigate('home'); // Go to home after logout instead of auth page
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard size={20} /> },
    { id: 'explore', label: 'Explore Airdrops', icon: <Rocket size={20} /> },
    { id: 'rewards', label: 'Daily Rewards', icon: <Gift size={20} /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: <PlusCircle size={20} /> });
  }

  return (
    <div className="min-h-screen bg-crypto-dark flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-crypto-card border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-crypto-accent font-bold text-xl">
          <Rocket className="fill-current" /> AirdropHunter
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-crypto-card border-r border-slate-700 z-40 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:flex items-center gap-2 text-crypto-accent font-bold text-2xl mb-8">
            <Rocket className="fill-current" /> Hunter
          </div>

          {user && (
            <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-sm text-slate-400">Welcome back,</div>
              <div className="font-bold text-white truncate">{user.name}</div>
              <div className="mt-2 flex items-center gap-2 text-crypto-success text-sm font-mono">
                <ShieldCheck size={14} /> {user.points} PTS
              </div>
            </div>
          )}

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activePage === item.id 
                    ? 'bg-crypto-accent text-white shadow-lg shadow-crypto-accent/25' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-700">
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-2 hover:bg-slate-800 rounded-lg"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <button 
                onClick={() => navigate('auth')}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <LogIn size={18} /> Login / Signup
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-crypto-dark p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;