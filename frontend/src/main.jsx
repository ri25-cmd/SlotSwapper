// In frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast'; // <--- Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="bottom-right" /> {/* <--- Add this */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);