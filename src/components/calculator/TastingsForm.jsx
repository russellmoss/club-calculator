import React, { useState } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import SavingsTally from './SavingsTally';
import { FaCheck } from 'react-icons/fa';

const TastingsForm = () => {
  const { formData, updateFormData, currentStep, nextStep, prevStep } = useCalculator();
  const [focusedField, setFocusedField] = useState(null);

  if (currentStep !== 2) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleFocus = (field) => {
    setFocusedField(field);
    if (formData[field] === 0) {
      updateFormData({ [field]: '' });
    }
  };

  const handleBlur = (field) => {
    setFocusedField(null);
    if (formData[field] === '') {
      updateFormData({ [field]: 0 });
    }
  };

  const handleQuarterlyTastingsClick = () => {
    updateFormData({ useQuarterlyTastings: !formData.useQuarterlyTastings });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6">Wine Tastings</h2>
      <p className="text-gray-600 mb-8">Let's calculate your savings from complimentary wine tastings.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-primary">Click if you want free tastings</h3>
          
          {/* Quarterly Tastings Card */}
          <div 
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              formData.useQuarterlyTastings 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={handleQuarterlyTastingsClick}
          >
            {formData.useQuarterlyTastings && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                <FaCheck size={12} />
              </div>
            )}
            <h3 className="font-medium text-gray-900 mb-1">Quarterly Tastings</h3>
            <p className="text-gray-500 text-sm">
              I will use the free quarterly tastings as a Grand Prix or Triple Crown member
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many free tastings do you think you would send to friends and family each year as part of Milea Miles?
          </label>
          <input
            type="number"
            min="0"
            value={formData.complimentaryTastings}
            onChange={(e) => updateFormData({ complimentaryTastings: parseInt(e.target.value) || 0 })}
            onFocus={() => handleFocus('complimentaryTastings')}
            onBlur={() => handleBlur('complimentaryTastings')}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 hover:border-gray-400"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Each tasting is valued at $25
          </p>
        </div>

        <SavingsTally />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md text-lg font-medium hover:bg-gray-300 transition-all duration-200 hover:shadow-md"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-primary text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-all duration-200 hover:shadow-md"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default TastingsForm; 