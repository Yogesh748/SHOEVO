// import React, { useContext } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Layout from './layout/Layout'; // Customer Layout
// import AdminLayout from './layout/AdminLayout'; // Admin Layout
// import Home from './pages/Home';
// import Collection from './pages/Collection';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Product from './pages/Product';
// import Cart from './pages/Cart';
// import PlaceOrder from './pages/PlaceOrder';
// import Orders from './pages/Orders'; // User Orders page
// import SearchResults from './pages/SearchResults';
// import LoginPopup from './components/LoginPopup';
// import { CartContext } from './context/CartContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import AdminRoute from './components/AdminRoute';
// import AddProduct from './pages/AddProduct';
// import ListProducts from './pages/ListProducts';
// import AdminOrders from './pages/AdminOrders'; // 1. Import AdminOrders

// const App = () => {
//   const { showLogin } = useContext(CartContext);

//   return (
//     <>
//       {showLogin && <LoginPopup />}
//       <Routes>
//         {/* --- Customer Routes --- */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="collection" element={<Collection />} />
//           <Route path="about" element={<About />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="product/:productId" element={<Product />} />
//           <Route path="cart" element={<Cart />} />
//           <Route path="search" element={<SearchResults />} />
//           <Route path="place-order" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
//           <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//         </Route>

//         {/* --- Admin Routes --- */}
//         <Route path="/admin" element={
//           <AdminRoute> {/* Protect the whole admin section */}
//             <AdminLayout /> {/* Use the specific admin layout */}
//           </AdminRoute>
//         }>
//           <Route index element={<ListProducts />} /> {/* Default admin page to List */}
//           <Route path="add" element={<AddProduct />} />
//           <Route path="list" element={<ListProducts />} />
//           {/* 2. Add the route for managing orders */}
//           <Route path="orders" element={<AdminOrders />} />
//         </Route>

//       </Routes>
//     </>
//   );
// };

// export default App;


//__________________________________________
// import React, { useContext } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Layout from './layout/Layout'; // Customer Layout
// import AdminLayout from './layout/AdminLayout'; // Admin Layout
// import Home from './pages/Home';
// import Collection from './pages/Collection';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Product from './pages/Product';
// import Cart from './pages/Cart';
// import PlaceOrder from './pages/PlaceOrder';
// import Orders from './pages/Orders'; // User Orders page
// import SearchResults from './pages/SearchResults';
// import LoginPopup from './components/LoginPopup';
// import { CartContext } from './context/CartContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import AdminRoute from './components/AdminRoute';
// import AddProduct from './pages/AddProduct';
// import ListProducts from './pages/ListProducts';
// import AdminOrders from './pages/AdminOrders';
// import EditProduct from './pages/EditProduct'; // Import EditProduct

// const App = () => {
//   const { showLogin } = useContext(CartContext);

//   return (
//     <>
//       {showLogin && <LoginPopup />}
//       <Routes>
//         {/* --- Customer Routes --- */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="collection" element={<Collection />} />
//           <Route path="about" element={<About />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="product/:productId" element={<Product />} />
//           <Route path="cart" element={<Cart />} />
//           <Route path="search" element={<SearchResults />} />
//           <Route path="place-order" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
//           <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//         </Route>

//         {/* --- Admin Routes --- */}
//         <Route path="/admin" element={
//           <AdminRoute>
//             <AdminLayout />
//           </AdminRoute>
//         }>
//           <Route index element={<ListProducts />} /> {/* Default to list */}
//           <Route path="add" element={<AddProduct />} />
//           <Route path="list" element={<ListProducts />} />
//           <Route path="orders" element={<AdminOrders />} />
//           {/* Add the route for editing a product */}
//           <Route path="edit/:productId" element={<EditProduct />} />
//         </Route>

//       </Routes>
//     </>
//   );
// };

// export default App;

import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout'; // Customer Layout
import AdminLayout from './layout/AdminLayout'; // Admin Layout
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders'; // User Orders page
import SearchResults from './pages/SearchResults';
import LoginPopup from './components/LoginPopup';
import { CartContext } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AddProduct from './pages/AddProduct';
import ListProducts from './pages/ListProducts';
import AdminOrders from './pages/AdminOrders';
import EditProduct from './pages/EditProduct';
import AdminPromoCodes from './pages/AdminPromoCodes'; // Import AdminPromoCodes

const App = () => {
  const { showLogin } = useContext(CartContext);

  return (
    <>
      {showLogin && <LoginPopup />}
      <Routes>
        {/* --- Customer Routes --- */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="collection" element={<Collection />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="product/:productId" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="place-order" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        </Route>

        {/* --- Admin Routes --- */}
        <Route path="/admin" element={
          <AdminRoute> {/* Protect the whole admin section */}
            <AdminLayout /> {/* Use the specific admin layout */}
          </AdminRoute>
        }>
          <Route index element={<ListProducts />} /> {/* Default admin page to List Products */}
          <Route path="add" element={<AddProduct />} />
          <Route path="list" element={<ListProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="edit/:productId" element={<EditProduct />} />
          {/* Add Promo Code Route */}
          <Route path="promos" element={<AdminPromoCodes />} />
        </Route>

      </Routes>
    </>
  );
};

export default App;