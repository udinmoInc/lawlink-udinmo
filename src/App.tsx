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

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex px-2 md:px-4">
            {/* Desktop Sidebar - Hidden on medium and smaller screens */}
            <div className="hidden lg:block w-64 fixed left-4 top-16 bottom-0 bg-white border border-gray-100 rounded-xl overflow-y-auto">
              <Sidebar />
            </div>

            {/* Main Content - Centered with gap */}
            <div className="w-full lg:ml-[17rem] lg:mr-[21rem] pt-16 pb-16 lg:pb-0">
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

            {/* Right Sidebar - Hidden on medium and smaller screens */}
            <div className="hidden lg:block w-80 fixed right-4 top-16 bottom-0 bg-white border border-gray-100 rounded-xl overflow-y-auto">
              <TrendingSidebar />
            </div>
          </div>

          {/* Mobile Navigation */}
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