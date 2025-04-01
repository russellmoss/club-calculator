import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import ClubSignupForm from './ClubSignupForm';

const ClubSelectionPage = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Club IDs:', {
      tripleCrown: process.env.REACT_APP_CLUB_TRIPLE_CROWN_ID,
      grandPrix: process.env.REACT_APP_CLUB_GRAND_PRIX_ID,
      jumper: process.env.REACT_APP_CLUB_JUMPER_ID
    });
  }, []);
  
  const handleJoinClub = (clubId) => {
    console.log('Joining club:', clubId);
    setSelectedClub(clubId);
    setShowSignupModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6 text-center">Choose Your Wine Club Tier</h2>
      <p className="text-gray-600 text-center mb-8">Select the club tier that best fits your wine preferences and lifestyle.</p>
      
      {/* Triple Crown */}
      <div className="mb-6 p-6 rounded-lg border-2 border-primary bg-primary/5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-darkBrown">Triple Crown</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Value</div>
            <div className="text-2xl font-bold text-primary">$1,200+</div>
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
        
        <button
          onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_TRIPLE_CROWN_ID)}
          className="w-full bg-primary text-white py-4 px-6 rounded-md text-lg font-medium hover:bg-darkBrownHover transition-colors"
        >
          Join Triple Crown
        </button>
      </div>
      
      {/* Grand Prix */}
      <div className="mb-6 p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-darkBrown">Grand Prix</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Value</div>
            <div className="text-2xl font-bold text-primary">$600+</div>
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
        
        <button
          onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_GRAND_PRIX_ID)}
          className="w-full bg-white text-primary border-2 border-primary py-3 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Join Grand Prix
        </button>
      </div>
      
      {/* Jumper */}
      <div className="mb-6 p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-darkBrown">Jumper</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Value</div>
            <div className="text-2xl font-bold text-primary">$400+</div>
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
        
        <button
          onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_JUMPER_ID)}
          className="w-full bg-white text-primary border-2 border-primary py-3 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Join Jumper
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <a 
          href="https://mileaestatevineyard.com/wine-club/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Learn more about the clubs
        </a>
      </div>
      
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

export default ClubSelectionPage; 