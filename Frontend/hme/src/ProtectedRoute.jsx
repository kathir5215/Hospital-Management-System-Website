import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');



  // If no token or no role, redirect to login
  if (!token || !role || role === "null") {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed, redirect to login or unauthorized page
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/rolecheck" replace />;
  }

  // If authorized, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
