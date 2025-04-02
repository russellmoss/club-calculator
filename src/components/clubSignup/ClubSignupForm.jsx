import React, { useState } from 'react';
import CustomerInfoStep from './CustomerInfoStep';
import BillingAddressStep from './BillingAddressStep';
import ShippingAddressStep from './ShippingAddressStep';
import AllocationReceivalStep from './AllocationReceivalStep';
import TermsAndSubmitStep from './TermsAndSubmitStep';
import FormStepper from './FormStepper';
import FormSuccess from './FormSuccess';
import useCommerce7Api from '../../hooks/useCommerce7Api';
import { useToast } from '../../contexts/ToastContext';

const ClubSignupForm = ({ clubId, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  
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
      address: '',
      address2: '',
      city: '',
      stateCode: '',
      zipCode: '',
      countryCode: 'US',
      isDefault: true
    },
    
    // Shipping address
    shippingAddress: {
      address: '',
      address2: '',
      city: '',
      stateCode: '',
      zipCode: '',
      countryCode: 'US',
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
    showToast('Step completed successfully', 'success');
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
      
      // Structure the data with customerInfo object
      const submissionData = {
        // Customer info in a nested object
        customerInfo: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          birthDate: formData.birthDate
        },

        // Billing address
        billingAddress: {
          ...formData.billingAddress,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        },

        // Shipping address (if different from billing)
        shippingAddress: formData.useShippingAsBilling ? null : {
          ...formData.shippingAddress,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        },

        // Club and delivery info
        clubId: formData.clubId,
        orderDeliveryMethod: formData.orderDeliveryMethod || 'Pickup',

        // Metadata
        metadata: {
          'club-calculator-sign-up': 'true'
        }
      };
      
      // Process the signup
      await processClubSignup(submissionData);
      
      showToast('Club membership created successfully!', 'success');
      setSuccess(true);
      
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during signup.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
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
      label: 'Allocation Receival',
      component: (
        <AllocationReceivalStep 
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
    <div className="relative max-w-2xl mx-auto p-6">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-primary font-medium">Processing your signup...</p>
          </div>
        </div>
      )}
      
      <FormStepper steps={steps.map(step => step.label)} activeStep={activeStep} />
      {steps[activeStep].component}
    </div>
  );
};

export default ClubSignupForm; 