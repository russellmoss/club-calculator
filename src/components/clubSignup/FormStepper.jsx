import React from 'react';

const FormStepper = ({ steps, activeStep }) => {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${
                index <= activeStep
                  ? 'bg-primary text-white scale-110 shadow-lg'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`mt-2 text-sm transition-colors duration-300 ${
                index <= activeStep ? 'text-primary font-medium' : 'text-gray-500'
              }`}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-4">
        <div className="absolute top-0 left-0 h-0.5 bg-gray-200 w-full"></div>
        <div
          className="absolute top-0 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out"
          style={{
            width: `${((activeStep + 1) / steps.length) * 100}%`
          }}
        ></div>
      </div>
    </div>
  );
};

export default FormStepper; 