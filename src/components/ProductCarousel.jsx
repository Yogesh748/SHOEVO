import React, { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';

const ProductCarousel = ({ title, products }) => {
  const scrollRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Checks the scroll position to determine if arrows should be disabled
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Use a small tolerance (e.g., 5px) for floating point inaccuracies
      setIsBeginning(scrollLeft < 5);
      setIsEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    }
  };

  // Set up the event listener for scrolling and check initially
  useEffect(() => {
    const scrollElement = scrollRef.current;
    checkScrollPosition(); // Check on mount
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      // Cleanup listener on unmount
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition);
    }
  }, [products]); // Re-run if the list of products changes

  // Handles the scrolling behavior when an arrow is clicked
  const scroll = (direction) => {
    if (scrollRef.current) {
      // Scroll approximately by the visible width of the container
      const scrollAmount = scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Ensure products is an array before trying to map
  if (!Array.isArray(products)) {
      console.warn("ProductCarousel received non-array products prop:", products);
      products = []; // Default to empty array to prevent crash
  }

  return (
    <section className="py-12">
      {/* Container for the title, aligned with the page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
      </div>

      {/* Main Flex container that holds [Arrow] [Cards] [Arrow] */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8">

        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          disabled={isBeginning}
          aria-label="Scroll left"
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 flex-shrink-0 hidden sm:block" // Hidden on mobile
        >
          <IoIosArrowBack size={24} />
        </button>

        {/* The scrollable container for cards */}
        <div
          ref={scrollRef}
          className="flex-grow flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide" // Use gap-6 here
        >
          {products.map((product) => (
            // Use product._id for the key and the link URL
            <Link to={`/product/${product._id}`} key={product._id}>
              {/* Use fixed widths for the items within the carousel */}
              <div className="flex-shrink-0 w-[280px] sm:w-[300px]">
                <ProductCard product={product} />
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          disabled={isEnd}
          aria-label="Scroll right"
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 flex-shrink-0 hidden sm:block" // Hidden on mobile
        >
          <IoIosArrowForward size={24} />
        </button>
      </div>
    </section>
  );
};

export default ProductCarousel;