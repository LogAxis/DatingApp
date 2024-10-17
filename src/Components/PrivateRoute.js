import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If no token is found, redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
