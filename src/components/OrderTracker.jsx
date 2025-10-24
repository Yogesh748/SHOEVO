import React from 'react';
import { FaCheckCircle, FaBox, FaShippingFast, FaHome } from 'react-icons/fa';

const OrderTracker = ({ status }) => {
  const steps = [
    { name: 'Order Confirmed', icon: <FaCheckCircle /> },
    { name: 'Processing', icon: <FaBox /> },
    { name: 'Shipped', icon: <FaShippingFast /> },
    { name: 'Delivered', icon: <FaHome /> },
  ];

  const currentStepIndex = steps.findIndex(step => step.name === status);

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6 text-center">Track Your Order</h3>
      <div className="flex justify-between items-start">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center w-24">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step.icon}
                </div>
                <p className={`mt-2 text-sm font-semibold ${isCurrent ? 'text-black' : 'text-gray-500'}`}>
                  {step.name}
                </p>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mt-5 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;