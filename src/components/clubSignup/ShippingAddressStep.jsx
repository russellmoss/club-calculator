import React from 'react';

const ShippingAddressStep = ({ formData, updateFormData, onBack, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const key = name.replace('shipping', '').toLowerCase();
    console.log(`Updating shipping ${key}:`, value);
    
    // Special handling for state code
    if (key === 'statecode') {
      // Convert full state name to two-letter code if needed
      const stateCode = value.length > 2 ? stateNameToCode(value) : value.toUpperCase();
      console.log('Converted state code:', stateCode);
      updateFormData(`shipping${key.charAt(0).toUpperCase() + key.slice(1)}`, stateCode);
    } else {
      updateFormData(`shipping${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
    }
  };

  // Add state name to code mapping function
  const stateNameToCode = (stateName) => {
    const stateMap = {
      'Alabama': 'AL',
      'Alaska': 'AK',
      'Arizona': 'AZ',
      'Arkansas': 'AR',
      'California': 'CA',
      'Colorado': 'CO',
      'Connecticut': 'CT',
      'Delaware': 'DE',
      'Florida': 'FL',
      'Georgia': 'GA',
      'Hawaii': 'HI',
      'Idaho': 'ID',
      'Illinois': 'IL',
      'Indiana': 'IN',
      'Iowa': 'IA',
      'Kansas': 'KS',
      'Kentucky': 'KY',
      'Louisiana': 'LA',
      'Maine': 'ME',
      'Maryland': 'MD',
      'Massachusetts': 'MA',
      'Michigan': 'MI',
      'Minnesota': 'MN',
      'Mississippi': 'MS',
      'Missouri': 'MO',
      'Montana': 'MT',
      'Nebraska': 'NE',
      'Nevada': 'NV',
      'New Hampshire': 'NH',
      'New Jersey': 'NJ',
      'New Mexico': 'NM',
      'New York': 'NY',
      'North Carolina': 'NC',
      'North Dakota': 'ND',
      'Ohio': 'OH',
      'Oklahoma': 'OK',
      'Oregon': 'OR',
      'Pennsylvania': 'PA',
      'Rhode Island': 'RI',
      'South Carolina': 'SC',
      'South Dakota': 'SD',
      'Tennessee': 'TN',
      'Texas': 'TX',
      'Utah': 'UT',
      'Vermont': 'VT',
      'Virginia': 'VA',
      'Washington': 'WA',
      'West Virginia': 'WV',
      'Wisconsin': 'WI',
      'Wyoming': 'WY',
      'District of Columbia': 'DC'
    };
    return stateMap[stateName] || stateName;
  };

  const handleUseBillingAddress = (e) => {
    const useBilling = e.target.checked;
    updateFormData({
      sameAsBilling: useBilling,
      // Clear shipping address fields if using billing address
      ...(useBilling ? {
        shippingFirstName: '',
        shippingLastName: '',
        shippingAddress: '',
        shippingAddress2: '',
        shippingCity: '',
        shippingState: '',
        shippingZip: '',
        shippingCountry: 'US'
      } : {})
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="useBillingAddress"
          checked={formData.sameAsBilling}
          onChange={handleUseBillingAddress}
          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="useBillingAddress" className="text-base font-medium text-gray-900">
          Use billing address for shipping
        </label>
      </div>

      {!formData.sameAsBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="shippingFirstName" className="block text-base font-medium text-gray-900 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="shippingFirstName"
              name="shippingFirstName"
              value={formData.shippingFirstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label htmlFor="shippingLastName" className="block text-base font-medium text-gray-900 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="shippingLastName"
              name="shippingLastName"
              value={formData.shippingLastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Enter last name"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="shippingAddress" className="block text-base font-medium text-gray-900 mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Enter street address"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="shippingAddress2" className="block text-base font-medium text-gray-900 mb-2">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              id="shippingAddress2"
              name="shippingAddress2"
              value={formData.shippingAddress2}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Enter apartment or suite number"
            />
          </div>

          <div>
            <label htmlFor="shippingCity" className="block text-base font-medium text-gray-900 mb-2">
              City
            </label>
            <input
              type="text"
              id="shippingCity"
              name="shippingCity"
              value={formData.shippingCity}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label htmlFor="shippingState" className="block text-base font-medium text-gray-900 mb-2">
              State
            </label>
            <input
              type="text"
              id="shippingState"
              name="shippingState"
              value={formData.shippingState}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label htmlFor="shippingZip" className="block text-base font-medium text-gray-900 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              id="shippingZip"
              name="shippingZip"
              value={formData.shippingZip}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Enter ZIP code"
            />
          </div>

          <div>
            <label htmlFor="shippingCountry" className="block text-base font-medium text-gray-900 mb-2">
              Country
            </label>
            <input
              type="text"
              id="shippingCountry"
              name="shippingCountry"
              value={formData.shippingCountry}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Enter country"
            />
          </div>
        </div>
      )}

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
          Next: Terms & Submit
        </button>
      </div>
    </form>
  );
};

export default ShippingAddressStep; 