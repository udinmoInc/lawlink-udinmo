import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User, LogOut, LogIn, PlusSquare, Search, Users } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <>
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-10 md:block hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  SocialApp
                </span>
              </Link>
            </div>

            <div className="flex md:items-center md:ml-6">
              <div className="relative mx-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <Home className="h-6 w-6" />
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/groups"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/groups'
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      <Users className="h-6 w-6" />
                    </Link>
                    <Link
                      to="/create"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/create'
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      <PlusSquare className="h-6 w-6" />
                    </Link>
                    <Link
                      to="/profile"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/profile'
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      <User className="h-6 w-6" />
                    </Link>
                    <button
                      onClick={signOut}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-red-600"
                    >
                      <LogOut className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/login'
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <LogIn className="h-6 w-6" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          {user ? (
            <>
              <Link
                to="/groups"
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  location.pathname === '/groups' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Users className="h-6 w-6" />
                <span className="text-xs mt-1">Groups</span>
              </Link>
              <Link
                to="/create"
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  location.pathname === '/create' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <PlusSquare className="h-6 w-6" />
                <span className="text-xs mt-1">Create</span>
              </Link>
              <Link
                to="/profile"
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">Profile</span>
              </Link>
              <button
                onClick={signOut}
                className="flex flex-col items-center justify-center flex-1 h-full text-gray-500"
              >
                <LogOut className="h-6 w-6" />
                <span className="text-xs mt-1">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                location.pathname === '/login' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <LogIn className="h-6 w-6" />
              <span className="text-xs mt-1">Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Add padding to the bottom of the page on mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar;