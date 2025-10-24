// import React, { useState, useEffect, useContext } from 'react';
// import { FaBoxOpen } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import Modal from '../components/Modal';
// import OrderTracker from '../components/OrderTracker';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext';

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [modalContent, setModalContent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { token } = useContext(CartContext);

//   // This useEffect hook fetches the user's orders from the backend
//   useEffect(() => {
//     const fetchUserOrders = async () => {
//       if (!token) {
//         setLoading(false);
//         return; // Don't fetch if there's no token
//       }
//       setLoading(true);
//       setError(null);
//       try {
//         // Call the backend endpoint we just created
//         const response = await axios.get('http://localhost:4000/api/order/userorders', {
//           headers: { Authorization: `Bearer ${token}` } // Send the auth token
//         });

//         if (response.data.success) {
//           setOrders(response.data.data);
//         } else {
//           setError("Failed to fetch orders.");
//         }
//       } catch (err) {
//         setError(`Error fetching orders: ${err.response?.data?.message || err.message}`);
//         console.error("Fetch orders error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserOrders();
//   }, [token]); // Re-fetch if the token changes

//   // Placeholder for cancel functionality
//   const handleCancelClick = (orderId) => {
//        alert("Order cancellation requires a backend endpoint which has not been built yet.");
//   };

//   return (
//     <>
//       <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
//         {modalContent}
//       </Modal>

//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold">My Orders</h1>
//           <Link to="/collection" className="bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
//             Go to Shopping
//           </Link>
//         </div>

//         <div className="flex flex-col gap-6">
//           {loading && <p className="text-center text-gray-500">Loading your orders...</p>}
//           {error && <p className="text-center text-red-500">{error}</p>}

//           {!loading && !error && orders.length > 0 && (
//             orders.map((order) => (
//               <div key={order._id} className="border rounded-lg p-4 shadow-sm">
//                 <div className="flex flex-wrap items-center gap-4 mb-4">
//                   <FaBoxOpen className="text-2xl text-gray-700" />
//                   <p className="font-semibold text-sm sm:text-base">Order ID: ...{order._id.slice(-6)}</p>
//                   <p className="text-sm text-gray-500 ml-auto">Date: {new Date(order.date).toLocaleDateString()}</p>
//                 </div>
//                 <div className="flex flex-col gap-2 mb-4">
//                   {order.items.map((item, index) => (
//                     <Link to={`/product/${item._id}`} key={item._id || index} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
//                       <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
//                       <p>{item.name} <span className="text-sm text-gray-500">x {item.quantity}</span></p>
//                     </Link>
//                   ))}
//                 </div>
//                 <div className="border-t pt-3 flex flex-wrap gap-4 justify-between items-center">
//                   <p className="font-semibold">Total: ${order.amount.toFixed(2)}</p>
//                   <div className="flex items-center gap-4">
//                     <p className="text-sm font-medium">Status: <span className="text-orange-500">{order.status}</span></p>
//                     <button
//                       onClick={() => setModalContent(<OrderTracker status={order.status} />)}
//                       className="bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-blue-600 transition-colors"
//                     >
//                       Track Order
//                     </button>
//                     <button
//                       onClick={() => handleCancelClick(order._id)}
//                       className="bg-red-300 text-white text-sm font-semibold py-1 px-3 rounded-md cursor-not-allowed"
//                       disabled
//                     >
//                       Cancel Order
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}

//           {!loading && !error && orders.length === 0 && (
//             <div className="text-center py-16">
//               <h2 className="text-2xl font-semibold text-gray-700">No Orders Yet</h2>
//               <p className="text-gray-500 mt-2">You haven't placed any orders with us.</p>
//               <Link to="/" className="mt-6 inline-block bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300">
//                 Start Shopping
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Orders;


// import React, { useState, useEffect, useContext } from 'react';
// import { FaBoxOpen } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import Modal from '../components/Modal';
// import OrderTracker from '../components/OrderTracker';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext';
// import { IoArrowBack } from 'react-icons/io5'; // Import if needed for back button consistency

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [modalContent, setModalContent] = useState(null);
//   const [loading, setLoading] = useState(true); // Start loading true
//   const [error, setError] = useState(null);
//   const { token } = useContext(CartContext); // Get token from context

//   // Fetch user's orders function with logging
//   const fetchUserOrders = async () => {
//     // console.log("Orders Page: Starting fetchUserOrders. Token:", token ? "Present" : "Missing"); // Keep logs minimal
//     if (!token) {
//       setError("Not logged in. Cannot fetch orders."); // Set error if no token
//       setLoading(false);
//       // console.log("Orders Page: No token, fetch aborted.");
//       return;
//     }
//     setLoading(true); // Ensure loading is true when fetching starts
//     setError(null);
//     try {
//       // console.log("Orders Page: Making API call to /api/order/userorders...");
//       const response = await axios.get('http://localhost:4000/api/order/userorders', {
//         headers: { Authorization: `Bearer ${token}` } // Send the auth token
//       });
//       // console.log("Orders Page: API response received:", response.data);
//       if (response.data.success) {
//         setOrders(response.data.data);
//       } else {
//         setError(`Failed to fetch orders: ${response.data.message}`);
//         console.error("Orders Page: API reported failure:", response.data.message);
//       }
//     } catch (err) {
//       setError(`Error fetching orders: ${err.response?.data?.message || err.message}`);
//       console.error("Orders Page: Axios error during fetch:", err);
//     } finally {
//       setLoading(false);
//       // console.log("Orders Page: fetchUserOrders finished.");
//     }
//   };

//   // Fetch orders when the component mounts or token changes
//   useEffect(() => {
//     // console.log("Orders Page: useEffect triggered. Token:", token ? "Present" : "Missing");
//     fetchUserOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]); // Dependency: token

//   // Handler for User Cancelling Order
//   const handleUserCancel = async (orderId) => {
//       // console.log(`Orders Page: Attempting user cancel for order ${orderId}`);
//       if (!token) { alert("Authentication error."); return; }

//       if (window.confirm("Are you sure you want to cancel this order?")) {
//           try {
//               const response = await axios.put(`http://localhost:4000/api/order/cancel/${orderId}`,
//                  {},
//                  { headers: { Authorization: `Bearer ${token}` } }
//               );
//               // console.log("Orders Page: Cancel response:", response.data);
//               if (response.data.success) {
//                   // Update status locally
//                   setOrders(prevOrders =>
//                       prevOrders.map(order =>
//                           order._id === orderId ? { ...order, status: "Cancelled" } : order
//                       )
//                   );
//                   alert("Order cancelled successfully!");
//               } else {
//                   alert(`Error cancelling order: ${response.data.message}`);
//               }
//           } catch (err) {
//               alert(`Error: ${err.response?.data?.message || err.message}`);
//               console.error("Orders Page: Cancel order error:", err);
//           }
//       }
//   };

//   return (
//     <>
//       <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)}> {modalContent} </Modal>

//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold">My Orders</h1>
//           <Link to="/collection" className="bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"> Go to Shopping </Link>
//         </div>

//         <div className="flex flex-col gap-6">
//           {/* Loading State */}
//           {loading && <p className="text-center py-10 text-gray-500 text-lg">Loading your orders...</p>}

//           {/* Error State */}
//           {error && <p className="text-center py-10 text-red-600 font-semibold text-lg">{error}</p>}

//           {/* Content */}
//           {!loading && !error && orders.length > 0 && (
//             orders.map((order) => {
//                 const canCancel = order.status === 'Processing' || order.status === 'Payment Pending';
//                 const isCancelled = order.status === "Cancelled"; // Check if cancelled
//                 return (
//                     <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
//                         {/* Order Header */}
//                         <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 border-b pb-2 text-sm">
//                             <FaBoxOpen className="text-lg text-gray-600" />
//                             <p className="font-semibold text-gray-800">ID: ...{order._id.slice(-6)}</p>
//                             <p className="text-gray-500 ml-auto"> Date: {new Date(order.createdAt || order.date).toLocaleDateString()} </p>
//                         </div>
//                         {/* Items List */}
//                         <div className="flex flex-col gap-2 mb-4">
//                             {order.items.map((item, index) => (
//                                 <Link to={`/product/${item._id}`} key={item._id || index} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
//                                     <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/48?text=Img'; }} />
//                                     <p>{item.name} <span className="text-sm text-gray-500">x {item.quantity}</span></p>
//                                 </Link>
//                             ))}
//                         </div>
//                         {/* Footer */}
//                         <div className="border-t pt-3 flex flex-wrap gap-4 justify-between items-center">
//                             <p className="font-semibold text-gray-800">Total: ${order.amount.toFixed(2)}</p>
//                             <div className="flex items-center gap-4 flex-wrap"> {/* Buttons container */}
//                                 <p className="text-sm font-medium">Status: <span className={`font-semibold ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Cancelled' ? 'text-red-600' : 'text-orange-500'}`}>{order.status}</span></p>
//                                 {/* --- UPDATED: Track Order Button --- */}
//                                 <button
//                                     onClick={() => setModalContent(<OrderTracker status={order.status} />)}
//                                     disabled={isCancelled} // Disable button if order is cancelled
//                                     className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${
//                                         isCancelled
//                                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // Disabled style
//                                         : 'bg-blue-500 text-white hover:bg-blue-600' // Active style
//                                     }`}
//                                 >
//                                     Track Order
//                                 </button>
//                                 {/* User Cancel Button */}
//                                 <button
//                                     onClick={() => handleUserCancel(order._id)}
//                                     disabled={!canCancel} // Disable based on status
//                                     className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${
//                                         canCancel
//                                         ? 'bg-red-500 text-white hover:bg-red-600'
//                                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                     }`}
//                                 >
//                                     Cancel Order
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })
//           )}

//           {/* Empty State */}
//           {!loading && !error && orders.length === 0 && (
//             <div className="text-center py-16">
//                 <h2 className="text-2xl font-semibold text-gray-700">No Orders Yet</h2>
//                 <p className="text-gray-500 mt-2">You haven't placed any orders with us.</p>
//                 <Link to="/collection" className="mt-6 inline-block bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300"> Start Shopping </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Orders;

import React, { useState, useEffect, useContext } from 'react';
import { FaBoxOpen } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import OrderTracker from '../components/OrderTracker';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { IoArrowBack } from 'react-icons/io5';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading true
  const [error, setError] = useState(null);
  const { token } = useContext(CartContext); // Get token from context

  // Fetch user's orders function
  const fetchUserOrders = async () => {
    // console.log("Orders Page (User): useEffect triggered. Token:", token ? "Present" : "Missing");
    if (!token) {
      setError("Not logged in. Cannot fetch orders.");
      setLoading(false);
      // console.log("Orders Page (User): No token, fetch aborted.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // console.log("Orders Page (User): Making API call to /api/order/userorders...");
      const response = await axios.get('http://localhost:4000/api/order/userorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log("Orders Page (User): API response received:", response.data);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError(`Failed to fetch orders: ${response.data.message}`);
        console.error("Orders Page (User): API reported failure:", response.data.message);
      }
    } catch (err) {
      setError(`Error fetching orders: ${err.response?.data?.message || err.message}`);
      console.error("Orders Page (User): Axios error during fetch:", err);
    } finally {
      setLoading(false);
      // console.log("Orders Page (User): fetchUserOrders finished.");
    }
  };

  // Fetch orders when the component mounts or token changes
  useEffect(() => {
    fetchUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Dependency: token

  // Handler for User Cancelling Order
  const handleUserCancel = async (orderId) => {
      // console.log(`Orders Page: Attempting user cancel for order ${orderId}`);
      if (!token) { alert("Authentication error."); return; }

      if (window.confirm("Are you sure you want to cancel this order?")) {
          try {
              const response = await axios.put(`http://localhost:4000/api/order/cancel/${orderId}`,
                 {},
                 { headers: { Authorization: `Bearer ${token}` } }
              );
              // console.log("Orders Page: Cancel response:", response.data);
              if (response.data.success) {
                  setOrders(prevOrders =>
                      prevOrders.map(order =>
                          order._id === orderId ? { ...order, status: "Cancelled" } : order
                      )
                  );
                  alert("Order cancelled successfully!");
              } else {
                  alert(`Error cancelling order: ${response.data.message}`);
              }
          } catch (err) {
              alert(`Error: ${err.response?.data?.message || err.message}`);
              console.error("Orders Page: Cancel order error:", err);
          }
      }
  };

  return (
    <>
      <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)}> {modalContent} </Modal>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link to="/collection" className="bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"> Go to Shopping </Link>
        </div>

        <div className="flex flex-col gap-6">
          {/* Loading State */}
          {loading && <p className="text-center py-10 text-gray-500 text-lg">Loading your orders...</p>}

          {/* Error State */}
          {error && <p className="text-center py-10 text-red-600 font-semibold text-lg">{error}</p>}

          {/* Content */}
          {!loading && !error && orders.length > 0 && (
            orders.map((order) => {
                // User can cancel if Processing or Payment Pending
                const canCancel = order.status === 'Processing' || order.status === 'Payment Pending';
                // Track button is disabled if Cancelled or Payment Failed
                const isCancelledOrFailed = order.status === "Cancelled" || order.status === "Payment Failed";
                return (
                    <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 border-b pb-2 text-sm">
                            <FaBoxOpen className="text-lg text-gray-600" />
                            <p className="font-semibold text-gray-800">ID: ...{order._id.slice(-6)}</p>
                            <p className="text-gray-500 ml-auto"> Date: {new Date(order.createdAt || order.date).toLocaleDateString()} </p>
                        </div>
                        {/* Items List */}
                        <div className="flex flex-col gap-2 mb-4">
                            {order.items.map((item, index) => (
                                <Link to={`/product/${item._id}`} key={item._id || index} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/48?text=Img'; }} />
                                    <p>{item.name} <span className="text-sm text-gray-500">x {item.quantity}</span></p>
                                </Link>
                            ))}
                        </div>
                        {/* Footer */}
                        <div className="border-t pt-3 flex flex-wrap gap-4 justify-between items-center">
                            <p className="font-semibold text-gray-800">Total: ₹{order.amount.toFixed(2)}</p>
                            <div className="flex items-center gap-4 flex-wrap"> {/* Buttons container */}
                                <p className="text-sm font-medium">Status:
                                    <span className={`font-semibold ${
                                        order.status === 'Delivered' ? 'text-green-600' :
                                        (order.status === 'Cancelled' || order.status === 'Payment Failed') ? 'text-red-600' :
                                        'text-orange-500' // Processing or Payment Pending
                                    }`}>
                                        {order.status}
                                    </span>
                                </p>
                                {/* Track Order Button */}
                                <button
                                    onClick={() => setModalContent(<OrderTracker status={order.status} />)}
                                    disabled={isCancelledOrFailed} // Disable if Cancelled or Payment Failed
                                    className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${
                                        isCancelledOrFailed
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // Disabled style
                                        : 'bg-blue-500 text-white hover:bg-blue-600' // Active style
                                    }`}
                                >
                                    Track Order
                                </button>
                                {/* User Cancel Button */}
                                <button
                                    onClick={() => handleUserCancel(order._id)}
                                    disabled={!canCancel} // Disable based on status
                                    className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${
                                        canCancel
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-700">No Orders Yet</h2>
                <p className="text-gray-500 mt-2">You haven't placed any orders with us.</p>
                <Link to="/collection" className="mt-6 inline-block bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300"> Start Shopping </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;

