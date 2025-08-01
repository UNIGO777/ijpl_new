const cron = require('node-cron');
const Order = require('../models/Order');
const paymentService = require('./paymentService');
const emailService = require('./emailService');
const config = require('../config');

class CronService {
  constructor() {
    this.jobs = [];
  }

  // Initialize cron jobs
  init() {
    this.setupPaymentVerificationChecker();
    console.log('Cron service initialized');
  }

  // Check pending payments every minute
  setupPaymentVerificationChecker() {
    const job = cron.schedule('* * * * *', async () => {
      try {
        console.log('Running payment verification check...');
        
        // Get current time and time windows
        const now = Date.now();
        const threeMinutesAgo = new Date(now - 3 * 60 * 1000);
        
        // Find pending orders that are less than 3 minutes old
        const pendingOrders = await Order.find({
          'payment.method': 'phonepe',
          'payment.status': 'pending',
          orderDate: { 
            $gte: threeMinutesAgo, // Only orders from last 3 minutes
            $lte: new Date(now) // Up to current time
          }
        });

        console.log(`Found ${pendingOrders.length} recent pending orders to verify`);

        for (const order of pendingOrders) {
          try {
            if (!order.orderId) continue;

            console.log(`Verifying payment for recent order: ${order.orderId}`);
            
            // Check payment status with PhonePe
            const updateResult = await paymentService.verifyAndUpdateOrder(order, {});

            if (updateResult.success) {
              // Send confirmation emails if payment verified
              if (!order.emailSent.customer) {
                console.log(`Payment verified - sending emails for order: ${order.orderId}`);
                
                try {
                  // Send emails sequentially like in routes/orders.js
                  await emailService.sendAdminOrderNotification(order);
                  await emailService.sendCustomerOrderConfirmation(order);
                  
                  // Update email sent flags
                  order.emailSent.customer = true;
                  order.emailSent.admin = true;
                  await order.save();
                  
                  console.log(`✅ All emails sent for order: ${order.orderId}`);
                } catch (emailError) {
                  console.error(`❌ Email error for order ${order.orderId}:`, emailError.message);
                  // Still update flags to avoid retrying
                  order.emailSent.customer = true;
                  order.emailSent.admin = true;
                  await order.save();
                }
              }
              
              console.log(`Successfully verified payment for order: ${order.orderId}`);
            }

          } catch (error) {
            console.error(`Error processing order ${order.orderId}:`, error);
          }
        }

        // Mark orders older than 3 minutes as expired
        await Order.updateMany(
          {
            'payment.method': 'phonepe',
            'payment.status': 'pending',
            orderDate: { $lt: threeMinutesAgo }
          },
          {
            $set: {
              'payment.status': 'expired',
              status: 'cancelled'
            }
          }
        );

      } catch (error) {
        console.error('Payment verification checker error:', error);
      }
    });

    this.jobs.push(job);
  }

  // Stop all cron jobs
  stopAll() {
    this.jobs.forEach(job => job.stop());
    console.log('All cron jobs stopped');
  }
}

module.exports = new CronService();