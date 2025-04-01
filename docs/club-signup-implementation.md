I'll create a detailed markdown guide for building a React component to handle Commerce7 club membership sign-ups based on the provided script. This guide will walk through the step-by-step process, from collecting user information to submitting the membership to Commerce7.

# Commerce7 Club Membership Signup Form Implementation Guide

This guide outlines how to create a React component for a multi-step wine club membership signup process using Commerce7's API.

## Overview

Our signup form will follow these steps:
1. Customer information (name, email, phone, birthdate)
2. Billing address
3. Shipping address (with option to use billing address)
4. Terms acceptance and submission

The form will process memberships by either creating a new customer or updating an existing one based on the email address.

## Implementation Structure

```
ClubSignupForm/
├── components/
│   ├── CustomerInfoStep.jsx
│   ├── BillingAddressStep.jsx
│   ├── ShippingAddressStep.jsx
│   ├── TermsAndSubmitStep.jsx
│   ├── FormStepper.jsx
│   └── FormSuccess.jsx
├── hooks/
│   └── useCommerce7Api.js
└── ClubSignupForm.jsx
```

## Main Component Implementation

Let's start with the main component that will manage the multi-step form:

```jsx
import React, { useState } from 'react';
import CustomerInfoStep from './components/CustomerInfoStep';
import BillingAddressStep from './components/BillingAddressStep';
import ShippingAddressStep from './components/ShippingAddressStep';
import TermsAndSubmitStep from './components/TermsAndSubmitStep';
import FormStepper from './components/FormStepper';
import FormSuccess from './components/FormSuccess';
import useCommerce7Api from './hooks/useCommerce7Api';

const ClubSignupForm = ({ clubId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Customer info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    
    // Billing address
    billingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      address2: '',
      city: '',
      stateCode: '',
      zipCode: '',
      countryCode: 'US',
      phone: '',
      isDefault: true
    },
    
    // Shipping address
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      address2: '',
      city: '',
      stateCode: '',
      zipCode: '',
      countryCode: 'US',
      phone: '',
      isDefault: true
    },
    
    // Options
    useShippingAsBilling: false,
    orderDeliveryMethod: 'Ship', // 'Ship' or 'Pickup'
    termsAccepted: false
  });
  
  const { processClubSignup } = useCommerce7Api();
  
  // Update form data
  const updateFormData = (data) => {
    setFormData(prevState => ({
      ...prevState,
      ...data
    }));
  };
  
  // Handle next step
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If using billing as shipping, copy the data
      const submissionData = { ...formData };
      if (formData.useShippingAsBilling) {
        submissionData.shippingAddress = { ...formData.billingAddress };
      }
      
      // Process the signup
      await processClubSignup({
        ...submissionData,
        clubId
      });
      
      setSuccess(true);
      
    } catch (err) {
      setError(err.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };
  
  // Form steps
  const steps = [
    {
      label: 'Your Information',
      component: (
        <CustomerInfoStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={handleNext} 
        />
      )
    },
    {
      label: 'Billing Address',
      component: (
        <BillingAddressStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onBack={handleBack} 
          onNext={handleNext} 
        />
      )
    },
    {
      label: 'Shipping Address',
      component: (
        <ShippingAddressStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onBack={handleBack} 
          onNext={handleNext} 
        />
      )
    },
    {
      label: 'Terms & Submit',
      component: (
        <TermsAndSubmitStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onBack={handleBack} 
          onSubmit={handleSubmit} 
          loading={loading}
          error={error}
        />
      )
    }
  ];
  
  // Show success page if submission was successful
  if (success) {
    return <FormSuccess />;
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Wine Club Membership</h1>
      
      <FormStepper steps={steps.map(step => step.label)} activeStep={activeStep} />
      
      <div className="mt-8">
        {steps[activeStep].component}
      </div>
    </div>
  );
};

export default ClubSignupForm;
```

## Commerce7 API Hook

Let's implement the hook that will handle interactions with the Commerce7 API:

```jsx
// useCommerce7Api.js
import { useState } from 'react';
import axios from 'axios';

const useCommerce7Api = () => {
  const [loading, setLoading] = useState(false);
  
  /**
   * Process club signup by creating/updating customer and creating membership
   */
  const processClubSignup = async (formData) => {
    try {
      setLoading(true);
      
      // Call our backend endpoint that handles Commerce7 API calls
      const response = await axios.post('/api/club-signup', {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate
        },
        billingAddress: formData.billingAddress,
        shippingAddress: formData.shippingAddress,
        clubId: formData.clubId,
        orderDeliveryMethod: formData.orderDeliveryMethod
      });
      
      return response.data;
    } catch (error) {
      console.error('Club signup error:', error);
      throw new Error(error.response?.data?.message || 'Failed to process club signup');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    processClubSignup,
    loading
  };
};

export default useCommerce7Api;
```

## Individual Form Steps

### 1. Customer Information Step

```jsx
// CustomerInfoStep.jsx
import React from 'react';

const CustomerInfoStep = ({ formData, updateFormData, onNext }) => {
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Phone Number*</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Birth Date*</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default CustomerInfoStep;
```

### 2. Billing Address Step

```jsx
// BillingAddressStep.jsx
import React, { useState } from 'react';

const BillingAddressStep = ({ formData, updateFormData, onBack, onNext }) => {
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      billingAddress: {
        ...formData.billingAddress,
        [name]: value
      }
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    const address = formData.billingAddress;
    
    if (!address.firstName) newErrors.firstName = 'First name is required';
    if (!address.lastName) newErrors.lastName = 'Last name is required';
    if (!address.address) newErrors.address = 'Address is required';
    if (!address.city) newErrors.city = 'City is required';
    if (!address.stateCode) newErrors.stateCode = 'State is required';
    if (!address.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!address.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.billingAddress.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.billingAddress.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Address*</label>
          <input
            type="text"
            name="address"
            value={formData.billingAddress.address}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Address Line 2</label>
          <input
            type="text"
            name="address2"
            value={formData.billingAddress.address2}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">City*</label>
            <input
              type="text"
              name="city"
              value={formData.billingAddress.city}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">State*</label>
            <select
              name="stateCode"
              value={formData.billingAddress.stateCode}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              {/* Add all states here */}
              <option value="WY">Wyoming</option>
            </select>
            {errors.stateCode && (
              <p className="text-red-500 text-sm mt-1">{errors.stateCode}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code*</label>
            <input
              type="text"
              name="zipCode"
              value={formData.billingAddress.zipCode}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Phone Number*</label>
          <input
            type="tel"
            name="phone"
            value={formData.billingAddress.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default BillingAddressStep;
```

### 3. Shipping Address Step

```jsx
// ShippingAddressStep.jsx
import React, { useState, useEffect } from 'react';

const ShippingAddressStep = ({ formData, updateFormData, onBack, onNext }) => {
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      shippingAddress: {
        ...formData.shippingAddress,
        [name]: value
      }
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    updateFormData({ useShippingAsBilling: checked });
    
    if (checked) {
      // Use billing address for shipping
      updateFormData({
        shippingAddress: { ...formData.billingAddress }
      });
    }
  };
  
  const handleDeliveryMethodChange = (e) => {
    const { value } = e.target;
    updateFormData({ orderDeliveryMethod: value });
  };
  
  const validateForm = () => {
    // If pickup selected, no need to validate shipping address
    if (formData.orderDeliveryMethod === 'Pickup') {
      return true;
    }
    
    // If using billing address for shipping, no need to validate
    if (formData.useShippingAsBilling) {
      return true;
    }
    
    const newErrors = {};
    const address = formData.shippingAddress;
    
    if (!address.firstName) newErrors.firstName = 'First name is required';
    if (!address.lastName) newErrors.lastName = 'Last name is required';
    if (!address.address) newErrors.address = 'Address is required';
    if (!address.city) newErrors.city = 'City is required';
    if (!address.stateCode) newErrors.stateCode = 'State is required';
    if (!address.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!address.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="delivery-ship"
              name="orderDeliveryMethod"
              value="Ship"
              checked={formData.orderDeliveryMethod === 'Ship'}
              onChange={handleDeliveryMethodChange}
              className="mr-2"
            />
            <label htmlFor="delivery-ship">Ship to address</label>
          </div>
          
          <div className="flex items-center mt-2">
            <input
              type="radio"
              id="delivery-pickup"
              name="orderDeliveryMethod"
              value="Pickup"
              checked={formData.orderDeliveryMethod === 'Pickup'}
              onChange={handleDeliveryMethodChange}
              className="mr-2"
            />
            <label htmlFor="delivery-pickup">Pickup at winery</label>
          </div>
        </div>
        
        {formData.orderDeliveryMethod === 'Ship' && (
          <>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="same-as-billing"
                  checked={formData.useShippingAsBilling}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="same-as-billing">
                  Same as billing address
                </label>
              </div>
            </div>
            
            {!formData.useShippingAsBilling && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name*</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.shippingAddress.firstName}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name*</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.shippingAddress.lastName}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.shippingAddress.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Address Line 2</label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.shippingAddress.address2}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City*</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.shippingAddress.city}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">State*</label>
                    <select
                      name="stateCode"
                      value={formData.shippingAddress.stateCode}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      {/* Add all states here */}
                      <option value="WY">Wyoming</option>
                    </select>
                    {errors.stateCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.stateCode}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP Code*</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Phone Number*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.shippingAddress.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </>
            )}
          </>
        )}
        
        {formData.orderDeliveryMethod === 'Pickup' && (
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-gray-800">
              Your club shipments will be available for pickup at our winery location.
              We'll notify you when your shipment is ready.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ShippingAddressStep;
```

### 4. Terms & Submit Step

```jsx
// TermsAndSubmitStep.jsx
import React, { useState } from 'react';

const TermsAndSubmitStep = ({ formData, updateFormData, onBack, onSubmit, loading, error }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    updateFormData({ [name]: checked });
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Terms & Submission</h2>
        
        <div className="p-4 bg-gray-100 rounded mb-4">
          <h3 className="font-medium mb-2">Club Membership Summary</h3>
          
          <div className="mb-2">
            <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
          </div>
          
          <div className="mb-2">
            <span className="font-medium">Email:</span> {formData.email}
          </div>
          
          <div className="mb-2">
            <span className="font-medium">Phone:</span> {formData.phone}
          </div>
          
          Here's the continuation of the `TermsAndSubmitStep.jsx` component:

```jsx
// TermsAndSubmitStep.jsx (continued)
          <div className="mb-2">
            <span className="font-medium">Birth Date:</span> {formData.birthDate}
          </div>
          
          <div className="mb-2">
            <span className="font-medium">Delivery Method:</span> {formData.orderDeliveryMethod}
          </div>
          
          {formData.orderDeliveryMethod === 'Ship' && (
            <div>
              <h4 className="font-medium mt-3 mb-1">Shipping Address:</h4>
              <div>
                {formData.useShippingAsBilling ? 'Same as billing address' : (
                  <>
                    {formData.shippingAddress.firstName} {formData.shippingAddress.lastName}<br />
                    {formData.shippingAddress.address}<br />
                    {formData.shippingAddress.address2 && <>{formData.shippingAddress.address2}<br /></>}
                    {formData.shippingAddress.city}, {formData.shippingAddress.stateCode} {formData.shippingAddress.zipCode}
                  </>
                )}
              </div>
            </div>
          )}
          
          <h4 className="font-medium mt-3 mb-1">Billing Address:</h4>
          <div>
            {formData.billingAddress.firstName} {formData.billingAddress.lastName}<br />
            {formData.billingAddress.address}<br />
            {formData.billingAddress.address2 && <>{formData.billingAddress.address2}<br /></>}
            {formData.billingAddress.city}, {formData.billingAddress.stateCode} {formData.billingAddress.zipCode}
          </div>
        </div>
        
        <div className="mb-4 p-4 border border-gray-300 rounded">
          <h3 className="font-medium mb-2">Terms and Conditions</h3>
          <div className="h-40 overflow-auto mb-4 text-sm">
            <p className="mb-2">By joining our wine club, you agree to:</p>
            <ul className="list-disc pl-5">
              <li>Be at least 21 years of age.</li>
              <li>Purchase the required number of wine shipments per year.</li>
              <li>Allow us to charge your credit card for each wine club shipment.</li>
              <li>Notify us of any changes to your shipping or billing information.</li>
              <li>Accept responsibility for ensuring someone 21+ is available to sign for deliveries.</li>
              <li>Acknowledge that we cannot ship to all states due to legal restrictions.</li>
              <li>Maintain your membership for a minimum of one year.</li>
            </ul>
            <p className="mt-2">For a complete copy of our terms and conditions, please visit our website or contact us directly.</p>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="termsAccepted">
              I have read and agree to the terms and conditions
            </label>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <button
          type="button"
          onClick={onSubmit}
          disabled={!formData.termsAccepted || loading}
          className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            !formData.termsAccepted
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : loading
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Submit Membership'}
        </button>
      </div>
    </div>
  );
};

export default TermsAndSubmitStep;
```

### 5. Form Stepper Component

```jsx
// FormStepper.jsx
import React from 'react';

const FormStepper = ({ steps, activeStep }) => {
  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`flex flex-col items-center w-full ${
            index < steps.length - 1 ? 'relative' : ''
          }`}
        >
          <div 
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index <= activeStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          
          <div className="text-xs mt-1 text-center">{step}</div>
          
          {index < steps.length - 1 && (
            <div 
              className={`absolute top-4 left-10 right-10 h-0.5 ${
                index < activeStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormStepper;
```

### 6. Success Message Component

```jsx
// FormSuccess.jsx
import React from 'react';

const FormSuccess = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-green-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
      
      <p className="text-gray-700 mb-6">
        Your membership is pending. Please see a Milea Estate staff member to finalize your enrollment.
      </p>
      
      <div className="mx-auto max-w-md">
        <p className="text-sm text-gray-600 mb-4">
          A staff member will help you with:
        </p>
        
        <ul className="text-sm text-gray-600 text-left list-disc pl-6 mb-6">
          <li>Verifying your information</li>
          <li>Setting up your payment method</li>
          <li>Discussing upcoming club shipments</li>
          <li>Answering any questions about your membership</li>
        </ul>
        
        <p className="text-sm text-gray-600">
          If you need assistance, please contact us at <a href="mailto:club@mileaestate.com" className="text-blue-600 hover:underline">club@mileaestate.com</a> or call us at (123) 456-7890.
        </p>
      </div>
    </div>
  );
};

export default FormSuccess;
```

## Backend API Implementation

Now, let's implement the server-side API that will interact with the Commerce7 API using the provided script logic:

```javascript
// server/api/club-signup.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Commerce7 API configuration
const C7_APP_ID = process.env.C7_APP_ID;
const C7_SECRET_KEY = process.env.C7_SECRET_KEY;
const C7_TENANT_ID = process.env.C7_TENANT_ID;
const PICKUP_LOCATION_ID = process.env.PICKUP_LOCATION_ID;

// Create Basic Auth token
const basicAuthToken = Buffer.from(`${C7_APP_ID}:${C7_SECRET_KEY}`).toString('base64');

// Auth configuration for API requests
const authConfig = {
  headers: {
    'Authorization': `Basic ${basicAuthToken}`,
    'Tenant': C7_TENANT_ID,
    'Content-Type': 'application/json',
  },
};

/**
 * Find a customer by email
 * @param {string} email - Customer email
 * @returns {Promise<object|null>} Customer object or null if not found
 */
async function findCustomerByEmail(email) {
  try {
    console.log(`Searching for customer with email: ${email}`);
    const response = await axios.get(
      `https://api.commerce7.com/v1/customer?q=${encodeURIComponent(email)}`,
      authConfig
    );
    
    if (response.data.customers && response.data.customers.length > 0) {
      console.log('Customer found!', 
        `ID: ${response.data.customers[0].id}`, 
        `Name: ${response.data.customers[0].firstName} ${response.data.customers[0].lastName}`
      );
      return response.data.customers[0];
    }
    
    console.log('No customer found with that email.');
    return null;
  } catch (error) {
    console.error('Error finding customer:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Create a new customer
 * @param {object} customerData - Customer data
 * @returns {Promise<object>} Created customer
 */
async function createCustomer(customerData) {
  try {
    console.log('Creating new customer...');
    
    const payload = {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      emails: [{ email: customerData.email }],
      phones: customerData.phone ? [{ phone: customerData.phone }] : [],
      birthDate: customerData.birthDate
    };
    
    const response = await axios.post(
      'https://api.commerce7.com/v1/customer',
      payload,
      authConfig
    );
    
    console.log('Customer created successfully!', `ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Update an existing customer
 * @param {string} customerId - Customer ID
 * @param {object} customerData - Customer data to update
 * @returns {Promise<object>} Updated customer
 */
async function updateCustomer(customerId, customerData) {
  try {
    console.log(`Updating customer with ID: ${customerId}`);
    
    const payload = {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      birthDate: customerData.birthDate,
      phones: customerData.phone ? [{ phone: customerData.phone }] : []
    };
    
    const response = await axios.put(
      `https://api.commerce7.com/v1/customer/${customerId}`,
      payload,
      authConfig
    );
    
    console.log('Customer updated successfully!');
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Add address to customer profile
 * @param {string} customerId - Customer ID
 * @param {object} addressData - Address data
 * @returns {Promise<object>} Created address
 */
async function addCustomerAddress(customerId, addressData) {
  try {
    console.log(`Adding address for customer: ${customerId}`);
    
    const response = await axios.post(
      `https://api.commerce7.com/v1/customer/${customerId}/address`,
      addressData,
      authConfig
    );
    
    console.log(`Address added successfully!`, `ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`Error adding address:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Create a club membership for a customer
 * @param {string} customerId - Customer ID
 * @param {string} clubId - Club ID
 * @param {string} billToAddressId - Billing address ID
 * @param {string} shipToAddressId - Shipping address ID (or null for pickup)
 * @param {string} orderDeliveryMethod - "Ship" or "Pickup"
 * @returns {Promise<object>} Created club membership
 */
async function createClubMembership(
  customerId, 
  clubId, 
  billToAddressId, 
  shipToAddressId, 
  orderDeliveryMethod
) {
  try {
    console.log(`Creating club membership for customer: ${customerId}, club: ${clubId}`);
    
    // Create a payload based on delivery method
    const payload = {
      customerId,
      clubId,
      billToCustomerAddressId: billToAddressId,
      signupDate: new Date().toISOString(),
      orderDeliveryMethod
    };
    
    // Add the appropriate fields based on delivery method
    if (orderDeliveryMethod === 'Pickup') {
      // For pickup, we need the pickup location ID
      payload.pickupInventoryLocationId = PICKUP_LOCATION_ID;
    } else {
      // For shipping, we need the shipping address
      payload.shipToCustomerAddressId = shipToAddressId;
    }
    
    console.log('Club membership payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(
      'https://api.commerce7.com/v1/club-membership',
      payload,
      authConfig
    );
    
    console.log('Club membership created successfully!', `ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error('Error creating club membership:', error.response?.data || error.message);
    throw error;
  }
}

router.post('/club-signup', async (req, res) => {
  try {
    console.log('Starting Wine Club Signup Process...');
    
    const { customerInfo, billingAddress, shippingAddress, clubId, orderDeliveryMethod } = req.body;
    
    // Step 1: Check if customer exists
    let customer = await findCustomerByEmail(customerInfo.email);
    
    // Step 2: Create or update customer
    if (!customer) {
      customer = await createCustomer(customerInfo);
    } else {
      customer = await updateCustomer(customer.id, customerInfo);
    }
    
    // Step 3: Add billing address
    const billingAddressData = await addCustomerAddress(
      customer.id, 
      billingAddress
    );
    
    // Step 4: Add shipping address (only if delivery method is "Ship")
    let shippingAddressData = null;
    if (orderDeliveryMethod === 'Ship') {
      shippingAddressData = await addCustomerAddress(
        customer.id,
        shippingAddress
      );
    }
    
    // Step 5: Create club membership
    const clubMembership = await createClubMembership(
      customer.id,
      clubId,
      billingAddressData.id,
      shippingAddressData ? shippingAddressData.id : null,
      orderDeliveryMethod
    );
    
    console.log('Club signup process completed successfully!');
    
    res.status(200).json({
      success: true,
      message: 'Club membership created successfully',
      customerId: customer.id,
      membershipId: clubMembership.id
    });
    
  } catch (error) {
    console.error('Error in club signup process:', error);
    
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred during the signup process.'
    });
  }
});

module.exports = router;
```

## Usage Instructions

To use this component in your React application:

1. Set up your project with the folder structure mentioned above
2. Create each of the components according to the code provided
3. Set up your backend API endpoint to handle the form submission 
4. Configure environment variables for Commerce7 API credentials

Here's an example of how to use the component in your main page:

```jsx
// Import the main component
import ClubSignupForm from './ClubSignupForm/ClubSignupForm';

function ClubSignupPage() {
  // Club ID comes from the previous page or URL parameter
  const clubId = "your-club-id-here"; // or from URL params
  
  return (
    <div className="container mx-auto py-10">
      <ClubSignupForm clubId={clubId} />
    </div>
  );
}

export default ClubSignupPage;
```

## Key Features

1. **Multi-step form** with clear navigation and validation
2. **Customer information handling** including name, email, phone, and birth date
3. **Address management** with the option to use billing address for shipping
4. **Delivery method selection** between shipping and pickup
5. **Review and terms acceptance** with a summary of the membership
6. **Form submission** to Commerce7 API via a secure backend endpoint
7. **Success message** with clear next steps for the customer

## Best Practices

- **Validation** at each step ensures all necessary data is collected
- **Error handling** provides clear feedback for failed API calls
- **Loading states** prevent multiple submissions
- **Responsive design** works well on mobile and desktop
- **State management** keeps form data consistent through the steps
- **Commerce7 API integration** follows the same flow as the sample script

## Backend Considerations

When deploying this solution, make sure to:

1. **Set up proper environment variables** for Commerce7 API credentials
2. **Secure the API endpoint** to prevent unauthorized access
3. **Implement rate limiting** to prevent abuse
4. **Log API responses** for debugging and auditing
5. **Handle errors gracefully** with appropriate status codes and messages

This implementation provides a complete solution for creating a wine club membership signup form that integrates with the Commerce7 API while providing a user-friendly experience for customers.