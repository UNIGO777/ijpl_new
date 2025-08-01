const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { 
  validateOrderCreation, 
  validateOrderStatusUpdate, 
  validatePaymentVerification,
  validateOrdersQuery,
  sanitizeInput 
} = require('../middleware/validation');
const paymentService = require('../services/paymentService');
const emailService = require('../services/emailService');
const config = require('../config');

// Create new registration
router.post('/create', sanitizeInput, validateOrderCreation, async (req, res) => {
  try {
    const registrationData = req.body;
    
    console.log('📋 Cricket Registration Request:', {
      playerName: registrationData.player?.fullName,
      ageGroup: registrationData.player?.ageGroup,
      playingRole: registrationData.player?.playingRole,
      paymentMethod: registrationData.payment?.method
    });
    
    // Get registration fee from environment
    const registrationFee = parseInt(process.env.REGISTRATION_FEE) || 3300;
    
    // Create registration order
    const order = new Order({
      player: registrationData.player,
      registration: {
        fee: registrationFee,
        season: '2025',
        category: 'Indian Jabalpur Premier League'
      },
      totalAmount: registrationFee,
      payment: registrationData.payment,
      notes: registrationData.notes || ''
    });

    // If payment method is PhonePe, create PhonePe payment order
    if (registrationData.payment.method === 'phonepe') {
      const phonePeOrderData = {
        amount: registrationFee,
        orderId: order.orderId,
        customerEmail: registrationData.player.email,
        customerName: registrationData.player.fullName,
        customerPhone: registrationData.player.phone
      };

      console.log('💰 Creating PhonePe payment for registration:', {
        amount: registrationFee,
        playerName: registrationData.player.fullName,
        orderId: order.orderId
      });

      const phonePeResult = await paymentService.createOrder(phonePeOrderData);
      
      if (!phonePeResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Failed to create payment order for registration',
          error: phonePeResult.error
        });
      }

      order.payment.phonePeOrderId = phonePeResult.orderId;
      order.payment.phonePeTransactionId = phonePeResult.phonePeTransactionId;
      order.payment.redirectUrl = phonePeResult.redirectUrl;
    }

    await order.save();

    // 🐛 DEBUG: Check registration before email sending
    console.log('🔍 REGISTRATION CHECK - Before email sending:');
    console.log('Registration ID:', order.orderId);
    console.log('Player Name:', order.player.fullName);
    console.log('Age Group:', order.player.ageGroup);
    console.log('Payment method:', order.payment.method);
    console.log('Registration status:', order.status);
    console.log('Has formattedOrderDate:', !!order.formattedOrderDate);
    
    // Add formattedOrderDate if missing (common issue!)
    if (!order.formattedOrderDate) {
      order.formattedOrderDate = new Date(order.orderDate).toLocaleDateString('en-IN');
      console.log('🔧 Added missing formattedOrderDate:', order.formattedOrderDate);
    }

    // Send emails asynchronously (non-blocking) - Only for Cash on Delivery
    // For online payments, emails will be sent after payment verification
    if (order.payment.method === 'cod') {
      console.log('✅ COD Registration - starting email sequence...');
      
      // Start email sending tasks without waiting for them to complete
      emailService.sendAdminOrderNotification(order);
      emailService.sendCustomerOrderConfirmation(order);
      
      console.log('✅ COD Registration created, emails queued for sending in background');
    } else {
      console.log('ℹ️  Online payment registration created, emails will be sent after payment verification');
      console.log('   Payment method was:', order.payment.method);
    }

    res.status(201).json({
      success: true,
      message: 'Cricket registration created successfully',
      registrationId: order.orderId,
      playerName: order.player.fullName,
      ageGroup: order.player.ageGroup,
      registrationFee: order.totalAmount,
      data: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        phonePeOrderId: order.payment.phonePeOrderId,
        phonePeTransactionId: order.payment.phonePeTransactionId,
        redirectUrl: order.payment.redirectUrl,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Verify PhonePe payment and update order
router.get('/verify-payment/:orderId', sanitizeInput, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Use the shared verification function to check PhonePe payment status
    const updateResult = await paymentService.verifyAndUpdateOrder(order, {});

    if (!updateResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Send confirmation emails for verified online payments (sequentially)
    if (!order.emailSent.customer) {
      console.log('💳 Online payment verified - starting sequential email sending...');
      
      try {
        // Send emails one by one for verified online payment
     
        await emailService.sendAdminOrderNotification(order);
        await emailService.sendCustomerOrderConfirmation(order);
        console.log('✅ Customer email sent');
        
        console.log('📧 2. Sending admin notification...');
        console.log('✅ Admin email sent');
        
        
        
        // Update email sent flag after all emails are sent
        order.emailSent.customer = true;
        order.emailSent.admin = true;
        await order.save();
        
        console.log('🎉 Online payment verified, all 3 emails sent successfully!');
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError.message);
        // Still update flags to avoid retrying failed emails
        order.emailSent.customer = true;
        order.emailSent.admin = true;
        await order.save();
        console.log('⚠️  Payment verified but some emails may have failed');
      }
    } else {
      console.log('Payment verified, but emails already sent for this order');
    }

    res.redirect(`http://www.ijpl.life/payment-success?orderId=${orderId}`);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// PhonePe Payment Callback
router.post('/phonepe-callback', async (req, res) => {
  try {
    console.log('PhonePe callback received:', req.body);
    
    // PhonePe will send payment status in the callback
    const callbackData = req.body;
    
    // Find order by merchant transaction ID
    const order = await Order.findOne({ orderId: callbackData.merchantTransactionId });
    if (!order) {
      console.error('Order not found for callback:', callbackData.merchantTransactionId);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify the callback and update order
    const verificationResult = paymentService.verifyPaymentCallback(callbackData);
    
    if (verificationResult.success) {
      // Update order status based on payment success
      order.payment.status = 'completed';
      order.status = 'confirmed';
      order.payment.phonePeTransactionId = verificationResult.paymentId;
      await order.save();
      
      console.log('Payment callback processed successfully for order:', order.orderId);
    } else {
      // Payment failed
      order.payment.status = 'failed';
      order.status = 'cancelled';
      await order.save();
      
      console.log('Payment failed for order:', order.orderId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('PhonePe callback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID (public - for customer order tracking)
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId }).select('-payment.razorpaySignature -adminNotes');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order'
    });
  }
});

// Admin Routes (require authentication)

// Get all orders (admin only)
router.get('/', verifyToken, verifyAdmin, validateOrdersQuery, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      sortBy = 'orderDate', 
      sortOrder = 'desc',
      search 
    } = req.query;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders'
    });
  }
});

// Update order status (admin only)
router.patch('/:orderId/status', verifyToken, verifyAdmin, sanitizeInput, validateOrderStatusUpdate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, adminNotes } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousStatus = order.status;
    
    // Update order
    order.status = status;
    if (trackingNumber) order.shipping.trackingNumber = trackingNumber;
    if (adminNotes) order.adminNotes = adminNotes;
    
    // Set estimated delivery for shipped orders
    if (status === 'shipped' && !order.shipping.estimatedDelivery) {
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // 7 days from now
      order.shipping.estimatedDelivery = estimatedDelivery;
    }
    
    // Set actual delivery date for delivered orders
    if (status === 'delivered') {
      order.shipping.actualDelivery = new Date();
    }

    await order.save();

    // Send status update email to customer
    if (status !== previousStatus) {
      emailService.sendOrderStatusUpdate(order, previousStatus);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId: order.orderId,
        status: order.status,
        previousStatus
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Get order analytics (admin only)
router.get('/analytics/summary', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchConditions = {
      'payment.status': 'completed' // Only include completed payments
    };
    if (startDate || endDate) {
      matchConditions.orderDate = {};
      if (startDate) matchConditions.orderDate.$gte = new Date(startDate);
      if (endDate) matchConditions.orderDate.$lte = new Date(endDate);
    }

    const analytics = await Order.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
          totalQuantity: { $sum: '$product.quantity' }
        }
      }
    ]);

    const statusDistribution = await Order.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const paymentMethodDistribution = await Order.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: '$payment.method',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find(matchConditions)
      .sort({ orderDate: -1 })
      .limit(10)
      .select('orderId player.fullName totalAmount status orderDate')
      .lean();

    res.json({
      success: true,
      data: {
        summary: analytics[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          avgOrderValue: 0,
          totalQuantity: 0
        },
        statusDistribution,
        paymentMethodDistribution,
        recentOrders
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics'
    });
  }
});

// Delete order (admin only - for testing/cleanup)
router.delete('/:orderId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOneAndDelete({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
});

module.exports = router; 