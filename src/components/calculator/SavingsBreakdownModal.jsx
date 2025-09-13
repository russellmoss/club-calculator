import React from 'react';
import { FaTimes } from 'react-icons/fa';

const SavingsBreakdownModal = ({ isOpen, onClose, tier, formData, savings }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateEventSavings = () => {
    let total = 0;
    const eventSavings = [];

    if (formData.selectedEvents.culinarySeries) {
      const amount = tier === 'Triple Crown' ? 140 : 70;
      total += amount;
      eventSavings.push({
        name: 'Culinary Series',
        amount,
        description: 'Annual savings on culinary events'
      });
    }

    if (formData.selectedEvents.pickupParties) {
      const amount = tier === 'Triple Crown' ? 560 : 280;
      total += amount;
      eventSavings.push({
        name: 'Pickup Parties',
        amount,
        description: 'Quarterly celebration savings'
      });
    }

    if (formData.selectedEvents.roseDay) {
      const amount = tier === 'Triple Crown' ? 140 : 70;
      total += amount;
      eventSavings.push({
        name: 'Rosé Day',
        amount,
        description: 'Annual rosé celebration savings'
      });
    }

    if (formData.selectedEvents.fizzFest) {
      const amount = tier === 'Triple Crown' ? 140 : 70;
      total += amount;
      eventSavings.push({
        name: 'Fizz Fest',
        amount,
        description: 'Annual bubbles celebration savings'
      });
    }

    if (formData.selectedEvents.thanksgiving) {
      const amount = tier === 'Triple Crown' ? 140 : 70;
      total += amount;
      eventSavings.push({
        name: 'Thanksgiving Uncorked',
        amount,
        description: 'Holiday celebration savings'
      });
    }

    return { total, eventSavings };
  };

  const calculateWineSavings = () => {
    // For Triple Crown, show fixed $260 savings
    if (tier === 'Triple Crown') {
      return {
        annualBottles: 48,
        annualSpend: 1733, // $260 is 15% of $1733
        savings: 260,
        description: '15% discount on 48 bottles annually'
      };
    }
    
    // For Grand Prix, show fixed $150 savings
    if (tier === 'Grand Prix') {
      return {
        annualBottles: 24,
        annualSpend: 1000, // $150 is 15% of $1000
        savings: 150,
        description: '15% discount on 24 bottles annually'
      };
    }
    
    // For Jumper, show fixed $76 savings
    if (tier === 'Jumper') {
      return {
        annualBottles: 16,
        annualSpend: 760, // $76 is 10% of $760
        savings: 76,
        description: '10% discount on 16 bottles annually'
      };
    }
    
    // Fallback (should not be reached)
    return {
      annualBottles: 0,
      annualSpend: 0,
      savings: 0,
      description: 'No wine savings'
    };
  };

  const calculateTastingSavings = () => {
    // Only include quarterly tasting savings for Grand Prix and Triple Crown tiers
    if ((tier === 'Grand Prix' || tier === 'Triple Crown') && formData.useQuarterlyTastings) {
      const tastingsPerQuarter = 4; // Quarterly tastings
      const pricePerTasting = 25; // $25 per tasting
      const annualSavings = tastingsPerQuarter * pricePerTasting;
      
      return {
        savings: annualSavings,
        description: 'Free quarterly tastings (4 per year)'
      };
    }
    
    return {
      savings: 0,
      description: 'No free tasting savings'
    };
  };

  const calculateMileaMilesSavings = () => {
    const freeTastingsPerYear = formData.complimentaryTastings || 0;
    const pricePerTasting = 25; // $25 per tasting
    const annualSavings = freeTastingsPerYear * pricePerTasting;
    
    return {
      savings: annualSavings,
      description: `Free tastings for friends and family (${freeTastingsPerYear} per year)`
    };
  };

  const eventBreakdown = calculateEventSavings();
  const wineBreakdown = calculateWineSavings();
  const tastingBreakdown = calculateTastingSavings();
  const mileaMilesBreakdown = calculateMileaMilesSavings();
  
  // Use the savings value from the main page to ensure consistency
  const totalSavings = savings[tier === 'Triple Crown' ? 'tripleCrown' : tier === 'Grand Prix' ? 'grandPrix' : 'jumper'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-gilda text-primary">
              {tier} Club Savings Breakdown
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Wine Savings Section */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Wine Purchase Savings</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  {wineBreakdown.description}
                </p>
                <div className="flex justify-between text-gray-700">
                  <span>Annual Wine Spend:</span>
                  <span>{formatCurrency(wineBreakdown.annualSpend)}</span>
                </div>
                <div className="flex justify-between text-primary font-medium">
                  <span>Annual Wine Savings:</span>
                  <span>{formatCurrency(wineBreakdown.savings)}</span>
                </div>
              </div>
            </div>

            {/* Tasting Savings Section */}
            {tastingBreakdown.savings > 0 && (
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Wine Tasting Savings</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    {tastingBreakdown.description}
                  </p>
                  <div className="flex justify-between text-primary font-medium">
                    <span>Annual Tasting Savings:</span>
                    <span>{formatCurrency(tastingBreakdown.savings)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Milea Miles Savings Section */}
            {mileaMilesBreakdown.savings > 0 && (
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Milea Miles Savings</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    {mileaMilesBreakdown.description}
                  </p>
                  <div className="flex justify-between text-primary font-medium">
                    <span>Annual Milea Miles Savings:</span>
                    <span>{formatCurrency(mileaMilesBreakdown.savings)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Events Savings Section */}
            {eventBreakdown.eventSavings.length > 0 && (
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Event Savings</h3>
                <div className="space-y-4">
                  {eventBreakdown.eventSavings.map((event, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-gray-700">
                        <span>{event.name}</span>
                        <span>{formatCurrency(event.amount)}</span>
                      </div>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Savings */}
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Annual Savings</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalSavings)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsBreakdownModal; 