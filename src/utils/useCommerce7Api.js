// API base URL configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Use relative path that works with Netlify redirects
  : 'http://localhost:8888/.netlify/functions/api';

const processClubSignup = async (data) => {
  try {
    console.log('Sending data to Commerce7:', JSON.stringify(data, null, 2));
    const transformedData = transformClubSignupData(data);
    console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

    console.log('Making fetch request to:', `${API_BASE_URL}/club-signup`);
    const response = await fetch(`${API_BASE_URL}/club-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(transformedData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    if (!response.ok) {
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      });
      throw new Error(`API error: ${response.status} ${response.statusText}\n${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', {
        error: parseError,
        responseText: responseText
      });
      throw new Error('Received invalid JSON response from server');
    }

    console.log('Club signup successful:', result);
    return result;
  } catch (error) {
    console.error('Error in processClubSignup:', {
      error: error.message,
      stack: error.stack,
      data: data
    });
    throw error;
  }
};

const transformClubSignupData = (data) => {
  console.log('Original data:', JSON.stringify(data, null, 2));
  
  // Transform the data to match the API's expected structure
  const transformedData = {
    // Customer info in a nested object
    customerInfo: {
      email: data.billingAddress.email || data.email,
      firstName: data.billingAddress.firstName,
      lastName: data.billingAddress.lastName,
      phone: data.billingAddress.phone
    },

    // Billing address
    billingAddress: {
      address1: data.billingAddress.address,
      address2: data.billingAddress.address2 || '',
      city: data.billingAddress.city,
      state: data.billingAddress.stateCode,
      zip: data.billingAddress.zipCode,
      country: data.billingAddress.countryCode || 'US'
    },

    // Shipping address (if different from billing)
    shippingAddress: data.shippingAddress ? {
      address1: data.shippingAddress.address,
      address2: data.shippingAddress.address2 || '',
      city: data.shippingAddress.city,
      state: data.shippingAddress.stateCode,
      zip: data.shippingAddress.zipCode,
      country: data.shippingAddress.countryCode || 'US'
    } : null,

    // Club and delivery info
    clubId: data.clubId,
    orderDeliveryMethod: data.orderDeliveryMethod || 'Pickup',

    // Metadata
    metadata: {
      'club-calculator-sign-up': 'true'
    }
  };

  console.log('Transformed data:', JSON.stringify(transformedData, null, 2));
  return transformedData;
}; 