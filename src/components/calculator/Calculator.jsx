import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import ConsumptionForm from './ConsumptionForm';
import TastingsForm from './TastingsForm';
import EventsForm from './EventsForm';
import FormStepper from './FormStepper';
import useIdleTimer from '../../hooks/useIdleTimer';

const Calculator = () => {
  const { currentStep, resetCalculator } = useCalculator();

  const handleIdle = () => {
    console.log('Calculator idle, resetting...');
    resetCalculator();
  };

  useIdleTimer(handleIdle, 180000); // 3 minutes in milliseconds

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-gilda text-primary mb-4">Wine Club Savings Calculator</h1>
          <p className="text-xl text-gray-600">Calculate your potential savings with Milea Wine Club membership</p>
        </div>

        <FormStepper />

        {currentStep === 0 && <ConsumptionForm />}
        {currentStep === 1 && <TastingsForm />}
        {currentStep === 2 && <EventsForm />}
      </div>
    </div>
  );
};

export default Calculator; 