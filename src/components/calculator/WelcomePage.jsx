import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-gilda text-primary mb-4">
          Milea Estate Wine Club
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Calculate your potential savings and find the perfect membership tier for you.
        </p>
        <Link
          to="/calculator"
          className="block w-full bg-primary text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-colors"
        >
          Calculate Your Savings
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage; 