import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log("ProtectedRoute: token =", token);
  console.log("ProtectedRoute: role =", role);
  console.log("Allowed Roles:", allowedRoles);

  if (!token || !role || role === "null") {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/rolecheck" replace />;
    
  }

  return <Outlet />;
};

export default ProtectedRoute;
