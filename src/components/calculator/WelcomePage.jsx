import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculator } from '../../contexts/CalculatorContext';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start px-4 pt-8 sm:pt-12">
      <div className="max-w-md w-full text-center">
        <img 
          src="https://i.imgur.com/qfTW5j0.png" 
          alt="Milea Estate Vineyard Logo" 
          className="w-48 sm:w-64 mx-auto mb-4 sm:mb-6"
        />
        
        <h1 className="text-2xl sm:text-3xl font-gilda text-primary mb-2 sm:mb-4">
          Milea Estate Club Calculator
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
          Calculate your savings today
        </p>
        <button
          onClick={() => navigate('/calculator')}
          className="w-full bg-primary text-white py-3 sm:py-4 px-6 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-colors"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default WelcomePage; 