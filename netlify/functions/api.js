const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');

// Import your existing server code
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Commerce7 API configuration - updated to match Netlify environment variables
const C7_APP_ID = process.env.C7_APP_ID;
const C7_SECRET_KEY = process.env.C7_SECRET_KEY;
const C7_TENANT_ID = process.env.C7_TENANT_ID;
const PICKUP_LOCATION_ID = process.env.PICKUP_LOCATION_ID;

// Log environment variables for debugging (don't include this in production)
console.log('Environment variables:');
console.log('- APP_ID:', C7_APP_ID);
console.log('- SECRET_KEY:', C7_SECRET_KEY ? 'Set (not shown for security)' : 'NOT SET');
console.log('- TENANT_ID:', C7_TENANT_ID);
console.log('- PICKUP_LOCATION_ID:', PICKUP_LOCATION_ID);

// Validate required environment variables
if (!C7_APP_ID || !C7_SECRET_KEY || !C7_TENANT_ID) {
  console.error('Missing required environment variables:', {
    C7_APP_ID: !!C7_APP_ID,
    C7_SECRET_KEY: !!C7_SECRET_KEY,
    C7_TENANT_ID: !!C7_TENANT_ID
  });
  throw new Error('Missing required environment variables');
}

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

async function addCustomerAddress(customerId, addressData, addressType) {
  try {
    console.log(`Adding ${addressType} address for customer: ${customerId}`);
    
    const response = await axios.post(
      `https://api.commerce7.com/v1/customer/${customerId}/address`,
      addressData,
      authConfig
    );
    
    console.log(`${addressType} address added successfully!`, `ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`Error adding ${addressType} address:`, error.response?.data || error.message);
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
app.post('/club-signup', async (req, res) => {
  try {
    console.log('Starting Wine Club Signup Process...');
    
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
      throw new Error('Missing required customer email');
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
      billingAddress, 
      'billing'
    );
    
    // Step 4: Add shipping address (only if delivery method is "Ship")
    let shippingAddressResult = null;
    if (orderDeliveryMethod === 'Ship' && shippingAddress) {
      shippingAddressResult = await addCustomerAddress(
        customer.id,
        shippingAddress,
        'shipping'
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
    
    res.json({
      success: true,
      data: {
        customer,
        clubMembership,
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

// Export the serverless handler
module.exports.handler = serverless(app); 