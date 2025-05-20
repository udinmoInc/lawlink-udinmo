import React, { useState } from 'react';
import { Image, MapPin, BarChart2 } from 'lucide-react';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';

const MainFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('for-you');

  return (
    <div className="min-h-screen border-x border-gray-100">
      {/* Feed Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('for-you')}
          className={`flex-1 py-4 text-center font-semibold hover:bg-gray-50 transition-colors ${
            activeTab === 'for-you' ? 'border-b-2 border-blue-500' : ''
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 py-4 text-center font-semibold hover:bg-gray-50 transition-colors ${
            activeTab === 'following' ? 'border-b-2 border-blue-500' : ''
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 py-4 text-center font-semibold hover:bg-gray-50 transition-colors ${
            activeTab === 'nearby' ? 'border-b-2 border-blue-500' : ''
          }`}
        >
          Nearby
        </button>
      </div>

      {/* Post Creation */}
      <div className="p-4 border-b border-gray-100">
        <CreatePostForm onPostCreated={() => {}} />
        <div className="flex gap-4 mt-4">
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
            <Image size={20} />
            <span>Image</span>
          </button>
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
            <BarChart2 size={20} />
            <span>Poll</span>
          </button>
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
            <MapPin size={20} />
            <span>Location</span>
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-gray-100">
        {/* Posts will be rendered here */}
      </div>
    </div>
  );
};

export default MainFeed;