import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PlusCircle, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-gray-900">
              <Home className="h-6 w-6 mr-2" />
              <span className="font-semibold text-xl">RentEase</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/add-house"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <PlusCircle className="h-5 w-5 mr-1" />
                  <span>Add House</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogIn className="h-5 w-5 mr-1" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}