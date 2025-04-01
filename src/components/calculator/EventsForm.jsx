import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import SavingsTally from './SavingsTally';

const EventsForm = () => {
  const { formData, updateEventSelection, currentStep, nextStep, prevStep } = useCalculator();

  if (currentStep !== 1) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6">Events & Activities</h2>
      <p className="text-gray-600 mb-8">Select the events you're interested in attending.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="culinarySeries"
                checked={formData.selectedEvents.culinarySeries}
                onChange={(e) => updateEventSelection('culinarySeries', e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="culinarySeries" className="font-medium text-gray-700">
                Culinary Series
              </label>
              <p className="text-gray-500 text-sm">
                Spectacular special dinners with our Executive Chefs and guests
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="pickupParties"
                checked={formData.selectedEvents.pickupParties}
                onChange={(e) => updateEventSelection('pickupParties', e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="pickupParties" className="font-medium text-gray-700">
                Pickup Parties
              </label>
              <p className="text-gray-500 text-sm">
                Music, Special menus, Special tastings and community
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="roseDay"
                checked={formData.selectedEvents.roseDay}
                onChange={(e) => updateEventSelection('roseDay', e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="roseDay" className="font-medium text-gray-700">
                Rosé Day
              </label>
              <p className="text-gray-500 text-sm">
                Celebrate the annual release of our Rosé
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="fizzFest"
                checked={formData.selectedEvents.fizzFest}
                onChange={(e) => updateEventSelection('fizzFest', e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="fizzFest" className="font-medium text-gray-700">
                Fizz Fest
              </label>
              <p className="text-gray-500 text-sm">
                An annual celebration of all things bubbles
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="thanksgiving"
                checked={formData.selectedEvents.thanksgiving}
                onChange={(e) => updateEventSelection('thanksgiving', e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="thanksgiving" className="font-medium text-gray-700">
                Thanksgiving Uncorked
              </label>
              <p className="text-gray-500 text-sm">
                Come celebrate and get your holiday wine
              </p>
            </div>
          </div>
        </div>

        <SavingsTally />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md text-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-primary text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-colors"
          >
            Next: Wine Tastings
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventsForm; 