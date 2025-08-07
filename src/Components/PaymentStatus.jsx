import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Trophy, Home, RefreshCw, Mail, Phone } from 'lucide-react';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');

  useEffect(() => {
    if (orderId) {
      checkPaymentStatus();
    } else {
      setPaymentStatus('error');
      setLoading(false);
    }
  }, [orderId]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.ijpl.life/api/orders/${orderId}`);
      
      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        setPaymentStatus('failed');
        // console.log('API response not ok:', response.json())
        return;
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const orderData = result.data;
        console.log('Order data:', orderData.payment?.status);
        setOrderDetails({
          orderId: orderData.orderId,
          amount: orderData.totalAmount,
          playerName: orderData.player?.fullName || orderData.customer?.name,
          email: orderData.player?.email || orderData.customer?.email,
          phone: orderData.player?.phone || orderData.customer?.phone,
          ageGroup: orderData.player?.ageGroup,
          status: orderData.status,
          paymentStatus: orderData.payment?.status,
          paymentMethod: orderData.payment?.method
        });
        
        // Determine payment status based on order status and payment status
        if (orderData.payment?.status === 'completed') {
          setPaymentStatus('success');
        } else if (orderData.payment?.status === 'failed') {
          setPaymentStatus('failed');
        } else if (orderData.payment?.status === 'pending') {
          setPaymentStatus('pending');
        } else {
          // For COD or other cases
          setPaymentStatus(orderData.status === 'confirmed' ? 'success' : 'pending');
        }
      } else {
        console.error('API returned unsuccessful response:', result);
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          icon: <CheckCircle className="w-20 h-20 text-green-400" />,
          title: 'Registration Successful!',
          subtitle: 'Welcome to IJPL 2025',
          message: 'Your payment has been processed successfully and your registration is confirmed.',
          bgGradient: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-400/50',
          buttonColor: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-20 h-20 text-red-400" />,
          title: 'Payment Failed',
          subtitle: 'Registration Incomplete',
          message: 'Your payment could not be processed. Please try again or contact support.',
          bgGradient: 'from-red-500/20 to-rose-500/20',
          borderColor: 'border-red-400/50',
          buttonColor: 'from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600'
        };
      case 'pending':
        return {
          icon: <Clock className="w-20 h-20 text-yellow-400" />,
          title: 'Payment Pending',
          subtitle: 'Processing Your Registration',
          message: 'Your payment is being processed. Please wait while we confirm your registration.',
          bgGradient: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-400/50',
          buttonColor: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
        };
      default:
        return {
          icon: <RefreshCw className="w-20 h-20 text-blue-400 animate-spin" />,
          title: 'Checking Payment Status',
          subtitle: 'Please Wait',
          message: 'We are verifying your payment status...',
          bgGradient: 'from-blue-500/20 to-indigo-500/20',
          borderColor: 'border-blue-400/50',
          buttonColor: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
        };
    }
  };

  const config = getStatusConfig();

  if (loading && paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <RefreshCw className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Checking Payment Status</h2>
          <p className="text-blue-200">Please wait while we verify your payment...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 px-4 relative overflow-hidden">
      {/* Enhanced Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1500"></div>
        
        {/* Floating success particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${paymentStatus === 'success' ? 'bg-green-400' : paymentStatus === 'failed' ? 'bg-red-400' : 'bg-yellow-400'} rounded-full`}
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * 300 - 150],
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* IJPL Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Indian Jabalpur Premier League
            </h1>
            <p className="text-blue-200 mt-2">IJPL 2025 Registration Status</p>
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`bg-gradient-to-r ${config.bgGradient} backdrop-blur-md rounded-3xl p-8 border-2 ${config.borderColor} text-center relative overflow-hidden`}
        >
          {/* Success confetti animation */}
          {paymentStatus === 'success' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    scale: 0,
                    rotate: 0
                  }}
                  animate={{
                    x: `${Math.random() * 400 - 200}%`,
                    y: `${Math.random() * 400 - 200}%`,
                    scale: [0, 1, 0],
                    rotate: 360,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Premium glow effect */}
          <div className={`absolute inset-0 rounded-3xl opacity-20 ${paymentStatus === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : paymentStatus === 'failed' ? 'bg-gradient-to-r from-red-400 to-rose-400' : 'bg-gradient-to-r from-yellow-400 to-orange-400'} blur-xl`}></div>
          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            {config.icon}
          </motion.div>

          {/* Status Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
          >
            {config.title}
          </motion.h2>

          {/* Status Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-blue-200 mb-4"
          >
            {config.subtitle}
          </motion.p>

          {/* Status Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {config.message}
          </motion.p>

          {/* Order Details */}
          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/10 rounded-2xl p-6 mb-8 text-left"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Registration Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-200">Order ID:</span>
                  <span className="text-white font-mono ml-2">{orderId}</span>
                </div>
                <div>
                  <span className="text-blue-200">Amount:</span>
                  <span className="text-white ml-2">₹{orderDetails.amount || '1'}</span>
                </div>
                {orderDetails.playerName && (
                  <div>
                    <span className="text-blue-200">Player Name:</span>
                    <span className="text-white ml-2">{orderDetails.playerName}</span>
                  </div>
                )}
                {orderDetails.email && (
                  <div>
                    <span className="text-blue-200">Email:</span>
                    <span className="text-white ml-2">{orderDetails.email}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-r ${config.buttonColor} text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 `}
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>

            {paymentStatus === 'failed' && (
              <motion.button
                onClick={() => navigate('/#checkout')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 "
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </motion.button>
            )}

            {paymentStatus === 'pending' && (
              <motion.button
                onClick={checkPaymentStatus}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 "
              >
                <RefreshCw className="w-5 h-5" />
                Check Status
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Success Summary (only for successful payments) */}
        {paymentStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">🎉 What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Check Your Email</h4>
                  <p className="text-blue-200 text-sm">Registration confirmation sent to your email</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Join Our Community</h4>
                  <p className="text-blue-200 text-sm">Connect with fellow players and get updates</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Prepare for Glory</h4>
                  <p className="text-blue-200 text-sm">Tournament details will be shared soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <p className="text-blue-200 mb-4">Need help? Contact our support team</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:support@ijpl.life"
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-2 text-blue-300 hover:text-white transition-colors bg-white/10 py-2 px-4 rounded-lg"
              >
                <Mail className="w-4 h-4" />
                support@ijpl.life
              </motion.a>
              <motion.a
                href="tel:+919876543210"
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-2 text-blue-300 hover:text-white transition-colors bg-white/10 py-2 px-4 rounded-lg"
              >
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentStatus;
