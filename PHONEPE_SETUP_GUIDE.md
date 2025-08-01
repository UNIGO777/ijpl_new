# PhonePe Integration Setup Guide

## 🎉 Migration Complete!

Your application has been successfully migrated from Razorpay to PhonePe! Here's what was changed and how to complete the setup.

## ✅ What Was Migrated

### Backend Changes:
- **Payment Service**: Complete rewrite to use PhonePe APIs
- **Configuration**: Updated to use PhonePe credentials
- **Order Model**: Updated payment fields for PhonePe
- **Routes**: Modified to handle PhonePe payment flow
- **Dependencies**: Replaced `razorpay` with `axios`
- **Validation**: Updated for PhonePe requirements

### Frontend Changes:
- **Checkout Flow**: Updated to use PhonePe web redirect flow
- **Payment Method**: Changed from 'razorpay' to 'phonepe'
- **Policy Pages**: Updated to mention PhonePe instead of Razorpay

## 🔧 Setup Instructions

### Step 1: Get PhonePe Merchant Credentials

1. **Sign up for PhonePe Business Account**:
   - Visit [PhonePe for Business](https://business.phonepe.com/)
   - Complete the merchant onboarding process
   - Get your live credentials

2. **For Testing**:
   - Request sandbox/UAT credentials from PhonePe
   - You'll receive:
     - Merchant ID
     - Salt Key
     - Salt Index
     - API URLs

### Step 2: Update Environment Variables

Update your `backend/.env` file with your actual PhonePe credentials:

```bash
# PhonePe Credentials (Replace with your actual credentials)
PHONEPE_MERCHANT_ID=your_actual_merchant_id
PHONEPE_SALT_KEY=your_actual_salt_key
PHONEPE_SALT_INDEX=1

# For Testing
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/hermes

# For Production
# PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
```

### Step 3: Test the Integration

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend**:
   ```bash
   cd ..
   npm start
   ```

3. **Test a payment**:
   - Go to checkout page
   - Select "Online Payment" (PhonePe)
   - Complete the form and submit
   - You should be redirected to PhonePe payment page

## 🔍 How PhonePe Payment Flow Works

### New Payment Flow:
1. **Create Order**: Backend creates PhonePe payment order
2. **Get Redirect URL**: PhonePe returns a payment page URL
3. **Redirect User**: Frontend redirects user to PhonePe payment page
4. **User Pays**: User completes payment on PhonePe
5. **Callback**: PhonePe sends callback to your server
6. **Verify Payment**: Backend verifies payment status
7. **Update Order**: Order status is updated based on payment result

### Key Differences from Razorpay:
- **Redirect-based**: Instead of modal popup, uses page redirect
- **Server-side verification**: Payment verification happens on backend
- **Callback handling**: PhonePe sends server-to-server callbacks

## 🚨 Important Notes

### 1. HTTPS Required
- PhonePe requires HTTPS in production
- Use proper SSL certificates

### 2. Callback URL Setup
- Ensure your server can receive POST requests at:
  - `/api/orders/phonepe-callback`
- This endpoint handles payment status updates

### 3. Redirect URL Setup
- Users will be redirected to:
  - `/payment-success` (for success)
  - Configure this route in your frontend

### 4. Mobile Optimization
- PhonePe works best on mobile devices
- Ensure your checkout is mobile-friendly

## 🐛 Troubleshooting

### Common Issues:

1. **"KEY_NOT_CONFIGURED" Error**:
   - Verify your PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY
   - Ensure you're using the correct environment (preprod/prod)

2. **401 Authorization Error**:
   - Check your salt key and checksum generation
   - Verify the API endpoint URL

3. **Callback Not Received**:
   - Ensure your server is publicly accessible
   - Check firewall settings
   - Verify callback URL is correct

4. **Payment Status Not Updating**:
   - Check the payment verification logic
   - Ensure database connection is working

### Debug Steps:

1. **Check Environment Variables**:
   ```bash
   # In backend directory
   node -e "console.log(require('./config').phonepe)"
   ```

2. **Test API Connectivity**:
   - Ensure you can reach PhonePe's API endpoints
   - Check network connectivity

3. **Monitor Logs**:
   - Check backend console for error messages
   - Monitor network requests in browser

## 📝 Configuration Files Updated

- `backend/config.js` - PhonePe configuration
- `backend/services/paymentService.js` - Payment logic
- `backend/models/Order.js` - Database schema
- `backend/routes/orders.js` - API endpoints
- `src/Components/Checkout.jsx` - Frontend payment flow

## 🎯 Next Steps

1. **Get Real Credentials**: Contact PhonePe to get your merchant credentials
2. **Test Thoroughly**: Test all payment scenarios
3. **Configure Webhooks**: Set up proper webhook handling
4. **Deploy to Production**: Update production environment with live credentials
5. **Monitor Payments**: Set up payment monitoring and alerts

## 📞 Support

- **PhonePe Documentation**: [https://developer.phonepe.com/](https://developer.phonepe.com/)
- **PhonePe Support**: Contact your PhonePe account manager
- **Integration Issues**: Check the troubleshooting section above

## ✨ Benefits of PhonePe

- **UPI Focus**: Better UPI payment experience
- **Mobile Optimized**: Optimized for mobile payments
- **Indian Market**: Better suited for Indian customers
- **Lower Fees**: Competitive transaction fees
- **Fast Settlement**: Quick settlement cycles

---

**Your Razorpay to PhonePe migration is complete! 🎉**

Just update the credentials and you'll be ready to accept payments through PhonePe. 