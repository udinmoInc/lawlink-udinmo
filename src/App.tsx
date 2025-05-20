import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
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
        <div className="min-h-screen bg-[#15202b] text-white">
          <Navbar />
          <div className="flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-80 fixed left-0 top-16 bottom-0 bg-[#1a2734] border-r border-[#38444d] overflow-y-auto">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-80">
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
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a2734',
                color: '#fff',
                border: '1px solid #38444d'
              }
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;