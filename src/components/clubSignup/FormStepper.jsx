import React from 'react';

const FormStepper = ({ currentStep, totalSteps }) => {
  return (
    <div className="form-stepper">
      <div className="steps">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div 
            key={index}
            className={`step ${index <= currentStep ? 'active' : ''}`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormStepper; 