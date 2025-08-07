import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Trophy, Shield, ArrowLeft, Users } from 'lucide-react';
import PaymentStatusChecker from './PaymentStatusChecker';
import { toast } from 'react-toastify';

const Checkout = ({ onBack }) => {
  const [formData, setFormData] = useState({
    player: {
      fullName: '',
      email: '',
      phone: '',
      ageGroup: '',
      state: '',
      playingRole: '',
      battingHandedness: '',
      bowlingStyle: '',
      battingOrder: ''
    },
    payment: {
      method: 'phonepe'
    },
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [registrationFee, setRegistrationFee] = useState(1100);
  const [lastOrderId, setLastOrderId] = useState(() => {
    return localStorage.getItem('lastOrderId') || null;
  });

  // Cricket form options
  const ageGroups = ['Under 19', 'Senior Player'];
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];
  const playingRoles = ['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper', 'Wicket Keeper Batsman'];
  const battingHandedness = ['Right Handed', 'Left Handed'];
  const bowlingStyles = [
    'Right Arm Fast', 'Right Arm Medium', 'Left Arm Fast', 'Left Arm Medium', 
    'Right Arm Spin', 'Left Arm Spin', 'Not Applicable'
  ];
  const battingOrders = ['Top Order', 'Middle Order', 'Lower Order'];

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.player.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      toast.error('Full name is required');
    } else if (formData.player.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
      toast.error('Name must be at least 2 characters');
    }

    if (!formData.player.email.trim()) {
      newErrors.email = 'Email is required';
      toast.error('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.player.email)) {
      newErrors.email = 'Email is invalid';
      toast.error('Email is invalid');
    }

    if (!formData.player.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      toast.error('Phone number is required');
    } else if (!/^[6-9]\d{9}$/.test(formData.player.phone)) {
      newErrors.phone = 'Enter valid 10-digit phone number';
      toast.error('Enter valid 10-digit phone number');
    }

    if (!formData.player.ageGroup) {
      newErrors.ageGroup = 'Age group is required';
      toast.error('Age group is required');
    }

    if (!formData.player.state) {
      newErrors.state = 'State is required';
      toast.error('State is required');
    }

    if (!formData.player.playingRole) {
      newErrors.playingRole = 'Playing role is required';
      toast.error('Playing role is required');
    }

    if (!formData.player.battingHandedness) {
      newErrors.battingHandedness = 'Batting handedness is required';
      toast.error('Batting handedness is required');
    }

    if (!formData.player.bowlingStyle) {
      newErrors.bowlingStyle = 'Bowling style is required';
      toast.error('Bowling style is required');
    }

    if (!formData.player.battingOrder) {
      newErrors.battingOrder = 'Batting order is required';
      toast.error('Batting order is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name.split('.').pop()]) {
      setErrors(prev => ({
        ...prev,
        [name.split('.').pop()]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log('🏏 Submitting cricket registration:', formData);

      const response = await fetch('https://api.ijpl.life/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (data.success) {
        setOrderDetails(data.data);
        localStorage.setItem('lastOrderId', data.data.orderId);
        setLastOrderId(data.data.orderId);
        toast.success('Registration successful!');

        if (formData.payment.method === 'phonepe' && data.data.redirectUrl) {
          console.log('🚀 Redirecting to PhonePe payment:', data.data.redirectUrl);
          window.location.href = data.data.redirectUrl;
        } else {
          setOrderSuccess(true);
        }
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        submit: error.message || 'Registration failed. Please try again.' 
      });
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (orderSuccess && orderDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Welcome to Indian Jabalpur Premier League 2025!
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold">Registration ID:</span> {orderDetails.orderId}</p>
              <p><span className="font-semibold">Player:</span> {formData.player.fullName}</p>
              <p><span className="font-semibold">Age Group:</span> {formData.player.ageGroup}</p>
              <p><span className="font-semibold">Registration Fee:</span> ₹{registrationFee}</p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 px-4 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1500"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
              IJPL 2025
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Player Registration
            </h2>
            <p className="text-lg text-blue-200 mb-6">Secure Your Spot in India's Premier T10 Cricket League</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Prize Pool: ₹76+ Lakhs
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registration Fee: ₹{registrationFee}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Status Checker */}
        {lastOrderId && !orderSuccess && (
          <PaymentStatusChecker 
            orderId={lastOrderId} 
            onPaymentSuccess={() => setOrderSuccess(true)}
            onPaymentFailed={() => setLastOrderId(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Personal Information
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="player.fullName"
                    value={formData.player.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white placeholder-blue-200 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm ${
                      errors.fullName ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                    }`}
                    placeholder="Enter your full name"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.fullName && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="player.phone"
                      value={formData.player.phone}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white placeholder-blue-200 focus:ring-4 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300 backdrop-blur-sm ${
                        errors.phone ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.phone && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.phone}</p>}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="player.email"
                      value={formData.player.email}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white placeholder-blue-200 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm ${
                        errors.email ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                      }`}
                      placeholder="Enter your email address"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Age Group *
                  </label>
                  <div className="relative">
                    <select
                      name="player.ageGroup"
                      value={formData.player.ageGroup}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white focus:ring-4 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                        errors.ageGroup ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <option value="" className="bg-slate-800 text-white">Select Age Group</option>
                      {ageGroups.map(group => (
                        <option key={group} value={group} className="bg-slate-800 text-white">{group}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.ageGroup && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.ageGroup}</p>}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    Select your state *
                  </label>
                  <div className="relative">
                    <select
                      name="player.state"
                      value={formData.player.state}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                        errors.state ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <option value="" className="bg-slate-800 text-white">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state} className="bg-slate-800 text-white">{state}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.state && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.state}</p>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cricket Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Cricket Information
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  Playing Roles *
                </label>
                <div className="relative">
                  <select
                    name="player.playingRole"
                    value={formData.player.playingRole}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                      errors.playingRole ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <option value="" className="bg-slate-800 text-white">Select Playing Role</option>
                    {playingRoles.map(role => (
                      <option key={role} value={role} className="bg-slate-800 text-white">{role}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.playingRole && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.playingRole}</p>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    Batting Handedness *
                  </label>
                  <div className="relative">
                    <select
                      name="player.battingHandedness"
                      value={formData.player.battingHandedness}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white focus:ring-4 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                        errors.battingHandedness ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <option value="" className="bg-slate-800 text-white">Select Batting Hand</option>
                      {battingHandedness.map(hand => (
                        <option key={hand} value={hand} className="bg-slate-800 text-white">{hand}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.battingHandedness && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.battingHandedness}</p>}
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                    Preferred Bowling Style *
                  </label>
                  <div className="relative">
                    <select
                      name="player.bowlingStyle"
                      value={formData.player.bowlingStyle}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                        errors.bowlingStyle ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <option value="" className="bg-slate-800 text-white">Select Bowling Style</option>
                      {bowlingStyles.map(style => (
                        <option key={style} value={style} className="bg-slate-800 text-white">{style}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.bowlingStyle && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.bowlingStyle}</p>}
                </div>
              </div>

              <div className="group">
                <label className="text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                  Preferred Batting Order *
                </label>
                <div className="relative">
                  <select
                    name="player.battingOrder"
                    value={formData.player.battingOrder}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 bg-white/10 border-2 rounded-2xl text-white focus:ring-4 focus:ring-violet-500/50 focus:border-violet-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                      errors.battingOrder ? 'border-red-400 focus:border-red-400' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <option value="" className="bg-slate-800 text-white">Select Batting Order</option>
                    {battingOrders.map(order => (
                      <option key={order} value={order} className="bg-slate-800 text-white">{order}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.battingOrder && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{errors.battingOrder}</p>}
              </div>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Payment Method
              </h3>
            </div>
            
            <div className="bg-white/5 border-2 border-green-400/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Secure Online Payment</p>
                    <p className="text-blue-200">Pay safely with PhonePe (UPI, Cards, Net Banking)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">Available</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Additional Notes (Optional)
              </h3>
            </div>
            <div className="group relative">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm resize-none hover:border-white/40"
                placeholder="Share your cricket experience, achievements, or any special information..."
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            {errors.submit && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
              >
                <p className="text-red-300 font-medium">{errors.submit}</p>
              </motion.div>
            )}
            
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white py-6 px-8 rounded-3xl text-xl font-bold hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-orange-500/25 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="relative z-10">Processing Registration...</span>
                </>
              ) : (
                <>
                  <Trophy className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Complete Registration - ₹{registrationFee}</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;