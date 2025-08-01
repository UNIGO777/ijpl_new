import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, Package } from 'lucide-react';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const pricingPlans = [
    {
      id: 1,
      name: 'Basic Pack',
      price: 999,
      currency: 'INR',
      duration: '1 Month Supply',
      quantity: '30 Capsules',
      features: [
        'Increases Energy & Stamina',
        'Improves Physical Strength',
        'Natural Herbal Formula',
        'No Side Effects'
      ],
      popular: false,
      savings: '10% OFF'
    },
    {
      id: 2,
      name: 'Popular Pack',
      price: 1899,
      currency: 'INR',
      duration: '2 Months Supply',
      quantity: '60 Capsules',
      features: [
        'All Basic Pack Benefits',
        'Enhanced Performance',
        'Better Results',
        'Free Shipping'
      ],
      popular: true,
      savings: '20% OFF'
    },
    {
      id: 3,
      name: 'Value Pack',
      price: 2699,
      currency: 'INR',
      duration: '3 Months Supply',
      quantity: '90 Capsules',
      features: [
        'All Popular Pack Benefits',
        'Maximum Results',
        'Best Value for Money',
        'Priority Support'
      ],
      popular: false,
      savings: '30% OFF'
    }
  ];

  const handlePayment = async (plan) => {
    try {
      setSelectedPlan(plan);
      
      // For PhonePe integration, you would need to create an order first
      // and then redirect to PhonePe payment page
      console.log('PhonePe payment flow would be implemented here');
      console.log('Selected plan:', plan);
      
      // This would typically create an order on your backend and redirect to PhonePe
      alert(`PhonePe payment integration for ${plan.name} would be implemented here. Please use the main checkout page for actual payments.`);

    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your <span className="text-red-600">Power Pack</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the perfect package for your needs and experience the power of Ayurveda
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeInUp}
              className={`relative rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'border-2 border-red-500' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {plan.savings}
                </span>
              </div>

              <div className="mb-6">
                <p className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">₹{plan.price}</span>
                  <span className="ml-2 text-gray-500">/{plan.duration}</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">{plan.quantity}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                className={`w-full rounded-lg px-4 py-3 text-center font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Get Started Now
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            100% Satisfaction Guaranteed • Free Shipping on Orders Above ₹999 • EMI Available
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingPage;
