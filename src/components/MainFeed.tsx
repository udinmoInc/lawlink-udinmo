import React, { useState, useEffect } from 'react';
import { Image, MapPin, BarChart2, Share2, SmilePlus } from 'lucide-react';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';
import { supabase, type Post } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MainFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleCreatePost = async () => {
    if (!content.trim()) return;

    try {
      const { error } = await supabase.from('posts').insert([
        {
          user_id: user?.id,
          content: content.trim(),
        },
      ]);

      if (error) throw error;

      setContent('');
      fetchPosts();
      toast.success('Post created successfully!');
    } catch (error: any) {
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      {/* Create Post Section */}
      {user && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-xl p-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full bg-transparent border-0 resize-none placeholder:text-gray-500 focus:ring-0 p-0 text-gray-900"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <Image size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <SmilePlus size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <MapPin size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!content.trim()}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdate={fetchPosts} />
          ))
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-1 text-sm text-gray-500">Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeed;