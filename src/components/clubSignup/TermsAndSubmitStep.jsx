import React, { useState } from 'react';
import TermsAndConditions from './TermsAndConditions';

const TermsAndSubmitStep = ({ formData, updateFormData, onBack, onSubmit, loading, error }) => {
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleTermsChange = (e) => {
    updateFormData({ termsAccepted: e.target.checked });
  };

  if (showTerms) {
    return <TermsAndConditions onBack={() => setShowTerms(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleTermsChange}
            required
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="termsAccepted" className="ml-3 text-base text-gray-900">
            By checking this box, you agree to the{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-primary hover:text-darkBrownHover underline"
            >
              Terms and Conditions
            </button>
            {' '}of the Milea Wine Club
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
          className="px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading || !formData.termsAccepted}
          className={`px-6 py-3 text-base font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors ${
            loading || !formData.termsAccepted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-darkBrownHover'
          }`}
        >
          {loading ? 'Processing...' : 'Complete Signup'}
        </button>
      </div>
    </form>
  );
};

export default TermsAndSubmitStep; 