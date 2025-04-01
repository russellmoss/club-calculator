import React from 'react';

const ShippingAddressStep = ({ formData, updateFormData, onBack, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      shippingAddress: {
        ...formData.shippingAddress,
        [name]: value,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      }
    });
  };

  const handleUseBillingAddress = (e) => {
    const useBilling = e.target.checked;
    updateFormData({
      useShippingAsBilling: useBilling,
      shippingAddress: useBilling ? { ...formData.billingAddress } : {
        ...formData.shippingAddress,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="useBillingAddress"
          checked={formData.useShippingAsBilling}
          onChange={handleUseBillingAddress}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="useBillingAddress" className="ml-2 block text-sm text-gray-700">
          Use billing address for shipping
        </label>
      </div>

      {!formData.useShippingAsBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              id="shippingAddress"
              name="address"
              value={formData.shippingAddress.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="shippingAddress2" className="block text-sm font-medium text-gray-700">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              id="shippingAddress2"
              name="address2"
              value={formData.shippingAddress.address2}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="shippingCity"
              name="city"
              value={formData.shippingAddress.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="shippingState"
              name="stateCode"
              value={formData.shippingAddress.stateCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="shippingZip" className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              type="text"
              id="shippingZip"
              name="zipCode"
              value={formData.shippingAddress.zipCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

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
          Next: Terms & Submit
        </button>
      </div>
    </form>
  );
};

export default ShippingAddressStep; 