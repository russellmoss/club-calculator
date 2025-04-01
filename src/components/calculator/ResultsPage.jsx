import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { calculateSavings } from '../../utils/calculatorUtils';

const ResultsPage = () => {
  const { 
    monthlyBottles, 
    averageBottlePrice, 
    annualEvents, 
    annualTastings,
    culinarySeries,
    setCurrentStep 
  } = useCalculator();

  const savings = calculateSavings({
    monthlyBottles,
    averageBottlePrice,
    annualEvents,
    annualTastings,
    culinarySeries
  });

  const tiers = [
    {
      name: 'Jumper',
      description: 'Perfect for wine enthusiasts who want to start their journey',
      benefits: [
        '10% off all wine purchases',
        'Two complimentary tastings per month',
        'Access to member-only events',
        'Priority access to limited releases'
      ],
      savings: savings.jumper
    },
    {
      name: 'Grand Prix',
      description: 'Enhanced benefits for the dedicated wine collector',
      benefits: [
        '15% off all wine purchases',
        'Four complimentary tastings per month',
        'Access to member-only events',
        'Priority access to limited releases',
        'Exclusive access to Grand Prix events'
      ],
      savings: savings.grandPrix
    },
    {
      name: 'Triple Crown',
      description: 'The ultimate wine club experience',
      benefits: [
        '20% off all wine purchases',
        'Unlimited complimentary tastings',
        'Access to member-only events',
        'Priority access to limited releases',
        'Exclusive access to Triple Crown events',
        'Food discounts at events',
        'Special recognition at events'
      ],
      savings: savings.tripleCrown
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-gilda text-primary mb-4">
          Your Wine Club Recommendations
        </h2>
        <p className="text-gray-700">
          Based on your preferences, here are the best options for you.
        </p>
      </div>

      <div className="space-y-6">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-gilda text-primary">{tier.name} Tier</h3>
                <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ${tier.savings.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              {tier.benefits.map((benefit, index) => (
                <p key={index}>• {benefit}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={() => setCurrentStep(0)}
          className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-darkBrownHover transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultsPage; 