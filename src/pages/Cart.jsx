// import React, { useContext } from 'react';
// import { CartContext } from '../context/CartContext';
// import { useNavigate, Link } from 'react-router-dom';
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { IoArrowBack } from "react-icons/io5";

// const Cart = () => {
//   // Get all necessary data and functions, including loading states
//   const {
//     cartItems,
//     all_products,
//     deleteFromCart,
//     getCartTotalAmount,
//     updateCartQuantity,
//     loadingProducts, // Added loading state
//     productError     // Added error state
//   } = useContext(CartContext);
//   const navigate = useNavigate();

//   // Early return if products are still loading or there was an error
//   if (loadingProducts) {
//     return <div className="text-center py-20">Loading Cart Items...</div>;
//   }
//   if (productError) {
//     return <div className="text-center py-20 text-red-600">Error loading products: {productError}</div>;
//   }

//   // Check if cartItems is actually populated
//   console.log("Cart Items State:", cartItems);
//   // Check if all_products is populated
//   console.log("All Products State:", all_products);


//   return (
//     <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
//         <Link
//           to="/collection"
//           className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
//         >
//           <IoArrowBack />
//           <span>Back to Shopping</span>
//         </Link>
//       </div>

//       <div>
//         {getCartTotalAmount() > 0 ? (
//           <>
//             {/* Cart Headers (ensure grid class is correct) */}
//             <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-6 gap-4 text-center font-semibold text-gray-600 border-b pb-2 mb-4"> {/* Adjusted grid for consistency */}
//               <p className="col-span-2 text-left">Items</p>
//               <p className="hidden sm:block">Price</p> {/* Hide price on smallest screens if needed */}
//               <p>Quantity</p>
//               <p>Total</p>
//               <p>Remove</p>
//             </div>

//             {/* Cart Items List */}
//             {all_products.map((product) => {
//               // Ensure product and product._id exist before checking cartItems
//               if (product && product._id && cartItems[product._id] > 0) {
//                  // Log inside the map if item is found in cart
//                  console.log(`Rendering cart item for product ${product.name} (_id: ${product._id}), Quantity: ${cartItems[product._id]}`);
//                 return (
//                   // Use MongoDB _id as the key
//                   <div key={product._id} className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-6 gap-4 items-center text-center border-b py-4">
//                     {/* Item Details */}
//                     <div className="col-span-2 flex items-center gap-4 text-left">
//                       <img src={product.images[0]} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md" />
//                       <div>
//                          <p className="font-semibold">{product.name}</p>
//                          <p className="text-sm text-gray-500 sm:hidden">${product.price.toFixed(2)}</p> {/* Show price here on mobile */}
//                       </div>
//                     </div>
//                     {/* Price (Hidden on mobile) */}
//                     <p className="hidden sm:block">${product.price.toFixed(2)}</p>
//                     {/* Quantity Dropdown */}
//                     <select
//                       value={cartItems[product._id]}
//                       onChange={(e) => updateCartQuantity(product._id, Number(e.target.value))}
//                       className="mx-auto p-2 border rounded-md bg-white w-16 sm:w-20" // Adjusted width
//                     >
//                       {/* Generate options up to 10 */}
//                       {[...Array(10).keys()].map(x => (
//                         <option key={x + 1} value={x + 1}>{x + 1}</option>
//                       ))}
//                        {/* Add an option for quantities > 10 if needed */}
//                        {cartItems[product._id] > 10 && <option value={cartItems[product._id]}>{cartItems[product._id]}</option>}
//                     </select>
//                     {/* Total */}
//                     <p>${(product.price * cartItems[product._id]).toFixed(2)}</p>
//                     {/* Remove Button */}
//                     <button onClick={() => deleteFromCart(product._id)} className="mx-auto hover:text-red-500 transition-colors">
//                       <RiDeleteBin6Line size={20} />
//                     </button>
//                   </div>
//                 );
//               }
//               return null; // Important: Return null if product not in cart
//             })}
//           </>
//         ) : (
//           // Empty Cart Message
//           <div className="text-center py-16">
//             <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty.</h2>
//             <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
//           </div>
//         )}
//       </div>

//       {/* Cart Totals Section */}
//       {getCartTotalAmount() > 0 && (
//         <div className="mt-12 flex flex-col md:flex-row justify-between gap-12">
//           {/* Left Side: Totals & Checkout */}
//           <div className="flex-1">
//             <h2 className="text-2xl font-bold mb-4">Cart Totals</h2>
//             <div className="space-y-3 border-b pb-4">
//               <div className="flex justify-between text-gray-700">
//                 <p>Subtotal</p>
//                 <p>${getCartTotalAmount().toFixed(2)}</p>
//               </div>
//               <div className="flex justify-between text-gray-700">
//                 <p>Delivery Fee</p>
//                 {/* Ensure fee calculation is correct */}
//                 <p>${(getCartTotalAmount() > 0 ? 5.00 : 0.00).toFixed(2)}</p>
//               </div>
//             </div>
//             <div className="flex justify-between font-bold text-lg mt-4">
//               <p>Total</p>
//               {/* Ensure total calculation is correct */}
//               <p>${(getCartTotalAmount() > 0 ? getCartTotalAmount() + 5.00 : 0.00).toFixed(2)}</p>
//             </div>
//             <button
//               onClick={() => navigate('/place-order')}
//               className="w-full mt-6 bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
//             >
//               PROCEED TO CHECKOUT
//             </button>
//           </div>

//           {/* Right Side: Promo Code */}
//           <div className="flex-1">
//             <div>
//               <p className="text-gray-600 mb-2">If you have a promo code, enter it here</p>
//               <div className="flex">
//                 <input type="text" placeholder="promo code" className="outline-none p-2 border border-r-0 flex-grow rounded-l-md" />
//                 <button className="bg-gray-800 text-white px-6 rounded-r-md">Submit</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";
import axios from 'axios';

const Cart = () => {
  // Get state and setters from context
  const {
    cartItems, all_products, deleteFromCart, getCartTotalAmount, updateCartQuantity,
    loadingProducts, productError, token,
    appliedDiscount, setAppliedDiscount
  } = useContext(CartContext);
  const navigate = useNavigate();

  // Local state for input
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(""); // State for success message

  // Effect to clear messages if discount is removed from context
  useEffect(() => {
      if (!appliedDiscount) {
          setPromoSuccess("");
          setPromoError("");
      }
  }, [appliedDiscount]);


  // Loading/Error Handling for Products
  if (loadingProducts) return <div className="text-center py-20">Loading Cart...</div>;
  if (productError) return <div className="text-center py-20 text-red-600">Error: {productError}</div>;

  // --- Calculations ---
  const subtotal = getCartTotalAmount();
  const deliveryFee = subtotal > 0 ? 5.00 : 0.00;
  let discountAmount = 0;
  // Calculate based on discount object from context
  if (appliedDiscount) {
      if (appliedDiscount.type === 'percent') discountAmount = (subtotal * appliedDiscount.value) / 100;
      else if (appliedDiscount.type === 'fixed') discountAmount = Math.min(appliedDiscount.value, subtotal + deliveryFee); // Apply to total
      else if (appliedDiscount.type === 'shipping') discountAmount = deliveryFee;
  }
  discountAmount = Math.max(0, discountAmount);
  const totalAmount = (subtotal + deliveryFee - discountAmount);
  // --- End Calculations ---


  // --- Handle Promo Code Submission ---
  const handlePromoSubmit = async () => {
      if (!promoCodeInput.trim()) { setPromoError("Enter code."); return; }
      // NOTE: We are NOT checking for token here, as per your request
      // to allow multiple uses.
      setPromoLoading(true); setPromoError(""); setPromoSuccess("");
      setAppliedDiscount(null); // Clear previous discount

      try {
          const codeToSubmit = promoCodeInput.trim().toUpperCase();
          // Call public validation endpoint
          const response = await axios.post('http://localhost:4000/api/promo/validate',
              { code: codeToSubmit }
              // No token header needed, as route is public
          );
          if (response.data.success) {
              setAppliedDiscount(response.data.discount); // Set discount object in CONTEXT
              setPromoSuccess("Code applied!");
              setPromoCodeInput("");
          } else { setPromoError(response.data.message || "Invalid code."); }
      } catch (err) { setPromoError(err.response?.data?.message || "Invalid code/server error."); }
      finally { setPromoLoading(false); }
  };
  // --- END Promo Handler ---

  // --- Remove Applied Code ---
  const removeAppliedCode = () => {
      setAppliedDiscount(null); // Clear context
      setPromoError(''); setPromoSuccess('');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
        <Link to="/collection" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
            <IoArrowBack />
            <span>Back to Shopping</span>
        </Link>
      </div>

      {/* Cart Items or Empty Message */}
      <div>
        {subtotal > 0 ? (
          <>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-6 gap-4 text-center font-semibold text-gray-600 border-b pb-2 mb-4">
                <p className="col-span-2 text-left">Items</p>
                <p className="hidden sm:block">Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            {all_products.map((product) => {
              if (product?._id && cartItems[product._id] > 0) {
                return (
                  <div key={product._id} className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-6 gap-4 items-center text-center border-b py-4">
                    <div className="col-span-2 flex items-center gap-4 text-left">
                        <img src={product.images[0]} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md" onError={(e) => {e.target.src='https://via.placeholder.com/80?text=Err'}}/>
                        <div>
                            <p className="font-semibold">{product.name}</p>
                           <p className="text-sm text-gray-500 sm:hidden">₹{product.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <p className="hidden sm:block">₹{product.price.toFixed(2)}</p>
                    <select value={cartItems[product._id]} onChange={(e) => updateCartQuantity(product._id, Number(e.target.value))} className="mx-auto p-2 border rounded-md bg-white w-16 sm:w-20">
                        {[...Array(Math.max(10, cartItems[product._id])).keys()].map(x => ( <option key={x + 1} value={x + 1}>{x + 1}</option> ))}
                    </select>
                    <p>₹{(product.price * cartItems[product._id]).toFixed(2)}</p>
                    <button onClick={() => deleteFromCart(product._id)} className="mx-auto hover:text-red-500 transition-colors">
                        <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                );
              } return null;
            })}
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty.</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/collection" className="mt-6 inline-block bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800"> Start Shopping </Link>
          </div>
        )}
      </div>

      {/* Cart Totals & Promo Section */}
      {subtotal > 0 && (
        <div className="mt-12 flex flex-col md:flex-row justify-between gap-12">
          {/* Left Side: Totals & Checkout */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Cart Totals</h2>
            <div className="space-y-3 border-b pb-4">
              <div className="flex justify-between text-gray-700"> <p>₹{subtotal.toFixed(2)}</p> </div>
              {/* Discount Row */}
              {appliedDiscount && (
                  <div className="flex justify-between text-green-600 font-medium">
                      <p>Discount ({
                           appliedDiscount.type === 'percent' ? `${appliedDiscount.value}%` :
                           appliedDiscount.type === 'fixed' ? `₹${appliedDiscount.value.toFixed(2)}` :
                           'Free Shipping'
                       })</p>
                    <p>- ₹{discountAmount.toFixed(2)}</p>
                  </div>
              )}
              <div className="flex justify-between text-gray-700"> <p>Delivery Fee</p> <p>₹{deliveryFee.toFixed(2)}</p>
 </div>
            </div>
            {/* Final Total */}
            <div className="flex justify-between font-bold text-lg mt-4"> <p>Total</p> <p>₹{Math.max(0, totalAmount).toFixed(2)}</p></div>
            <button onClick={() => navigate('/place-order')} className="w-full mt-6 bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"> PROCEED TO CHECKOUT </button>
          </div>

          {/* Right Side: Promo Code */}
          <div className="flex-1">
            <div>
              <p className="text-gray-600 mb-2">Have a promo code?</p>
              <div className="flex">
                <input
                   type="text"
                   placeholder="Enter code"
                   value={promoCodeInput}
                   onChange={(e) => { setPromoCodeInput(e.target.value); setPromoError(""); setPromoSuccess(""); }} // Clear messages on type
                   disabled={!!appliedDiscount} // Disable input if code is applied
                   className={`outline-none p-2 border border-r-0 flex-grow rounded-l-md focus:border-black ${appliedDiscount ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                />
                <button
                   onClick={handlePromoSubmit}
                   disabled={promoLoading || !!appliedDiscount} // Disable if loading or code applied
                   className={`px-6 rounded-r-md transition-colors ${promoLoading || appliedDiscount ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-black'}`}
                >
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </div>
              {/* Messages */}
              {promoError && <p className="text-red-600 text-sm mt-2">{promoError}</p>}
              {promoSuccess && <p className="text-green-600 text-sm mt-2">{promoSuccess}</p>}
              {/* Remove button */}
              {appliedDiscount && <button onClick={removeAppliedCode} className='text-sm text-red-500 hover:underline mt-1 block'> Remove code </button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

