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

  useEffect(() => {
    fetchPosts();
  }, [activeTab, user]);

  const fetchPosts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (*),
          likes_count: likes(count),
          comments_count: comments(count),
          user_has_liked: likes!inner(user_id)
        `)
        .order('created_at', { ascending: false });

      if (activeTab === 'following') {
        // Add following filter logic here
      }

      const { data: postsData, error: postsError } = await query;

      if (postsError) throw postsError;

      const processedPosts = postsData?.map((post: any) => ({
        ...post,
        likes_count: post.likes_count?.[0]?.count || 0,
        comments_count: post.comments_count?.[0]?.count || 0,
        user_has_liked: post.user_has_liked?.some((like: any) => like.user_id === user?.id) || false
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
    <div className="min-h-screen border-x border-gray-100">
      {/* Feed Tabs */}
      <div className="flex border-b border-gray-100 sticky top-0 bg-white z-10">
        <button
          onClick={() => setActiveTab('for-you')}
          className={`flex-1 py-4 text-center font-semibold hover:bg-gray-50 transition-colors ${
            activeTab === 'for-you' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 py-4 text-center font-semibold hover:bg-gray-50 transition-colors ${
            activeTab === 'following' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 py-4 text-center font-semibold hover:bg-gray-50 transition-colors ${
            activeTab === 'nearby' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
          }`}
        >
          Nearby
        </button>
      </div>

      {/* Post Creation */}
      <div className="p-4 border-b border-gray-100 sticky top-[57px] bg-white z-10">
        <CreatePostForm onPostCreated={fetchPosts} />
        <div className="flex gap-4 mt-4">
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors">
            <Image size={20} />
            <span className="text-sm font-medium">Image</span>
          </button>
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors">
            <BarChart2 size={20} />
            <span className="text-sm font-medium">Poll</span>
          </button>
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors">
            <MapPin size={20} />
            <span className="text-sm font-medium">Location</span>
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdate={fetchPosts} />
          ))
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-1 text-gray-500">Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeed;