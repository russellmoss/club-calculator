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
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: addressData.address,
      city: addressData.city,
      stateCode: addressData.stateCode,
      zipCode: addressData.zipCode,
      countryCode: "US",
      isDefault: isBillingAddress // Only set as default for billing addresses
    };

    console.log('Address data:', JSON.stringify(addressPayload, null, 2));
    
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

    // Add shipping address if delivery method is "Ship"
    if (deliveryMethod === "Ship") {
      // If shipping address is null or sameAsBilling is true, use billing address
      if (!shippingAddress || shippingAddress.sameAsBilling) {
        clubMembershipData.shipToCustomerAddressId = billToCustomerAddressId;
      } else if (shippingAddress.id) {
        clubMembershipData.shipToCustomerAddressId = shippingAddress.id;
      }
    } else if (deliveryMethod === "Pickup") {
      clubMembershipData.pickupInventoryLocationId = process.env.PICKUP_LOCATION_ID;
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
app.post('/.netlify/functions/api/club-signup', async (req, res) => {
  try {
    console.log('Starting Wine Club Signup Process...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { customerInfo, billingAddress, shippingAddress, clubId, orderDeliveryMethod } = req.body;
    
    // Validate required fields
    if (!customerInfo?.email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required customer email'
      });
    }

    // Find or create customer
    let customer = await findCustomerByEmail(customerInfo.email);
    if (!customer) {
      customer = await createCustomer(customerInfo);
    } else {
      customer = await updateCustomer(customer.id, customerInfo);
    }
    
    // Add billing address (set as default)
    const billingAddressResult = await addCustomerAddress(customer.id, billingAddress, true);
    
    // Add shipping address if provided and different from billing
    let shippingAddressResult = null;
    if (orderDeliveryMethod === "Ship to address" && shippingAddress && !shippingAddress.sameAsBilling) {
      shippingAddressResult = await addCustomerAddress(customer.id, shippingAddress, false);
    }
    
    // Create club membership with appropriate address
    const clubMembership = await createClubMembership(
      customer.id,
      clubId,
      billingAddressResult.id,
      orderDeliveryMethod,
      shippingAddressResult
    );
    
    // Get full customer and club membership data
    const fullCustomer = await axios.get(`${C7_API_URL}/customer/${customer.id}`, authConfig);
    const fullClubMembership = await axios.get(`${C7_API_URL}/club-membership/${clubMembership.id}`, authConfig);
    
    console.log('Club signup process completed successfully!');
    console.log('Summary:');
    console.log(`Customer: ${fullCustomer.data.firstName} ${fullCustomer.data.lastName} (${fullCustomer.data.id})`);
    console.log(`Club Membership: ${fullClubMembership.data.id}`);
    console.log(`Club Tier: ${fullClubMembership.data.clubId}`);
    console.log(`Delivery Method: ${fullClubMembership.data.orderDeliveryMethod}`);
    
    res.json({
      success: true,
      customer: fullCustomer.data,
      clubMembership: fullClubMembership.data
    });
  } catch (error) {
    console.error('Error in club signup process:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
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