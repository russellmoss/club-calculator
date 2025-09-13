import React, { useState } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { FaCrown, FaTrophy, FaMedal } from 'react-icons/fa';
import SavingsBreakdownModal from './SavingsBreakdownModal';

const SavingsTally = () => {
  const { savings, formData } = useCalculator();
  const [selectedTier, setSelectedTier] = useState(null);

  const handleTierClick = (tier) => {
    setSelectedTier(tier);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
          <FaCrown className="mr-2 text-primary" />
          Potential Annual Savings
        </h3>
        
        <div className="space-y-3">
          <div 
            className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer"
            onClick={() => handleTierClick('Triple Crown')}
          >
            <span className="font-gilda text-darkBrown flex items-center">
              <FaCrown className="mr-2 text-primary" />
              Triple Crown
            </span>
            <span className="font-bold text-primary text-xl transition-all duration-300">
              ${savings.tripleCrown}
            </span>
          </div>
          
          <div 
            className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer"
            onClick={() => handleTierClick('Grand Prix')}
          >
            <span className="font-gilda text-darkBrown flex items-center">
              <FaTrophy className="mr-2 text-primary" />
              Grand Prix
            </span>
            <span className="font-bold text-primary text-xl transition-all duration-300">
              ${savings.grandPrix}
            </span>
          </div>
          
          <div 
            className="flex justify-between items-center hover:bg-gray-50 px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer"
            onClick={() => handleTierClick('Jumper')}
          >
            <span className="font-gilda text-darkBrown flex items-center">
              <FaMedal className="mr-2 text-primary" />
              Jumper
            </span>
            <span className="font-bold text-primary text-xl transition-all duration-300">
              ${savings.jumper}
            </span>
          </div>
        </div>
      </div>

      <SavingsBreakdownModal
        isOpen={selectedTier !== null}
        onClose={() => setSelectedTier(null)}
        tier={selectedTier}
        formData={formData}
        savings={savings}
      />
    </>
  );
};

export default SavingsTally; 