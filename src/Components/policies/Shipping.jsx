import React from 'react';

const Shipping = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-12">
        Shipping Policy
      </h1>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Delivery Information
        </h2>
        <p className="mb-4">
          At PalankTop, we strive to deliver your orders as quickly as possible. Orders are typically processed within 1-2 business days after payment confirmation.
        </p>
        <p className="mb-4">
          Standard delivery within major cities takes 2-4 business days. For remote areas, delivery may take 4-7 business days.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Shipping Charges
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Free shipping on all orders above ₹999 across India</li>
          <li>Standard shipping charge of ₹49 for orders below ₹999</li>
          <li>Additional charges may apply for express delivery or remote locations</li>
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Track Your Order
        </h2>
        <p className="mb-4">
          You'll receive a tracking link via email and SMS once your order ships. You can also track your order status by logging into your PalankTop account.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Delivery Partners
        </h2>
        <p className="mb-4">
          We work with trusted courier partners including BlueDart, DTDC, and Delhivery to ensure safe and timely delivery of your orders.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Need Help?
        </h2>
        <p className="mb-4">
          For any shipping related queries, please contact our customer support:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Email: support@palanktop.com</li>
          <li>Phone: +91-9876543210 (Mon-Sat, 9AM-6PM)</li>
          <li>WhatsApp: +91-9876543210</li>
        </ul>
      </div>
    </div>
  );
};

export default Shipping;
