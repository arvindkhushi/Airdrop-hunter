import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Rewards from './pages/Rewards';
import Admin from './pages/Admin';
import AirdropDetails from './pages/AirdropDetails';
import { MockStore } from './services/mockStore';
import { User, Airdrop } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedAirdrop, setSelectedAirdrop] = useState<Airdrop | null>(null);
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);

  // Check auth on mount, but DO NOT force redirect
  useEffect(() => {
    const u = MockStore.getCurrentUser();
    setUser(u);
  }, []);

  const handleNavigate = (page: string) => {
    // Protected Routes Check
    if ((page === 'rewards' || page === 'admin') && !user) {
      setIntendedRoute(page);
      setCurrentPage('auth');
      window.scrollTo(0, 0);
      return;
    }

    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    setUser(MockStore.getCurrentUser());
    // Redirect to intended page or home
    setCurrentPage(intendedRoute || 'home');
    setIntendedRoute(null);
  };

  const handleSelectAirdrop = (airdrop: Airdrop) => {
    setSelectedAirdrop(airdrop);
    setCurrentPage('details');
  };

  // Auth Page renders without layout
  if (currentPage === 'auth') {
    return (
      <Auth 
        onLoginSuccess={handleLoginSuccess} 
        onCancel={() => {
          setCurrentPage('home');
          setIntendedRoute(null);
        }} 
      />
    );
  }

  return (
    <Layout activePage={currentPage} navigate={handleNavigate}>
      {currentPage === 'home' && (
        <Home navigate={handleNavigate} onSelectAirdrop={handleSelectAirdrop} />
      )}
      
      {currentPage === 'explore' && (
        <Explore onSelectAirdrop={handleSelectAirdrop} />
      )}
      
      {currentPage === 'rewards' && (
        <Rewards />
      )}

      {currentPage === 'admin' && (
        user?.role === 'admin' 
          ? <Admin />
          : <div className="text-white text-center pt-20">Access Denied. Admin only.</div>
      )}

      {currentPage === 'details' && (
        <AirdropDetails 
          airdrop={selectedAirdrop} 
          onBack={() => handleNavigate('explore')} 
        />
      )}
    </Layout>
  );
}

export default App;