const API_BASE_URL = '/api';

const processClubSignup = async (data) => {
  try {
    console.log('Sending data to Commerce7:', data);
    const transformedData = transformClubSignupData(data);
    console.log('Transformed data:', transformedData);

    const response = await fetch(`${API_BASE_URL}/club-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(transformedData),
    });

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Club signup successful:', result);
    return result;
  } catch (error) {
    console.error('Error in processClubSignup:', error);
    throw error;
  }
}; 