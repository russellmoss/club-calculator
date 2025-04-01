import React from 'react';

const CustomerInfoStep = ({ formData, updateFormData, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate age before allowing form submission
    if (!validateAge(formData.birthDate)) {
      alert('You must be at least 21 years old to join the wine club.');
      return;
    }
    onNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Function to validate age
  const validateAge = (birthDate) => {
    if (!birthDate) return true; // Skip validation if no date provided
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 21;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="firstName" className="block text-base font-medium text-gray-900 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-base font-medium text-gray-900 mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-base font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-base font-medium text-gray-900 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-base font-medium text-gray-900 mb-2">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-darkBrownHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Next: Billing Address
        </button>
      </div>
    </form>
  );
};

export default CustomerInfoStep; 