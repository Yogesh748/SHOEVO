import React from 'react';
import { FaShippingFast, FaCheckCircle, FaStar } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&auto=format&fit=crop&q=80" // A stylish shoe-related image
            alt="About Shoevo"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">About Shoevo</h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Our Story, Your Style. Discover the passion behind every pair.
          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            At Shoevo, our mission is simple: to provide you with an exclusive collection of footwear that combines
            unmatched quality, modern style, and exceptional comfort. We believe that the right pair of shoes
            can transform your day and elevate your look.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <div className="flex flex-col items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                  <FaCheckCircle size={24} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Curated Selection</h3>
                <p className="mt-2 text-base text-gray-600">
                  Every shoe in our collection is hand-picked by our team for its superior quality, style, and craftsmanship.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                  <FaStar size={24} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Unbeatable Quality</h3>
                <p className="mt-2 text-base text-gray-600">
                  We partner with the best brands and artisans to ensure every pair is built to last and provides maximum comfort.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                  <FaShippingFast size={24} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer First</h3>
                <p className="mt-2 text-base text-gray-600">
                  Your satisfaction is our top priority. We offer fast shipping, and dedicated customer support.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;