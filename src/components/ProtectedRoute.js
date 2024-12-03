import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const authToken = localStorage.getItem('authToken');

    // If no token is found, redirect to the login page
    if (!authToken) {
        return <Navigate to="/login" />;
    }

    // If token exists, render the children components
    return children;
};

export default ProtectedRoute;
