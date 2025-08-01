const nodemailer = require('nodemailer');
const config = require('../config');
const taskQueue = require('./taskQueueService');
const emailLogger = require('./emailLogger');
const emailFallback = require('./emailFallbackService');
const noopEmailService = require('./noopEmailService');

class EmailService {
  constructor() {
    // Check if we're in development mode and should use NoOp service
    this.isDevelopment = config.nodeEnv === 'development';
    
    // If we're in development mode and no email settings are provided, use NoOp service immediately
    if (this.isDevelopment && (!config.email.host || !config.email.user || !config.email.pass)) {
      console.log('Email credentials not configured properly. NoOp email service will be used for development.');
      noopEmailService.activate();
    }
    
    // Ensure port is an integer and use the confirmed working configuration
    // Based on our testing with email-setup-checker.js:
    // - Port 465 requires secure:true
    // - Port 587 would require secure:false (for other providers)
    const port = parseInt(config.email.port);
    
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: port,
      secure: port === 465, // Use secure based on port
      auth: {
        user: config.email.user,
        pass: config.email.pass
      },
      // Updated timeout settings
      connectionTimeout: 30000, // 30 seconds (was 10s)
      greetingTimeout: 15000,   // 15 seconds (was 5s)
      socketTimeout: 30000,     // 30 seconds (was 10s)
      debug: this.isDevelopment,
      // Disabled problematic connection pooling
      pool: false,              // Disable pooling to avoid connection issues
      maxConnections: 1,        // Single connection
      maxMessages: 1            // One message per connection
    });
    
    // Track failed emails for potential retry
    this.failedEmails = [];
    
    // Set retry interval (if needed later)
    this.maxRetries = 3;
  }

  // Test email connection
  async testConnection() {
    try {
      // Initialize the email logger
      await emailLogger.init();
      
      // Log SMTP configuration with type information for debugging
      console.log(`Attempting to connect to SMTP server: ${config.email.host}:${config.email.port} (${typeof config.email.port}), secure: ${config.email.port === 465}, parsed port: ${parseInt(config.email.port)}, user: ${config.email.user}`);
      
      // Add a timeout to prevent hanging for too long
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email verification timed out after 15 seconds')), 15000)
      );
      
      // Race between verification and timeout
      await Promise.race([
        this.transporter.verify(),
        timeoutPromise
      ]);
      
      // Also test fallback connection
      await emailFallback.testConnection();
      
      console.log('Email service is ready');
      return true;
    } catch (primaryError) {
      console.error('Primary email service error:', primaryError);
      console.log('Attempting to initialize fallback email service...');
      
      try {
        // Try to initialize fallback
        const fallbackSuccess = await emailFallback.testConnection();
        if (fallbackSuccess) {
          console.log('Fallback email service initialized successfully');
          return true;
        }
      } catch (fallbackError) {
        console.error('Fallback email service error:', fallbackError);
      }
      
      // If both primary and fallback failed, use the NoOp service
      console.log('All email services failed. Activating NoOp email service for development mode.');
      noopEmailService.activate();
      
      return true; // Return true anyway so server can start
    }
  }

  // Customer order confirmation email
  async sendCustomerOrderConfirmation(order) {
    // Queue the email sending task with retries
    const taskOptions = taskQueue.createTaskOptions(3, 10000); // 3 retries, 10 second delay
    
    return taskQueue.addTask(
      async (orderData) => {
        const emailTemplate = this.getCustomerOrderTemplate(orderData);
        
        const mailOptions = {
          from: config.email.from,
          to: orderData.player.email,
          subject: `IJPL Registration Confirmation - ${orderData.orderId}`,
          html: emailTemplate
        };

        const metadata = {
          type: 'customer_confirmation',
          orderId: orderData.orderId,
          retryCount: 0
        };

        try {
          // Attempt to send with primary transporter
          console.log(`Attempting to send customer email to: ${orderData.player.email}`);
          const result = await this.transporter.sendMail(mailOptions);
          
          // Log success
          await emailLogger.logEmailAttempt({
            ...metadata,
            to: [orderData.player.email, 'naman1333444@gmail.com'],
            subject: mailOptions.subject,
            success: true,
            messageId: result.messageId
          });
          
          console.log('✅ Customer email sent successfully:', result.messageId);
          return { success: true, messageId: result.messageId };
        } catch (primaryError) {
          console.error('❌ Error sending customer email with primary transport:', {
            error: primaryError.message,
            code: primaryError.code,
            command: primaryError.command,
            orderId: orderData.orderId
          });
          
          try {
            // Try fallback transport
            console.log(`🔄 Trying fallback transport for order ${orderData.orderId}`);
            const fallbackResult = await emailFallback.sendMail(mailOptions, {
              ...metadata,
              retryCount: 1
            });
            
            if (fallbackResult.success) {
              console.log('✅ Customer email sent using fallback:', fallbackResult.messageId);
              return fallbackResult;
            }
            
            throw new Error('Both primary and fallback email delivery failed');
          } catch (fallbackError) {
            console.error('❌ Fallback email also failed:', {
              error: fallbackError.message,
              orderId: orderData.orderId
            });
            
            // If NoOp service is active, use it as a last resort
            if (noopEmailService.active) {
              console.log(`📝 Using NoOp service as last resort for order ${orderData.orderId}`);
              return await noopEmailService.sendMail(mailOptions, {
                ...metadata,
                retryCount: 2
              });
            }
            
            // Log the final failure
            await emailLogger.logEmailAttempt({
              ...metadata,
              to: orderData.player.email,
              subject: mailOptions.subject,
              success: false,
              error: fallbackError.message || 'Both delivery methods failed'
            });
            
            return { 
              success: false, 
              error: fallbackError.message || 'Both delivery methods failed' 
            };
          }
        }
      },
      'sendCustomerOrderConfirmation',
      order,
      taskOptions
    );
  }

  // Admin new order notification email
  async sendAdminOrderNotification(order) {
    // Queue the admin notification email
    return taskQueue.addTask(
      async (orderData) => {
        const emailTemplate = this.getAdminOrderTemplate(orderData);
        
        const mailOptions = {
          from: config.email.from,
          to: 'naman1333444@gmail.com',
          subject: `New Order Received - ${orderData.orderId}`,
          html: emailTemplate
        };

        try {
          console.log(`🔄 Attempting to send admin email to: ${'naman13399@gmail.com'}`);
          const result = await this.transporter.sendMail(mailOptions);
          console.log(`✅ Admin email sent successfully to ${'naman13399@gmail.com'}:`, result.messageId);
          return { success: true, messageId: result.messageId };
        } catch (error) {
          console.error(`❌ Error sending admin email to ${'naman13399@gmail.com'}:`, {
            error: error.message,
            code: error.code,
            adminEmail: 'naman13399@gmail.com'
          });
          return { success: false, error: error.message };
        }
      },
      'sendAdminOrderNotification',
      order
    );
  }

  // Order status update email
  async sendOrderStatusUpdate(order, previousStatus) {
    // Queue the status update email
    return taskQueue.addTask(
      async (orderData, prevStatus) => {
        const emailTemplate = this.getStatusUpdateTemplate(orderData, prevStatus);
        
        const mailOptions = {
          from: config.email.from,
          to: orderData.player.email,
          subject: `Order Status Update - ${orderData.orderId}`,
          html: emailTemplate
        };

        try {
          const result = await this.transporter.sendMail(mailOptions);
          console.log('Status update email sent:', result.messageId);
          return { success: true, messageId: result.messageId };
        } catch (error) {
          console.error('Error sending status update email:', error);
          return { success: false, error: error.message };
        }
      },
      'sendOrderStatusUpdate',
      order,
      previousStatus
    );
  }
  
  // Send new order notification to specific email
  async sendNewOrderNotification(order, email = 'naman13399@gmail.com') {
    // Queue the admin notification email
    const taskOptions = taskQueue.createTaskOptions(3, 10000); // 3 retries, 10 second delay
    
    return taskQueue.addTask(
      async (orderData) => {
        const emailTemplate = this.getAdminOrderNotificationTemplate(orderData);
        
                  const mailOptions = {
            from: config.email.from,
            to: email,
            subject: `Order Alert: ${orderData.orderId} - Action Required`,
            html: emailTemplate,
            headers: {
              'X-Priority': '1',
              'X-MSMail-Priority': 'High',
              'Importance': 'high'
            }
          };

        const metadata = {
          type: 'admin_notification',
          orderId: orderData.orderId,
          retryCount: 0
        };

        try {
          // Attempt to send with primary transporter
          console.log(`Attempting to send admin notification email to: ${email}`);
          const result = await this.transporter.sendMail(mailOptions);
          
          // Log success
          await emailLogger.logEmailAttempt({
            ...metadata,
            to: email,
            subject: mailOptions.subject,
            success: true,
            messageId: result.messageId
          });
          
          console.log('✅ Admin notification email sent successfully:', result.messageId);
          return { success: true, messageId: result.messageId };
        } catch (primaryError) {
          console.error('❌ Error sending admin notification email with primary transport:', {
            error: primaryError.message,
            code: primaryError.code,
            command: primaryError.command,
            orderId: orderData.orderId
          });
          
          try {
            // Try fallback transport
            console.log(`🔄 Trying fallback transport for order ${orderData.orderId}`);
            const fallbackResult = await emailFallback.sendMail(mailOptions, {
              ...metadata,
              retryCount: 1
            });
            
            if (fallbackResult.success) {
              console.log('✅ Admin notification email sent using fallback:', fallbackResult.messageId);
              return fallbackResult;
            }
            
            throw new Error('Both primary and fallback email delivery failed');
          } catch (fallbackError) {
            console.error('❌ Fallback email also failed:', {
              error: fallbackError.message,
              orderId: orderData.orderId
            });
            
            // If NoOp service is active, use it as a last resort
            if (noopEmailService.active) {
              console.log(`📝 Using NoOp service as last resort for order ${orderData.orderId}`);
              return await noopEmailService.sendMail(mailOptions, {
                ...metadata,
                retryCount: 2
              });
            }
            
            // Log the final failure
            await emailLogger.logEmailAttempt({
              ...metadata,
              to: email,
              subject: mailOptions.subject,
              success: false,
              error: fallbackError.message || 'Both delivery methods failed'
            });
            
            return { 
              success: false, 
              error: fallbackError.message || 'Both delivery methods failed' 
            };
          }
        }
      },
      'sendNewOrderNotification',
      order,
      taskOptions
    );
  }

     // Admin order notification template
   getAdminOrderNotificationTemplate(order) {
    console.log('📧 Generating admin notification template for order:', order.orderId);
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #1d4ed8); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 25px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1e40af; }
        .customer-info { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .product-info { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .highlight { color: #1e40af; font-weight: bold; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Order Received</h1>
          <p>A new order has been placed and requires your attention</p>
        </div>
        
        <div class="content">
          <div class="order-details">
            <h3>📋 Order Information</h3>
            <p><strong>Order ID:</strong> <span class="highlight">${order.orderId}</span></p>
            <p><strong>Order Date:</strong> ${order.formattedOrderDate}</p>
            <p><strong>Status:</strong> <span class="highlight">${order.status.toUpperCase()}</span></p>
            <p><strong>Payment Method:</strong> ${order.payment.method}</p>
            <p><strong>Payment Status:</strong> ${order.payment.status}</p>
          </div>

          <div class="customer-info">
            <h3>👤 Customer Details</h3>
            <p><strong>Name:</strong> ${order.player.fullName}</p>
            <p><strong>Email:</strong> ${order.player.email}</p>
                         <p><strong>Phone:</strong> ${order.player.phone}</p>
           </div>
           
           <div class="order-details">
             <h3>🚚 Shipping Address</h3>
             <p>${order.player.address.street}<br>
             ${order.player.address.city}, ${order.player.address.state}<br>
             ${order.player.address.pincode}, ${order.player.address.country}</p>
           </div>
          
          <div class="product-info">
            <h3>🌿 Product Details</h3>
            <p><strong>Product:</strong> ${order.product.name}</p>
            <p><strong>Quantity:</strong> ${order.product.quantity} bottle(s)</p>
            <p><strong>Price per bottle:</strong> ₹${order.product.price}</p>
            ${order.product.discount > 0 ? `<p><strong>Discount Applied:</strong> ${order.product.discount}% OFF</p>` : ''}
            <p><strong>Total Amount:</strong> <span class="highlight">₹${order.totalAmount}</span></p>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.ADMIN_DASHBOARD_URL}/orders/${order.orderId}" class="button">View Order Details</a>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification from your e-commerce system</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Customer order confirmation template
  getCustomerOrderTemplate(order) {
    // Handle potential undefined values safely
    const playerName = order.player?.fullName || 'Player';
    const playerEmail = order.player?.email || 'N/A';
    const playerPhone = order.player?.phone || 'N/A';
    const ageGroup = order.player?.ageGroup || 'N/A';
    const playingRole = order.player?.playingRole || 'N/A';
    const state = order.player?.state || 'N/A';
    const category = order.registration?.category || 'N/A';
    const season = order.registration?.season || 'N/A';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>IJPL Registration Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .player-info { background: #fff; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .highlight { color: #2563eb; font-weight: bold; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .benefits { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>� Registration Confirmed!</h1>
          <p>Welcome to Indian Jabalpur Premier League (IJPL)</p>
        </div>
        
        <div class="content">
          <h2>Congratulations ${playerName}!</h2>
          <p>Your registration for IJPL ${season} has been successfully confirmed. Get ready to showcase your cricket skills!</p>
          
          <div class="order-details">
            <h3>📋 Registration Details</h3>
            <p><strong>Registration ID:</strong> <span class="highlight">${order.orderId}</span></p>
            <p><strong>Player Name:</strong> ${playerName}</p>
            <p><strong>Email:</strong> ${playerEmail}</p>
            <p><strong>Phone:</strong> ${playerPhone}</p>
            <p><strong>Age Group:</strong> ${ageGroup}</p>
            <p><strong>Playing Role:</strong> ${playingRole}</p>
            <p><strong>State:</strong> ${state}</p>
            <p><strong>Registration Fee:</strong> <span class="highlight">₹${order.totalAmount}</span></p>
            <p><strong>Payment Status:</strong> <span class="highlight">${order.payment?.status?.toUpperCase() || 'PENDING'}</span></p>
            <p><strong>Tournament:</strong> ${category}</p>
            <p><strong>Season:</strong> ${season}</p>
          </div>

          <div class="player-info">
            <h3>🏏 Player Profile</h3>
            <p><strong>Batting Style:</strong> ${order.player?.battingHandedness || 'N/A'}</p>
            <p><strong>Bowling Style:</strong> ${order.player?.bowlingStyle || 'N/A'}</p>
            <p><strong>Batting Order:</strong> ${order.player?.battingOrder || 'N/A'}</p>
          </div>
          
          <div class="benefits">
            <h3>🎯 What's Next?</h3>
            <ul>
              <li>✅ Your registration is confirmed and under review</li>
              <li>📧 You'll receive updates about team selections</li>
              <li>🏏 Tournament schedule will be shared soon</li>
              <li>🏆 Get ready for an exciting cricket season!</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.ijpl.life" class="button">Visit IJPL Website</a>
          </div>
          
          <p><strong>Important Notes:</strong></p>
          <ul>
            <li>Keep this registration ID safe for future reference</li>
            <li>Check your email regularly for tournament updates</li>
            <li>Contact us if you have any questions</li>
          </ul>
          
          <div class="footer">
            <p>Thank you for joining Indian Jabalpur Premier League!</p>
            <p>For any queries, contact us at: support@ijpl.life</p>
            <p>© ${new Date().getFullYear()} IJPL. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Admin order notification template
  getAdminOrderTemplate(order) {
    // Handle potential undefined values safely
    const playerName = order.player?.fullName || 'Player';
    const playerEmail = order.player?.email || 'N/A';
    const playerPhone = order.player?.phone || 'N/A';
    const ageGroup = order.player?.ageGroup || 'N/A';
    const playingRole = order.player?.playingRole || 'N/A';
    const state = order.player?.state || 'N/A';
    const category = order.registration?.category || 'N/A';
    const season = order.registration?.season || 'N/A';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New IJPL Registration - Admin Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #059669; }
        .player-info { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .urgent { background: #dcfce7; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .highlight { color: #059669; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏏 New IJPL Registration Alert</h1>
          <p>Registration #${order.orderId}</p>
        </div>
        
        <div class="content">
          <div class="urgent">
            <h3>⚡ New Player Registration</h3>
            <p>A new player has registered for IJPL ${season} and requires admin review.</p>
          </div>
          
          <div class="order-details">
            <h3>📋 Registration Information</h3>
            <p><strong>Registration ID:</strong> <span class="highlight">${order.orderId}</span></p>
            <p><strong>Player Name:</strong> ${playerName}</p>
            <p><strong>Email:</strong> ${playerEmail}</p>
            <p><strong>Phone:</strong> ${playerPhone}</p>
            <p><strong>Registration Fee:</strong> <span class="highlight">₹${order.totalAmount}</span></p>
            <p><strong>Payment Method:</strong> ${order.payment?.method?.toUpperCase() || 'N/A'}</p>
            <p><strong>Payment Status:</strong> <span class="highlight">${order.payment?.status?.toUpperCase() || 'PENDING'}</span></p>
            <p><strong>Tournament:</strong> ${category}</p>
            <p><strong>Season:</strong> ${season}</p>
            <p><strong>Registration Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
          </div>
          
          <div class="player-info">
            <h3>🏏 Player Profile</h3>
            <p><strong>Age Group:</strong> ${ageGroup}</p>
            <p><strong>Playing Role:</strong> ${playingRole}</p>
            <p><strong>State:</strong> ${state}</p>
            <p><strong>Batting Style:</strong> ${order.player?.battingHandedness || 'N/A'}</p>
            <p><strong>Bowling Style:</strong> ${order.player?.bowlingStyle || 'N/A'}</p>
            <p><strong>Batting Order:</strong> ${order.player?.battingOrder || 'N/A'}</p>
          </div>
          
          ${order.notes ? `
          <div class="order-details">
            <h3>📝 Player Notes</h3>
            <p>${order.notes}</p>
          </div>` : ''}
          
          <div class="order-details">
            <h3>🎯 Admin Action Items</h3>
            <ul>
              <li>✅ Verify payment completion</li>
              <li>📋 Review player registration details</li>
              <li>🏏 Process for team selection committee</li>
              <li>📧 Send confirmation/selection updates to player</li>
              <li>📊 Update registration database</li>
            </ul>
          </div>
          
          <div class="footer">
            <p><strong>IJPL Admin Dashboard</strong></p>
            <p>This is an automated notification for new player registrations</p>
            <p>© ${new Date().getFullYear()} Indian Jabalpur Premier League</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;
  }

  // Order status update template
  getStatusUpdateTemplate(order, previousStatus) {
    // Handle potential undefined values safely
    const playerName = order.player?.fullName || 'Player';
    
    const statusMessages = {
      confirmed: "Your IJPL registration has been confirmed and is under review for team selection.",
      processing: "Your registration is currently being processed by our team selection committee.",
      approved: "Congratulations! Your registration has been approved. Welcome to IJPL!",
      selected: "Great news! You have been selected for a team. Team details will be shared soon.",
      cancelled: "Your registration has been cancelled. If this was unexpected, please contact us."
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>IJPL Registration Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .status-update { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; text-align: center; }
        .highlight { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏏 Registration Status Update</h1>
          <p>Registration #${order.orderId}</p>
        </div>
        
        <div class="content">
          <h2>Hello ${playerName},</h2>
          
          <div class="status-update">
            <h3>Status Changed: <span class="highlight">${previousStatus.toUpperCase()}</span> → <span class="highlight">${order.status.toUpperCase()}</span></h3>
            <p>${statusMessages[order.status] || 'Your registration status has been updated.'}</p>
          </div>
          
          ${order.teamInfo?.teamName ? `
          <div class="status-update">
            <h3>🏏 Team Information</h3>
            <p><strong>Team Name:</strong> ${order.teamInfo.teamName}</p>
            ${order.teamInfo.captain ? `<p><strong>Captain:</strong> ${order.teamInfo.captain}</p>` : ''}
          </div>` : ''}
          
          <p>Thank you for being part of Indian Jabalpur Premier League!</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <p>For any queries, contact us at: support@ijpl.life</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;
  }
}

module.exports = new EmailService(); 