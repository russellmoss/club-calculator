import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import Button from '../common/Button';

const ConsumptionForm = () => {
  const { formData, updateFormData, currentStep, nextStep } = useCalculator();

  if (currentStep !== 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6">Your Wine Consumption</h2>
      <p className="text-gray-600 mb-8">Let's start by understanding your wine consumption habits.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many bottles of wine do you purchase per month?
          </label>
          <input
            type="number"
            min="0"
            value={formData.bottlesPerMonth}
            onChange={(e) => updateFormData({ bottlesPerMonth: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many bottles do you typically give as gifts per year?
          </label>
          <input
            type="number"
            min="0"
            value={formData.giftBottlesPerYear}
            onChange={(e) => updateFormData({ giftBottlesPerYear: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Next: Events & Activities
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConsumptionForm; 