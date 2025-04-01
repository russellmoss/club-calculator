import React from 'react';

const TermsAndSubmitStep = ({ formData, updateFormData, onBack, onSubmit, loading, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleTermsChange = (e) => {
    updateFormData({ termsAccepted: e.target.checked });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Terms and Conditions</h3>
        
        <div className="prose prose-sm text-gray-500">
          <p>
            By joining our wine club, you agree to the following terms:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You must be 21 years of age or older to join.</li>
            <li>Membership fees will be billed according to the selected club's schedule.</li>
            <li>Wine shipments will be sent to the provided shipping address.</li>
            <li>You are responsible for ensuring someone 21 or older is available to sign for deliveries.</li>
            <li>Membership benefits are subject to change with notice.</li>
            <li>You may cancel your membership at any time by contacting us.</li>
          </ul>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleTermsChange}
            required
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
            I accept the terms and conditions
          </label>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading || !formData.termsAccepted}
          className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            (loading || !formData.termsAccepted) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : 'Complete Signup'}
        </button>
      </div>
    </form>
  );
};

export default TermsAndSubmitStep; 