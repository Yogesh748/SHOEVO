// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext';
// import { FaBoxOpen } from "react-icons/fa"; // Icon for orders
// import Modal from '../components/Modal'; // Assuming you have Modal for potential future use

// const AdminOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { token } = useContext(CartContext); // Get token for API calls

//     // Function to fetch all orders from the backend
//     const fetchAllOrders = async () => {
//         if (!token) {
//             setError("Admin token not found. Please log in.");
//             setLoading(false);
//             return;
//         }
//         setLoading(true);
//         setError(null);
//         try {
//             // Call the backend endpoint to list all orders
//             const response = await axios.get('http://localhost:4000/api/order/list', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             if (response.data.success) {
//                 setOrders(response.data.data);
//             } else {
//                 setError(`Failed to fetch orders: ${response.data.message}`);
//             }
//         } catch (err) {
//             // Handle specific errors like 403 Forbidden if middleware fails
//             if (err.response?.status === 403) {
//                  setError("Access Denied: Admin privileges required.");
//             } else {
//                 setError(`Error fetching orders: ${err.response?.data?.message || err.message}`);
//             }
//             console.error("Fetch all orders error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch orders when the component mounts or token changes
//     useEffect(() => {
//         fetchAllOrders();
//     }, [token]);

//     // Function to handle status updates
//     const handleStatusChange = async (orderId, newStatus) => {
//          if (!token) {
//              alert("Authentication error.");
//              return;
//          }
//          try {
//             // Call the backend endpoint to update the status
//             const response = await axios.put('http://localhost:4000/api/order/status',
//              { orderId, status: newStatus }, // Send orderId and new status in body
//              { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (response.data.success) {
//                 // Update the status locally for immediate feedback
//                 setOrders(prevOrders =>
//                   prevOrders.map(order =>
//                     order._id === orderId ? { ...order, status: newStatus } : order
//                   )
//                 );
//                 // alert("Order status updated successfully!"); // Optional success message
//             } else {
//                 alert(`Error updating status: ${response.data.message}`);
//             }
//          } catch (err) {
//              alert(`Error updating status: ${err.response?.data?.message || err.message}`);
//              console.error("Update status error:", err);
//          }
//     };


//     return (
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Use container for better centering */}
//             <h1 className="text-3xl font-bold mb-8">Manage All Orders</h1>

//             {loading && <p className="text-center py-10 text-gray-500">Loading orders...</p>}
//             {error && <p className="text-center py-10 text-red-600 font-semibold">{error}</p>}

//             {!loading && !error && (
//                 <div className="flex flex-col gap-6">
//                     {orders.length > 0 ? (
//                         orders.map((order) => (
//                             <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
//                                 {/* Order Header */}
//                                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 border-b pb-2 text-sm">
//                                     <FaBoxOpen className="text-lg text-gray-600" />
//                                     <p className="font-semibold text-gray-800">ID: ...{order._id.slice(-6)}</p>
//                                     <p className="text-gray-500">
//                                         {/* Safely access populated user data */}
//                                         User: {order.userId?.name || 'N/A'} ({order.userId?.email || 'N/A'})
//                                     </p>
//                                     <p className="text-gray-500 ml-auto">
//                                         {/* Use createdAt timestamp for more accurate order time */}
//                                         Date: {new Date(order.createdAt || order.date).toLocaleDateString()}
//                                     </p>
//                                 </div>

//                                 {/* Items List */}
//                                 <div className="mb-4 pl-4 border-l-2 border-gray-100">
//                                     <h4 className="font-medium mb-2 text-sm text-gray-500">Items ({order.items.length}):</h4>
//                                     {order.items.map((item, index) => (
//                                         <p key={item._id || index} className="text-sm text-gray-700">
//                                             {item.name} x {item.quantity} (@ ${item.price?.toFixed(2)})
//                                         </p>
//                                     ))}
//                                 </div>

//                                 {/* Shipping Address */}
//                                 <div className="mb-4 pl-4 border-l-2 border-gray-100">
//                                      <h4 className="font-medium mb-1 text-sm text-gray-500">Shipping Address:</h4>
//                                      <p className="text-sm text-gray-700">
//                                          {order.address.firstName} {order.address.lastName}, {order.address.street}, {order.address.building || ''}, {order.address.city}, {order.address.state} - {order.address.zipcode}, Ph: {order.address.phone}
//                                      </p>
//                                 </div>

//                                 {/* Footer with Total and Status Update */}
//                                 <div className="border-t pt-3 flex flex-wrap gap-4 justify-between items-center">
//                                     <p className="font-semibold text-gray-800">Total: ${order.amount.toFixed(2)}</p>
//                                     <div className="flex items-center gap-3">
//                                         <label htmlFor={`status-${order._id}`} className="text-sm font-medium text-gray-700">Status:</label>
//                                         <select
//                                             id={`status-${order._id}`}
//                                             value={order.status} // Controlled component
//                                             onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                                             className="p-1 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
//                                             // Dynamic styling based on status
//                                             style={{
//                                                color: order.status === 'Delivered' ? '#16a34a' : // green-600
//                                                       order.status === 'Cancelled' ? '#dc2626' : // red-600
//                                                       order.status === 'Shipped' ? '#2563eb' : // blue-600
//                                                       '#f97316', // orange-500 (Processing)
//                                                fontWeight: 600,
//                                                borderColor: '#d1d5db' // gray-300 border
//                                             }}
//                                         >
//                                             <option value="Processing">Processing</option>
//                                             <option value="Shipped">Shipped</option>
//                                             <option value="Delivered">Delivered</option>
//                                             <option value="Cancelled">Cancelled</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                          <p className="text-center py-10 text-gray-500">No orders found.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminOrders;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { FaBoxOpen } from "react-icons/fa"; // Icon for orders
import Modal from '../components/Modal'; // Assuming you have Modal for potential future use
import OrderTracker from '../components/OrderTracker'; // Import OrderTracker


const API_BASE_URL = "https://shoevo-backend.onrender.com";
const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalContent, setModalContent] = useState(null); // State for modal content
    const { token } = useContext(CartContext); // Get token for API calls

    // Function to fetch all orders from the backend
    const fetchAllOrders = async () => {
        if (!token) {
            setError("Admin token not found. Please log in.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/order/list`, { // Use live URL
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                setError(`Failed to fetch orders: ${response.data.message}`);
            }
        } catch (err) {
            // Handle specific errors like 403 Forbidden if middleware fails
            if (err.response?.status === 403) {
                 setError("Access Denied: Admin privileges required.");
            } else {
                setError(`Error fetching orders: ${err.response?.data?.message || err.message}`);
            }
            console.error("Fetch all orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders when the component mounts or token changes
    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    // Function to handle status updates
    const handleStatusChange = async (orderId, newStatus) => {
         if (!token) {
             alert("Authentication error.");
             return;
         }
         try {
            const response = await axios.put(`${API_BASE_URL}/api/order/status`, // Use live URL
             { orderId, status: newStatus },
             { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Update the status locally for immediate feedback
                setOrders(prevOrders =>
                  prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                  )
                );
                // alert("Order status updated successfully!"); // Optional success message
            } else {
                alert(`Error updating status: ${response.data.message}`);
                // Optionally re-fetch if update fails to ensure consistency
                fetchAllOrders();
            }
         } catch (err) {
             alert(`Error updating status: ${err.response?.data?.message || err.message}`);
             console.error("Update status error:", err);
             // Optionally re-fetch on error
             fetchAllOrders();
         }
    };

    // Confirmation handler specifically for cancellation
    const handleCancelOrderClick = (orderId, currentStatus) => {
        // Prevent cancelling already delivered or cancelled orders
        if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') {
            alert(`Order is already ${currentStatus} and cannot be cancelled.`);
            return;
        }
        if (window.confirm("Are you sure you want to cancel this order? This will set the status to 'Cancelled'.")) {
            handleStatusChange(orderId, "Cancelled"); // Call the existing status update function
        }
    };

    // --- JSX Rendering ---
    return (
        <>
            {/* Modal for Order Tracker */}
            <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
                {modalContent}
            </Modal>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Manage All Orders</h1>

                {/* Loading State */}
                {loading && <p className="text-center py-10 text-gray-500 text-lg">Loading orders...</p>}

                {/* Error State */}
                {error && <p className="text-center py-10 text-red-600 font-semibold text-lg">{error}</p>}

                {/* Content */}
                {!loading && !error && (
                    <div className="flex flex-col gap-6">
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                // Determine if status is final (dropdown/cancel disabled)
                                const isStatusFinal = order.status === "Delivered" || order.status === "Cancelled";
                                // Determine specifically if cancelled (track button disabled)
                                const isCancelled = order.status === "Cancelled" || order.status === "Payment Failed";
                                return (
                                    <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
                                        {/* Order Header */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 border-b pb-2 text-sm">
                                            <FaBoxOpen className="text-lg text-gray-600" />
                                            <p className="font-semibold text-gray-800">ID: ...{order._id.slice(-6)}</p>
                                            <p className="text-gray-500">
                                                User: {order.userId?.name || 'N/A'} ({order.userId?.email || 'N/A'})
                                            </p>
                                            <p className="text-gray-500 ml-auto">
                                                Date: {new Date(order.createdAt || order.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {/* Items List */}
                                        <div className="mb-4 pl-4 border-l-2 border-gray-100">
                                            <h4 className="font-medium mb-2 text-sm text-gray-500">Items ({order.items.length}):</h4>
                                            {order.items.map((item, index) => (
                                                <p key={item._id || index} className="text-sm text-gray-700">
                                                    {item.name} x {item.quantity} (@ ₹{item.price?.toFixed(2)})
                                                </p>
                                            ))}
                                        </div>
                                        {/* Shipping Address */}
                                        <div className="mb-4 pl-4 border-l-2 border-gray-100">
                                             <h4 className="font-medium mb-1 text-sm text-gray-500">Shipping Address:</h4>
                                             <p className="text-sm text-gray-700">
                                                 {order.address.firstName} {order.address.lastName}, {order.address.street}, {order.address.building || ''}, {order.address.city}, {order.address.state} - {order.address.zipcode}, Ph: {order.address.phone}
                                             </p>
                                        </div>
                                        {/* Footer */}
                                        <div className="border-t pt-3 flex flex-wrap gap-4 justify-between items-center">
                                            <p className="font-semibold text-gray-800">Total: ₹{order.amount.toFixed(2)}</p>
                                            <div className="flex items-center gap-3"> {/* Status Dropdown Container */}
                                                <label htmlFor={`status-${order._id}`} className="text-sm font-medium text-gray-700">Status:</label>
                                                <select
                                                    id={`status-${order._id}`}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    disabled={isStatusFinal} // Disable dropdown if status is final
                                                    className={`p-1 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isStatusFinal ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'cursor-pointer'}`}
                                                    style={{ // Dynamic text color based on status
                                                       color: order.status === 'Delivered' ? '#16a34a' : (order.status === 'Cancelled' || order.status === 'Payment Failed') ? '#dc2626' : order.status === 'Shipped' ? '#2563eb' : '#f97316',
                                                       fontWeight: 600,
                                                       borderColor: '#d1d5db' // gray-300 border
                                                    }}
                                                >
                                                    <option value="Payment Pending">Payment Pending</option>
                                                    <option value="Payment Failed">Payment Failed</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-4"> {/* Buttons Container */}
                                                {/* Track Order Button - Disable if Cancelled */}
                                                <button
                                                    onClick={() => setModalContent(<OrderTracker status={order.status} />)}
                                                    disabled={isCancelled} // Disable button if order is cancelled
                                                    className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${
                                                        isCancelled
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // Disabled style
                                                        : 'bg-blue-500 text-white hover:bg-blue-600' // Active style
                                                    }`}
                                                >
                                                    Track Order
                                                </button>
                                                {/* Cancel Button */}
                                                <button
                                                    onClick={() => handleCancelOrderClick(order._id, order.status)}
                                                    disabled={isStatusFinal} // Disable if status is final
                                                    className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${ isStatusFinal ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600' }`}
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                             <p className="text-center py-10 text-gray-500">No orders found.</p>
                        )}
                    </div>
                )}
            </div>
         </>
    );
};

export default AdminOrders;

