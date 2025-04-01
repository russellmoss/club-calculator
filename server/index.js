require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
  methods: ['GET', 'POST'], // Allow specific HTTP methods
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());

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

// Helper functions
/**
 * Transform address data to match Commerce7's expected format
 */
function transformAddressData(addressData, customerInfo) {
  return {
    firstName: customerInfo.firstName,
    lastName: customerInfo.lastName,
    address: addressData.address || addressData.streetAddress,
    address2: addressData.address2 || addressData.streetAddress2 || '',
    city: addressData.city,
    stateCode: addressData.stateCode || addressData.state,
    zipCode: addressData.zipCode,
    countryCode: addressData.countryCode || 'US',
    phone: customerInfo.phone,
    isDefault: Boolean(addressData.isDefault)
  };
}

async function findCustomerByEmail(email) {
  try {
    const response = await axios.get(
      `https://api.commerce7.com/v1/customer?q=${encodeURIComponent(email)}`,
      authConfig
    );
    
    if (response.data.customers && response.data.customers.length > 0) {
      return response.data.customers[0];
    }
    return null;
  } catch (error) {
    console.error('Error finding customer:', error.response?.data || error.message);
    throw error;
  }
}

async function createCustomer(customerData) {
  try {
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
    
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error.response?.data || error.message);
    throw error;
  }
}

async function updateCustomer(customerId, customerData) {
  try {
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
    
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error.response?.data || error.message);
    throw error;
  }
}

async function addCustomerAddress(customerId, addressData, addressType) {
  try {
    console.log(`Adding ${addressType} address for customer: ${customerId}`);
    
    // Remove the type field as it's not supported by Commerce7's API
    const { type, ...addressPayload } = addressData;
    
    const response = await axios.post(
      `https://api.commerce7.com/v1/customer/${customerId}/address`,
      addressPayload,
      authConfig
    );
    
    console.log(`${addressType} address added successfully!`, `ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`Error adding ${addressType} address:`, error.response?.data || error.message);
    throw error;
  }
}

async function createClubMembership(customerId, clubId, billToAddressId, shipToAddressId, orderDeliveryMethod) {
  try {
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
    
    const response = await axios.post(
      'https://api.commerce7.com/v1/club-membership',
      payload,
      authConfig
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating club membership:', error.response?.data || error.message);
    throw error;
  }
}

// Routes
app.post('/api/club-signup', async (req, res) => {
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
      transformAddressData(billingAddress, customerInfo),
      'billing'
    );
    
    // Step 4: Add shipping address (only if delivery method is "Ship")
    let shippingAddressData = null;
    if (orderDeliveryMethod === 'Ship') {
      shippingAddressData = await addCustomerAddress(
        customer.id,
        transformAddressData(shippingAddress, customerInfo),
        'shipping'
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
    console.log('Summary:');
    console.log(`Customer: ${customer.firstName} ${customer.lastName} (${customer.id})`);
    console.log(`Club Membership: ${clubMembership.id}`);
    console.log(`Club Tier: ${clubId}`);
    console.log(`Delivery Method: ${orderDeliveryMethod}`);
    
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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 