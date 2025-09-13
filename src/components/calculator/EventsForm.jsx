import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import SavingsTally from './SavingsTally';
import { FaCheck } from 'react-icons/fa';

const EventsForm = () => {
  const { formData, updateEventSelection, currentStep, nextStep, prevStep } = useCalculator();

  if (currentStep !== 1) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleEventClick = (eventName) => {
    updateEventSelection(eventName, !formData.selectedEvents[eventName]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6">Events & Activities</h2>
      <p className="text-gray-600 mb-8">Select the events you're interested in attending.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Culinary Series Card */}
          <div 
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              formData.selectedEvents.culinarySeries 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => handleEventClick('culinarySeries')}
          >
            {formData.selectedEvents.culinarySeries && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                <FaCheck size={12} />
              </div>
            )}
            <h3 className="font-medium text-gray-900 mb-1">Culinary Series</h3>
            <p className="text-gray-500 text-sm">
              Spectacular special dinners with our Executive Chefs and guests
            </p>
          </div>

          {/* Pickup Parties Card */}
          <div 
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              formData.selectedEvents.pickupParties 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => handleEventClick('pickupParties')}
          >
            {formData.selectedEvents.pickupParties && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                <FaCheck size={12} />
              </div>
            )}
            <h3 className="font-medium text-gray-900 mb-1">Pickup Parties</h3>
            <p className="text-gray-500 text-sm">
              Quarterly celebrations with food, wine, and live music
            </p>
          </div>

          {/* Rosé Day Card */}
          <div 
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              formData.selectedEvents.roseDay 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => handleEventClick('roseDay')}
          >
            {formData.selectedEvents.roseDay && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                <FaCheck size={12} />
              </div>
            )}
            <h3 className="font-medium text-gray-900 mb-1">Rosé Day</h3>
            <p className="text-gray-500 text-sm">
              A celebration of all things rosé
            </p>
          </div>

          {/* Fizz Fest Card */}
          <div 
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              formData.selectedEvents.fizzFest 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => handleEventClick('fizzFest')}
          >
            {formData.selectedEvents.fizzFest && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                <FaCheck size={12} />
              </div>
            )}
            <h3 className="font-medium text-gray-900 mb-1">Fizz Fest</h3>
            <p className="text-gray-500 text-sm">
              An annual celebration of all things bubbles
            </p>
          </div>

          {/* Thanksgiving Card */}
          <div 
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              formData.selectedEvents.thanksgiving 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => handleEventClick('thanksgiving')}
          >
            {formData.selectedEvents.thanksgiving && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                <FaCheck size={12} />
              </div>
            )}
            <h3 className="font-medium text-gray-900 mb-1">Thanksgiving Uncorked</h3>
            <p className="text-gray-500 text-sm">
              Come celebrate and get your holiday wine
            </p>
          </div>
        </div>

        <SavingsTally />

        <div className="flex justify-between mt-8">
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
            Next: Wine Tastings
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventsForm; 