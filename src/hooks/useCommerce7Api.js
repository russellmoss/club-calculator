import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const useCommerce7Api = () => {
  const [loading, setLoading] = useState(false);
  
  /**
   * Process club signup by creating/updating customer and creating membership
   */
  const processClubSignup = async (formData) => {
    try {
      setLoading(true);
      
      // Call our backend endpoint that handles Commerce7 API calls
      const response = await axios.post(`${API_BASE_URL}/api/club-signup`, {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate
        },
        billingAddress: formData.billingAddress,
        shippingAddress: formData.shippingAddress,
        clubId: formData.clubId,
        orderDeliveryMethod: formData.orderDeliveryMethod
      });
      
      return response.data;
    } catch (error) {
      console.error('Club signup error:', error);
      throw new Error(error.response?.data?.message || 'Failed to process club signup');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    processClubSignup
  };
};

export default useCommerce7Api; 