import React, { useState, useEffect } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import Modal from '../common/Modal';
import ClubSignupForm from '../clubSignup/ClubSignupForm';
import SavingsBreakdownModal from './SavingsBreakdownModal';

const ResultsPage = () => {
  const { formData, savings, resetCalculator, prevStep } = useCalculator();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [animatedSavings, setAnimatedSavings] = useState({
    tripleCrown: 0,
    grandPrix: 0,
    jumper: 0
  });
  const [selectedTier, setSelectedTier] = useState(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // Start animation immediately
    setAnimationStarted(true);
    
    const duration = 1500; // milliseconds
    const steps = 50;
    const interval = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedSavings({
        tripleCrown: Math.round(progress * savings.tripleCrown),
        grandPrix: Math.round(progress * savings.grandPrix),
        jumper: Math.round(progress * savings.jumper)
      });
      
      if (currentStep === steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [savings]);
  
  const handleJoinClub = (clubId) => {
    setSelectedClub(clubId);
    setShowSignupModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleJoinClick = (tier) => {
    // Handle join button click
    console.log(`Joining ${tier} tier`);
  };

  const handleCheckMathClick = (tier) => {
    setSelectedTier(tier);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6 text-center">Your Potential Annual Savings</h2>
      
      {/* Triple Crown */}
      <div className="mb-6 p-6 rounded-lg border-2 border-primary bg-background hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-primary">Triple Crown</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Savings</div>
            <div className="text-2xl font-bold text-primary">
              {animationStarted ? `$${animatedSavings.tripleCrown}` : `$${savings.tripleCrown}`}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Club Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">12 bottles per shipment (4x/year)</li>
            <li className="text-sm">15% off all Milea wines</li>
            <li className="text-sm">15% off Milea accommodations</li>
            <li className="text-sm">15% off Milea Local & Seasonal plates</li>
            <li className="text-sm">Reciprocal membership with Hudson Valley Vineyards</li>
            <li className="text-sm">Fully customizable shipments</li>
            <li className="text-sm">Access to exclusive club-only events</li>
            <li className="text-sm">Free quarterly tastings for member + 3 guests</li>
          </ul>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_TRIPLE_CROWN_ID)}
            className="w-full bg-primary text-white py-4 px-6 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-all duration-200 hover:shadow-md"
          >
            Join Triple Crown
          </button>
          <button
            onClick={() => handleCheckMathClick('Triple Crown')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200"
          >
            Check our math
          </button>
        </div>
      </div>
      
      {/* Grand Prix */}
      <div className="mb-6 p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-darkBrown">Grand Prix</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Savings</div>
            <div className="text-2xl font-bold text-primary">
              {animationStarted ? `$${animatedSavings.grandPrix}` : `$${savings.grandPrix}`}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Club Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">6 bottles per shipment (4x/year)</li>
            <li className="text-sm">15% off all Milea wines</li>
            <li className="text-sm">Fully customizable shipments</li>
            <li className="text-sm">Access to exclusive club-only events</li>
            <li className="text-sm">Free quarterly tastings for member + 3 guests</li>
          </ul>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_GRAND_PRIX_ID)}
            className="w-full bg-primary text-white py-4 px-6 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-all duration-200 hover:shadow-md"
          >
            Join Grand Prix
          </button>
          <button
            onClick={() => handleCheckMathClick('Grand Prix')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200"
          >
            Check our math
          </button>
        </div>
      </div>
      
      {/* Jumper */}
      <div className="mb-6 p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-darkBrown">Jumper</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Savings</div>
            <div className="text-2xl font-bold text-primary">
              {animationStarted ? `$${animatedSavings.jumper}` : `$${savings.jumper}`}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Club Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">4 bottles per shipment (4x/year)</li>
            <li className="text-sm">10% off all Milea wines</li>
            <li className="text-sm">Curated selection</li>
            <li className="text-sm">Access to exclusive club-only events</li>
          </ul>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_JUMPER_ID)}
            className="w-full bg-primary text-white py-4 px-6 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-all duration-200 hover:shadow-md"
          >
            Join Jumper
          </button>
          <button
            onClick={() => handleCheckMathClick('Jumper')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200"
          >
            Check our math
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <a 
          href="https://mileaestatevineyard.com/wine-club/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium transition-colors duration-200"
        >
          Learn more about the clubs
        </a>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={prevStep}
          className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md text-lg font-medium hover:bg-gray-300 transition-all duration-200 hover:shadow-md"
        >
          Back
        </button>
      </div>

      <SavingsBreakdownModal
        isOpen={selectedTier !== null}
        onClose={() => setSelectedTier(null)}
        tier={selectedTier}
        formData={formData}
        savings={savings}
      />
      
      {/* Modal for club signup */}
      {showSignupModal && (
        <Modal 
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          title="Join Milea Wine Club"
        >
          <ClubSignupForm 
            clubId={selectedClub} 
            onClose={() => setShowSignupModal(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

export default ResultsPage; 