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
        [name]: value,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <input
            type="text"
            id="billingAddress"
            name="address"
            value={formData.billingAddress.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="billingAddress2" className="block text-sm font-medium text-gray-700">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            id="billingAddress2"
            name="address2"
            value={formData.billingAddress.address2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="billingCity"
            name="city"
            value={formData.billingAddress.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="billingState" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id="billingState"
            name="stateCode"
            value={formData.billingAddress.stateCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            type="text"
            id="billingZip"
            name="zipCode"
            value={formData.billingAddress.zipCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next: Shipping Address
        </button>
      </div>
    </form>
  );
};

export default BillingAddressStep; 