import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p>When you use our payment services, we collect information that you provide directly to us, including:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Personal information (name, email address, phone number)</li>
            <li>Payment information (credit card details, bank account information)</li>
            <li>Transaction details</li>
            <li>Device and usage information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Processing payments and transactions</li>
            <li>Providing customer support</li>
            <li>Preventing fraud and maintaining security</li>
            <li>Improving our services</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Banking partners and financial institutions</li>
            <li>Service providers and vendors</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p>We implement appropriate security measures to protect your information, including:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Access controls and monitoring</li>
            <li>Compliance with PCI-DSS standards</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <div className="mt-2">
            <p>Email: privacy@neelkanthpharmacy.com</p>
            <p>Address: Neelkanth Pharmacy</p>
            <p>Phone: 1800-123-456</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Updates to Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
