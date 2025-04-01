import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';

const SavingsTally = () => {
  const { savings } = useCalculator();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
      <h3 className="text-lg font-medium text-primary mb-3">Potential Annual Savings</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-gilda text-darkBrown">Triple Crown</span>
          <span className="font-bold text-primary">${Math.round(savings.tripleCrown)}</span>
        </div>
        
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-gilda text-darkBrown">Grand Prix</span>
          <span className="font-bold text-primary">${Math.round(savings.grandPrix)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-gilda text-darkBrown">Jumper</span>
          <span className="font-bold text-primary">${Math.round(savings.jumper)}</span>
        </div>
      </div>
    </div>
  );
};

export default SavingsTally; 