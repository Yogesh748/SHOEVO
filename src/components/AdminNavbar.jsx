import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { IoLogOutOutline } from "react-icons/io5";

const AdminNavbar = () => {
  const { setToken } = useContext(CartContext);
  const navigate = useNavigate();

  const logout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await signOut(auth);
      localStorage.removeItem("token");
      setToken(null);
      navigate("/"); // Redirect to customer homepage on logout
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b"> {/* Changed background */}
      <div className="flex items-center justify-between h-16 max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="font-semibold text-xl text-gray-800">Shoevo Admin Panel</h1>

        {/* Logout Button */}
        <button onClick={logout} className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
          <IoLogOutOutline size={20}/> Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;