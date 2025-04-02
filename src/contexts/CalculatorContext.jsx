import React, { createContext, useContext, useState, useEffect } from 'react';
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
  
  const [savings, setSavings] = useState({});

  const [displayedSavings, setDisplayedSavings] = useState({
    tripleCrown: 0,
    grandPrix: 0,
    jumper: 0
  });

  const [selectedTier, setSelectedTier] = useState(null);

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

  const calculateSavingsForAllTiers = () => {
    // Base savings - wine discounts
    let tripleCrownTotal = 260; // Base wine savings 
    let grandPrixTotal = 150;  // Base wine savings
    let jumperTotal = 76;     // Base wine savings
    
    // Food discounts (Triple Crown only)
    tripleCrownTotal += 30;
    
    // Calculate event savings
    if (formData.selectedEvents.culinarySeries) {
      // $25 off each dinner, assuming at least two per year
      tripleCrownTotal += 50;
      grandPrixTotal += 50;
      jumperTotal += 50;
    }
    
    if (formData.selectedEvents.pickupParties) {
      // Two free tickets at $35 each for 4 parties
      const pickupSavings = 2 * 35 * 4;
      tripleCrownTotal += pickupSavings;
      grandPrixTotal += pickupSavings;
      jumperTotal += pickupSavings;
    }
    
    // Individual events
    const eventSavings = (event) => formData.selectedEvents[event] ? 2 * 35 : 0;
    
    tripleCrownTotal += eventSavings('roseDay');
    tripleCrownTotal += eventSavings('fizzFest');
    tripleCrownTotal += eventSavings('thanksgiving');
    
    grandPrixTotal += eventSavings('roseDay');
    grandPrixTotal += eventSavings('fizzFest');
    grandPrixTotal += eventSavings('thanksgiving');
    
    jumperTotal += eventSavings('roseDay');
    jumperTotal += eventSavings('fizzFest');
    jumperTotal += eventSavings('thanksgiving');
    
    // Quarterly tastings (Triple Crown and Grand Prix only)
    if (formData.useQuarterlyTastings) {
      const quarterlySavings = 100 * 4; // $100 per quarter × 4
      tripleCrownTotal += quarterlySavings;
      grandPrixTotal += quarterlySavings;
      // Jumper doesn't get quarterly tastings
    }
    
    // Complimentary tastings
    const complimentarySavings = formData.complimentaryTastings * 25;
    tripleCrownTotal += complimentarySavings;
    grandPrixTotal += complimentarySavings;
    jumperTotal += complimentarySavings;
    
    setSavings({
      tripleCrown: tripleCrownTotal,
      grandPrix: grandPrixTotal,
      jumper: jumperTotal
    });
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
    setSavings({});
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