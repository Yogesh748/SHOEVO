import React from 'react';
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg w-[90%] max-w-md flex flex-col gap-5 animate-fadeIn">
        <IoClose 
          onClick={onClose} 
          className="absolute top-4 right-4 w-6 h-6 cursor-pointer text-gray-600" 
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;