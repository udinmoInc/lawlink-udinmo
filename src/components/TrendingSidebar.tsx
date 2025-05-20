import React, { useEffect, useState } from 'react';
import { supabase, type Profile } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Hash, TrendingUp, User, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TrendingSidebar: React.FC = () => {
  const { user } = useAuth();
  const [trendingTags, setTrendingTags] = useState<{ tag: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingTags();
  }, []);

  const fetchTrendingTags = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('content');

      if (error) throw error;

      const hashtagRegex = /#(\w+)/g;
      const hashtags = data
        .map(post => post.content.match(hashtagRegex) || [])
        .flat()
        .map(tag => tag.toLowerCase());

      const tagCounts = hashtags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTrendingTags(sortedTags);
    } catch (error) {
      console.error('Error fetching trending tags:', error);
      toast.error('Failed to load trending tags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Premium Subscription */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Star className="text-yellow-300" size={24} />
          <h2 className="text-lg font-semibold">Subscribe to Premium</h2>
        </div>
        <p className="text-sm text-blue-100 mb-4">
          Get exclusive features and support the community
        </p>
        <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          Upgrade Now
        </button>
      </div>

      {/* What's Happening */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">What's happening</h2>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {trendingTags.map(({ tag, count }) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="block p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Hash className="text-blue-500" size={16} />
                  <span className="font-medium text-gray-900">{tag}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{count} posts</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Live Events */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Events</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="font-medium text-gray-900">Tech Conference 2025</p>
            <p className="text-sm text-gray-500 mt-1">Starting in 2 days</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="font-medium text-gray-900">Community Meetup</p>
            <p className="text-sm text-gray-500 mt-1">Live now • 1.2k watching</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;