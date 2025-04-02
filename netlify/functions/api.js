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
    console.log('Address data received:', JSON.stringify(addressData, null, 2));
    
    // Get customer details to include in address
    const customerResponse = await axios.get(`${C7_API_URL}/customer/${customerId}`, authConfig);
    const customer = customerResponse.data;
    
    // Extract the address from nested object if needed
    const streetAddress = addressData.address.address || addressData.address;
    const streetAddress2 = addressData.address2 || addressData.address.address2 || '';
    
    // Prepare address data with required fields
    const addressPayload = {
      firstName: addressData.firstName || customer.firstName,
      lastName: addressData.lastName || customer.lastName,
      address: streetAddress, // Use the extracted address string
      address2: streetAddress2,
      city: addressData.city || addressData.address.city,
      stateCode: addressData.stateCode || addressData.address.stateCode,
      zipCode: addressData.zipCode || addressData.address.zipCode,
      countryCode: addressData.countryCode || addressData.address.countryCode || "US",
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

async function createClubMembership(customerId, clubId, billToAddressId, orderDeliveryMethod, shippingAddressId = null, metaData = null) {
  try {
    console.log('Creating club membership with metaData:', metaData);
    
    // Check if first parameter is an object (old way of calling)
    if (typeof customerId === 'object') {
      const payload = customerId;
      console.log('Function called with object parameter, extracting fields');
      customerId = payload.customerId;
      clubId = payload.clubId;
      billToAddressId = payload.billToCustomerAddressId;
      orderDeliveryMethod = payload.orderDeliveryMethod;
      metaData = payload.metaData;
      
      if (payload.pickupInventoryLocationId) {
        // This is a pickup order
        console.log('Setting pickup location:', payload.pickupInventoryLocationId);
      } else if (payload.shipToCustomerAddressId) {
        // This is a shipping order
        shippingAddressId = payload.shipToCustomerAddressId;
        console.log('Setting shipping address:', shippingAddressId);
      }
    }
    
    console.log(`Creating club membership for customer: ${customerId}, club: ${clubId}`);
    console.log('Delivery method:', orderDeliveryMethod);
    console.log('Billing address:', billToAddressId);
    
    // Ensure all required fields are present
    if (!customerId || !clubId || !billToAddressId || !orderDeliveryMethod) {
      throw new Error(`Missing required fields for club membership: 
        customerId: ${!!customerId}, 
        clubId: ${!!clubId}, 
        billToAddressId: ${!!billToAddressId}, 
        orderDeliveryMethod: ${!!orderDeliveryMethod}`);
    }
    
    const clubMembershipData = {
      customerId,
      clubId,
      billToCustomerAddressId: billToAddressId,
      signupDate: new Date().toISOString(),
      orderDeliveryMethod: orderDeliveryMethod,
      metaData: {
        'club-calculator-sign-up': 'true'
      }
    };

    // Handle delivery method specific fields
    if (orderDeliveryMethod === "Pickup") {
      // For pickup, set pickupInventoryLocationId
      if (process.env.PICKUP_LOCATION_ID) {
        clubMembershipData.pickupInventoryLocationId = process.env.PICKUP_LOCATION_ID;
        console.log('Set pickup location:', process.env.PICKUP_LOCATION_ID);
      } else {
        console.warn('PICKUP_LOCATION_ID not set in environment variables');
      }
    } else if (orderDeliveryMethod === "Ship" && shippingAddressId) {
      // For shipping, set shipToCustomerAddressId
      clubMembershipData.shipToCustomerAddressId = shippingAddressId;
      console.log('Set shipping address:', shippingAddressId);
    }

    // Add metaData if provided
    if (metaData) {
      clubMembershipData.metaData = metaData;
      console.log('Added metaData to club membership:', metaData);
    }

    if (typeof clubMembershipData.customerId !== 'string') {
      throw new Error(`Invalid customerId: ${typeof clubMembershipData.customerId}, must be a string`);
    }

    console.log('Using Commerce7 compliant metadata format');
    console.log('Club membership data with metaData:', JSON.stringify(clubMembershipData, null, 2));
    
    const response = await axios.post(
      `${C7_API_URL}/club-membership`,
      clubMembershipData,
      authConfig
    );
    
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
    console.log('Request headers:', req.headers);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const data = req.body;
    
    // Validate required fields
    if (!data.customerInfo?.email) {
      console.error('Missing required field: email');
      return res.status(400).json({
        success: false,
        error: 'Missing required field: email'
      });
    }
    
    // Search for existing customer
    console.log(`Searching for customer with email: ${data.customerInfo.email}`);
    let customer;
    try {
      customer = await findCustomerByEmail(data.customerInfo.email);
      console.log('Customer search result:', customer ? 'Found' : 'Not found');
    } catch (error) {
      console.error('Error searching for customer:', {
        error: error.message,
        response: error.response?.data
      });
      throw new Error('Failed to search for customer');
    }
    
    // Create new customer if not found
    if (!customer) {
      console.log('No customer found with that email.');
      try {
        console.log('Creating new customer...');
        customer = await createCustomer(data.customerInfo);
        console.log('Customer created successfully! ID:', customer.id);
      } catch (error) {
        console.error('Error creating customer:', {
          error: error.message,
          response: error.response?.data,
          customerInfo: data.customerInfo
        });
        throw new Error('Failed to create customer');
      }
    }
    
    // Add billing address
    console.log(`Adding billing address for customer: ${customer.id}`);
    let billingAddress;
    try {
      billingAddress = await addCustomerAddress(customer.id, data.billingAddress);
      console.log('Billing address added successfully! ID:', billingAddress.id);
    } catch (error) {
      console.error('Error adding billing address:', {
        error: error.message,
        response: error.response?.data,
        customerId: customer.id,
        addressData: data.billingAddress
      });
      throw new Error('Failed to add billing address');
    }
    
    // Create club membership
    console.log(`Creating club membership for customer: ${customer.id}, club: ${data.clubId}`);
    let clubMembership;
    try {
      clubMembership = await createClubMembership(
        customer.id,
        data.clubId,
        billingAddress.id,
        data.orderDeliveryMethod || 'Pickup',
        data.shippingAddress ? data.shippingAddress.id : null,
        { 'club-calculator-sign-up': 'true' }
      );
      
      console.log('Club membership created successfully:', {
        id: clubMembership.id,
        customerId: customer.id,
        clubId: data.clubId
      });

      // Verify metaData was properly set
      console.log('Club membership created with metaData:', clubMembership.metaData);

      // Add additional check for metaData
      if (!clubMembership.metaData || !clubMembership.metaData['club-calculator-sign-up']) {
        console.warn('Warning: club-calculator-sign-up metaData not found in created membership');
      }
    } catch (error) {
      console.error('Error creating club membership:', {
        error: error.message,
        response: error.response?.data,
        payload: {
          customerId: customer.id,
          clubId: data.clubId,
          billToCustomerAddressId: billingAddress.id,
          orderDeliveryMethod: data.orderDeliveryMethod || 'Pickup'
        }
      });
      throw new Error('Failed to create club membership');
    }
    
    // Log success summary
    console.log('=== Club signup process completed successfully! ===');
    console.log('Summary:', {
      customer: `${customer.firstName} ${customer.lastName} (${customer.id})`,
      clubMembership: clubMembership.id,
      clubTier: data.clubId,
      deliveryMethod: data.orderDeliveryMethod || 'Pickup'
    });
    console.log('===========================================');
    
    // Return success response
    res.json({
      success: true,
      customerId: customer.id,
      membershipId: clubMembership.id,
      message: 'Club signup completed successfully'
    });
  } catch (error) {
    console.error('=== Error in club signup process ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    console.error('=====================================');
    
    res.status(500).json({
      success: false,
      error: error.message
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