import React, { useContext, useState, useMemo } from 'react';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Collection = () => {
  // Get products and loading/error states from context
  const { all_products, loadingProducts, productError } = useContext(CartContext);

  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('');

  const displayedProducts = useMemo(() => {
    // Ensure all_products is available before filtering/sorting
    if (loadingProducts || productError || !all_products) {
      return []; // Return empty array while loading or if error
    }

    let filtered = [...all_products];

    // Apply audience filter
    if (activeFilter !== 'All') {
      filtered = filtered.filter(product => product.audience === activeFilter);
    }

    // Apply sort order
    if (sortOrder === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [all_products, activeFilter, sortOrder, loadingProducts, productError]); // Include loading states in dependencies

  const filterButtons = ['All', 'Men', 'Women', 'Kids'];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Our Collection</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Explore our curated selection of premium footwear.
        </p>
      </div>

      {/* Filter and Sort Controls (remain unchanged) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1 bg-gray-100 rounded-full">
          {filterButtons.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === filter ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        {/* Sort Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded-md bg-white text-sm"
        >
          <option value="">Sort by Relevance</option>
          <option value="low-to-high">Sort by Price: Low to High</option>
          <option value="high-to-low">Sort by Price: High to Low</option>
        </select>
      </div>

      {/* Conditional Rendering for Loading/Error/Content */}
      {loadingProducts && (
        <div className="text-center py-20">
          <p className="text-xl font-semibold">Loading collection...</p>
        </div>
      )}

      {productError && (
        <div className="text-center py-20 px-4">
          <p className="text-xl font-semibold text-red-600">Error Loading Collection</p>
          <p className="text-gray-600 mt-2">{productError}</p>
        </div>
      )}

      {!loadingProducts && !productError && displayedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            // Use product._id for the key and link
            <Link to={`/product/${product._id}`} key={product._id}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}

      {!loadingProducts && !productError && displayedProducts.length === 0 && (
        <div className="text-center py-16 col-span-full">
            <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default Collection;