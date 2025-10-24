// import React, { useContext, useState, useEffect } from 'react';
// import { CartContext } from '../context/CartContext';
// import { useNavigate } from 'react-router-dom';
// import Modal from '../components/Modal';
// import { FaCheckCircle } from "react-icons/fa";
// import { IoArrowBack } from 'react-icons/io5';

// const PlaceOrder = () => {
//   const { getCartTotalAmount, all_products, cartItems, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     building: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     phone: ""
//   });
  
//   const [errors, setErrors] = useState({});
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   const onChangeHandler = (event) => {
//     const { name, value } = event.target;
//     setData(prevData => ({ ...prevData, [name]: value }));
//   };
  
//   const handlePlaceOrder = async (event) => {
//     event.preventDefault(); 
    
//     const newErrors = {};
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//       newErrors.email = "Please enter a valid email address.";
//     }
//     if (!/^\d{10}$/.test(data.phone)) {
//       newErrors.phone = "Phone number must be exactly 10 digits.";
//     }
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return; 
//     }
//     setErrors({});
    
//     let orderItems = [];
//     all_products.forEach((item) => {
//       if (cartItems[item.id] > 0) {
//         orderItems.push({...item, quantity: cartItems[item.id]});
//       }
//     });

//     const orderData = {
//       items: orderItems,
//       address: data,
//       amount: getCartTotalAmount() + 5,
//       date: new Date(),
//       status: "Processing"
//     };

//     const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
//     localStorage.setItem("orders", JSON.stringify([...existingOrders, orderData]));
    
//     localStorage.setItem("deliveryDetails", JSON.stringify(data));
    
//     setOrderSuccess(true);
//     clearCart();
//   };

//   useEffect(() => {
//     const savedDetails = JSON.parse(localStorage.getItem("deliveryDetails"));
//     if (savedDetails) {
//       setData(savedDetails);
//     }
//   }, []);

//   useEffect(() => {
//     if (orderSuccess) {
//       const timer = setTimeout(() => {
//         navigate('/orders');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [orderSuccess, navigate]);

//   useEffect(() => {
//     if (getCartTotalAmount() === 0 && !orderSuccess) {
//       navigate('/cart');
//     }
//   }, [getCartTotalAmount, navigate, orderSuccess]);

//   return (
//     <>
//       <Modal isOpen={orderSuccess} onClose={() => setOrderSuccess(false)}>
//         <div className="text-center flex flex-col items-center gap-4">
//           <FaCheckCircle className="text-green-500 text-6xl" />
//           <h2 className="text-2xl font-bold">Order Placed!</h2>
//           <p className="text-gray-700">Thank you for your purchase.</p>
//           <p className="text-sm text-gray-500">Redirecting to My Orders...</p>
//         </div>
//       </Modal>
      
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <form onSubmit={handlePlaceOrder}>
//           <div className="flex flex-col lg:flex-row gap-12">
//             <div className="flex-1">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold">Delivery Information</h2>
//                 <button
//                   type="button"
//                   onClick={() => navigate(-1)}
//                   className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
//                 >
//                   <IoArrowBack />
//                   <span>Back to Cart</span>
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <input name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" className="p-2 border rounded-md" required />
//                 <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" className="p-2 border rounded-md" required />
//               </div>
//               <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" className={`w-full p-2 border rounded-md mt-4 ${errors.email ? 'border-red-500' : ''}`} required />
//               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//               <input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street Address" className="w-full p-2 border rounded-md mt-4" required />
//               <input name="building" onChange={onChangeHandler} value={data.building} type="text" placeholder="Building, Apartment, Hostel, etc." className="w-full p-2 border rounded-md mt-4" />
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                 <input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" className="p-2 border rounded-md" required />
//                 <input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" className="p-2 border rounded-md" required />
//               </div>
//               <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" className="w-full p-2 border rounded-md mt-4" required />
//               <input name="phone" onChange={onChangeHandler} value={data.phone} type="tel" placeholder="Phone" className={`w-full p-2 border rounded-md mt-4 ${errors.phone ? 'border-red-500' : ''}`} required />
//               {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//             </div>
            
//             <div className="w-full lg:w-2/5">
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-2xl font-bold mb-4">Your Items</h2>
//                 <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
//                   {all_products.map((item) => {
//                     if (cartItems[item.id] > 0) {
//                       return (
//                         <div key={item.id} className="flex justify-between items-center text-gray-700">
//                           <div className="flex items-center gap-3">
//                             <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded" />
//                             <p>{item.name} <span className="text-sm">x{cartItems[item.id]}</span></p>
//                           </div>
//                           <p>${(item.price * cartItems[item.id]).toFixed(2)}</p>
//                         </div>
//                       )
//                     }
//                     return null;
//                   })}
//                 </div>
//                 <h2 className="text-2xl font-bold mb-4 mt-6">Cart Totals</h2>
//                 <div className="space-y-3 border-t pt-4">
//                   <div className="flex justify-between text-gray-700"><p>Subtotal</p><p>${getCartTotalAmount().toFixed(2)}</p></div>
//                   <div className="flex justify-between text-gray-700"><p>Delivery Fee</p><p>${getCartTotalAmount() > 0 ? (5.00).toFixed(2) : '0.00'}</p></div>
//                 </div>
//                 <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
//                   <p>Total</p><p>${getCartTotalAmount() > 0 ? (getCartTotalAmount() + 5).toFixed(2) : '0.00'}</p>
//                 </div>
//                 <button type="submit" className="w-full mt-6 bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">
//                   PROCEED TO PAYMENT
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default PlaceOrder;

// import React, { useContext, useState, useEffect } from 'react';
// import { CartContext } from '../context/CartContext';
// import { useNavigate, Link } from 'react-router-dom';
// import Modal from '../components/Modal';
// import { FaCheckCircle } from "react-icons/fa";
// import axios from 'axios';
// import { IoArrowBack } from 'react-icons/io5';

// const PlaceOrder = () => {
//   // Get appliedDiscount (object)
//   const {
//     getCartTotalAmount, all_products, cartItems, clearCart, token, loadingProducts,
//     appliedDiscount // Get discount object from context
//   } = useContext(CartContext);
//   const navigate = useNavigate();

//   // State (unchanged)
//   const [data, setData] = useState({ firstName: "", lastName: "", email: "", street: "", building: "", city: "", state: "", zipcode: "", phone: "" });
//   const [errors, setErrors] = useState({});
//   const [orderSuccess, setOrderSuccess] = useState(false);
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   // Form input handler (unchanged)
//   const onChangeHandler = (event) => {
//     const { name, value } = event.target;
//     setData(prevData => ({ ...prevData, [name]: value }));
//   };

//   // --- Calculate Final Total Amount ---
//   const subtotal = getCartTotalAmount();
//   const deliveryFee = subtotal > 0 ? 5.00 : 0.00;
//   let discountAmount = 0;
//   if (appliedDiscount) {
//       if (appliedDiscount.type === 'percent') discountAmount = (subtotal * appliedDiscount.value) / 100;
//       else if (appliedDiscount.type === 'fixed') discountAmount = Math.min(appliedDiscount.value, subtotal + deliveryFee);
//       else if (appliedDiscount.type === 'shipping') discountAmount = deliveryFee;
//   }
//   discountAmount = Math.max(0, discountAmount);
//   const finalOrderAmount = Math.max(0, (subtotal + deliveryFee - discountAmount));
//   // --- End Calculation ---


//   // Handle form submission
//   const handlePlaceOrder = async (event) => {
//     event.preventDefault();
//     setIsPlacingOrder(true); setSubmitError("");

//     // --- Validation (unchanged) ---
//     if (!token) { setSubmitError("Log in required."); setIsPlacingOrder(false); return; }
//     const newErrors = {};
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Invalid email.";
//     if (!/^\d{10}$/.test(data.phone)) newErrors.phone = "10 digits required.";
//     for (const key in data) { if (key !== 'building' && !data[key]) newErrors[key] = `Required.`; }
//     if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setIsPlacingOrder(false); return; }
//     setErrors({});
//     // --- End Validation ---

//     // --- Prepare Order Items (unchanged) ---
//     let orderItems = [];
//     if (loadingProducts || !all_products || all_products.length === 0) { setSubmitError("Products not loaded."); setIsPlacingOrder(false); return; }
//     all_products.forEach((item) => {
//       if (cartItems[item._id] > 0) {
//         orderItems.push({ _id: item._id, name: item.name, price: item.price, quantity: cartItems[item._id], image: item.images[0] });
//       }
//     });
//     if (orderItems.length === 0) { setSubmitError("Cart is empty."); setIsPlacingOrder(false); return; }
//     // --- End Prepare Items ---

//     // --- Prepare Payload (Send the final calculated amount) ---
//     const orderDataPayload = {
//       items: orderItems,
//       amount: finalOrderAmount, // Send the final, discounted total
//       address: data,
//       // promoCodeApplied: REMOVED
//     };

//     // --- Send Order to Backend ---
//     try {
//       const response = await axios.post('http://localhost:4000/api/order/place', orderDataPayload, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setOrderSuccess(true);
//         clearCart(); // Clears cart AND applied promo
//         localStorage.setItem("deliveryDetails", JSON.stringify(data));
//       } else { setSubmitError(`Failed: ${response.data.message}`); }
//     } catch (error) {
//        console.error("Place order error:", error.response || error);
//        setSubmitError(`Error: ${error.response?.data?.message || 'Server error.'}`);
//     } finally { setIsPlacingOrder(false); }
//   };

//   // --- useEffect Hooks (unchanged) ---
//   useEffect(() => { // Load saved details
//     const savedDetails = JSON.parse(localStorage.getItem("deliveryDetails"));
//     if (savedDetails) { setData(prev => ({ ...prev, ...savedDetails })); }
//   }, []);
//   useEffect(() => { // Navigate after success
//     if (orderSuccess) {
//       const timer = setTimeout(() => navigate('/orders'), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [orderSuccess, navigate]);
//   useEffect(() => { // Redirect if cart empty
//     if (!loadingProducts && getCartTotalAmount() === 0 && !orderSuccess) {
//       navigate('/cart');
//     }
//   }, [loadingProducts, getCartTotalAmount, navigate, orderSuccess]);

//   // --- JSX ---
//   return (
//     <>
//       <Modal isOpen={orderSuccess} onClose={() => navigate('/orders')}>
//         <div className="text-center flex flex-col items-center gap-4">
//           <FaCheckCircle className="text-green-500 text-6xl" />
//           <h2 className="text-2xl font-bold">Order Placed!</h2>
//           <p className="text-gray-700">Thank you for your purchase.</p>
//           <p className="text-sm text-gray-500">Redirecting to My Orders...</p>
//         </div>
//       </Modal>

//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <form onSubmit={handlePlaceOrder}>
//           <div className="flex flex-col lg:flex-row gap-12">
//             {/* Delivery Info Section */}
//             <div className="flex-1">
//                <div className="flex justify-between items-center mb-6">
//                    <h2 className="text-2xl font-bold">Delivery Information</h2>
//                    <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"> <IoArrowBack /> <span>Back to Cart</span> </button>
//                </div>
//                {/* Form Fields */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                    <div><input name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First Name" className={`p-2 border rounded-md w-full ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />{errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}</div>
//                    <div><input name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder="Last Name" className={`p-2 border rounded-md w-full ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />{errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}</div>
//                 </div>
//                 <div><input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" className={`w-full p-2 border rounded-md mt-4 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
//                 <div><input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street Address" className={`w-full p-2 border rounded-md mt-4 ${errors.street ? 'border-red-500' : 'border-gray-300'}`} />{errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}</div>
//                 <div><input name="building" onChange={onChangeHandler} value={data.building} type="text" placeholder="Apt, Building, etc. (Optional)" className="w-full p-2 border rounded-md mt-4 border-gray-300" /></div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                    <div><input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" className={`p-2 border rounded-md w-full ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />{errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}</div>
//                    <div><input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" className={`p-2 border rounded-md w-full ${errors.state ? 'border-red-500' : 'border-gray-300'}`} />{errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}</div>
//                 </div>
//                 <div><input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" className={`w-full p-2 border rounded-md mt-4 ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`} />{errors.zipcode && <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>}</div>
//                 <div><input name="phone" onChange={onChangeHandler} value={data.phone} type="tel" placeholder="Phone (10 digits)" className={`w-full p-2 border rounded-md mt-4 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}</div>
//             </div>
//             {/* Order Summary Section */}
//             <div className="w-full lg:w-2/5">
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-2xl font-bold mb-4">Your Items</h2>
//                 {/* Item List */}
//                 <div className="space-y-3 mb-4 max-h-48 overflow-y-auto border-b pb-4">
//                   {loadingProducts ? <p>Loading items...</p> : all_products.map((item) => {
//                     if (cartItems[item._id] > 0) {
//                       return (
//                         <div key={item._id} className="flex justify-between items-center text-gray-700">
//                           <div className="flex items-center gap-3">
//                             <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded" onError={(e)=>{e.target.src='https://via.placeholder.com/48?text=Err'}}/>
//                             <p className="text-sm">{item.name} <span className="text-xs">x{cartItems[item._id]}</span></p>
//                           </div>
//                           <p className="text-sm">${(item.price * cartItems[item._id]).toFixed(2)}</p>
//                         </div>
//                       )
//                     }
//                     return null;
//                   })}
//                   {(!loadingProducts && getCartTotalAmount() === 0) && <p className="text-sm text-gray-500">No items in cart.</p>}
//                 </div>
//                 {/* Cart Totals */}
//                 <h2 className="text-2xl font-bold mb-4 mt-6">Cart Totals</h2>
//                 <div className="space-y-3 border-t pt-4">
//                   <div className="flex justify-between text-gray-700"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
//                   {/* Show discount row if applied */}
//                   {appliedDiscount && (
//                        <div className="flex justify-between text-green-600 font-medium">
//                            <p>Discount</p>
//                            <p>- ${discountAmount.toFixed(2)}</p>
//                        </div>
//                   )}
//                   <div className="flex justify-between text-gray-700"><p>Delivery Fee</p><p>${deliveryFee.toFixed(2)}</p></div>
//                 </div>
//                 <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
//                   <p>Total</p><p>${finalOrderAmount.toFixed(2)}</p> {/* Use final calculated amount */}
//                 </div>
//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isPlacingOrder || loadingProducts || getCartTotalAmount() === 0}
//                   className={`w-full mt-6 text-white py-3 rounded-md font-semibold transition-colors ${isPlacingOrder || loadingProducts || getCartTotalAmount() === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
//                 >
//                   {isPlacingOrder ? 'Placing Order...' : 'PROCEED TO PAYMENT'}
//                 </button>
//                 {submitError && <p className="text-red-600 text-sm mt-2 text-center">{submitError}</p>}
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };
// export default PlaceOrder;

import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { FaCheckCircle } from "react-icons/fa";
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5';
import { assets } from '../assets/assets'; // Import assets for logo


const API_BASE_URL = "https://shoevo-backend.onrender.com";
// Function to dynamically load the Razorpay script
const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            resolve(true); // Already loaded
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log("Razorpay SDK loaded successfully.");
            resolve(true);
        };
        script.onerror = () => {
            console.error("Razorpay SDK failed to load.");
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

const PlaceOrder = () => {
  // Get required data from context
  const {
      getCartTotalAmount, all_products, cartItems, clearCart, token, loadingProducts,
      appliedDiscount
  } = useContext(CartContext);
  const navigate = useNavigate();

  // State variables
  const [data, setData] = useState({
      firstName: "", lastName: "", email: "", street: "",
      building: "", city: "", state: "", zipcode: "", phone: ""
  });
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Loading state
  const [submitError, setSubmitError] = useState("");

  // Form input handler
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  // --- Calculate Final Total Amount ---
  const subtotal = getCartTotalAmount();
  const deliveryFee = subtotal > 0 ? 5.00 : 0.00;
  let discountAmount = 0;
  if (appliedDiscount) {
      if (appliedDiscount.type === 'percent') discountAmount = (subtotal * appliedDiscount.value) / 100;
      else if (appliedDiscount.type === 'fixed') discountAmount = Math.min(appliedDiscount.value, subtotal + deliveryFee);
      else if (appliedDiscount.type === 'shipping') discountAmount = deliveryFee;
  }
  discountAmount = Math.max(0, discountAmount);
  const finalOrderAmount = Math.max(0, (subtotal + deliveryFee - discountAmount));
  // --- End Calculation ---


  // --- Main Payment Initiation Function ---
  const proceedToPayment = async (event) => {
    event.preventDefault();
    console.log("Frontend: 1. Proceed to payment clicked.");
    setIsPlacingOrder(true);
    setSubmitError("");

    // --- Form validation ---
    if (!token) { setSubmitError("Log in required."); setIsPlacingOrder(false); return; }
    const newErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Invalid email.";
    if (!/^\d{10}$/.test(data.phone)) newErrors.phone = "10 digits required.";
    for (const key in data) { if (key !== 'building' && !data[key]) newErrors[key] = `Required.`; }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setIsPlacingOrder(false); return; }
    setErrors({});

    // --- 1. Prepare Order Items ---
    let orderItems = [];
    if (loadingProducts || !all_products || all_products.length === 0) { setSubmitError("Products not loaded."); setIsPlacingOrder(false); return; }
    all_products.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ _id: item._id, name: item.name, price: item.price, quantity: cartItems[item._id], image: item.images[0] });
      }
    });
    if (orderItems.length === 0) { setSubmitError("Cart is empty."); setIsPlacingOrder(false); return; }

    // --- Prepare Full Order Payload ---
    const orderDataPayload = {
      items: orderItems,
      amount: finalOrderAmount, // Send the final, discounted total
      address: data,
    };

    try {
        // --- 2. Save Order (Pending Payment) to DB ---
        const placeOrderResponse = await axios.post(`${API_BASE_URL}/api/order/place`, orderDataPayload, { // Use live URL
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!placeOrderResponse.data.success) throw new Error(placeOrderResponse.data.message || "Failed to save order");
        const orderIdMongoDB = placeOrderResponse.data.orderIdMongoDB;
        console.log("Frontend: 3. Order saved to DB. MongoDB ID:", orderIdMongoDB);

        console.log("Frontend: 4. Creating Razorpay order...");
        // --- 3. Create Razorpay Order via Backend ---
        const razorpayOrderResponse = await axios.post(`${API_BASE_URL}/api/order/create-razorpay-order`,
            { amount: finalOrderAmount }, // Send amount in base currency (e.g., INR)
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!razorpayOrderResponse.data.success) throw new Error(razorpayOrderResponse.data.message || "Failed to create Razorpay order");
        const { orderId: razorpayOrderId, amount: razorpayAmount, currency, key: razorpayKeyId } = razorpayOrderResponse.data;
        console.log("Frontend: 5. Razorpay order created. Razorpay ID:", razorpayOrderId);

        console.log("Frontend: 6. Loading Razorpay script...");
        // --- 4. Load Razorpay Script ---
        const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) throw new Error("Razorpay SDK failed to load. Are you online?");
        console.log("Frontend: 7. Razorpay script loaded.");

        // --- 5. Configure and Open Razorpay Checkout ---
        const options = {
            key: razorpayKeyId, // Your Key ID from backend
            amount: razorpayAmount, // Amount in paisa
            currency: currency,
            name: "Shoevo",
            description: "Shoe Purchase",
            image: assets.shoevo, // Your logo from assets
            order_id: razorpayOrderId, // Razorpay Order ID
            handler: async function (response) {
                // --- 6. Payment Success: Verify Payment Signature via Backend ---
                console.log("Frontend: 8. Razorpay payment successful. Verifying signature...", response);
                setIsPlacingOrder(true); // Show loading again
                setSubmitError("");
                try {
                   const verificationResponse = await axios.post(`${API_BASE_URL}/api/order/verify-payment`,
                        { ...response, orderIdMongoDB }, // Send razorpay details + your DB order ID
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (verificationResponse.data.success) {
                         console.log("Frontend: 9. Payment verified successfully.");
                         setOrderSuccess(true); // Show success modal
                         clearCart(); // Clear cart (and applied promo)
                         localStorage.setItem("deliveryDetails", JSON.stringify(data)); // Save details on success
                    } else {
                         console.error("Frontend: Payment verification failed:", verificationResponse.data.message);
                         setSubmitError("Payment verification failed. Please contact support.");
                    }
                } catch (verifyError) {
                     console.error("Frontend: Verification API call error:", verifyError);
                     setSubmitError("Error verifying payment. Please contact support.");
                } finally {
                    setIsPlacingOrder(false); // Stop loading
                }
            },
            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                contact: data.phone,
            },
            notes: {
                address: `${data.street}, ${data.city}`,
                order_db_id: orderIdMongoDB
            },
            theme: { color: "#000000" },
            modal: {
                ondismiss: function() {
                     console.log("Frontend: Razorpay checkout modal dismissed by user.");
                     setIsPlacingOrder(false); // Stop loading if user closes modal
                     // Order status remains "Payment Pending" in DB
                }
            }
        };

        console.log("Frontend: Opening Razorpay checkout...");
        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
            console.error("Frontend: Razorpay Payment Failed:", response.error);
            setSubmitError(`Payment Failed: ${response.error.description || response.error.reason || 'Unknown Error'}.`);
            setIsPlacingOrder(false); // Stop loading on failure
        });
        paymentObject.open(); // Open the Razorpay checkout modal
        event.preventDefault();
        setIsPlacingOrder(false); // Stop loading indicator after opening modal

    } catch (error) {
        console.error("Frontend: Error during checkout process:", error);
        setSubmitError(`Checkout Error: ${error.message || 'An unexpected error occurred.'}`);
        setIsPlacingOrder(false);
    }
  };

  // --- useEffect hooks ---
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem("deliveryDetails"));
    if (savedDetails) { setData(prev => ({ ...prev, ...savedDetails })); }
  }, []);
  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => navigate('/orders'), 3000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess, navigate]);
  useEffect(() => {
    if (!loadingProducts && getCartTotalAmount() === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [loadingProducts, getCartTotalAmount, navigate, orderSuccess]);

  // --- JSX Rendering ---
  return (
    <>
      <Modal isOpen={orderSuccess} onClose={() => navigate('/orders')}>
        <div className="text-center flex flex-col items-center gap-4">
          <FaCheckCircle className="text-green-500 text-6xl" />
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-gray-700">Your order has been placed.</p>
          <p className="text-sm text-gray-500">Redirecting to My Orders...</p>
        </div>
      </Modal>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <form onSubmit={proceedToPayment}>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Delivery Info Section */}
            <div className="flex-1">
               <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold">Delivery Information</h2>
                   <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"> <IoArrowBack /> <span>Back to Cart</span> </button>
               </div>
               {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div><input name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First Name" className={`p-2 border rounded-md w-full ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} required />{errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}</div>
                   <div><input name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder="Last Name" className={`p-2 border rounded-md w-full ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} required />{errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}</div>
                </div>
                <div><input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" className={`w-full p-2 border rounded-md mt-4 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} required />{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
                <div><input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street Address" className={`w-full p-2 border rounded-md mt-4 ${errors.street ? 'border-red-500' : 'border-gray-300'}`} required />{errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}</div>
                <div><input name="building" onChange={onChangeHandler} value={data.building} type="text" placeholder="Apt, Building, etc. (Optional)" className="w-full p-2 border rounded-md mt-4 border-gray-300" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                   <div><input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" className={`p-2 border rounded-md w-full ${errors.city ? 'border-red-500' : 'border-gray-300'}`} required />{errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}</div>
                   <div><input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" className={`p-2 border rounded-md w-full ${errors.state ? 'border-red-500' : 'border-gray-300'}`} required />{errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}</div>
                </div>
                <div><input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" className={`w-full p-2 border rounded-md mt-4 ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`} required />{errors.zipcode && <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>}</div>
                <div><input name="phone" onChange={onChangeHandler} value={data.phone} type="tel" placeholder="Phone (10 digits)" className={`w-full p-2 border rounded-md mt-4 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} required />{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}</div>
            </div>

            {/* Order Summary Section */}
            <div className="w-full lg:w-2/5">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Your Items</h2>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto border-b pb-4">
                  {loadingProducts ? <p>Loading items...</p> : all_products.map((item) => { if (cartItems[item._id] > 0) { return ( <div key={item._id} className="flex justify-between items-center text-gray-700"> <div className="flex items-center gap-3"> <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded" onError={(e)=>{e.target.src='https://via.placeholder.com/48?text=Err'}}/> <p className="text-sm">{item.name} <span className="text-xs">x{cartItems[item._id]}</span></p> </div> <p className="text-sm">₹{(item.price * cartItems[item._id]).toFixed(2)}</p> </div> ) } return null; })}
                  {(!loadingProducts && getCartTotalAmount() === 0) && <p className="text-sm text-gray-500">No items.</p>}
                </div>
                <h2 className="text-2xl font-bold mb-4 mt-6">Cart Totals</h2>
                <div className="space-y-3 border-t pt-4">
                   <div className="flex justify-between text-gray-700"><p>Subtotal</p><p>₹{subtotal.toFixed(2)}</p></div>
                   {appliedDiscount && ( <div className="flex justify-between text-green-600 font-medium"> <p>Discount</p> <p>- ₹{discountAmount.toFixed(2)}</p> </div> )}
                   <div className="flex justify-between text-gray-700"><p>Delivery Fee</p><p>${deliveryFee.toFixed(2)}</p></div>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
                  <p>Total</p><p>₹{finalOrderAmount.toFixed(2)}</p>
                </div>
                <button
                  type="submit"
                  disabled={isPlacingOrder || loadingProducts || getCartTotalAmount() === 0}
                  className={`w-full mt-6 text-white py-3 rounded-md font-semibold transition-colors ${isPlacingOrder || loadingProducts || getCartTotalAmount() === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
                >
                  {isPlacingOrder ? 'Processing Payment...' : 'PROCEED TO PAYMENT'}
                </button>
                {submitError && <p className="text-red-600 text-sm mt-2 text-center">{submitError}</p>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default PlaceOrder;