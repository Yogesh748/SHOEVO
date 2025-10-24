// import React, { useContext } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import ProductCard from '../components/ProductCard';
// import { IoArrowBack } from 'react-icons/io5'; // 1. Import an icon

// const SearchResults = () => {
//   const { all_products } = useContext(CartContext);
//   const [searchParams] = useSearchParams();
  
//   const query = searchParams.get('q')?.toLowerCase() || '';

//   const filteredProducts = query
//     ? all_products.filter(product => 
//         product.name.toLowerCase().includes(query) || 
//         product.category.toLowerCase().includes(query)
//       )
//     : [];

//   return (
//     <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl font-extrabold tracking-tight">Search Results</h1>
//         <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
//           Showing results for: <span className="font-semibold text-black">"{query}"</span>
//         </p>
//       </div>

//       {/* 2. NEW: Back to Home button, visible only on small screens (sm:hidden) */}
//       <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-black transition-colors sm:hidden">
//         <IoArrowBack />
//         <span>Back to Home</span>
//       </Link>

//       {filteredProducts.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {filteredProducts.map((product) => (
//             <Link to={`/product/${product.id}`} key={product.id}>
//               <ProductCard product={product} />
//             </Link>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16">
//             <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
//             <p className="text-gray-500 mt-2">Sorry, we couldn't find any products matching your search.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResults;

import React, { useContext, useMemo } from 'react'; // Import useMemo
import { useSearchParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { IoArrowBack } from 'react-icons/io5';

const SearchResults = () => {
  // Get products and loading states from context
  const { all_products, loadingProducts, productError } = useContext(CartContext);
  const [searchParams] = useSearchParams();

  const query = searchParams.get('q')?.toLowerCase() || '';

  // Use useMemo to filter products efficiently
  const filteredProducts = useMemo(() => {
     if (loadingProducts || productError || !all_products) {
       return []; // Return empty if loading, error, or no products
     }
     if (!query) {
       return []; // Return empty if no query
     }
     return all_products.filter(product =>
         product.name.toLowerCase().includes(query) ||
         product.category.toLowerCase().includes(query) ||
         product.audience.toLowerCase().includes(query) // Also search audience
       );
  }, [all_products, loadingProducts, productError, query]); // Dependencies


  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Search Results</h1>
        {query && (
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Showing results for: <span className="font-semibold text-black">"{query}"</span>
          </p>
        )}
      </div>

      <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-black transition-colors sm:hidden">
        <IoArrowBack />
        <span>Back to Home</span>
      </Link>

      {/* Handle Loading/Error States */}
      {loadingProducts && (
          <div className="text-center py-20"><p className="text-xl font-semibold">Loading results...</p></div>
      )}
      {productError && (
          <div className="text-center py-20 px-4">
              <p className="text-xl font-semibold text-red-600">Error Loading Products</p>
              <p className="text-gray-600 mt-2">{productError}</p>
          </div>
      )}

      {/* Display Results or No Results Message */}
      {!loadingProducts && !productError && (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                // Use product._id for the key and link
                <Link to={`/product/${product._id}`} key={product._id}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
                <p className="text-gray-500 mt-2">Sorry, we couldn't find any products matching "{query}".</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;