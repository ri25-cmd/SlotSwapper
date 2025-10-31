import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client'; // Import socket.io-client
import toast from 'react-hot-toast'; // Import toast

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null); // Add socket state

  useEffect(() => {
    // Check local storage for user info on app load
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  // --- NEW useEffect for Socket.IO ---
  useEffect(() => {
    if (user && !socket) {
      // If user is logged in but socket isn't connected, connect
      const newSocket = io('http://localhost:5001'); // Your backend URL
      setSocket(newSocket);

      // Send this user's ID to the backend
      newSocket.emit('addNewUser', user._id);

      // Listen for notifications
      newSocket.on('getNotification', (data) => {
        toast.success(data.message, {
          icon: '🔔',
          duration: 5000,
        });
        // Here you could also add a 'refetch' for your requests page
      });

      newSocket.on('getResponse', (data) => {
        toast.success(data.message, {
          icon: '✨',
          duration: 5000,
        });
        // Here you could also add a 'refetch' for your dashboard
      });
    }

    // Clean up on unmount or user change
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]); // Re-run when user logs in
  // --- End new useEffect ---

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    // Disconnect socket on logout
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};