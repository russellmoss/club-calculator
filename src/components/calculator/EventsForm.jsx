import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import Button from '../common/Button';

const EventsForm = () => {
  const { formData, updateEventSelection, currentStep, nextStep, prevStep } = useCalculator();

  if (currentStep !== 1) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const events = [
    {
      id: 'culinarySeries',
      name: 'Culinary Series Dinners',
      description: 'Enjoy exclusive wine-paired dinners with our chef'
    },
    {
      id: 'pickupParties',
      name: 'Pickup Parties',
      description: 'Quarterly events to pick up your wine shipments'
    },
    {
      id: 'roseDay',
      name: 'Rosé Day Celebration',
      description: 'Annual celebration of our rosé wines'
    },
    {
      id: 'fizzFest',
      name: 'Fizz Fest',
      description: 'Sparkling wine tasting and celebration'
    },
    {
      id: 'thanksgiving',
      name: 'Thanksgiving Weekend',
      description: 'Special tastings and events during Thanksgiving'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6">Events & Activities</h2>
      <p className="text-gray-600 mb-8">Select the events and activities you're interested in.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={event.id}
                  checked={formData.selectedEvents[event.id]}
                  onChange={(e) => updateEventSelection(event.id, e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={event.id} className="font-medium text-gray-700">
                  {event.name}
                </label>
                <p className="text-gray-500 text-sm">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit">
            Next: Wine Tastings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventsForm; 