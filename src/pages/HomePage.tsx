import React from 'react';
import MainFeed from '../components/MainFeed';
import TrendingSidebar from '../components/TrendingSidebar';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-full mx-auto">
      <MainFeed />
    </div>
  );
};

export default HomePage;