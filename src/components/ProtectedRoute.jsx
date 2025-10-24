

import React, { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token, setShowLogin, authIsReady } = useContext(CartContext);

  useEffect(() => {
    if (authIsReady && !token) {
      setShowLogin(true);
    }
  }, [token, authIsReady, setShowLogin]);
  
  // While the app checks for a token, show a loading state
  if (!authIsReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  // After the check is complete, if a token exists, show the page
  if (token) {
    return children;
  } 
  // Otherwise, redirect to the homepage
  else {
    return <Navigate to='/' />;
  }
};

export default ProtectedRoute;