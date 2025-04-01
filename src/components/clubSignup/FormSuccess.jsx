import React from 'react';

const FormSuccess = ({ onClose }) => {
  return (
    <div className="text-center py-6">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
        <svg
          className="h-6 w-6 text-green-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h2 className="text-2xl font-gilda text-primary mb-2">
        Welcome to the Wine Club!
      </h2>
      
      <p className="text-gray-600 mb-6">
        Thank you for joining. Your membership has been successfully processed.
        You will receive a confirmation email shortly with your membership details.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onClose}
          className="w-full bg-primary text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-colors"
        >
          Close
        </button>
        
        <p className="text-sm text-gray-500">
          Have questions? Contact us at{' '}
          <a href="mailto:membership@mileaestate.com" className="text-primary hover:underline">
            membership@mileaestate.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default FormSuccess; 