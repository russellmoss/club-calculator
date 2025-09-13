import React, { useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useCalculator } from '../../contexts/CalculatorContext';
import ConsumptionForm from './ConsumptionForm';
import EventsForm from './EventsForm';
import TastingsForm from './TastingsForm';
import ResultsPage from './ResultsPage';

const CalculatorFlow = () => {
  const { currentStep, resetCalculator } = useCalculator();

  // Reset calculator when component mounts
  useEffect(() => {
    resetCalculator();
  }, [resetCalculator]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ConsumptionForm />;
      case 1:
        return <EventsForm />;
      case 2:
        return <TastingsForm />;
      case 3:
        return <ResultsPage />;
      default:
        return <ConsumptionForm />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto w-full">
        <TransitionGroup>
          <CSSTransition
            key={currentStep}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div className="w-full">
              {renderStep()}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default CalculatorFlow; 