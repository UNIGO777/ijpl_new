require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/palank-top-db',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // PhonePe SDK
  phonepe: {
    clientId: process.env.PHONEPE_CLIENT_ID || 'TEST-CLIENT-ID',
    clientSecret: process.env.PHONEPE_CLIENT_SECRET || 'test-client-secret',
    clientVersion: parseInt(process.env.PHONEPE_CLIENT_VERSION) || 1,
    environment: process.env.PHONEPE_ENVIRONMENT || 'SANDBOX'
  },

  // Cricket Registration
  cricket: {
    registrationFee: parseInt(process.env.REGISTRATION_FEE) || 3300,
    league: 'Indian Jabalpur Premier League',
    season: '2025'
  },
  
  // Email
  email: {
    from: process.env.EMAIL_FROM || 'noreply@neelkanthpharmacy.com',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  },
  
  // Admin
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@neelkanthpharmacy.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    notificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'naman13399@gmail.com'
  },
  
  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
}; 