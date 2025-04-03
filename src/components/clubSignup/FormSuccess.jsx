import React from 'react';

const FormSuccess = ({ onClose }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for joining the Milea Estate wine club. A member of our team will reach out shortly to finalize your signup process.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 text-base font-medium text-white bg-primary border border-transparent rounded-md hover:bg-darkBrownHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSuccess; 