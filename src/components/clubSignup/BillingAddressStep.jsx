import React from 'react';

const BillingAddressStep = ({ formData, updateFormData, onBack, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      billingAddress: {
        ...formData.billingAddress,
        [name]: value
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <label htmlFor="billingAddress" className="block text-base font-medium text-gray-900 mb-2">
            Street Address
          </label>
          <input
            type="text"
            id="billingAddress"
            name="address"
            value={formData.billingAddress.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter your street address"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="billingAddress2" className="block text-base font-medium text-gray-900 mb-2">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            id="billingAddress2"
            name="address2"
            value={formData.billingAddress.address2}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter apartment or suite number"
          />
        </div>

        <div>
          <label htmlFor="billingCity" className="block text-base font-medium text-gray-900 mb-2">
            City
          </label>
          <input
            type="text"
            id="billingCity"
            name="city"
            value={formData.billingAddress.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter your city"
          />
        </div>

        <div>
          <label htmlFor="billingState" className="block text-base font-medium text-gray-900 mb-2">
            State
          </label>
          <input
            type="text"
            id="billingState"
            name="stateCode"
            value={formData.billingAddress.stateCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter your state"
          />
        </div>

        <div>
          <label htmlFor="billingZip" className="block text-base font-medium text-gray-900 mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            id="billingZip"
            name="zipCode"
            value={formData.billingAddress.zipCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter your ZIP code"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 text-base font-medium text-white bg-primary border border-transparent rounded-md hover:bg-darkBrownHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Next: Shipping Address
        </button>
      </div>
    </form>
  );
};

export default BillingAddressStep; 