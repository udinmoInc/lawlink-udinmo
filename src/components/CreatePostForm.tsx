import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Image, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('posts').insert([
        {
          user_id: user.id,
          content: content.trim(),
          image_url: imageUrl.trim() || null,
        },
      ]);

      if (error) throw error;

      setContent('');
      setImageUrl('');
      toast.success('Post created successfully!');
      onPostCreated();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          disabled={isSubmitting}
        />

        {imageUrl && (
          <div className="relative mt-2 mb-3">
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img src={imageUrl} alt="Post preview" className="w-full h-auto max-h-64 object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 border-t border-gray-100 pt-3">
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Add image URL"
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <Image className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;