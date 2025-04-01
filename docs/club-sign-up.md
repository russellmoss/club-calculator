# Wine Club Signup Implementation Guide

This guide outlines how to implement a secure club membership signup flow for your winery's React application, leveraging Commerce7's API.

## Overview

We'll implement a secure flow that:
1. Captures the club ID when a user selects a membership tier
2. Guides them through a multi-step form collecting necessary information
3. Securely submits this data to Commerce7's API
4. Protects sensitive credentials throughout the process

## Implementation Steps

### 1. Project Structure Setup

First, let's ensure our project structure is properly organized:

```
src/
├── components/
│   ├── clubSignup/
│   │   ├── ClubSignupForm.jsx      (Main container)
│   │   ├── CustomerInfoStep.jsx    (Step 1: Personal info)
│   │   ├── BillingAddressStep.jsx  (Step 2: Billing address)
│   │   ├── ShippingAddressStep.jsx (Step 3: Shipping address)
│   │   ├── TermsAndSubmitStep.jsx  (Step 4: Terms acceptance)
│   │   ├── FormStepper.jsx         (Progress indicator)
│   │   └── FormSuccess.jsx         (Success message)
├── hooks/
│   └── useCommerce7Api.js          (API interaction logic)
├── services/
│   └── api.js                      (API endpoints configuration)
├── utils/
│   └── validation.js               (Form validation helpers)
└── server/                         (Backend code - separate folder)
    ├── routes/
    │   └── clubSignup.js           (Express route handler)
    ├── middleware/
    │   └── auth.js                 (API authentication)
    ├── config/
    │   └── index.js                (Configuration handling)
    └── server.js                   (Express server setup)
```

### 2. Environment Variables Setup

#### For Development

Create a `.env` file in your root directory for local development:

```
# Commerce7 API Credentials
REACT_APP_API_BASE_URL=http://localhost:5000/api

# For server-side (these won't be exposed to the client)
C7_APP_ID=club-test
C7_SECRET_KEY=NXL3UAMLoqkdYejnuJDp73JOizvancWeyZgY71fbPiaTeyotPBoKL5AuOFN4Kh2F
C7_TENANT_ID=milea-estate-vineyard

# Club IDs (can be exposed to client)
REACT_APP_CLUB_JUMPER_ID=2ba4f45e-51b9-45af-ab34-6162b9383948
REACT_APP_CLUB_GRAND_PRIX_ID=a708a00a-2bd6-4f5d-9ce6-e1e37b107808
REACT_APP_CLUB_TRIPLE_CROWN_ID=0a2dbd7e-656c-4cb9-a0c7-146187fccefe

# Pickup Location ID (server-side only)
PICKUP_LOCATION_ID=e75bfc54-009d-43db-8ed7-113158cce63e

# Server config
PORT=5000
```

#### For Production

For production deployment, make sure to:
- Use environment variables in your hosting platform (Netlify, Vercel, etc.)
- Never commit `.env` files to your repository
- Use different API keys for production vs. development

### 3. Backend Implementation

Create a separate backend server to handle secure API calls to Commerce7. This prevents exposing your API keys to the client.

#### Server Setup (server/server.js)

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const clubSignupRoutes = require('./routes/clubSignup');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/club-signup', clubSignupRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Club Signup Route (server/routes/clubSignup.js)

Implement the route handler based on your existing club-signup-test.js script:

```javascript
const express = require('express');
const axios = require('axios');
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
 * Create a club membership
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

// POST endpoint to handle club signup
router.post('/', async (req, res) => {
  try {
    console.log('Starting Wine Club Signup Process...');
    
    const { customerInfo, billingAddress, shippingAddress, clubId, orderDeliveryMethod } = req.body;
    
    // Validate required fields
    if (!customerInfo || !billingAddress || !clubId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required information'
      });
    }
    
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

### 4. Frontend Implementation

#### API Service (src/services/api.js)

```javascript
import axios from 'axios';

// Create an axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const clubSignupAPI = {
  // Process club signup
  processSignup: (signupData) => {
    return apiClient.post('/club-signup', signupData);
  },
};

export default apiClient;
```

#### Commerce7 API Hook (src/hooks/useCommerce7Api.js)

```javascript
import { useState } from 'react';
import { clubSignupAPI } from '../services/api';

const useCommerce7Api = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Process club signup
   */
  const processClubSignup = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare data for submission
      const submissionData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate
        },
        billingAddress: formData.billingAddress,
        orderDeliveryMethod: formData.orderDeliveryMethod,
        clubId: formData.clubId
      };
      
      // Add shipping address if needed
      if (formData.orderDeliveryMethod === 'Ship') {
        submissionData.shippingAddress = formData.useShippingAsBilling ? 
          formData.billingAddress : formData.shippingAddress;
      }
      
      const response = await clubSignupAPI.processSignup(submissionData);
      return response.data;
      
    } catch (error) {
      console.error('Club signup error:', error);
      setError(error.response?.data?.message || 'Failed to process club signup');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    processClubSignup,
    loading,
    error
  };
};

export default useCommerce7Api;
```

#### Main Form Component (src/components/clubSignup/ClubSignupForm.jsx)

```jsx
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
  
  const { processClubSignup, loading: apiLoading, error: apiError } = useCommerce7Api();
  
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
      
      // Process the signup
      await processClubSignup(formData);
      
      setSuccess(true);
      
    } catch (err) {
      setError(err.message || apiError || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };
  
  // Form steps components
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
      label: 'Review & Submit',
      component: (
        <TermsAndSubmitStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onBack={handleBack} 
          onSubmit={handleSubmit} 
          loading={loading || apiLoading}
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
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-gilda text-primary text-center mb-6">
        Join Milea Estate Wine Club
      </h1>
      
      <FormStepper currentStep={activeStep} totalSteps={steps.length} />
      
      <div className="mt-8">
        {steps[activeStep].component}
      </div>
    </div>
  );
};

export default ClubSignupForm;
```

#### Update Results Page (src/components/calculator/ResultsPage.jsx)

Update the ResultsPage to show the signup form in a modal when a user clicks "Join":

```jsx
import React, { useState } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ClubSignupForm from '../clubSignup/ClubSignupForm';

const ResultsPage = () => {
  const { savings, resetCalculator } = useCalculator();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const handleJoinClub = (clubId) => {
    setSelectedClub(clubId);
    setShowSignupModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6 text-center">Your Potential Annual Savings</h2>
      
      {/* Triple Crown */}
      <div className="mb-6 p-6 rounded-lg border-2 border-primary bg-background">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-primary">Triple Crown</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Savings</div>
            <div className="text-2xl font-bold text-primary">${Math.round(savings.tripleCrown)}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Club Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">12 bottles per shipment (4x/year)</li>
            <li className="text-sm">15% off all Milea wines</li>
            <li className="text-sm">15% off Milea accommodations</li>
            <li className="text-sm">15% off Milea food</li>
            <li className="text-sm">Fully customizable shipments</li>
            <li className="text-sm">Free quarterly tastings for member + 3 guests</li>
          </ul>
        </div>
        
        <button
          onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_TRIPLE_CROWN_ID)}
          className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-darkBrownHover transition-colors"
        >
          Join Triple Crown
        </button>
      </div>
      
      {/* Grand Prix */}
      <div className="mb-6 p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-darkBrown">Grand Prix</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Savings</div>
            <div className="text-2xl font-bold text-primary">${Math.round(savings.grandPrix)}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Club Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">6 bottles per shipment (4x/year)</li>
            <li className="text-sm">15% off all Milea wines</li>
            <li className="text-sm">Fully customizable shipments</li>
            <li className="text-sm">Free quarterly tastings for member + 3 guests</li>
          </ul>
        </div>
        
        <button
          onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_GRAND_PRIX_ID)}
          className="w-full bg-white text-primary border-2 border-primary py-3 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Join Grand Prix
        </button>
      </div>
      
      {/* Jumper */}
      <div className="mb-6 p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-gilda text-darkBrown">Jumper</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Savings</div>
            <div className="text-2xl font-bold text-primary">${Math.round(savings.jumper)}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Club Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">4 bottles per shipment (4x/year)</li>
            <li className="text-sm">10% off all Milea wines</li>
            <li className="text-sm">Access to exclusive club-only events</li>
          </ul>
        </div>
        
        <button
          onClick={() => handleJoinClub(process.env.REACT_APP_CLUB_JUMPER_ID)}
          className="w-full bg-white text-primary border-2 border-primary py-3 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Join Jumper
        </button>
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="secondary" onClick={resetCalculator}>
          Start Over
        </Button>
      </div>
      
      {/* Signup Modal */}
      <Modal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)}
      >
        <ClubSignupForm 
          clubId={selectedClub} 
          onClose={() => setShowSignupModal(false)} 
        />
      </Modal>
    </div>
  );
};

export default ResultsPage;
```

### 5. Deployment & Security Considerations

#### Frontend Deployment

1. **Build process:**
   ```bash
   npm run build
   ```

2. **Deploy to a host like Netlify or Vercel:**
   - Connect your GitHub repository
   - Set up environment variables in the hosting platform
   - Configure build settings

#### Backend Deployment

1. **Separate deployment:**
   - Deploy your backend to a service like Heroku, Render, or DigitalOcean
   - Set up environment variables in your hosting platform
   - Ensure you have proper security headers and CORS configuration

2. **Security considerations:**
   - Set up rate limiting to prevent abuse
   - Add proper logging for debugging
   - Use HTTPS for all communication
   - Consider adding request validation middleware

#### Environment Variables Management

1. **Development:**
   - Use `.env` file locally (added to `.gitignore`)
   - Add a `.env.example` file with placeholders for required variables

2. **Production:**
   - Never store API keys in client-side code
   - Use environment variables in your hosting platform
   - Rotate API keys periodically
   - Use different keys for production vs. development

### 6. Testing

1. **Backend testing:**
   ```bash
   # Test the API locally
   curl -X POST http://localhost:5000/api/club-signup \
     -H "Content-Type: application/json" \
     -d '{
       "customerInfo": {
         "firstName": "Test",
         "lastName": "User",
         "email": "test@example.com",
         "birthDate": "1990-01-01"
       },
       "billingAddress": {
         "firstName": "Test",
         "lastName": "User",
         "address": "123 Test St",
         "city": "Testville",
         "stateCode": "NY",
         "zipCode": "12345",
         "countryCode": "US",
         "phone": "555-555-5555",
         "isDefault": true
       },
       "orderDeliveryMethod": "Pickup",
       "clubId": "2ba4f45e-51b9-45af-ab34-6162b9383948"
     }'
   ```

2. **Form testing:**
   - Test each form step validation
   - Test the entire signup flow
   - Test error handling
   - Test with bad data to ensure proper validation

## Conclusion

This implementation creates a secure, multi-step signup process for your wine club memberships. It protects your Commerce7 API credentials by handling all API calls on the server side, while providing a smooth user experience on the front end.

The architecture separates concerns properly:
- Frontend handles user interaction and data collection
- Backend handles sensitive API calls and data processing
- Environment variables are managed securely

For any questions or issues during implementation, refer to the Commerce7 API documentation or your API credentials provider.