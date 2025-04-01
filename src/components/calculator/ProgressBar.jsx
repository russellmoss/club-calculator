import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="progress-bar">
      <div 
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar; 