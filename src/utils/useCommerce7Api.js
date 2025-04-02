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