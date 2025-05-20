import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNavbar from './components/MobileNavbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import GroupsPage from './pages/GroupsPage';
import PostPage from './pages/PostPage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import TrendingSidebar from './components/TrendingSidebar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex mx-auto max-w-[1600px]">
            {/* Left Sidebar - Fixed width */}
            <div className="w-[280px] fixed left-0 top-16 bottom-0 px-4">
              <div className="bg-white rounded-xl border border-gray-200 h-full p-4">
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Fixed width */}
            <div className="w-[640px] mx-auto pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/create" element={<CreatePostPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Routes>
            </div>

            {/* Right Sidebar - Fixed width */}
            <div className="w-[280px] fixed right-0 top-16 bottom-0 px-4">
              <div className="bg-white rounded-xl border border-gray-200 h-full p-4">
                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <MobileNavbar />

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