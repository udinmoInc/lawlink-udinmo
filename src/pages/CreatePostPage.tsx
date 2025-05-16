import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/CreatePostForm';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePostCreated = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 mt-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Post</h1>
      <CreatePostForm onPostCreated={handlePostCreated} />
    </div>
  );
};

export default CreatePostPage;