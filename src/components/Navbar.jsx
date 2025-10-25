// import React, { useState, useContext } from 'react';
// import { assets } from '../assets/assets';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';

// // --- ICONS ---
// import { CiSearch } from "react-icons/ci";
// import { CgProfile } from "react-icons/cg";
// import { IoCartOutline } from "react-icons/io5";
// import { HiMenu, HiX } from "react-icons/hi";
// import { FaUserCircle, FaShoppingBag } from "react-icons/fa";
// import { IoLogOutOutline } from "react-icons/io5";

// const Navbar = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//     const { getCartItemCount, setShowLogin, token, setToken } = useContext(CartContext);
//     const navigate = useNavigate();
//     const [searchQuery, setSearchQuery] = useState("");

//     const logout = async () => {
//         if (window.confirm("Are you sure you want to log out?")) {
//             await signOut(auth);
//             localStorage.removeItem("token");
//             setToken(null);
//             setShowProfileDropdown(false);
//             navigate("/");
//         }
//     }

//     const navLinkClasses = ({ isActive }) => {
//         return `py-2 transition-colors duration-300 hover:text-black ${
//             isActive
//                 ? "text-black font-bold border-b-2 border-black"
//                 : "text-gray-700 border-b-2 border-transparent"
//         }`;
//     };

//     const handleSearch = () => {
//         if (searchQuery.trim() !== "") {
//             navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//             setSearchQuery("");
//         }
//     };
    
//     const handleKeyDown = (event) => {
//         if (event.key === 'Enter') {
//             handleSearch();
//         }
//     };
     
//     return (
//         <nav className="sticky top-0 z-50 bg-white shadow-sm">
//             <div className="flex items-center justify-between h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
//                 <div className="flex-shrink-0">
//                     <Link to='/' onClick={() => setIsMenuOpen(false)}>
//                         <img
//                             src={assets.logo}
//                             className="h-20 w-auto rounded-full"
//                             alt="Shoevo logo"
//                         />
//                     </Link>
//                 </div>

//                 <ul className="hidden sm:flex items-center gap-8 text-sm">
//                     <li><NavLink to="/" className={navLinkClasses}>HOME</NavLink></li>
//                     <li><NavLink to="/collection" className={navLinkClasses}>COLLECTION</NavLink></li>
//                     <li><NavLink to="/about" className={navLinkClasses}>ABOUT</NavLink></li>
//                     <li><NavLink to="/contact" className={navLinkClasses}>CONTACT</NavLink></li>
//                 </ul>

//                 <div className="hidden sm:flex items-center gap-4">
//                     <div className="flex items-center py-1 px-2 rounded-full border border-gray-300">
//                         <input
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             type="text"
//                             placeholder="Search products..."
//                             className="outline-none text-sm w-40 bg-transparent"
//                         />
//                         <CiSearch
//                             onClick={handleSearch}
//                             className="h-6 w-6 cursor-pointer text-gray-600"
//                         />
//                     </div>
//                     <Link to='/cart' className="relative">
//                         <IoCartOutline className="h-6 w-6 cursor-pointer hover:text-black transition-colors" />
//                         {getCartItemCount() > 0 && (
//                             <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                                 {getCartItemCount()}
//                             </div>
//                         )}
//                     </Link>

//                     {!token ? (
//                         <div onClick={() => setShowLogin(true)} className="cursor-pointer">
//                             <CgProfile className="h-6 w-6 hover:text-black transition-colors" />
//                         </div>
//                     ) : (
//                         <div className="relative">
//                             <FaUserCircle 
//                                 onClick={() => setShowProfileDropdown(prev => !prev)}
//                                 className="h-6 w-6 cursor-pointer" 
//                             />
//                             {showProfileDropdown && (
//                                 <ul className="absolute right-0 top-8 z-10 w-48 p-2 bg-white border rounded-md shadow-lg">
//                                     <li onClick={() => {navigate('/orders'); setShowProfileDropdown(false);}} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
//                                         <FaShoppingBag /> <p>Orders</p>
//                                     </li>
//                                     <hr className="my-1"/>
//                                     <li onClick={logout} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
//                                         <IoLogOutOutline /> <p>Logout</p>
//                                     </li>
//                                 </ul>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 <div className="sm:hidden flex items-center gap-4">
//                     <CiSearch className="h-6 w-6 cursor-pointer" />
//                     <Link to='/cart' className="relative">
//                         <IoCartOutline className="h-6 w-6" />
//                         {getCartItemCount() > 0 && (
//                             <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{getCartItemCount()}</div>
//                         )}
//                     </Link>
//                     {!token ? (
//                         <div onClick={() => setShowLogin(true)} className="cursor-pointer"><CgProfile className="h-6 w-6" /></div>
//                      ) : (
//                         <div onClick={logout} className="cursor-pointer"><IoLogOutOutline className="h-6 w-6" /></div>
//                      )}
//                     <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu" className="ml-2">
//                         {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
//                     </button>
//                 </div>
//             </div>

//             {isMenuOpen && (
//                 <div className="sm:hidden absolute w-full bg-white shadow-lg">
//                     <ul className="flex flex-col items-center gap-4 p-4">
//                         <li onClick={() => setIsMenuOpen(false)}><NavLink to="/" className={navLinkClasses}>HOME</NavLink></li>
//                         <li onClick={() => setIsMenuOpen(false)}><NavLink to="/collection" className={navLinkClasses}>COLLECTION</NavLink></li>
//                         <li onClick={() => setIsMenuOpen(false)}><NavLink to="/about" className={navLinkClasses}>ABOUT</NavLink></li>
//                         <li onClick={() => setIsMenuOpen(false)}><NavLink to="/contact" className={navLinkClasses}>CONTACT</NavLink></li>
//                     </ul>
//                 </div>
//             )}
//         </nav>
//     );
// }

// export default Navbar;

import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// --- ICONS ---
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoCartOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
// 1. Make sure FaUserCircle, FaShoppingBag, and IoLogOutOutline are imported
import { FaUserCircle, FaShoppingBag } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { getCartItemCount, setShowLogin, token, setToken } = useContext(CartContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const logout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            await signOut(auth);
            localStorage.removeItem("token");
            setToken(null);
            setShowProfileDropdown(false);
            navigate("/");
        }
    }

    const navLinkClasses = ({ isActive }) => {
        return `py-2 transition-colors duration-300 hover:text-black ${
            isActive
                ? "text-black font-bold border-b-2 border-black"
                : "text-gray-700 border-b-2 border-transparent"
        }`;
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // Calculate item count *inside* the component to ensure it re-renders
    const itemCount = getCartItemCount();

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="flex items-center justify-between h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to='/' onClick={() => setIsMenuOpen(false)}>
                        <img
                            src={assets.shoevo}
                            className="h-12 w-auto"
                            alt="Shoevo logo"
                        />
                    </Link>
                </div>

                {/* Desktop Navlinks */}
                <ul className="hidden sm:flex items-center gap-8 text-sm">
                    <li><NavLink to="/" className={navLinkClasses}>HOME</NavLink></li>
                    <li><NavLink to="/collection" className={navLinkClasses}>COLLECTION</NavLink></li>
                    <li><NavLink to="/about" className={navLinkClasses}>ABOUT</NavLink></li>
                    <li><NavLink to="/contact" className={navLinkClasses}>CONTACT</NavLink></li>
                </ul>

                {/* Desktop Icons */}
                <div className="hidden sm:flex items-center gap-4">
                    {/* Desktop Search Bar */}
                    <div className="flex items-center py-1 px-2 rounded-full border border-gray-300">
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            type="text"
                            placeholder="Search products..."
                            className="outline-none text-sm w-40 bg-transparent"
                        />
                        <CiSearch
                            onClick={handleSearch}
                            className="h-6 w-6 cursor-pointer text-gray-600"
                        />
                    </div>
                    {/* Desktop Cart Icon */}
                    <Link to='/cart' className="relative">
                        <IoCartOutline className="h-6 w-6 cursor-pointer hover:text-black transition-colors" />
                        {itemCount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                {itemCount}
                            </div>
                        )}
                    </Link>
                    {/* Desktop Profile/Login Icon */}
                    {!token ? (
                        <div onClick={() => setShowLogin(true)} className="cursor-pointer">
                            <CgProfile className="h-6 w-6 hover:text-black transition-colors" />
                        </div>
                    ) : (
                        <div className="relative">
                            <FaUserCircle 
                                onClick={() => setShowProfileDropdown(prev => !prev)}
                                className="h-6 w-6 cursor-pointer" 
                            />
                            {showProfileDropdown && (
                                <ul className="absolute right-0 top-8 z-10 w-48 p-2 bg-white border rounded-md shadow-lg">
                                    <li onClick={() => {navigate('/orders'); setShowProfileDropdown(false);}} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                                        <FaShoppingBag /> <p>Orders</p>
                                    </li>
                                    <hr className="my-1"/>
                                    <li onClick={logout} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                                        <IoLogOutOutline /> <p>Logout</p>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* --- MOBILE ICONS (This whole section is updated) --- */}
                <div className="sm:hidden flex items-center gap-4">
                    {/* Mobile Search: Now links to the search page */}
                    <Link to="/search">
                        <CiSearch className="h-6 w-6 cursor-pointer" />
                    </Link>
                    {/* Mobile Cart */}
                    <Link to='/cart' className="relative">
                        <IoCartOutline className="h-6 w-6" />
                        {itemCount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">{itemCount}</div>
                        )}
                    </Link>

                    {/* Mobile Profile/Orders/Logout */}
                    {!token ? (
                        // Show Profile/Login icon if logged out
                        <div onClick={() => setShowLogin(true)} className="cursor-pointer">
                            <CgProfile className="h-6 w-6" />
                        </div>
                     ) : (
                        // Show Orders and Logout icons if logged in
                        <>
                            <Link to="/orders">
                                <FaShoppingBag className="h-5 w-5 cursor-pointer" />
                            </Link>
                            <div onClick={logout} className="cursor-pointer">
                                <IoLogOutOutline className="h-6 w-6" />
                            </div>
                        </>
                     )}
                    
                    {/* Hamburger Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu" className="ml-2">
                        {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Unchanged) */}
            {isMenuOpen && (
                <div className="sm:hidden absolute w-full bg-white shadow-lg">
                    <ul className="flex flex-col items-center gap-4 p-4">
                        <li onClick={() => setIsMenuOpen(false)}><NavLink to="/" className={navLinkClasses}>HOME</NavLink></li>
                        <li onClick={() => setIsMenuOpen(false)}><NavLink to="/collection" className={navLinkClasses}>COLLECTION</NavLink></li>
                        <li onClick={() => setIsMenuOpen(false)}><NavLink to="/about" className={navLinkClasses}>ABOUT</NavLink></li>
                        <li onClick={() => setIsMenuOpen(false)}><NavLink to="/contact" className={navLinkClasses}>CONTACT</NavLink></li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
