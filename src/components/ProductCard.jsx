// import React, { useContext } from 'react';
// import { IoCartOutline } from 'react-icons/io5';
// import { CartContext } from '../context/CartContext';

// const ProductCard = ({ product }) => {
//   // Destructure properties from product, using _id and images
//   const { name, price, images, _id } = product || {}; // Add default empty object
//   const { addToCart } = useContext(CartContext);

//   // Handle cases where product data might be incomplete
//   if (!product || !images || images.length === 0) {
//       // Render a placeholder or null if product data is invalid
//       return (
//          <div className="border rounded-lg overflow-hidden shadow-sm h-full flex items-center justify-center bg-gray-100">
//             <p className="text-gray-400">Loading...</p>
//          </div>
//       );
//   }


//   return (
//     // Ensure the card takes full height and uses flex column
//     <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full">
//       <div className="relative">
//         {/* Display the first image, ensure it covers the area */}
//         <img
//           src={images[0]} // Use the first image from the array
//           alt={name || 'Product Image'} // Add default alt text
//           className="w-full h-64 object-cover" // Fixed height, cover area
//           // Optional: Add error handling for images
//           onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300?text=Image+Error"; }}
//         />
//         <button
//           onClick={(e) => {
//             e.preventDefault(); // Stop Link navigation
//             addToCart(_id); // Use MongoDB _id
//           }}
//           className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
//           aria-label="Add to cart"
//         >
//           <IoCartOutline size={20} />
//         </button>
//       </div>
//       {/* Text container with fixed height and flex properties */}
//       <div className="p-4 flex flex-col justify-between flex-grow h-28">
//         {/* Limit product name to 2 lines */}
//         <h3 className="text-lg font-semibold line-clamp-2">{name || 'Unnamed Product'}</h3>
//         {/* Display price, handle potential null price */}
//         <p className="text-gray-600 mt-1">${(price || 0).toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import React, { useContext } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  // Destructure properties including stock
  const { name, price, images, _id, stock } = product || {};
  const { addToCart } = useContext(CartContext);

  // Determine if the product is out of stock
  const isOutOfStock = !stock || stock <= 0;

  // Handle cases where product data might be incomplete
  if (!product || !images || images.length === 0) {
      return (
         <div className="border rounded-lg overflow-hidden shadow-sm h-full flex items-center justify-center bg-gray-100 min-h-[300px]">
            <p className="text-gray-400">Loading...</p>
         </div>
      );
  }

  return (
    // Remove opacity class from here
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full bg-white">
      <div className="relative">
        {/* Image */}
        <img
          src={images[0]}
          alt={name || 'Product Image'}
          className="w-full h-64 object-cover" // Ensure consistent height and cover
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300?text=Image+Error"; }}
        />

        {/* Out of Stock Badge (Bottom Right) */}
        {isOutOfStock && (
            <span className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                Out of Stock
            </span>
        )}

        {/* Add to Cart Button (Only show if IN stock) */}
        {!isOutOfStock && (
            <button
              onClick={(e) => {
                e.preventDefault(); // Stop Link navigation when clicking button
                addToCart(_id); // Use MongoDB _id
              }}
              // Button appears on hover of the *entire card* (group-hover)
              className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Add to cart"
            >
              <IoCartOutline size={20} />
            </button>
        )}
      </div>
      {/* Text container */}
      <div className="p-4 flex flex-col justify-between flex-grow h-28">
        <h3 className="text-lg font-semibold line-clamp-2">{name || 'Unnamed Product'}</h3>
        <p className="text-gray-600 mt-1">₹{(price || 0).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;