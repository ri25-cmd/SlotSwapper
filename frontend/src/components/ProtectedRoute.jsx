import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;