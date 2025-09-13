import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateSavings } from '../utils/calculatorUtils';

const CalculatorContext = createContext();

export const CalculatorProvider = ({ children }) => {
  // State declarations
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    monthlyBottles: 0,
    averageBottlePrice: 0,
    annualEvents: 0,
    annualTastings: 0,
    culinarySeries: 0,
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
  
  const [savings, setSavings] = useState({
    tripleCrown: 0,
    grandPrix: 0,
    jumper: 0
  });

  const [displayedSavings, setDisplayedSavings] = useState({
    tripleCrown: 0,
    grandPrix: 0,
    jumper: 0
  });

  const [selectedTier, setSelectedTier] = useState(null);

  const calculateSavingsForAllTiers = useCallback(() => {
    // Base savings - wine discounts
    let tripleCrownTotal = 260; // Base wine savings 
    let grandPrixTotal = 150;  // Base wine savings
    let jumperTotal = 76;     // Base wine savings
    
    // Food discounts (Triple Crown only)
    tripleCrownTotal += 30;
    
    // Calculate event savings
    if (formData.selectedEvents.culinarySeries) {
      tripleCrownTotal += 35;
      grandPrixTotal += 35;
      jumperTotal += 35;
    }
    
    if (formData.selectedEvents.pickupParties) {
      tripleCrownTotal += 35;
      grandPrixTotal += 35;
      jumperTotal += 35;
    }
    
    if (formData.selectedEvents.roseDay) {
      tripleCrownTotal += 35;
      grandPrixTotal += 35;
      jumperTotal += 35;
    }
    
    if (formData.selectedEvents.fizzFest) {
      tripleCrownTotal += 35;
      grandPrixTotal += 35;
      jumperTotal += 35;
    }
    
    if (formData.selectedEvents.thanksgiving) {
      tripleCrownTotal += 35;
      grandPrixTotal += 35;
      jumperTotal += 35;
    }
    
    // Calculate complimentary tastings savings
    const complimentarySavings = formData.complimentaryTastings * 25;
    tripleCrownTotal += complimentarySavings;
    grandPrixTotal += complimentarySavings;
    jumperTotal += complimentarySavings;
    
    setSavings({
      tripleCrown: tripleCrownTotal,
      grandPrix: grandPrixTotal,
      jumper: jumperTotal
    });
  }, [formData]);

  // Calculate savings whenever form data changes
  useEffect(() => {
    calculateSavingsForAllTiers();
  }, [calculateSavingsForAllTiers]);

  // Animate savings display
  useEffect(() => {
    // If we're on the first step (Wine Consumption), keep savings at 0
    if (currentStep === 0) {
      setDisplayedSavings({
        tripleCrown: 0,
        grandPrix: 0,
        jumper: 0
      });
      return;
    }

    const duration = 1500; // milliseconds
    const steps = 50;
    const interval = duration / steps;
    
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setDisplayedSavings({
        tripleCrown: Math.round(progress * savings.tripleCrown),
        grandPrix: Math.round(progress * savings.grandPrix),
        jumper: Math.round(progress * savings.jumper)
      });
      
      if (step === steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [savings, currentStep]);

  // Reset calculator state when component mounts
  useEffect(() => {
    resetCalculator();
  }, []);

  // Update form data
  const updateFormData = (data) => {
    setFormData(prevState => ({
      ...prevState,
      ...data
    }));
  };

  const updateEventSelection = (eventName, isSelected) => {
    setFormData(prevState => ({
      ...prevState,
      selectedEvents: {
        ...prevState.selectedEvents,
        [eventName]: isSelected
      }
    }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const goToStep = (step) => setCurrentStep(step);

  const resetCalculator = () => {
    setCurrentStep(0);
    setFormData({
      monthlyBottles: 0,
      averageBottlePrice: 0,
      annualEvents: 0,
      annualTastings: 0,
      culinarySeries: 0,
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
    setSavings({
      tripleCrown: 0,
      grandPrix: 0,
      jumper: 0
    });
    setDisplayedSavings({
      tripleCrown: 0,
      grandPrix: 0,
      jumper: 0
    });
  };

  const getRecommendedTier = () => {
    const { tripleCrown, grandPrix, jumper } = savings;
    if (tripleCrown >= grandPrix && tripleCrown >= jumper) return 'Triple Crown';
    if (grandPrix >= tripleCrown && grandPrix >= jumper) return 'Grand Prix';
    return 'Jumper';
  };

  const value = {
    currentStep,
    formData,
    savings: displayedSavings,
    updateFormData,
    updateEventSelection,
    nextStep,
    prevStep,
    goToStep,
    resetCalculator,
    getRecommendedTier
  };

  return (
    <CalculatorContext.Provider value={value}>
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