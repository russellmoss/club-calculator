const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://club-calculator.netlify.app/.netlify/functions/api'
  : 'http://localhost:8888/.netlify/functions/api';

const processClubSignup = async (data) => {
  try {
    console.log('Sending data to Commerce7:', JSON.stringify(data, null, 2));
    const transformedData = transformClubSignupData(data);
    console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

    const response = await fetch(`${API_BASE_URL}/club-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(transformedData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error(`API error: ${response.status} ${response.statusText} - ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Received non-JSON response:', responseText);
      throw new Error('Received invalid JSON response');
    }

    console.log('Club signup successful:', result);
    return result;
  } catch (error) {
    console.error('Error in processClubSignup:', error);
    throw error;
  }
}; 