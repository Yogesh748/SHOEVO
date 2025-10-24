// import React, { useContext } from 'react';
// import ProductCarousel from '../components/ProductCarousel';
// import { Link } from 'react-router-dom';
// import { CartContext } from '../context/CartContext'; // Import CartContext

// const Home = () => {
//   // Fetching from context
//   const { all_products, loadingProducts, productError } = useContext(CartContext);

//   // Split products into two groups (for Featured and Trending)
//   const featuredProducts = all_products.slice(0, Math.ceil(all_products.length / 2));
//   const trendingProducts = all_products.slice(Math.ceil(all_products.length / 2));

//   return (
//     <div>
//       {/* Hero Section - Restored to original dummy UI style */}
//       <section className="bg-gray-100 text-center py-20 lg:py-32">
//         <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-800">
//           Step Into Style
//         </h1>
//         <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
//           Discover our exclusive collection of footwear that blends comfort and modern design.
//         </p>

//         {/* Button as Link (same as dummy UI) */}
//         <Link
//           to="/collection"
//           className="mt-8 inline-block bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300"
//         >
//           Shop Collection
//         </Link>
//       </section>

//       {/* Conditional Rendering for Loading and Errors */}
//       {loadingProducts && (
//         <div className="text-center py-20">
//           <p className="text-xl font-semibold">Loading products...</p>
//         </div>
//       )}

//       {productError && (
//         <div className="text-center py-20 px-4">
//           <p className="text-xl font-semibold text-red-600">Error Loading Products</p>
//           <p className="text-gray-600 mt-2">{productError}</p>
//         </div>
//       )}

//       {/* Show products once data is ready */}
//       {!loadingProducts && !productError && all_products.length > 0 && (
//         <>
//           <ProductCarousel title="Featured Products" products={featuredProducts} />
//           <ProductCarousel title="Trending Now" products={trendingProducts} />
//         </>
//       )}

//       {/* Message for no products */}
//       {!loadingProducts && !productError && all_products.length === 0 && (
//         <p className="text-center py-20 text-gray-500">
//           No products are currently available.
//         </p>
//       )}
//     </div>
//   );
// };

// export default Home;

import React, { useContext, useMemo } from 'react';
import ProductCarousel from '../components/ProductCarousel';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { assets } from '../assets/assets'; // Import assets if needed

const Home = () => {
  // Get products and loading states from context
  const { all_products, loadingProducts, productError } = useContext(CartContext);

  // Use useMemo to filter for featured products
  const featuredProducts = useMemo(() => {
    if (loadingProducts || !all_products) return [];
    return all_products.filter(product => product.isFeatured === true);
  }, [all_products, loadingProducts]);

  // Use useMemo to filter for trending products
  const trendingProducts = useMemo(() => {
    if (loadingProducts || !all_products) return [];
    return all_products.filter(product => product.isTrending === true);
  }, [all_products, loadingProducts]);

  return (
    <div>
      {/* Hero Section - Simple Gray Background */}
      <section className="bg-gray-100 text-center py-20 lg:py-32">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-800">
          Step Into Style
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          Discover our exclusive collection of footwear that blends comfort and modern design.
        </p>
        <Link
          to="/collection"
          className="mt-8 inline-block bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300"
        >
          Shop Collection
        </Link>
      </section>

      {/* Conditional Rendering for Loading/Error */}
      {loadingProducts && (
        <div className="text-center py-20">
          <p className="text-xl font-semibold text-gray-500">Loading products...</p>
        </div>
      )}

      {productError && (
        <div className="text-center py-20 px-4">
          <p className="text-xl font-semibold text-red-600">Error Loading Products</p>
          <p className="text-gray-600 mt-2">{productError}</p>
        </div>
      )}

      {/* Main Content: Carousels or Messages */}
      {!loadingProducts && !productError && all_products.length > 0 && (
        <>
          {/* Featured Products Section */}
          {featuredProducts.length > 0 ? (
            <ProductCarousel title="Featured Products" products={featuredProducts} />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
              <p className="text-center text-gray-500">No featured products at this time. Check back soon!</p>
            </div>
          )}

          {/* Trending Products Section */}
          {trendingProducts.length > 0 ? (
            <ProductCarousel title="Trending Now" products={trendingProducts} />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
              <p className="text-center text-gray-500">No trending products at this time.</p>
            </div>
          )}
        </>
      )}

      {/* No Products At All */}
      {!loadingProducts && !productError && all_products.length === 0 && (
        <p className="text-center py-20 text-gray-500">No products are currently available.</p>
      )}
    </div>
  );
};

export default Home;

