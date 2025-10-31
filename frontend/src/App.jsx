import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import RequestsPage from './pages/RequestsPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;