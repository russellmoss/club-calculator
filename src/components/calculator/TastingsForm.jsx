import React, { useState } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import SavingsTally from './SavingsTally';

const TastingsForm = () => {
  const { formData, updateFormData, currentStep, nextStep, prevStep } = useCalculator();
  const [focusedField, setFocusedField] = useState(null);

  if (currentStep !== 1) return null;

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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6">Wine Tastings</h2>
      <p className="text-gray-600 mb-8">Let's calculate your savings from complimentary wine tastings.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many complimentary tastings would you like per year?
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