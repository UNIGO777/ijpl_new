const cron = require('node-cron');
const Order = require('../models/Order');
const paymentService = require('./paymentService');
const emailService = require('./emailService');
const config = require('../config');
const axios = require('axios');

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
              // Only send emails if payment is actually confirmed/completed, not just pending
              if (!order.emailSent.customer && (updateResult.orderStatus === 'confirmed' || updateResult.orderStatus === 'completed')) {
                console.log(`Payment confirmed - sending emails for order: ${order.orderId}`);
                
                try {
                  // Send emails sequentially like in routes/orders.js
                  await emailService.sendAdminOrderNotification(order);
                  await emailService.sendCustomerOrderConfirmation(order);

                  const formattedPhone = order.player.phone.replace(/^0/, '+91');

                  console.log("sending whatsapp msges to", formattedPhone)

                  const apiUrl = `https://www.fast2sms.com/dev/whatsapp?authorization=${process.env.FAST2SMS_API_KEY}&message_id=${process.env.FAST2SMS_MESSAGE_ID || '3692'}&numbers=${formattedPhone,"+91 7999236121", "+91 7000610047"}&variables_values=${order.orderId}`;
          
                  const response = await axios.get(apiUrl);
                  
                  if (response.status === 200) {
                    console.log(`OTP sent successfully to ${formattedPhone}`);
                  } else {
                    throw new Error('Failed to send OTP');
                  }

                  
                  
                  // Update email sent flags
                  order.emailSent.customer = true;
                  order.emailSent.admin = true;
                  await order.save();
                  
                  console.log(`✅ All emails sent for confirmed order: ${order.orderId}`);
                } catch (emailError) {
                  console.error(`❌ Email error for order ${order.orderId}:`, emailError.message);
                  // Still update flags to avoid retrying
                  order.emailSent.customer = true;
                  order.emailSent.admin = true;
                  await order.save();
                }
              } else if (updateResult.orderStatus === 'pending') {
                console.log(`Payment still pending for order: ${order.orderId} - no emails sent`);
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