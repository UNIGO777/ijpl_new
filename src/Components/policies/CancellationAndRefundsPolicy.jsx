import React from 'react';

const CancellationAndRefundsPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cancellation and Refund Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Cancellation Policy</h2>
          <p>
            Once a payment is made, customers can request for cancellation within 24 hours of placing the order. 
            Cancellation requests after 24 hours may not be entertained.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Refund Policy</h2>
          <p>
            Refunds will be processed through the same payment method used for the purchase.
            The refund amount will be credited back within 5-7 working days, depending on the payment method and bank processing time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Refund Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Services not rendered as described</li>
            <li>Technical issues preventing service delivery</li>
            <li>Duplicate payment issues</li>
            <li>Cancellation within the eligible timeframe</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Non-refundable Circumstances</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Services already delivered or consumed</li>
            <li>Cancellation requests after the eligible timeframe</li>
            <li>Violation of terms of service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Contact Information</h2>
          <p>
            For any queries regarding cancellation or refunds, please contact our support team at:
            <br />
            Email: contact@neelkanthpharmacy.com
            <br />
            Phone: +91 9303522323
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Payment Gateway Partner</h2>
          <p>
            All payments are processed securely through PhonePe. Any payment-related issues will be handled in accordance with
PhonePe's policies and procedures.
          </p>
        </section>
      </div>

      <footer className="mt-8 text-sm text-gray-600">
        <p>
          This policy is subject to change without prior notice. Please check this page periodically for any updates.
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
};

export default CancellationAndRefundsPolicy;
