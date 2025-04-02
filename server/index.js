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

async function createClubMembership(customerId, clubId, billToAddressId, shipToAddressId, orderDeliveryMethod, metadata) {
  try {
    const payload = {
      customerId,
      clubId,
      billToCustomerAddressId: billToAddressId,
      signupDate: new Date().toISOString(),
      orderDeliveryMethod,
      metaData: {
        'club-calculator-sign-up': 'true'
      }
    };
    
    if (orderDeliveryMethod === 'Pickup') {
      payload.pickupInventoryLocationId = PICKUP_LOCATION_ID;
    } else {
      payload.shipToCustomerAddressId = shipToAddressId;
    }
    
    // Log the complete request details
    console.log('Creating club membership with payload:', JSON.stringify(payload, null, 2));
    console.log('Request headers:', JSON.stringify(authConfig, null, 2));
    
    const response = await axios.post(
      'https://api.commerce7.com/v1/club-membership',
      payload,
      authConfig
    );
    
    // Log the complete response
    console.log('Commerce7 Response:', JSON.stringify(response.data, null, 2));
    
    // Verify metadata was properly set in the response
    const responseData = response.data;
    if (!responseData.metaData || responseData.metaData['club-calculator-sign-up'] !== 'true') {
      console.warn('Metadata verification failed:', {
        membershipId: responseData.id,
        expectedMetaData: { 'club-calculator-sign-up': 'true' },
        receivedMetaData: responseData.metaData
      });

      // Try to fetch the membership details to verify metadata
      try {
        const membershipResponse = await axios.get(
          `https://api.commerce7.com/v1/club-membership/${responseData.id}`,
          authConfig
        );
        console.log('Fetched membership details:', JSON.stringify(membershipResponse.data, null, 2));
      } catch (fetchError) {
        console.error('Error fetching membership details:', fetchError.message);
      }
    } else {
      console.log('Metadata verified successfully for membership:', responseData.id);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error creating club membership:', error.response?.data || error.message);
    
    // Log additional error details
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      
      // Check for metadata-specific errors
      if (error.response.data?.errors) {
        error.response.data.errors.forEach(err => {
          if (err.field && err.field.includes('metaData')) {
            console.error('Metadata-specific error:', err);
          }
        });
      }
    }
    
    throw error;
  }
}

// Routes
app.post('/api/club-signup', async (req, res) => {
  try {
    console.log('Starting Wine Club Signup Process...');
    
    const { customerInfo, billingAddress, shippingAddress, clubId, orderDeliveryMethod, metadata } = req.body;
    
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
      orderDeliveryMethod,
      metadata
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

// Get customer addresses endpoint
app.get('/api/customer/:id/addresses', async (req, res) => {
  try {
    const customerId = req.params.id;
    console.log('Fetching addresses for customer:', customerId);
    
    const response = await axios.get(
      `https://api.commerce7.com/v1/customer/${customerId}`,
      authConfig
    );
    
    const addresses = response.data.addresses || [];
    console.log('Customer addresses:', JSON.stringify(addresses, null, 2));
    
    res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching customer addresses:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
});

// Test endpoint for metadata
app.post('/api/test-metadata', async (req, res) => {
  try {
    const { customerId, clubId, clubMembershipId } = req.body;
    
    // If a club membership ID is provided, we'll update an existing membership
    if (clubMembershipId) {
      const updatePayload = {
        metaData: {
          'club-calculator-sign-up': 'true'
        }
      };
      
      console.log('Updating club membership metadata:', updatePayload);
      
      const response = await axios.put(
        `https://api.commerce7.com/v1/club-membership/${clubMembershipId}`,
        updatePayload,
        authConfig
      );
      
      console.log('Update response:', JSON.stringify(response.data, null, 2));
      
      res.status(200).json({
        success: true,
        message: 'Metadata updated successfully',
        data: response.data
      });
    } 
    // Otherwise, we'll create a test membership with metadata
    else if (customerId && clubId) {
      // Get customer details and addresses
      const customerResponse = await axios.get(
        `https://api.commerce7.com/v1/customer/${customerId}`,
        authConfig
      );
      
      const customer = customerResponse.data;
      console.log('Customer details:', JSON.stringify(customer, null, 2));
      
      let address;
      
      // If customer has no addresses, create one
      if (!customer.addresses || customer.addresses.length === 0) {
        console.log('No addresses found, creating a new address for customer');
        
        // Get the customer's phone number from their profile
        const customerPhone = customer.phones && customer.phones.length > 0 
          ? customer.phones[0].phone 
          : '+18457073347'; // Fallback to a valid phone number if none exists
        
        const newAddress = {
          firstName: customer.firstName,
          lastName: customer.lastName,
          address: '123 Test Street',
          city: 'Test City',
          stateCode: 'CA',
          zipCode: '12345',
          countryCode: 'US',
          phone: customerPhone,
          isDefault: true
        };
        
        console.log('Creating new address with payload:', JSON.stringify(newAddress, null, 2));
        
        const addressResponse = await axios.post(
          `https://api.commerce7.com/v1/customer/${customerId}/address`,
          newAddress,
          authConfig
        );
        
        address = addressResponse.data;
        console.log('Created new address:', JSON.stringify(address, null, 2));
      } else {
        // Use existing address
        address = customer.addresses.find(addr => addr.type === 'billing') || customer.addresses[0];
        console.log('Using existing address:', JSON.stringify(address, null, 2));
      }
      
      const createPayload = {
        customerId,
        clubId,
        billToCustomerAddressId: address.id,
        shipToCustomerAddressId: address.id,
        orderDeliveryMethod: 'Ship',
        signupDate: new Date().toISOString(),
        metaData: {
          'club-calculator-sign-up': 'true'
        }
      };
      
      console.log('Creating test club membership:', JSON.stringify(createPayload, null, 2));
      
      const response = await axios.post(
        'https://api.commerce7.com/v1/club-membership',
        createPayload,
        authConfig
      );
      
      console.log('Create response:', JSON.stringify(response.data, null, 2));
      
      res.status(200).json({
        success: true,
        message: 'Test membership created with metadata',
        data: response.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
  } catch (error) {
    console.error('Metadata test error:', error);
    if (error.response) {
      console.error('Error response:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 