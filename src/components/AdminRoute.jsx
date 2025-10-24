import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios'; // We'll need axios to fetch user details

const AdminRoute = ({ children }) => {
  const { token, authIsReady, setShowLogin } = useContext(CartContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authIsReady && token) {
        try {
          // **IMPORTANT: We need to create this backend endpoint next!**
          // This endpoint will verify the token and return the user's role.
          const response = await axios.get('http://localhost:4000/api/user/getrole', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success && response.data.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false); // User found but not admin, or error fetching role
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false); // Assume not admin if error occurs
        } finally {
          setLoadingRole(false);
        }
      } else if (authIsReady && !token) {
         // If auth is ready but no token, definitely not admin
         setIsAdmin(false);
         setLoadingRole(false);
         setShowLogin(true); // Open login if trying to access admin route while logged out
      }
    };

    checkAdminStatus();

  }, [token, authIsReady, setShowLogin]); // Rerun if token or auth readiness changes

  // While checking auth state or role, show loading
  if (!authIsReady || loadingRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Checking access...</p>
      </div>
    );
  }

  // After checks, if user is an admin, show the admin page
  if (token && isAdmin) {
    return children;
  }
  // Otherwise, redirect to homepage (and potentially show login)
  else {
    // Optionally add an alert here for non-admins trying to access
    // alert("Access Denied: Admin privileges required.");
    return <Navigate to='/' />;
  }
};

export default AdminRoute;