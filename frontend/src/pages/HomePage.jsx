import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to SlotSwapper</h1>
      <p className="text-lg text-gray-600 mb-8">
        The easiest way to swap your busy calendar slots with peers.
      </p>
      {user ? (
        <Link
          to="/dashboard"
          className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-700"
        >
          Go to Your Dashboard
        </Link>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-700"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg shadow border border-indigo-600 hover:bg-indigo-50"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;