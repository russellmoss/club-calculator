const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Use relative path that matches our redirect rule
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
  
  // Extract customer info from the nested structure
  const customerInfo = data.customerInfo || {};
  const billingAddress = data.billingAddress || {};
  const shippingAddress = data.shippingAddress || {};

  // Transform the data to match the API's expected structure
  const transformedData = {
    // Customer info
    email: customerInfo.email,
    firstName: customerInfo.firstName,
    lastName: customerInfo.lastName,
    phone: customerInfo.phone,
    clubId: data.clubId,

    // Billing address
    billingAddress: {
      address1: billingAddress.address1,
      address2: billingAddress.address2,
      city: billingAddress.city,
      state: billingAddress.state,
      zip: billingAddress.zip,
      country: billingAddress.country || 'US'
    },

    // Shipping address (if different from billing)
    shippingAddress: shippingAddress.sameAsBilling ? null : {
      address1: shippingAddress.address1,
      address2: shippingAddress.address2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.zip,
      country: shippingAddress.country || 'US'
    }
  };

  console.log('Transformed data:', JSON.stringify(transformedData, null, 2));
  return transformedData;
}; 