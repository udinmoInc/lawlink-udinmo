import React from 'react';
import MainFeed from '../components/MainFeed';
import TrendingSidebar from '../components/TrendingSidebar';

const HomePage: React.FC = () => {
  return (
    <div className="flex">
      <div className="flex-1 max-w-2xl mx-auto">
        <MainFeed />
      </div>
      {/* Trending Sidebar - Only visible on desktop */}
      <div className="hidden lg:block w-80 fixed right-0 top-16 bottom-0 overflow-y-auto border-l border-gray-100 bg-white">
        <TrendingSidebar />
      </div>
    </div>
  );
};

export default HomePage;