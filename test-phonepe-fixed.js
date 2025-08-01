const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/create-phonepe-order', async (req, res) => {
  try {
    const { amount, customerId } = req.body;

    // PhonePe Configuration
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    
    // Use test credentials with sandbox URL for testing
    const baseUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    
    // For production, use: 'https://api.phonepe.com/apis/pg'

    const redirectUrl = 'https://yourdomain.com/payment-success';
    const callbackUrl = 'https://yourdomain.com/api/payment-callback';

    const payload = {
      merchantId,
      merchantTransactionId: `TXN_${Date.now()}`,
      merchantUserId: customerId || `USER_${Date.now()}`,
      amount: amount * 100, // Amount in paise
      redirectUrl,
      redirectMode: 'REDIRECT', // Changed from POST to REDIRECT
      callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('PhonePe Payload:', JSON.stringify(payload, null, 2));

    const jsonPayload = JSON.stringify(payload);
    const base64Payload = Buffer.from(jsonPayload).toString('base64');
    
    // Correct checksum calculation
    const stringToSign = base64Payload + '/pg/v1/pay' + saltKey;
    const xVerify = crypto
      .createHash('sha256')
      .update(stringToSign)
      .digest('hex') + `###${saltIndex}`;

    console.log('Request URL:', `${baseUrl}/pg/v1/pay`);
    console.log('X-VERIFY:', xVerify);

    const response = await axios.post(
      `${baseUrl}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify
          // Removed X-MERCHANT-ID as it's not required
        }
      }
    );

    console.log('PhonePe Response:', response.data);

    if (response.data.success && response.data.data && response.data.data.instrumentResponse) {
      return res.json({
        success: true,
        url: response.data.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId: response.data.data.merchantTransactionId,
        transactionId: response.data.data.transactionId
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: response.data.message || 'Payment initiation failed',
        data: response.data 
      });
    }

  } catch (error) {
    console.error('PhonePe Order Error:', error?.response?.data || error.message);
    
    // Better error handling
    if (error.response) {
      const { status, data } = error.response;
      console.error('HTTP Status:', status);
      console.error('Error Response:', data);
      
      if (status === 404) {
        return res.status(500).json({ 
          error: 'PhonePe API endpoint not found. Please check the base URL and credentials.' 
        });
      }
      
      if (data && data.code) {
        let errorMessage = data.message || 'Payment initiation failed';
        
        switch (data.code) {
          case 'KEY_NOT_CONFIGURED':
            errorMessage = 'PhonePe merchant credentials not activated. Please contact PhonePe support.';
            break;
          case 'AUTHORIZATION_FAILED':
            errorMessage = 'Invalid checksum or credentials. Please verify your salt key.';
            break;
          case 'BAD_REQUEST':
            errorMessage = 'Invalid request format. Please check the payload.';
            break;
        }
        
        return res.status(500).json({ error: errorMessage, code: data.code });
      }
    }
    
    res.status(500).json({ error: 'Failed to create PhonePe order' });
  }
});

// Test endpoint to verify environment variables
app.get('/test-env', (req, res) => {
  res.json({
    merchantId: process.env.PHONEPE_MERCHANT_ID ? 'Set' : 'Missing',
    saltKey: process.env.PHONEPE_SALT_KEY ? 'Set' : 'Missing',
    saltIndex: process.env.PHONEPE_SALT_INDEX ? 'Set' : 'Missing',
    baseUrl: process.env.PHONEPE_BASE_URL || 'Not set'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- Merchant ID:', process.env.PHONEPE_MERCHANT_ID ? 'Set ✓' : 'Missing ✗');
  console.log('- Salt Key:', process.env.PHONEPE_SALT_KEY ? 'Set ✓' : 'Missing ✗');
  console.log('- Salt Index:', process.env.PHONEPE_SALT_INDEX ? 'Set ✓' : 'Missing ✗');
}); 