// src/Routing.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from '../components/Auth'; // Login component
import ProtectedRoute from '../components/ProtectedRoute'; // Route protection logic
import JobBoard from '../components/JobBoard';
import ResetPassword from '../components/ResetPassword'; // Import the ResetPassword component


const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} /> {/* Login Route */}
        <Route
          path="/jobboard"
          element={
            <ProtectedRoute>
              <JobBoard />
            </ProtectedRoute>
          }
        /> {/* Protected Dashboard Route */}
         <Route path="/reset-password" element={<ResetPassword />} /> {/* New Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Catch-All Route */}
      </Routes>
    </Router>
  );
};

export default Routing;
