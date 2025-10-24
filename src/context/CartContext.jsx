// import React, { createContext, useState, useEffect } from "react";
// import axios from 'axios';

// export const CartContext = createContext(null);

// const CartContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState({});
//   const [showLogin, setShowLogin] = useState(false);
//   const [token, setToken] = useState(null);
//   const [authIsReady, setAuthIsReady] = useState(false);
//   const [all_products, setAllProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [productError, setProductError] = useState(null);

//   // --- Fetch products from backend API ---
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoadingProducts(true);
//         setProductError(null);
//         console.log("Context: Fetching products from backend...");
//         const response = await axios.get('http://localhost:4000/api/product');
//         if (response.data.success) {
//           console.log("Context: Products fetched successfully:", response.data.data.length);
//           setAllProducts(response.data.data);
//         } else {
//           console.error("Context: Failed to fetch products:", response.data.message);
//           setProductError("Failed to fetch products from server.");
//         }
//       } catch (error) {
//         console.error("Context: Error fetching products (axios catch):", error);
//          if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
//              setProductError("Network Error: Could not connect to the backend server. Is it running?");
//          } else {
//             setProductError(`Could not fetch products. ${error.message}`);
//          }
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // --- Load cart from localStorage ---
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cartItems");
//     if (storedCart) {
//       try { setCartItems(JSON.parse(storedCart)); } catch (e) { localStorage.removeItem("cartItems"); }
//     }
//   }, []);

//   // --- Save cart to localStorage ---
//   useEffect(() => {
//     if (!loadingProducts) { // Only save after initial product load attempt
//         if (Object.keys(cartItems).length > 0) { localStorage.setItem("cartItems", JSON.stringify(cartItems)); }
//         else { localStorage.removeItem("cartItems"); }
//     }
//   }, [cartItems, loadingProducts]);

//   // --- Load token from localStorage ---
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) setToken(storedToken);
//     setAuthIsReady(true);
//   }, []);

//   // --- Cart Modification Functions (use _id) ---
//   const addToCart = (itemId) => setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
//   const removeFromCart = (itemId) => setCartItems((prev) => { const n = { ...prev }; if (n[itemId] > 1) n[itemId] -= 1; else delete n[itemId]; return n; });
//   const deleteFromCart = (itemId) => setCartItems((prev) => { const n = {...prev}; delete n[itemId]; return n; });
//   const updateCartQuantity = (itemId, quantity) => { if (quantity > 0) setCartItems((prev) => ({ ...prev, [itemId]: quantity })); else deleteFromCart(itemId); };
//   const clearCart = () => { setCartItems({}); localStorage.removeItem("cartItems"); };

//   // --- Cart Calculation Functions (use _id) ---
//   const getCartTotalAmount = () => { /* ... (Code from previous correct version using _id) ... */ };
//   const getCartItemCount = () => { /* ... (Code from previous correct version) ... */ };
//   // Explicitly define the calculation function again for clarity
//    const calculateTotal = () => {
//         let totalAmount = 0;
//         if (!all_products || all_products.length === 0) return 0;
//         for (const itemId in cartItems) {
//           if (cartItems[itemId] > 0) {
//             const itemInfo = all_products.find((product) => product._id === itemId);
//             if (itemInfo) totalAmount += itemInfo.price * cartItems[itemId];
//           }
//         }
//         return totalAmount;
//    };


//   // --- Context Value ---
//   const contextValue = {
//     all_products, cartItems, setCartItems, addToCart, removeFromCart, deleteFromCart,
//     clearCart, updateCartQuantity, getCartTotalAmount: calculateTotal, getCartItemCount, // Use the specific function here
//     showLogin, setShowLogin, token, setToken, authIsReady,
//     loadingProducts, productError,
//   };

//   return ( <CartContext.Provider value={contextValue}>{props.children}</CartContext.Provider> );
// };

// export default CartContextProvider;

// import React, { createContext, useState, useEffect } from "react";
// import axios from 'axios';

// export const CartContext = createContext(null);

// const CartContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState({});
//   const [showLogin, setShowLogin] = useState(false);
//   const [token, setToken] = useState(null);
//   const [authIsReady, setAuthIsReady] = useState(false);
//   const [all_products, setAllProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [productError, setProductError] = useState(null);
//   // State to hold the currently applied promo code *discount object* {type, value}
//   const [appliedDiscount, setAppliedDiscount] = useState(null);

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoadingProducts(true); setProductError(null);
//         const response = await axios.get('http://localhost:4000/api/product');
//         if (response.data.success) setAllProducts(response.data.data);
//         else setProductError("Failed to fetch products.");
//       } catch (error) { setProductError(`Could not fetch products. ${error.message}`); }
//       finally { setLoadingProducts(false); }
//     };
//     fetchProducts();
//   }, []);

//   // Load cart
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cartItems");
//     if (storedCart) { try { setCartItems(JSON.parse(storedCart)); } catch (e) { localStorage.removeItem("cartItems"); } }
//   }, []);

//   // Save cart
//   useEffect(() => {
//     if (!loadingProducts) {
//         if (Object.keys(cartItems).length > 0) localStorage.setItem("cartItems", JSON.stringify(cartItems));
//         else localStorage.removeItem("cartItems");
//     }
//   }, [cartItems, loadingProducts]);

//   // Load token
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) setToken(storedToken);
//     setAuthIsReady(true);
//   }, []);

//   // Cart modification functions
//   const addToCart = (itemId) => setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
//   const removeFromCart = (itemId) => setCartItems((prev) => { const n = { ...prev }; if (n[itemId] > 1) n[itemId] -= 1; else delete n[itemId]; return n; });
//   const deleteFromCart = (itemId) => setCartItems((prev) => { const n = {...prev}; delete n[itemId]; return n; });
//   const updateCartQuantity = (itemId, quantity) => { if (quantity > 0) setCartItems((prev) => ({ ...prev, [itemId]: quantity })); else deleteFromCart(itemId); };

//   // Clear cart now also clears promo code
//   const clearCart = () => {
//     setCartItems({});
//     localStorage.removeItem("cartItems");
//     setAppliedDiscount(null); // Clear applied code
//     console.log("Context: Cart and promo code cleared.");
//   };

//   // Cart calculation functions
//    const getCartTotalAmount = () => {
//         let totalAmount = 0;
//         if (!all_products || all_products.length === 0) return 0;
//         for (const itemId in cartItems) {
//           if (cartItems[itemId] > 0) {
//             const itemInfo = all_products.find((product) => product._id === itemId);
//             if (itemInfo) totalAmount += itemInfo.price * cartItems[itemId];
//           }
//         }
//         return totalAmount;
//    };
//    const getCartItemCount = () => {
//        let totalItems = 0;
//        for (const item in cartItems) if(cartItems.hasOwnProperty(item) && typeof cartItems[item] === 'number') totalItems += cartItems[item];
//        return totalItems;
//    };

//   // Context value
//   const contextValue = {
//     all_products, cartItems, setCartItems, addToCart, removeFromCart,
//     deleteFromCart, clearCart, updateCartQuantity, getCartTotalAmount, getCartItemCount,
//     showLogin, setShowLogin, token, setToken, authIsReady,
//     loadingProducts, productError,
//     appliedDiscount,    // Export applied discount object
//     setAppliedDiscount, // Export setter function
//   };

//   return (
//     <CartContext.Provider value={contextValue}>
//       {props.children}
//     </CartContext.Provider>
//   );
// };
// export default CartContextProvider;

import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { getAuth, onIdTokenChanged } from "firebase/auth"; // 1. Import new Firebase auth functions
import { auth } from "../firebase"; // 2. Import your firebase app's auth instance

export const CartContext = createContext(null);
const API_BASE_URL = "https://shoevo-backend.onrender.com";

const CartContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(null);
  const [authIsReady, setAuthIsReady] = useState(false); // This is still important
  const [all_products, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(null); // For promo codes

  // --- 3. REVISED: Auth Token Listener ---
  // This replaces the old "Load token from localStorage" useEffect
  useEffect(() => {
    console.log("Context: Setting up Firebase Auth listener...");
    
    // onIdTokenChanged listens for login, logout, AND token refreshes
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      console.log("Context: onIdTokenChanged listener fired.");
      if (user) {
        // User is logged in or token was refreshed
        console.log("Context: User found, getting fresh token...");
        const freshToken = await user.getIdToken();
        setToken(freshToken); // Update React state
        localStorage.setItem("token", freshToken); // Update localStorage
        console.log("Context: Token state and localStorage updated.");
      } else {
        // User is logged out
        console.log("Context: No user found (logged out).");
        setToken(null);
        localStorage.removeItem("token");
      }
      
      // This signals to ProtectedRoute/AdminRoute that the initial check is complete
      if (!authIsReady) {
          console.log("Context: Auth check is now ready.");
          setAuthIsReady(true);
      }
    });

    // Cleanup function: remove the listener when the app unmounts
    return () => {
      console.log("Context: Cleaning up Firebase Auth listener.");
      unsubscribe();
    };
    // We remove authIsReady from dependency array as we only want to set it once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  // --- Fetch products from backend API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true); setProductError(null);
        const response = await axios.get(`${API_BASE_URL}/api/product`)
        if (response.data.success) setAllProducts(response.data.data);
        else setProductError("Failed to fetch products.");
      } catch (error) { setProductError(`Could not fetch products. ${error.message}`); }
      finally { setLoadingProducts(false); }
    };
    fetchProducts();
  }, []);

  // --- Load cart from localStorage ---
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) { try { setCartItems(JSON.parse(storedCart)); } catch (e) { localStorage.removeItem("cartItems"); } }
  }, []);

  // --- Save cart to localStorage ---
  useEffect(() => {
    if (!loadingProducts) {
        if (Object.keys(cartItems).length > 0) localStorage.setItem("cartItems", JSON.stringify(cartItems));
        else localStorage.removeItem("cartItems");
    }
  }, [cartItems, loadingProducts]);


  // --- Cart Modification Functions ---
  const addToCart = (itemId) => setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  const removeFromCart = (itemId) => setCartItems((prev) => { const n = { ...prev }; if (n[itemId] > 1) n[itemId] -= 1; else delete n[itemId]; return n; });
  const deleteFromCart = (itemId) => setCartItems((prev) => { const n = {...prev}; delete n[itemId]; return n; });
  const updateCartQuantity = (itemId, quantity) => { if (quantity > 0) setCartItems((prev) => ({ ...prev, [itemId]: quantity })); else deleteFromCart(itemId); };

  // Clear cart now also clears promo code
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    setAppliedDiscount(null);
    console.log("Context: Cart and promo code cleared.");
  };

  // --- Cart Calculation Functions ---
   const getCartTotalAmount = () => {
        let totalAmount = 0;
        if (!all_products || all_products.length === 0) return 0;
        for (const itemId in cartItems) {
          if (cartItems[itemId] > 0) {
            const itemInfo = all_products.find((product) => product._id === itemId);
            if (itemInfo) totalAmount += itemInfo.price * cartItems[itemId];
          }
        }
        return totalAmount;
   };
   const getCartItemCount = () => {
       let totalItems = 0;
       for (const item in cartItems) if(cartItems.hasOwnProperty(item) && typeof cartItems[item] === 'number') totalItems += cartItems[item];
       return totalItems;
   };

  // --- Context Value ---
  const contextValue = {
    all_products, cartItems, setCartItems, addToCart, removeFromCart,
    deleteFromCart, clearCart, updateCartQuantity, getCartTotalAmount, getCartItemCount,
    showLogin, setShowLogin, token, setToken, authIsReady,
    loadingProducts, productError,
    appliedDiscount, setAppliedDiscount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  );
};
export default CartContextProvider;

