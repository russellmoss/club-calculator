import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const useCommerce7Api = () => {
  const [loading, setLoading] = useState(false);
  
  /**
   * Transform address data to match Commerce7's expected format
   * Commerce7 expects:
   * - firstName (string)
   * - lastName (string)
   * - address (string)
   * - address2 (string, optional)
   * - city (string)
   * - stateCode (string)
   * - zipCode (string)
   * - countryCode (string, defaults to 'US')
   * - phone (string)
   * - isDefault (boolean)
   */
  const transformAddressData = (addressData, customerInfo) => {
    // Ensure all required fields are present and properly formatted
    const transformed = {
      firstName: customerInfo.firstName?.trim(),
      lastName: customerInfo.lastName?.trim(),
      address: addressData.address?.trim(),
      address2: addressData.address2?.trim() || '',
      city: addressData.city?.trim(),
      stateCode: addressData.stateCode?.trim(),
      zipCode: addressData.zipCode?.trim(),
      countryCode: addressData.countryCode?.trim() || 'US',
      phone: customerInfo.phone?.trim(),
      isDefault: Boolean(addressData.isDefault)
    };

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'stateCode', 'zipCode'];
    const missingFields = requiredFields.filter(field => !transformed[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required address fields: ${missingFields.join(', ')}`);
    }

    return transformed;
  };

  /**
   * Format Commerce7 validation errors into a readable message
   */
  const formatCommerce7Errors = (error) => {
    if (!error.response?.data?.errors) {
      return error.message;
    }

    const errors = error.response.data.errors;
    const errorMessages = errors.map(err => {
      const field = err.field || 'unknown field';
      const message = err.message || 'Invalid value';
      return `${field}: ${message}`;
    });

    return `Commerce7 Validation Errors:\n${errorMessages.join('\n')}`;
  };

  /**
   * Test function to verify address API functionality
   */
  const testAddressApi = async () => {
    try {
      setLoading(true);
      
      // Sample test data
      const testData = {
        customerInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '555-555-5555',
          birthDate: '1990-01-01'
        },
        billingAddress: {
          address: '123 Main Street',
          address2: 'Apt 4B',
          city: 'San Francisco',
          stateCode: 'CA',
          zipCode: '94105',
          countryCode: 'US',
          isDefault: true
        }
      };

      // Transform the test data
      const transformedData = {
        customerInfo: testData.customerInfo,
        billingAddress: transformAddressData(testData.billingAddress, testData.customerInfo),
        shippingAddress: null,
        clubId: 'test-club-id',
        orderDeliveryMethod: 'Pickup'
      };

      // Log the transformed data for debugging
      console.log('Testing with data:', JSON.stringify(transformedData, null, 2));
      
      // Call our backend endpoint
      const response = await axios.post(`${API_BASE_URL}/api/club-signup`, transformedData);
      
      console.log('Test successful:', response.data);
      return response.data;
    } catch (error) {
      // Log detailed error information
      console.error('Test error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        errors: error.response?.data?.errors,
        requestData: error.config?.data
      });

      // Format the error message based on the type of error
      let errorMessage;
      if (error.response?.status === 422) {
        errorMessage = formatCommerce7Errors(error);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message || 'Failed to test address API';
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Process club signup by creating/updating customer and creating membership
   */
  const processClubSignup = async (formData) => {
    try {
      setLoading(true);
      
      // Validate required customer info
      const requiredCustomerFields = ['firstName', 'lastName', 'email'];
      const missingCustomerFields = requiredCustomerFields.filter(field => !formData[field]?.trim());
      
      if (missingCustomerFields.length > 0) {
        throw new Error(`Missing required customer fields: ${missingCustomerFields.join(', ')}`);
      }

      // Transform the data to match Commerce7's expected format
      const transformedData = {
        customerInfo: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || '',
          birthDate: formData.birthDate?.trim() || null
        },
        billingAddress: transformAddressData(formData.billingAddress, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        }),
        shippingAddress: formData.orderDeliveryMethod === 'Ship' ? 
          transformAddressData(formData.shippingAddress, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          }) : null,
        clubId: formData.clubId,
        orderDeliveryMethod: formData.orderDeliveryMethod
      };
      
      // Log the transformed data for debugging
      console.log('Sending data to Commerce7:', JSON.stringify(transformedData, null, 2));
      
      // Call our backend endpoint that handles Commerce7 API calls
      const response = await axios.post(`${API_BASE_URL}/api/club-signup`, transformedData);
      
      return response.data;
    } catch (error) {
      // Log detailed error information
      console.error('Club signup error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        errors: error.response?.data?.errors,
        requestData: error.config?.data
      });

      // Format the error message based on the type of error
      let errorMessage;
      if (error.response?.status === 422) {
        errorMessage = formatCommerce7Errors(error);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message || 'Failed to process club signup';
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    processClubSignup,
    testAddressApi
  };
};

export default useCommerce7Api; 