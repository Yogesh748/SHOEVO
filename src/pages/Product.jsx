// import React, { useContext, useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import { IoCartOutline, IoArrowBack } from "react-icons/io5";

// const Product = () => {
//   const { all_products, addToCart, cartItems, loadingProducts, productError } = useContext(CartContext);
//   const { productId } = useParams();
//   const navigate = useNavigate();

//   const [mainImage, setMainImage] = useState('');
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [isInCart, setIsInCart] = useState(false);

//   // Use useMemo for efficient product finding after loading
//   const product = React.useMemo(() => {
//       if (loadingProducts || !all_products || all_products.length === 0) return null;
//       return all_products.find((e) => e._id === productId);
//   }, [all_products, loadingProducts, productId]);

//   // Effect to update image, size, and cart status
//   useEffect(() => {
//     if (product) {
//       setMainImage(product.images[0]); // Default to first image
//       setSelectedSize(null); // Reset size
//       setIsInCart(cartItems[product._id] > 0); // Check if in cart using _id
//     } else if (!loadingProducts) {
//       setMainImage(''); // Clear image if product not found after load
//     }
//   }, [product, cartItems, loadingProducts]);

//   // --- Loading State ---
//   if (loadingProducts) { return ( <div className="flex justify-center items-center h-screen"><p className="text-xl font-semibold">Loading product...</p></div> ); }
//   // --- Error State ---
//   if (productError) { return ( <div className="text-center py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 className="text-2xl font-bold text-red-600">Error Loading Product</h2> <p className="text-gray-600 mt-2">{productError}</p> <Link to="/collection" className="mt-4 inline-block text-blue-600 hover:underline"> Back to Collection </Link> </div> ); }
//   // --- Not Found State (After Loading) ---
//   if (!product) { return ( <div className="text-center py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 className="text-2xl font-bold">Product Not Found</h2> <p className="text-gray-600 mt-2">Sorry, we couldn't find a product with ID: {productId}.</p> <Link to="/collection" className="mt-4 inline-block text-blue-600 hover:underline"> Back to Collection </Link> </div> ); }

//   // Handler for Add to Cart button
//   const handleAddToCart = () => {
//     if (!selectedSize) { alert("Please select a size."); return; }
//     addToCart(product._id); // Use _id
//   }

//   // --- Main JSX ---
//   return (
//     <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"> <IoArrowBack /> <span>Back</span> </button>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
//         {/* Image Gallery */}
//         <div className="flex flex-col gap-4">
//           <div className="aspect-square bg-gray-100 rounded-lg shadow-md overflow-hidden">
//             <img src={mainImage || product.images[0]} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/600?text=Image+Error"; }}/>
//           </div>
//           <div className="grid grid-cols-4 gap-4">
//             {product.images.map((image, index) => (
//               <div key={index} onClick={() => setMainImage(image)} className={`aspect-square bg-gray-100 rounded-md cursor-pointer overflow-hidden border-2 transition-colors ${mainImage === image ? 'border-black' : 'border-transparent hover:border-gray-400'}`}>
//                 <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=Error"; }}/>
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* Product Details */}
//         <div className="flex flex-col gap-4">
//           <h1 className="text-4xl font-extrabold tracking-tight">{product.name}</h1>
//           <p className="text-3xl font-semibold text-gray-800">${product.price.toFixed(2)}</p>
//           <div className="border-t pt-4">
//             <h2 className="text-lg font-semibold mb-2">Description</h2>
//             <p className="text-gray-600 leading-relaxed"> {product.description || `Experience the quality and style...`} </p>
//           </div>
//           {/* Size Selector */}
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold mb-2">Select Size</h3>
//             <div className="flex flex-wrap gap-2">
//               {product.sizes.map((size, index) => ( <button key={index} onClick={() => setSelectedSize(size)} className={`w-12 h-12 flex items-center justify-center border rounded-md font-semibold transition-colors ${ selectedSize === size ? 'bg-black text-white border-black' : 'hover:border-black' }`}> {size} </button> ))}
//             </div>
//           </div>
//           {/* Add/Go to Cart Button */}
//           {isInCart ? ( <Link to="/cart" className="mt-6 w-full text-center bg-gray-800 text-white py-3 rounded-md font-semibold text-lg hover:bg-black transition-colors"> Go to Cart </Link> ) : ( <button onClick={handleAddToCart} className="mt-6 w-full bg-black text-white py-3 rounded-md font-semibold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors" disabled={!selectedSize} > <IoCartOutline size={22} /> Add to Cart </button> )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Product;

import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { IoCartOutline, IoArrowBack } from "react-icons/io5";

const Product = () => {
  // Get necessary data and functions from context
  const { all_products, addToCart, cartItems, loadingProducts, productError } = useContext(CartContext);
  const { productId } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  // State for component
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  // Find the current product using useMemo for efficiency
  const product = React.useMemo(() => {
      if (loadingProducts || !all_products || all_products.length === 0) return null;
      // Find product based on the _id from the URL
      return all_products.find((e) => e._id === productId);
  }, [all_products, loadingProducts, productId]); // Dependencies for recalculation

  // Effect to update local state when product data or cart changes
  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]); // Default to first image
      setSelectedSize(null); // Reset selected size when product changes
      // Check if the current product is in the cart using its _id
      setIsInCart(cartItems[product._id] > 0);
    } else if (!loadingProducts) {
      // If product loading finished but product not found, clear image
      setMainImage('');
    }
  }, [product, cartItems, loadingProducts]); // Dependencies


  // --- Loading State ---
  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-500">Loading product details...</p>
      </div>
    );
  }
  // --- Error State ---
  if (productError) {
     return (
       <div className="text-center py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <h2 className="text-2xl font-bold text-red-600">Error Loading Product</h2>
         <p className="text-gray-600 mt-2">{productError}</p>
          <Link to="/collection" className="mt-6 inline-block bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300">
             Back to Collection
          </Link>
       </div>
     );
  }
  // --- Not Found State (After Loading) ---
  if (!product) {
    return (
      <div className="text-center py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-600 mt-2">Sorry, we couldn't find a product with the specified ID ({productId}).</p>
         <Link to="/collection" className="mt-6 inline-block bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300">
           Back to Collection
         </Link>
      </div>
    );
  }

  // Check if the product is out of stock
  const isOutOfStock = product.stock <= 0;

  // Handler for Add to Cart button click
  const handleAddToCart = () => {
    if (isOutOfStock) {
         alert("Sorry, this item is currently out of stock.");
         return;
    }
    if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
    }
    // Add the product to cart using its MongoDB _id
    addToCart(product._id);
    // Optionally show a confirmation toast here instead of alert
    // alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
  }

  // --- Main JSX Rendering ---
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8">
        <IoArrowBack />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4">
          {/* Main Image Display */}
          <div className="aspect-square bg-gray-100 rounded-lg shadow-md overflow-hidden border">
            <img
              src={mainImage || product.images[0]} // Show selected or default first image
              alt={product.name}
              className="w-full h-full object-cover"
              // Basic error handling for image load failure
              onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/600?text=Image+Load+Error"; }}
            />
          </div>
          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                onClick={() => setMainImage(image)} // Update main image on click
                className={`aspect-square bg-gray-100 rounded-md cursor-pointer overflow-hidden border-2 transition-colors ${
                    mainImage === image ? 'border-black' : 'border-transparent hover:border-gray-400' // Highlight selected thumbnail
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=Error"; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col gap-4">
          {/* Name */}
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          {/* Price */}
          <p className="text-3xl font-semibold text-gray-800">₹{product.price.toFixed(2)}</p>

          {/* Description */}
          <div className="border-t pt-4 mt-2">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Description</h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description || `Experience the quality and style of the "${product.name}". Perfect for ${product.category.toLowerCase()} enthusiasts, this item from our ${product.audience}'s collection offers both comfort and durability. Available in various sizes.`}
            </p>
          </div>

          {/* Size Selector */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center border rounded-md font-semibold transition-colors text-sm ${
                    selectedSize === size
                      ? 'bg-black text-white border-black' // Selected style
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black' // Default style
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Availability Indicator */}
          <div className="mt-4 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span> {/* Added pulse for out of stock */}
              <p className={`text-sm font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Out of Stock' : 'In Stock'}
              </p>
          </div>

          {/* Add to Cart / Go to Cart Button */}
          {isInCart ? (
            <Link
              to="/cart"
              className="mt-6 w-full text-center bg-gray-800 text-white py-3 rounded-md font-semibold text-lg hover:bg-black transition-colors"
            >
              Go to Cart
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || isOutOfStock} // Disable if size not selected OR out of stock
              className={`mt-6 w-full text-white py-3 rounded-md font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
                  (!selectedSize || isOutOfStock)
                  ? 'bg-gray-400 cursor-not-allowed' // Disabled style
                  : 'bg-black hover:bg-gray-800' // Enabled style
              }`}
            >
              <IoCartOutline size={22} />
              {/* Change button text if out of stock */}
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;