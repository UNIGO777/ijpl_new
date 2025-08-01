const config = require('../config');

class PaymentService {
  constructor() {
    this.client = null;
    this.initPromise = null;
    this.isInitialized = false;
    // Start initialization immediately
    this.initPromise = this.initializeClient();
  }

  async initializeClient() {
    try {
      console.log('🔄 Initializing PhonePe SDK...');
      console.log('📋 Config check:', {
        clientId: config.phonepe.clientId,
        clientSecret: config.phonepe.clientSecret ? config.phonepe.clientSecret.substring(0, 10) + '...' : 'NOT SET',
        clientVersion: config.phonepe.clientVersion,
        environment: config.phonepe.environment
      });

      // Dynamic import for ES6 module
      const { StandardCheckoutClient, Env } = await import('pg-sdk-node');
      
      const environment = config.phonepe.environment === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;
      
      this.client = StandardCheckoutClient.getInstance(
        config.phonepe.clientId,
        config.phonepe.clientSecret,
        config.phonepe.clientVersion,
        environment
      );
      
      this.isInitialized = true;
      console.log('✅ PhonePe SDK Client initialized successfully');
      return this.client;
    } catch (error) {
      console.error('❌ Failed to initialize PhonePe SDK:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  async ensureClientReady() {
    if (!this.isInitialized) {
      console.log('⏳ Waiting for PhonePe SDK initialization...');
      await this.initPromise;
    }
    
    if (!this.client) {
      throw new Error('PhonePe SDK client not available');
    }
    
    return this.client;
  }

  // Create PhonePe payment order using official SDK
  async createOrder(orderData) {
    try {
      console.log('🔄 [PaymentService] createOrder called with:', {
        orderId: orderData.orderId,
        amount: orderData.amount,
        customerEmail: orderData.customerEmail
      });

      console.log('🔄 [PaymentService] Ensuring client is ready...');
      const client = await this.ensureClientReady();
      console.log('✅ [PaymentService] Client ready, proceeding with order creation');
      
      // Import the request builder
      const { StandardCheckoutPayRequest } = await import('pg-sdk-node');
      
      const redirectUrl = `https://ijpl-new-backend.onrender.com/api/orders/verify-payment/${orderData.orderId}`;
      
      const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(orderData.orderId)
        .amount(orderData.amount * 100) // Amount in paise
        .redirectUrl(redirectUrl)
        .build();

      console.log('📦 Creating PhonePe order:', {
        merchantOrderId: orderData.orderId,
        amount: orderData.amount * 100,
        redirectUrl,
        clientId: config.phonepe.clientId,
        environment: config.phonepe.environment
      });

      console.log('🚀 [PaymentService] Calling client.pay()...');
      const response = await client.pay(request);
      
      console.log('✅ PhonePe order created successfully');
      
      return {
        success: true,
        orderId: orderData.orderId,
        phonePeOrderId: orderData.orderId, // SDK uses merchantOrderId
        redirectUrl: response.redirectUrl,
        amount: orderData.amount,
        currency: 'INR'
      };
      
    } catch (error) {
      console.error('❌ PhonePe order creation error:', error);
      
      // Handle PhonePe SDK specific errors
      let userFriendlyMessage = 'Payment initiation failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('CLIENT_ID') || error.message.includes('CLIENT_SECRET')) {
          userFriendlyMessage = 'PhonePe merchant credentials are not authorized. Please contact PhonePe support to activate your merchant account.';
        } else if (error.message.includes('NETWORK') || error.message.includes('timeout')) {
          userFriendlyMessage = 'Network error occurred. Please check your internet connection and try again.';
        }
      }
      
      return {
        success: false,
        error: userFriendlyMessage,
        details: error.message
      };
    }
  }

  // Check payment status using official SDK
  async checkOrderPaymentStatus(merchantOrderId) {
    try {
      const client = await this.ensureClientReady();
      
      console.log('🔍 Checking payment status for order:', merchantOrderId);
      
      const response = await client.getOrderStatus(merchantOrderId);
      
      console.log('📊 Payment status response:', {
        orderId: merchantOrderId,
        state: response.state,
        amount: response.amount
      });
      
      return {
        success: true,
        status: response.state,
        merchantOrderId: merchantOrderId,
        amount: response.amount,
        transactionId: response.transactionId
      };
      
    } catch (error) {
      console.error('❌ Payment status check error:', error);
      
      return {
        success: false,
        error: 'Failed to check payment status',
        details: error.message
      };
    }
  }

  // Verify and update order after payment
  async verifyAndUpdateOrder(order, paymentDetails) {
    try {
      const statusResult = await this.checkOrderPaymentStatus(order.orderId);
      
      if (!statusResult.success) {
        throw new Error('Failed to verify payment status');
      }
      
      console.log(order)
      // Map PhonePe states to our order states
      let orderStatus = 'pending';
      let paymentStatus = 'pending';
      
      switch (statusResult.status) {
        case 'COMPLETED':
          orderStatus = 'confirmed';
          paymentStatus = 'completed';
          break;
        case 'FAILED':
          orderStatus = 'cancelled';
          paymentStatus = 'failed';
          break;
        default:
          orderStatus = 'pending';
          paymentStatus = 'pending';
      }
      
      // Update order in database
      order.status = orderStatus;
      order.payment.status = paymentStatus;
      order.payment.phonePeTransactionId = statusResult.transactionId;
      order.payment.verifiedAt = new Date();

      
      await order.save();
      
      console.log('✅ Order updated successfully:', {
        orderId: order.orderId,
        orderStatus,
        paymentStatus
      });
      
      return {
        success: true,
        orderStatus,
        paymentStatus,
        order
      };
      
    } catch (error) {
      console.error('❌ Order verification error:', error);
      
      return {
        success: false,
        error: 'Failed to verify and update order',
        details: error.message
      };
    }
  }

  // Handle PhonePe callback validation
  async validateCallback(authHeader, responseBody, username, password) {
    try {
      const client = await this.ensureClientReady();
      
      const callbackResponse = client.validateCallback(
        username,
        password,
        authHeader,
        responseBody
      );
      
      return {
        success: true,
        orderId: callbackResponse.payload.orderId,
        state: callbackResponse.payload.state,
        payload: callbackResponse.payload
      };
      
    } catch (error) {
      console.error('❌ Callback validation error:', error);
      
      return {
        success: false,
        error: 'Invalid callback',
        details: error.message
      };
    }
  }

  // Refund payment (if supported by SDK)
  async refundPayment(transactionId, amount, reason = 'Customer request') {
    try {
      // Note: Check if refund functionality is available in the SDK
      console.log('🔄 Refund requested:', { transactionId, amount, reason });
      
      // For now, return a placeholder response
      // You'll need to check PhonePe SDK documentation for refund APIs
      
      return {
        success: false,
        error: 'Refund functionality not yet implemented with SDK',
        message: 'Please contact PhonePe support for refunds'
      };
      
    } catch (error) {
      console.error('❌ Refund error:', error);
      
      return {
        success: false,
        error: 'Refund failed',
        details: error.message
      };
    }
  }
}

module.exports = new PaymentService(); 