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
    const response = await axios.post(
      `https://api.commerce7.com/v1/customer/${customerId}/address`,
      addressData,
      authConfig
    );
    
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
    const {
      customerInfo,
      billingAddress,
      shippingAddress,
      clubId,
      orderDeliveryMethod
    } = req.body;

    // Validate required fields
    if (!customerInfo || !customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required customer information'
      });
    }

    if (!billingAddress || !billingAddress.streetAddress || !billingAddress.city || !billingAddress.state || !billingAddress.zipCode) {
      return res.status(400).json({
        success: false,
        error: 'Missing required billing address information'
      });
    }

    if (orderDeliveryMethod === 'Ship' && (!shippingAddress || !shippingAddress.streetAddress || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required shipping address information'
      });
    }

    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Missing club ID'
      });
    }

    if (!orderDeliveryMethod || !['Ship', 'Pickup'].includes(orderDeliveryMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order delivery method'
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
      billingAddress, 
      'billing'
    );
    
    // Step 4: Add shipping address (only if delivery method is "Ship")
    let shippingAddressResult = null;
    if (orderDeliveryMethod === 'Ship') {
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
    
    res.json({
      success: true,
      customer,
      clubMembership
    });
    
  } catch (error) {
    console.error('Error in club signup process:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 