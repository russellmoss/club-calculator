import React from 'react';

const FormStepper = ({ steps, activeStep }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center mb-4 sm:mb-0">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index <= activeStep
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 text-gray-500'
            }`}>
              {index + 1}
            </div>
            <div className="ml-3">
              <div className={`text-sm font-medium ${
                index <= activeStep ? 'text-primary' : 'text-gray-500'
              }`}>
                {step}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden sm:block h-0.5 w-8 bg-gray-300 mt-2" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormStepper; 