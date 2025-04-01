import React from 'react';

const TermsAndConditions = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          <strong>Membership:</strong> The Milea Wine Club is open to legal residents of the United States who are 21 years of age or older. By joining the Milea Wine Club, members agree to these terms and conditions.
        </p>

        <p className="mb-4">
          <strong>Membership Benefits:</strong> Members of the Milea Wine Club will receive a shipment of wine four times per year (every three months). Members will also receive exclusive access to limited edition wines, as well as discounts on additional purchases made through the Milea Wine Club.
        </p>

        <p className="mb-4">
          <strong>Shipment:</strong> Wine shipments will be sent to the address provided by the member. Members must be present to sign for the delivery and must provide a valid ID showing that they are 21 years of age or older. If a shipment is returned to Milea Wines due to an incorrect address, the member will be responsible for any additional shipping charges.
        </p>

        <p className="mb-4">
          <strong>Payment:</strong> Members will be charged for each shipment at the time of shipping or prior to pick-up. The cost of each shipment will vary based on the number of bottles and the price of the wine included in the shipment.
        </p>

        <p className="mb-4">
          <strong>Four Shipment Requirement:</strong> Members agree to receive four shipments of wine per year as part of their membership. If a member cancels their membership before receiving four shipments, an early termination fee of $150 will be incurred. This fee is to cover the cost of discounts and other benefits provided to the member as part of the membership program.
        </p>

        <p className="mb-4">
          <strong>Cancellation:</strong> Members may cancel their membership at any time by notifying Milea Wines in writing. If a cancellation is received before a shipment has been sent, the member will not be charged for that shipment. If a cancellation is received after a shipment has been sent, the member will be charged for that shipment and will receive it as scheduled.
        </p>

        <p className="mb-4">
          <strong>Returns:</strong> If a bottle of wine is defective or damaged, Milea Wines will replace it at no charge. If a member wishes to return a bottle for any other reason, they may do so within 30 days of receiving the shipment. The member will be responsible for the cost of shipping the bottle back to Milea Wines and will receive a refund for the cost of the wine (minus any shipping charges).
        </p>

        <p className="mb-4">
          <strong>Changes to Terms and Conditions:</strong> Milea Wines reserves the right to change these terms and conditions at any time. Members will be notified of any changes via email.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-darkBrownHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Back to Sign Up
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions; 