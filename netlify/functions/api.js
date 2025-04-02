const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');

// Import your existing server code
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add verbose logging middleware
app.use((req, res, next) => {
  console.log('\n=== REQUEST DETAILS ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('=====================\n');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Commerce7 API configuration - updated to match .env file
console.log('=== Raw Environment Variables ===');
console.log('process.env:', process.env);
console.log('===========================');

const C7_APP_ID = process.env.C7_APP_ID;
const C7_SECRET_KEY = process.env.C7_SECRET_KEY;
const C7_TENANT_ID = process.env.C7_TENANT_ID;
const PICKUP_LOCATION_ID = process.env.PICKUP_LOCATION_ID;
const C7_API_URL = 'https://api.commerce7.com/v1';

// Log environment variables for debugging (don't include this in production)
console.log('=== Environment Variables ===');
console.log('- C7_APP_ID:', C7_APP_ID);
console.log('- C7_SECRET_KEY:', C7_SECRET_KEY ? 'Set (not shown for security)' : 'NOT SET');
console.log('- C7_TENANT_ID:', C7_TENANT_ID);
console.log('- PICKUP_LOCATION_ID:', PICKUP_LOCATION_ID);
console.log('===========================');

// Validate required environment variables
if (!C7_APP_ID || !C7_SECRET_KEY || !C7_TENANT_ID) {
  console.error('=== Missing Environment Variables ===');
  console.error('Missing required environment variables:', {
    C7_APP_ID: !!C7_APP_ID,
    C7_SECRET_KEY: !!C7_SECRET_KEY,
    C7_TENANT_ID: !!C7_TENANT_ID
  });
  console.error('===========================');
  throw new Error('Missing required environment variables');
}

// Create Basic Auth token
const basicAuthToken = Buffer.from(`${C7_APP_ID}:${C7_SECRET_KEY}`).toString('base64');

// Log authentication details (without exposing sensitive data)
console.log('=== Authentication Details ===');
console.log('C7_APP_ID length:', C7_APP_ID.length);
console.log('C7_SECRET_KEY length:', C7_SECRET_KEY.length);
console.log('Basic Auth token length:', basicAuthToken.length);
console.log('Tenant ID:', C7_TENANT_ID);
console.log('===========================');

// Auth configuration for API requests
const authConfig = {
  headers: {
    'Authorization': `Basic ${basicAuthToken}`,
    'Tenant': C7_TENANT_ID,
    'Content-Type': 'application/json',
  },
};

// Helper functions from server/index.js
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

async function createCustomer(customerData) {
  try {
    console.log('Creating new customer...');
    
    const payload = {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      emails: [{ email: customerData.email }],
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

async function updateCustomer(customerId, customerData) {
  try {
    console.log(`Updating customer with ID: ${customerId}`);
    
    const payload = {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      birthDate: customerData.birthDate
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

// Add a new address to a customer
async function addCustomerAddress(customerId, addressData, isBillingAddress = false) {
  try {
    console.log(`Adding ${isBillingAddress ? 'billing' : 'shipping'} address for customer: ${customerId}`);
    
    // Get customer details to include in address
    const customerResponse = await axios.get(`${C7_API_URL}/customer/${customerId}`, authConfig);
    const customer = customerResponse.data;
    
    // Prepare address data with required fields
    const addressPayload = {
      firstName: addressData.firstName || customer.firstName,
      lastName: addressData.lastName || customer.lastName,
      address: addressData.address,
      address2: addressData.address2 || '',
      city: addressData.city,
      stateCode: addressData.stateCode,
      zipCode: addressData.zipCode,
      countryCode: addressData.countryCode || "US",
      isDefault: isBillingAddress // Only set as default for billing addresses
    };

    console.log('Address payload:', JSON.stringify(addressPayload, null, 2));
    
    const response = await axios.post(
      `${C7_API_URL}/customer/${customerId}/address`,
      addressPayload,
      authConfig
    );
    
    console.log(`${isBillingAddress ? 'Billing' : 'Shipping'} address added successfully! ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`Error adding ${isBillingAddress ? 'billing' : 'shipping'} address:`, error.response?.data || error.message);
    throw error;
  }
}

async function createClubMembership(customerId, clubId, billToCustomerAddressId, orderDeliveryMethod, shippingAddress = null) {
  try {
    console.log(`Creating club membership for customer: ${customerId}, club: ${clubId}`);
    console.log('Delivery method:', orderDeliveryMethod);
    console.log('Shipping address:', shippingAddress ? JSON.stringify(shippingAddress, null, 2) : 'None');
    
    // Convert "Ship to address" to "Ship" for Commerce7 API
    const deliveryMethod = orderDeliveryMethod === "Ship to address" ? "Ship" : orderDeliveryMethod;
    
    const clubMembershipData = {
      customerId,
      clubId,
      billToCustomerAddressId,
      signupDate: new Date().toISOString(),
      orderDeliveryMethod: deliveryMethod,
      metaData: {
        "club-calculator-sign-up": "true"
      }
    };

    // Handle delivery method specific fields
    if (deliveryMethod === "Ship") {
      // For shipping, set shipToCustomerAddressId
      if (!shippingAddress || shippingAddress.sameAsBilling) {
        // If no shipping address or same as billing, use billing address
        clubMembershipData.shipToCustomerAddressId = billToCustomerAddressId;
        console.log('Using billing address for shipping');
      } else if (shippingAddress.id) {
        // If shipping address provided, use it
        clubMembershipData.shipToCustomerAddressId = shippingAddress.id;
        console.log('Using provided shipping address:', shippingAddress.id);
      } else {
        console.warn('No valid shipping address provided for Ship delivery method');
      }
    } else if (deliveryMethod === "Pickup") {
      // For pickup, set pickupInventoryLocationId
      if (process.env.PICKUP_LOCATION_ID) {
        clubMembershipData.pickupInventoryLocationId = process.env.PICKUP_LOCATION_ID;
        console.log('Set pickup location:', process.env.PICKUP_LOCATION_ID);
      } else {
        console.warn('PICKUP_LOCATION_ID not set in environment variables');
      }
    }

    console.log('Club membership payload:', JSON.stringify(clubMembershipData, null, 2));
    
    const response = await axios.post(`${C7_API_URL}/club-membership`, clubMembershipData, authConfig);
    
    console.log('Club membership created successfully! ID:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('Error creating club membership:', error.response?.data || error.message);
    throw error;
  }
}

// Club signup endpoint
app.post('/club-signup', async (req, res) => {
  try {
    console.log('=== Starting Wine Club Signup Process ===');
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const data = req.body;
    
    // Handle both nested and flat data structures
    const customerEmail = data.customerInfo?.email || data.email;
    const customerFirstName = data.customerInfo?.firstName || data.firstName;
    const customerLastName = data.customerInfo?.lastName || data.lastName;
    const customerPhone = data.customerInfo?.phone || data.phone;

    // Validate required fields
    if (!customerEmail) {
      console.error('Missing required field: email');
      console.error('Received data:', JSON.stringify(data, null, 2));
      return res.status(400).json({ 
        success: false,
        error: 'Email is required',
        details: 'The request must contain an email field'
      });
    }

    // Rest of the function using these extracted variables
    // Search for existing customer
    console.log(`Searching for customer with email: ${data.customerInfo.email}`);
    let existingCustomer;
    try {
      existingCustomer = await findCustomerByEmail(data.customerInfo.email);
    } catch (error) {
      console.error('Error searching for customer:', {
        error: error.message,
        response: error.response?.data
      });
      throw new Error('Failed to search for existing customer');
    }
    
    let customerId;
    if (existingCustomer) {
      console.log('Found existing customer:', {
        id: existingCustomer.id,
        name: `${existingCustomer.firstName} ${existingCustomer.lastName}`
      });
      customerId = existingCustomer.id;
    } else {
      // Create new customer
      console.log('No customer found. Creating new customer...');
      try {
        const newCustomer = await createCustomer({
          email: data.customerInfo.email,
          firstName: data.customerInfo.firstName,
          lastName: data.customerInfo.lastName,
          phone: data.customerInfo.phone
        });
        customerId = newCustomer.id;
        console.log('Customer created successfully:', {
          id: customerId,
          name: `${newCustomer.firstName} ${newCustomer.lastName}`
        });
      } catch (error) {
        console.error('Error creating customer:', {
          error: error.message,
          response: error.response?.data,
          data: data.customerInfo
        });
        throw new Error('Failed to create new customer');
      }
    }

    // Add billing address
    console.log(`Adding billing address for customer: ${customerId}`);
    let billingAddress;
    try {
      billingAddress = await addCustomerAddress(customerId, data.billingAddress);
      console.log('Billing address added successfully:', {
        id: billingAddress.id,
        address: `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.stateCode} ${billingAddress.zipCode}`
      });
    } catch (error) {
      console.error('Error adding billing address:', {
        error: error.message,
        response: error.response?.data,
        address: data.billingAddress
      });
      throw new Error('Failed to add billing address');
    }

    // Create club membership
    console.log(`Creating club membership for customer: ${customerId}, club: ${data.clubId}`);
    let clubMembership;
    try {
      const clubMembershipPayload = {
        customerId,
        clubId: data.clubId,
        billToCustomerAddressId: billingAddress.id,
        signupDate: new Date().toISOString(),
        orderDeliveryMethod: data.orderDeliveryMethod || 'Pickup',
        pickupInventoryLocationId: process.env.PICKUP_LOCATION_ID
      };
      console.log('Club membership payload:', JSON.stringify(clubMembershipPayload, null, 2));

      clubMembership = await createClubMembership(clubMembershipPayload);
      console.log('Club membership created successfully:', {
        id: clubMembership.id,
        customerId,
        clubId: data.clubId
      });
    } catch (error) {
      console.error('Error creating club membership:', {
        error: error.message,
        response: error.response?.data,
        payload: {
          customerId,
          clubId: data.clubId,
          billToCustomerAddressId: billingAddress.id
        }
      });
      throw new Error('Failed to create club membership');
    }

    // Return success response
    console.log('=== Club Signup Process Completed Successfully ===');
    console.log('Summary:', {
      customer: {
        id: customerId,
        name: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
        email: data.customerInfo.email
      },
      membership: {
        id: clubMembership.id,
        clubId: data.clubId,
        deliveryMethod: data.orderDeliveryMethod || 'Pickup'
      },
      billingAddress: {
        id: billingAddress.id,
        address: `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.stateCode} ${billingAddress.zipCode}`
      }
    });

    res.json({
      success: true,
      customerId,
      clubMembershipId: clubMembership.id,
      message: 'Club membership created successfully'
    });
  } catch (error) {
    console.error('=== Error in Club Signup Process ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create club membership',
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Handle requests with /api prefix
app.post('/api/club-signup', async (req, res) => {
  console.log('Received request with /api prefix, forwarding to main handler');
  req.url = '/club-signup';
  app._router.handle(req, res);
});

// Test endpoint to verify Commerce7 API credentials
app.get('/test-auth', async (req, res) => {
  try {
    console.log('=== Testing Commerce7 API Authentication ===');
    console.log('Making test request to Commerce7 API...');
    
    // Log the decoded Basic Auth token for verification
    const decodedToken = Buffer.from(basicAuthToken, 'base64').toString('utf-8');
    console.log('Decoded Basic Auth token:', decodedToken);
    console.log('Expected format:', `${C7_APP_ID}:${C7_SECRET_KEY}`);
    
    // Use a simple customer query to test authentication
    const response = await axios.get(
      'https://api.commerce7.com/v1/customer?limit=1',
      authConfig
    );
    
    console.log('Test request successful!');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    res.json({
      success: true,
      message: 'Authentication successful',
      status: response.status,
      data: response.data
    });
  } catch (error) {
    console.error('=== Authentication Test Failed ===');
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    console.error('===========================');
    
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// Export the serverless handler
module.exports.handler = serverless(app); 