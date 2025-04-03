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
    billingAddress: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US',
    
    // Shipping address
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
    
    // Delivery method
    orderDeliveryMethod: 'Pickup',
    sameAsBilling: true
  });
  
  const { processClubSignup } = useCommerce7Api();
  
  // Update form data
  const updateFormData = (data) => {
    console.log('Updating form data:', data);
    setFormData(prevState => {
      const newState = {
        ...prevState,
        ...data
      };
      console.log('New form state:', newState);
      return newState;
    });
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
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);
    setError(null);
    
    try {
      // Create submission data with explicit metadata
      const submissionData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.billingAddress,
          address2: formData.billingAddress2 || '',
          city: formData.billingCity,
          stateCode: formData.billingState,
          zipCode: formData.billingZip,
          countryCode: formData.billingCountry || 'US'
        },
        shippingAddress: formData.sameAsBilling ? null : {
          firstName: formData.shippingFirstName,
          lastName: formData.shippingLastName,
          address: formData.shippingAddress,
          address2: formData.shippingAddress2 || '',
          city: formData.shippingCity,
          stateCode: formData.shippingState,
          zipCode: formData.shippingZip,
          countryCode: formData.shippingCountry || 'US'
        },
        clubId: formData.clubId,
        orderDeliveryMethod: formData.orderDeliveryMethod,
        sameAsBilling: formData.sameAsBilling,
        metaData: {
          'club-calculator-sign-up': 'true'
        }
      };

      console.log('Submitting with metaData:', JSON.stringify(submissionData.metaData, null, 2));
      console.log('Full submission data:', JSON.stringify(submissionData, null, 2));
      
      const response = await processClubSignup(submissionData);
      
      if (response.success) {
        showToast('Club membership created successfully!', 'success');
        setSuccess(true);
      } else {
        setError(response.error || 'Failed to process signup');
        showToast(response.error || 'Failed to process signup', 'error');
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(err.message || 'An error occurred during signup');
      showToast(err.message || 'An error occurred during signup', 'error');
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
    <div className="relative max-w-2xl mx-auto p-4 sm:p-6">
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
      <div className="mt-6">
        {steps[activeStep].component}
      </div>
    </div>
  );
};

export default ClubSignupForm; 