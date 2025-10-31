import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CalendarDaysIcon, ArrowLeftOnRectangleIcon, UserPlusIcon, UsersIcon, ShoppingBagIcon, BellIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-indigo-600 flex items-center">
            <CalendarDaysIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800 ml-2">SlotSwapper</span>
         </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Hi, {user.name}!</span>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 flex items-center">
                  <UsersIcon className="h-5 w-5 mr-1" />
                  My Slots
                </Link>
                <Link to="/marketplace" className="text-gray-600 hover:text-indigo-600 flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 mr-1" />
                  Marketplace
                </Link>
                <Link to="/requests" className="text-gray-600 hover:text-indigo-600 flex items-center">
                  <BellIcon className="h-5 w-5 mr-1" />
                  Requests
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 flex items-center">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-indigo-600 flex items-center">
                  <UserPlusIcon className="h-5 w-5 mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;