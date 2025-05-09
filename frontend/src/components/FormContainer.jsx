import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;