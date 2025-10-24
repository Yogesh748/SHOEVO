// import {React, useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext';
// import { IoTrashOutline } from "react-icons/io5"; // Icon for remove button
// import { Link } from 'react-router-dom'; // Import Link for Edit button later

// const ListProducts = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { token } = useContext(CartContext); // Get token for API calls

//     // Function to fetch products from the backend
//     const fetchProducts = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.get('http://localhost:4000/api/product');
//             if (response.data.success) {
//                 setProducts(response.data.data);
//             } else {
//                 setError("Failed to fetch products.");
//             }
//         } catch (err) {
//             setError("Error connecting to the server.");
//             console.error("Fetch products error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch products when the component mounts
//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     // Function to handle product removal
//     const handleRemove = async (productId, productName) => { // Added productName for confirmation
//         if (!token) {
//             alert("Authentication error. Please log in again.");
//             return;
//         }
//         // Use productName in the confirmation message
//         if (window.confirm(`Are you sure you want to remove "${productName}"? This action cannot be undone.`)) {
//             try {
//                 // Call the backend DELETE endpoint with the product's _id
//                 const response = await axios.delete(`http://localhost:4000/api/product/remove/${productId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}` // Send auth token
//                     }
//                 });

//                 if (response.data.success) {
//                     alert("Product removed successfully!");
//                     // Refresh the product list after successful deletion
//                     fetchProducts();
//                 } else {
//                     alert(`Error removing product: ${response.data.message}`);
//                 }
//             } catch (err) {
//                 alert(`Error removing product: ${err.response?.data?.message || err.message}`);
//                 console.error("Remove product error:", err);
//             }
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <h1 className="text-3xl font-bold mb-8">All Products</h1>

//             {loading && <p className="text-center py-10">Loading products...</p>}
//             {error && <p className="text-center py-10 text-red-600">{error}</p>}

//             {!loading && !error && (
//                 <div className="overflow-x-auto bg-white rounded-lg shadow">
//                     <table className="min-w-full border-collapse">
//                         <thead className="bg-gray-50 border-b">
//                             <tr>
//                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
//                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
//                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
//                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
//                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {products.length > 0 ? (
//                                 products.map((product) => (
//                                     <tr key={product._id} className="hover:bg-gray-50">
//                                         <td className="py-3 px-4">
//                                             {/* Ensure image exists before rendering */}
//                                             <img
//                                                 src={product.images?.[0] || 'https://via.placeholder.com/48?text=No+Img'}
//                                                 alt={product.name}
//                                                 className="w-12 h-12 object-cover rounded"
//                                                 onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/48?text=Error'; }}
//                                             />
//                                         </td>
//                                         <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
//                                         <td className="py-3 px-4 text-sm text-gray-500">{product.category}</td>
//                                         <td className="py-3 px-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
//                                         <td className="py-3 px-4 text-sm">
//                                             <button
//                                                 onClick={() => handleRemove(product._id, product.name)} // Pass name for confirmation
//                                                 className="text-red-600 hover:text-red-800 p-1"
//                                                 title="Remove Product"
//                                             >
//                                                 <IoTrashOutline size={18} />
//                                             </button>
//                                             {/* We will add an Edit button/link here later */}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                <tr>
//                                    <td colSpan="5" className="text-center py-10 text-gray-500">No products found. Add products using the 'Add Product' page.</td>
//                                </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ListProducts;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { IoTrashOutline, IoPencilOutline } from "react-icons/io5"; // Import Edit icon
import { Link } from 'react-router-dom'; // Import Link

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(CartContext); // Get token for API calls

    // Function to fetch products from the backend
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:4000/api/product');
            if (response.data.success) {
                setProducts(response.data.data);
            } else {
                setError("Failed to fetch products.");
            }
        } catch (err) {
            setError(`Error connecting to the server: ${err.message}`);
            console.error("Fetch products error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    // Function to handle product removal
    const handleRemove = async (productId, productName) => {
        if (!token) {
            alert("Authentication error. Please log in again.");
            return;
        }
        if (window.confirm(`Are you sure you want to remove "${productName}"? This action cannot be undone.`)) {
            try {
                // Call the backend DELETE endpoint with the product's _id
                const response = await axios.delete(`http://localhost:4000/api/product/remove/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Send auth token
                    }
                });

                if (response.data.success) {
                    alert("Product removed successfully!");
                    // Refresh the product list after successful deletion
                    fetchProducts();
                } else {
                    alert(`Error removing product: ${response.data.message}`);
                }
            } catch (err) {
                alert(`Error removing product: ${err.response?.data?.message || err.message}`);
                console.error("Remove product error:", err);
            }
        }
    };

    // --- Render Logic ---
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">All Products</h1>

            {loading && <p className="text-center py-10 text-gray-500">Loading products...</p>}
            {error && <p className="text-center py-10 text-red-600 font-semibold">{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <img
                                                src={product.images?.[0] || 'https://via.placeholder.com/48?text=No+Img'}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                                onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/48?text=Error'; }}
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{product.category}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                                            {/* Edit Link */}
                                            <Link
                                                to={`/admin/edit/${product._id}`}
                                                className="text-blue-600 hover:text-blue-800 p-1 mr-2 inline-block" // Ensure it's inline
                                                title="Edit Product"
                                            >
                                                <IoPencilOutline size={18} />
                                            </Link>
                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemove(product._id, product.name)}
                                                className="text-red-600 hover:text-red-800 p-1 inline-block" // Ensure it's inline
                                                title="Remove Product"
                                            >
                                                <IoTrashOutline size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                               <tr>
                                   <td colSpan="5" className="text-center py-10 text-gray-500">No products found. Add products using the 'Add Product' page.</td>
                               </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ListProducts;