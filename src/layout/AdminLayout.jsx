import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar'; // Import the sidebar
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden"> {/* Use flexbox for layout */}

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar /> {/* Navbar stays at the top of the content area */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-white p-4 sm:p-6 lg:p-8'>
          <Outlet /> {/* Admin pages will render here */}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;