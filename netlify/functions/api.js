const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');

// Import your existing server code
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

async function addCustomerAddress(customerId, address) {
  try {
    console.log(`Adding billing address for customer: ${customerId}`);
    
    // Get customer details to include in address
    const customerResponse = await axios.get(`https://api.commerce7.com/v1/customer/${customerId}`, authConfig);
    const customer = customerResponse.data;

    // Prepare address data with required fields
    const addressData = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: address.address,
      city: address.city,
      stateCode: address.stateCode,
      zipCode: address.zipCode,
      countryCode: 'US', // Required by Commerce7 API
      isDefault: true
    };

    console.log('Address data:', JSON.stringify(addressData, null, 2));
    
    const response = await axios.post(`https://api.commerce7.com/v1/customer/${customerId}/address`, addressData, authConfig);
    
    console.log('billing address added successfully! ID:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('Error adding billing address:', error.response?.data || error.message);
    throw error;
  }
}

async function createClubMembership(
  customerId, 
  clubId, 
  billToAddressId, 
  shipToAddressId, 
  orderDeliveryMethod
) {
  try {
    console.log(`Creating club membership for customer: ${customerId}, club: ${clubId}`);
    
    const payload = {
      customerId,
      clubId,
      billToCustomerAddressId: billToAddressId,
      signupDate: new Date().toISOString(),
      orderDeliveryMethod
    };
    
    if (orderDeliveryMethod === 'Pickup') {
      payload.pickupInventoryLocationId = PICKUP_LOCATION_ID;
    } else {
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

// Club signup endpoint
app.post('/api/club-signup', async (req, res) => {
  try {
    console.log('=== Starting Club Signup Process ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      customerInfo,
      billingAddress,
      shippingAddress,
      clubId,
      orderDeliveryMethod,
      metadata
    } = req.body;

    // Validate required fields
    if (!customerInfo?.email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required customer email'
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
    const billingAddressResult = await addCustomerAddress(
      customer.id, 
      billingAddress
    );
    
    // Step 4: Add shipping address (only if delivery method is "Ship")
    let shippingAddressResult = null;
    if (orderDeliveryMethod === 'Ship' && shippingAddress) {
      shippingAddressResult = await addCustomerAddress(
        customer.id,
        shippingAddress
      );
    }
    
    // Step 5: Create club membership
    const clubMembership = await createClubMembership(
      customer.id,
      clubId,
      billingAddressResult.id,
      shippingAddressResult ? shippingAddressResult.id : null,
      orderDeliveryMethod
    );
    
    console.log('Club signup process completed successfully!');
    console.log('Summary:');
    console.log(`Customer: ${customer.firstName} ${customer.lastName} (${customer.id})`);
    console.log(`Club Membership: ${clubMembership.id}`);
    console.log(`Club Tier: ${clubId}`);
    console.log(`Delivery Method: ${orderDeliveryMethod}`);
    
    // Get full customer and club membership data
    const [customerData, membershipData] = await Promise.all([
      axios.get(`https://api.commerce7.com/v1/customer/${customer.id}`, authConfig),
      axios.get(`https://api.commerce7.com/v1/club-membership/${clubMembership.id}`, authConfig)
    ]);
    
    // Log the response data for debugging
    console.log('Response data:', {
      customer: customerData.data,
      clubMembership: membershipData.data
    });
    
    res.json({
      success: true,
      data: {
        customer: customerData.data,
        clubMembership: membershipData.data,
        deliveryMethod: orderDeliveryMethod
      }
    });
    
  } catch (error) {
    console.error('Error in club signup process:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process club signup'
    });
  }
});

// Test endpoint to verify Commerce7 API credentials
app.get('/api/test-auth', async (req, res) => {
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