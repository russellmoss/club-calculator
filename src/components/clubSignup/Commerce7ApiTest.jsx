import React, { useState } from 'react';
import useCommerce7Api from '../../hooks/useCommerce7Api';

const Commerce7ApiTest = () => {
  const { testAddressApi, loading } = useCommerce7Api();
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState(null);

  const runTest = async () => {
    try {
      setTestResult(null);
      setTestError(null);
      
      const result = await testAddressApi();
      setTestResult(result);
    } catch (error) {
      setTestError(error.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-medium text-primary mb-4">Commerce7 API Test</h2>
      
      <p className="mb-4 text-gray-600">
        This component tests the Commerce7 API integration with sample address data.
      </p>
      
      <button
        onClick={runTest}
        disabled={loading}
        className="w-full bg-primary text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors mb-4 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Address API Test'}
      </button>
      
      {testResult && (
        <div className="mb-4 p-4 bg-green-100 rounded-md">
          <h3 className="font-medium text-green-800 mb-2">Test Successful!</h3>
          <pre className="text-sm overflow-auto max-h-60 whitespace-pre-wrap">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
      
      {testError && (
        <div className="mb-4 p-4 bg-red-100 rounded-md">
          <h3 className="font-medium text-red-800 mb-2">Test Failed</h3>
          <pre className="text-sm overflow-auto max-h-60 whitespace-pre-wrap text-red-700">
            {testError}
          </pre>
        </div>
      )}
      
      <div className="p-4 bg-blue-50 rounded-md text-sm text-blue-800">
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
      </div>
    </div>
  );
};

export default Commerce7ApiTest; 