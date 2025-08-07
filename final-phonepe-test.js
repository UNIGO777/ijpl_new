const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config({ override: true });

async function testPhonePePayment() {
  try {
    console.log('🚀 Final PhonePe Integration Test');
    console.log('================================');
    
    // Configuration
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const baseUrl = process.env.PHONEPE_BASE_URL;
    
    console.log('📋 Configuration:');
    console.log('- Merchant ID:', merchantId);
    console.log('- Salt Key:', saltKey.substring(0, 10) + '...');
    console.log('- Salt Index:', saltIndex);
    console.log('- Base URL:', baseUrl);
    console.log('');
    
    // Create payload
    const payload = {
      merchantId,
      merchantTransactionId: `TEST_${Date.now()}`,
      merchantUserId: `USER_${Date.now()}`,
      amount: 1000, // ₹10 in paise
      redirectUrl: 'http://localhost:5173/payment-success',
      redirectMode: 'REDIRECT',
      callbackUrl: 'https://api.ijpl.life/api/orders/phonepe-callback',
      mobileNumber: '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };
    
    console.log('📦 Payment Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('');
    
    // Encode payload
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Generate checksum
    const checksumString = base64Payload + '/pg/v1/pay' + saltKey;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex') + '###' + saltIndex;
    
    console.log('🔐 Security:');
    console.log('- Base64 payload length:', base64Payload.length);
    console.log('- Checksum:', checksum);
    console.log('');
    
    // Make API call
    console.log('📡 Making API call to PhonePe...');
    const response = await axios.post(
      `${baseUrl}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );
    
    console.log('✅ PhonePe API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data?.instrumentResponse?.redirectInfo?.url) {
      console.log('');
      console.log('🎉 SUCCESS! Payment URL generated:');
      console.log(response.data.data.instrumentResponse.redirectInfo.url);
    }
    
  } catch (error) {
    console.error('');
    console.error('❌ PhonePe Test Failed:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
      
      const { code, message } = error.response.data;
      console.error('');
      console.error('🔍 Error Analysis:');
      
      switch (code) {
        case 'KEY_NOT_CONFIGURED':
          console.error('- Issue: Merchant credentials not activated');
          console.error('- Solution: Contact PhonePe to activate your merchant account');
          console.error('- Alternative: Use Cash on Delivery for now');
          break;
        case 'AUTHORIZATION_FAILED':
          console.error('- Issue: Invalid checksum or salt key');
          console.error('- Solution: Verify salt key in .env file');
          break;
        case 'BAD_REQUEST':
          console.error('- Issue: Invalid request format');
          console.error('- Solution: Check payload structure');
          break;
        default:
          console.error('- Unknown error code:', code);
          console.error('- Message:', message);
      }
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

// Run the test
testPhonePePayment(); 