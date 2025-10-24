import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className='min-h-screen'>
        <Outlet /> {/* This is where your page components (Home, About, etc.) will be rendered */}
      </main>
      <Footer/>
    </>
  );
};

export default Layout;