import React, { useState } from 'react';
import useCommerce7Api from '../../hooks/useCommerce7Api';

const Commerce7ApiTest = () => {
  const { testAddressApi, processClubSignup, loading } = useCommerce7Api();
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState(null);
  const [metadataTestResult, setMetadataTestResult] = useState(null);
  const [metadataTestError, setMetadataTestError] = useState(null);

  const runAddressTest = async () => {
    try {
      setTestResult(null);
      setTestError(null);
      
      const result = await testAddressApi();
      setTestResult(result);
    } catch (error) {
      setTestError(error.message || 'An unknown error occurred');
    }
  };

  const runMetadataTest = async () => {
    try {
      setMetadataTestResult(null);
      setMetadataTestError(null);

      // Test data with metadata
      const testData = {
        firstName: 'Metadata',
        lastName: 'Test',
        email: `metadata.test.${Date.now()}@example.com`,
        phone: '555-555-5555',
        birthDate: '1990-01-01',
        billingAddress: {
          address: '123 Test Street',
          city: 'Test City',
          stateCode: 'CA',
          zipCode: '12345',
          countryCode: 'US',
          isDefault: true
        },
        clubId: process.env.REACT_APP_CLUB_JUMPER_ID,
        orderDeliveryMethod: 'Pickup',
        metadata: {
          'club-calculator-sign-up': true
        }
      };

      const result = await processClubSignup(testData);
      setMetadataTestResult(result);
    } catch (error) {
      setMetadataTestError(error.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-medium text-primary mb-4">Commerce7 API Test</h2>
      
      <div className="space-y-6">
        {/* Address API Test Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Address API Test</h3>
          <p className="mb-4 text-gray-600">
            This test verifies the Commerce7 API integration with sample address data.
          </p>
          
          <button
            onClick={runAddressTest}
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors mb-4 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Address API Test'}
          </button>
          
          {testResult && (
            <div className="mb-4 p-4 bg-green-100 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Address Test Successful!</h3>
              <pre className="text-sm overflow-auto max-h-60 whitespace-pre-wrap">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
          
          {testError && (
            <div className="mb-4 p-4 bg-red-100 rounded-md">
              <h3 className="font-medium text-red-800 mb-2">Address Test Failed</h3>
              <pre className="text-sm overflow-auto max-h-60 whitespace-pre-wrap text-red-700">
                {testError}
              </pre>
            </div>
          )}
        </div>

        {/* Metadata Test Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Metadata Test</h3>
          <p className="mb-4 text-gray-600">
            This test verifies that metadata is properly passed to and handled by the backend.
          </p>
          
          <button
            onClick={runMetadataTest}
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors mb-4 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Metadata Test'}
          </button>
          
          {metadataTestResult && (
            <div className="mb-4 p-4 bg-green-100 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Metadata Test Successful!</h3>
              <pre className="text-sm overflow-auto max-h-60 whitespace-pre-wrap">
                {JSON.stringify(metadataTestResult, null, 2)}
              </pre>
            </div>
          )}
          
          {metadataTestError && (
            <div className="mb-4 p-4 bg-red-100 rounded-md">
              <h3 className="font-medium text-red-800 mb-2">Metadata Test Failed</h3>
              <pre className="text-sm overflow-auto max-h-60 whitespace-pre-wrap text-red-700">
                {metadataTestError}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-md text-sm text-blue-800 mt-6">
        <h3 className="font-medium mb-2">Implementation Notes</h3>
        <p className="mb-2">Key address fields for Commerce7:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>firstName, lastName</li>
          <li>streetAddress (not 'address')</li>
          <li>streetAddress2 (optional)</li>
          <li>city</li>
          <li>state (not 'stateCode')</li>
          <li>zipCode</li>
          <li>countryCode (default 'US')</li>
          <li>phone</li>
          <li>isDefault (boolean)</li>
        </ul>
        <p className="mt-2">Metadata handling:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>club-calculator-sign-up field is automatically set to true</li>
          <li>Backend verifies metadata is properly set in Commerce7 response</li>
          <li>Test creates a new customer with unique email for each run</li>
        </ul>
      </div>
    </div>
  );
};

export default Commerce7ApiTest; 