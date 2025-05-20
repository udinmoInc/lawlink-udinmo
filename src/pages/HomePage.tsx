import React, { useEffect, useState } from 'react';
import { supabase, type Post } from '../lib/supabase';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
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
    <div className="max-w-2xl mx-auto px-4 py-6 mt-16 mb-20">
      <CreatePostForm onPostCreated={fetchPosts} />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdate={fetchPosts} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-gray-500">Be the first to share something!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;