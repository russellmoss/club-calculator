import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateSavings } from '../utils/calculatorUtils';

const CalculatorContext = createContext();

export const CalculatorProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    bottlesPerMonth: 0,
    giftBottlesPerYear: 0,
    selectedEvents: {
      culinarySeries: false,
      pickupParties: false,
      roseDay: false,
      fizzFest: false,
      thanksgiving: false
    },
    useQuarterlyTastings: false,
    complimentaryTastings: 0
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [savings, setSavings] = useState({
    tripleCrown: 0,
    grandPrix: 0,
    jumper: 0
  });

  // Calculate savings whenever form data changes
  useEffect(() => {
    const newSavings = calculateSavings(formData);
    setSavings(newSavings);
  }, [formData]);

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateEventSelection = (eventName, isSelected) => {
    setFormData(prev => ({
      ...prev,
      selectedEvents: {
        ...prev.selectedEvents,
        [eventName]: isSelected
      }
    }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const goToStep = (step) => setCurrentStep(step);

  const resetCalculator = () => {
    setFormData({
      bottlesPerMonth: 0,
      giftBottlesPerYear: 0,
      selectedEvents: {
        culinarySeries: false,
        pickupParties: false,
        roseDay: false,
        fizzFest: false,
        thanksgiving: false
      },
      useQuarterlyTastings: false,
      complimentaryTastings: 0
    });
    setCurrentStep(0);
  };

  const getRecommendedTier = () => {
    const maxSavings = Math.max(savings.tripleCrown, savings.grandPrix, savings.jumper);
    if (maxSavings === savings.tripleCrown) return 'tripleCrown';
    if (maxSavings === savings.grandPrix) return 'grandPrix';
    return 'jumper';
  };

  return (
    <CalculatorContext.Provider
      value={{
        formData,
        currentStep,
        savings,
        updateFormData,
        updateEventSelection,
        nextStep,
        prevStep,
        goToStep,
        resetCalculator,
        getRecommendedTier
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}; 