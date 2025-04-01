import React, { useState } from 'react';
import CustomerInfoStep from './CustomerInfoStep';
import BillingAddressStep from './BillingAddressStep';
import ShippingAddressStep from './ShippingAddressStep';
import TermsAndSubmitStep from './TermsAndSubmitStep';
import FormStepper from './FormStepper';
import FormSuccess from './FormSuccess';
import useCommerce7Api from '../../hooks/useCommerce7Api';

const ClubSignupForm = ({ clubId, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Club ID from props
    clubId: clubId,
    
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
    return <FormSuccess onClose={onClose} />;
  }
  
  return (
    <div className="w-full">
      <FormStepper steps={steps.map(step => step.label)} activeStep={activeStep} />
      
      <div className="mt-6">
        {steps[activeStep].component}
      </div>
    </div>
  );
};

export default ClubSignupForm; 