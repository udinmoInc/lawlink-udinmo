import React, { useState, useEffect } from 'react';
import { Image, MapPin, BarChart2 } from 'lucide-react';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';
import { supabase, type Post } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MainFeed: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('for-you');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostTools, setShowPostTools] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (*),
          likes_count: likes(count),
          comments_count: comments(count)
          ${user ? ', user_has_liked: likes!inner(user_id)' : ''}
        `)
        .order('created_at', { ascending: false });

      if (activeTab === 'following' && user) {
        // Add following filter logic here
      }

      const { data: postsData, error: postsError } = await query;

      if (postsError) throw postsError;

      const processedPosts = postsData?.map((post: any) => ({
        ...post,
        likes_count: post.likes_count?.[0]?.count || 0,
        comments_count: post.comments_count?.[0]?.count || 0,
        user_has_liked: user ? (post.user_has_liked?.some((like: any) => like.user_id === user?.id) || false) : false
      }));

      setPosts(processedPosts);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Post Creator Block */}
      <div className="p-4 border-b border-gray-200">
        <div className="h-32 bg-gray-100 rounded-lg"></div>
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="h-48 bg-gray-100 rounded-lg"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainFeed;