import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import Button from '../common/Button';

const TastingsForm = () => {
  const { formData, updateFormData, currentStep, nextStep, prevStep } = useCalculator();

  if (currentStep !== 2) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6">Wine Tastings</h2>
      <p className="text-gray-600 mb-8">Tell us about your interest in wine tastings.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="quarterlyTastings"
                checked={formData.useQuarterlyTastings}
                onChange={(e) => updateFormData({ useQuarterlyTastings: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="quarterlyTastings" className="font-medium text-gray-700">
                Quarterly Tastings
              </label>
              <p className="text-gray-500 text-sm">
                Attend quarterly wine tastings with our winemaker (Triple Crown and Grand Prix members only)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How many complimentary tastings would you use per year?
            </label>
            <input
              type="number"
              min="0"
              value={formData.complimentaryTastings}
              onChange={(e) => updateFormData({ complimentaryTastings: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Each complimentary tasting is valued at $25
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit">
            View Your Results
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TastingsForm; 