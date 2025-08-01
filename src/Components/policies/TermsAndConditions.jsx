import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using our payment services through PhonePe, you agree to be bound by these Terms and Conditions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Payment Services</h2>
          <p>We use PhonePe as our payment gateway service provider. By making payments through our platform, you also agree to PhonePe's terms of service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Payment Processing</h2>
          <ul className="list-disc pl-6">
            <li>All payments are processed securely through PhonePe's payment gateway</li>
            <li>We do not store your credit card information</li>
            <li>Transaction details are encrypted and secured using industry-standard protocols</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Refund Policy</h2>
          <p>Refunds, if applicable, will be processed through the original payment method used for the transaction. Processing time may vary depending on your payment provider.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. User Obligations</h2>
          <p>You agree to provide accurate and complete information for payment processing and take responsibility for all transactions conducted using your payment credentials.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Security</h2>
          <p>While we implement security measures to protect your payment information, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account details.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>We shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of our payment services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of our services after such modifications constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
          <p>For any questions regarding these terms or our payment services, please contact our support team.</p>
        </section>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
