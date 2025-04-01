import React from 'react';

const AllocationReceivalStep = ({ formData, updateFormData, onBack, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleDeliveryMethodChange = (e) => {
    const { value } = e.target;
    updateFormData({ orderDeliveryMethod: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocation Receival</h2>
        <p className="text-gray-600 mb-8">Choose how you would like to receive your wine club allocations.</p>

        <div className="space-y-6">
          <label 
            htmlFor="delivery-pickup"
            className={`flex items-center p-6 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.orderDeliveryMethod === 'Pickup'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary'
            }`}
          >
            <input
              type="radio"
              id="delivery-pickup"
              name="orderDeliveryMethod"
              value="Pickup"
              checked={formData.orderDeliveryMethod === 'Pickup'}
              onChange={handleDeliveryMethodChange}
              className="h-5 w-5 text-primary border-gray-300 focus:ring-primary"
            />
            <div className="ml-4">
              <div className="text-base font-medium text-gray-900">
                Pickup at Winery
              </div>
              <p className="text-gray-500 mt-1">
                Pick up your allocations at our winery location. No shipping fees.
              </p>
            </div>
          </label>

          <label 
            htmlFor="delivery-ship"
            className={`flex items-center p-6 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.orderDeliveryMethod === 'Ship'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary'
            }`}
          >
            <input
              type="radio"
              id="delivery-ship"
              name="orderDeliveryMethod"
              value="Ship"
              checked={formData.orderDeliveryMethod === 'Ship'}
              onChange={handleDeliveryMethodChange}
              className="h-5 w-5 text-primary border-gray-300 focus:ring-primary"
            />
            <div className="ml-4">
              <div className="text-base font-medium text-gray-900">
                Ship to Address
              </div>
              <p className="text-gray-500 mt-1">
                Have your allocations shipped to your address. Flat rate shipping fee of $20 per shipment.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-darkBrownHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Next: Terms & Submit
        </button>
      </div>
    </form>
  );
};

export default AllocationReceivalStep; 