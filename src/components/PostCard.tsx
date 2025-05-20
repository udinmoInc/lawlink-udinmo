import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Link as LinkIcon, Twitter, Facebook } from 'lucide-react';
import { supabase, type Post, type Comment, type Profile } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  onPostUpdate: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<(Comment & { profiles: Profile })[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(post.user_has_liked || false);
  const [likesCount, setLikesCount] = useState(typeof post.likes_count === 'number' ? post.likes_count : 0);
  const [commentsCount, setCommentsCount] = useState(typeof post.comments_count === 'number' ? post.comments_count : 0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const toggleComments = async () => {
    if (!showComments) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*, profiles(*)')
          .eq('post_id', post.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComments(data as (Comment & { profiles: Profile })[]);
      } catch (error: any) {
        console.error('Error loading comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const { data: newCommentData, error: commentError } = await supabase
        .from('comments')
        .insert([
          {
            post_id: post.id,
            user_id: user.id,
            content: newComment.trim(),
          },
        ])
        .select('*, profiles(*)');

      if (commentError) throw commentError;

      setComments([newCommentData[0] as (Comment & { profiles: Profile }), ...comments]);
      setNewComment('');
      setCommentsCount(prev => prev + 1);
      onPostUpdate();
    } catch (error: any) {
      toast.error('Failed to add comment');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        if (error) throw error;

        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: post.id, user_id: user.id }]);

        if (error) throw error;

        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error: any) {
      toast.error(isLiked ? 'Failed to unlike post' : 'Failed to like post');
      console.error(error);
    }
  };

  const handleShare = async (method: 'copy' | 'twitter' | 'facebook') => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const postText = post.content?.slice(0, 100) + (post.content?.length > 100 ? '...' : '');
    
    switch (method) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(postUrl);
          toast.success('Link copied to clipboard!');
        } catch (err) {
          toast.error('Failed to copy link');
        }
        break;
      
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}&url=${encodeURIComponent(postUrl)}`,
          '_blank'
        );
        break;
      
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
          '_blank'
        );
        break;
    }
    
    setShowShareMenu(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {post.profiles?.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="ml-3">
              <p className="font-semibold text-gray-900">
                {post.profiles?.full_name || post.profiles?.username}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
        </div>

        {post.image_url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={post.image_url} alt="Post" className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="flex items-center justify-between text-gray-500 border-t border-gray-100 pt-3">
          <button
            onClick={handleLike}
            className={`flex items-center ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <Heart size={20} className={isLiked ? 'fill-current' : ''} />
            <span className="ml-2 text-sm">{likesCount}</span>
          </button>

          <button onClick={toggleComments} className="flex items-center hover:text-blue-500">
            <MessageCircle size={20} />
            <span className="ml-2 text-sm">{commentsCount}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center hover:text-green-500"
            >
              <Share2 size={20} />
            </button>

            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                >
                  <LinkIcon size={16} className="mr-2" />
                  Copy Link
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                >
                  <Twitter size={16} className="mr-2" />
                  Share on Twitter
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                >
                  <Facebook size={16} className="mr-2" />
                  Share on Facebook
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          {user && (
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isLoading || !newComment.trim()}
                >
                  Post
                </button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  {comment.profiles?.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      {comment.profiles?.username.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {comment.profiles?.full_name || comment.profiles?.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;