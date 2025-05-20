import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RecentPosts from './components/RecentPosts';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import GroupsPage from './pages/GroupsPage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            {/* Desktop Left Sidebar */}
            <div className="hidden md:block w-64 fixed left-0 top-16 bottom-0 bg-white border-r border-gray-100 overflow-y-auto">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 md:mr-64">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/create" element={<CreatePostPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/post/:id" element={<PostPage />} />
              </Routes>
            </div>

            {/* Desktop Right Sidebar */}
            <div className="hidden md:block w-64 fixed right-0 top-16 bottom-0 bg-white border-l border-gray-100 overflow-y-auto">
              <RecentPosts />
            </div>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#334155',
                border: '1px solid #e2e8f0'
              }
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;