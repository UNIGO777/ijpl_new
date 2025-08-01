# Neelkanth Palangtod Landing Page - Full Stack E-commerce Solution

A complete full-stack e-commerce landing page for Neelkanth Palangtod Capsules with React frontend, Node.js backend, payment integration, and admin panel.

## 🌟 Features

### Frontend
- **Modern Landing Page** - Professional design with animations
- **Product Information** - Detailed Ayurvedic product information
- **Checkout System** - Complete order form with validation
- **Payment Integration** - PhonePe & Cash on Delivery
- **Responsive Design** - Works on all devices
- **Professional UI** - Built with Tailwind CSS and Framer Motion

### Backend
- **RESTful API** - Express.js backend with MongoDB
- **Order Management** - Complete order processing system
- **Payment Processing** - Secure PhonePe integration
- **Email Notifications** - Order confirmations for customers and admin
- **Admin Authentication** - JWT-based secure admin access
- **Rate Limiting** - Security against abuse
- **Input Validation** - Comprehensive data validation

### Admin Panel
- **Analytics Dashboard** - Order statistics and revenue tracking
- **Order Management** - View, update, and track orders
- **Status Updates** - Real-time order status management
- **Search & Filter** - Advanced order filtering
- **Email Integration** - Automatic customer notifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Email account for notifications (Gmail recommended)
- PhonePe merchant account for payment processing

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/palank-top-db

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
   JWT_EXPIRE=7d

   # PhonePe Configuration
PHONEPE_MERCHANT_ID=your-phonepe-merchant-id
PHONEPE_SALT_KEY=your-phonepe-salt-key
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/hermes

   # Email Configuration
   EMAIL_FROM=noreply@neelkanthpharmacy.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Admin Configuration
   ADMIN_EMAIL=admin@neelkanthpharmacy.com
   ADMIN_PASSWORD=admin123

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # Security
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in MONGODB_URI
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:5001`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update PhonePe Configuration:**
   PhonePe configuration is now handled through environment variables in the backend.
   Update your `.env` file with your PhonePe merchant details.

4. **Start the frontend:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📋 Usage

### Customer Flow
1. **Landing Page** - View product information and benefits
2. **Product Details** - Learn about Ayurvedic ingredients
3. **Checkout** - Fill order form with personal and shipping details
4. **Payment** - Choose between PhonePe or Cash on Delivery
5. **Confirmation** - Receive order confirmation and email

### Admin Flow
1. **Login** - Access admin panel with credentials
2. **Analytics** - View order statistics and revenue
3. **Order Management** - Process and update orders
4. **Status Updates** - Update order status and send notifications

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication in your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

### PhonePe Setup
1. Create merchant account at [PhonePe for Business](https://business.phonepe.com/)
2. Get your Key ID and Key Secret from dashboard
3. Add them to your `.env` file
4. Update the key in frontend checkout component

### MongoDB Setup
**Local MongoDB:**
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community  # macOS
sudo apt-get install mongodb  # Ubuntu

# Start MongoDB
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongod  # Ubuntu
```

**MongoDB Atlas (Recommended):**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster
3. Get connection string
4. Add to `MONGODB_URI` in `.env`

## 🛡️ Security Features

- **JWT Authentication** - Secure admin access
- **Rate Limiting** - Prevents abuse and DDoS
- **Input Validation** - Comprehensive data validation
- **CORS Protection** - Cross-origin request security
- **Password Hashing** - Bcrypt for secure passwords
- **SQL Injection Prevention** - MongoDB parameterized queries

## 📁 Project Structure

```
├── backend/
│   ├── config.js              # Configuration management
│   ├── server.js              # Main server file
│   ├── models/
│   │   ├── Order.js           # Order model
│   │   └── Admin.js           # Admin model
│   ├── routes/
│   │   ├── orders.js          # Order routes
│   │   └── admin.js           # Admin routes
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   └── validation.js      # Validation middleware
│   └── services/
│       ├── emailService.js    # Email service
│       └── paymentService.js  # Payment service
├── src/
│   ├── Components/
│   │   ├── Hero.jsx           # Landing page hero
│   │   ├── AboutTheProduct.jsx # Product information
│   │   ├── Checkout.jsx       # Checkout form
│   │   ├── AdminPanel.jsx     # Admin dashboard
│   │   └── Navbar.jsx         # Navigation
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
└── README.md
```

## 🔗 API Endpoints

### Public Endpoints
- `POST /api/orders/create` - Create new order
- `POST /api/orders/verify-payment` - Verify payment
- `GET /api/orders/:orderId` - Get order details

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:orderId/status` - Update order status
- `GET /api/orders/analytics/summary` - Get analytics

## 🎨 Customization

### Styling
- Built with Tailwind CSS
- Easy to customize colors and themes
- Professional animations with Framer Motion

### Product Information
- Update product details in `AboutTheProduct.jsx`
- Modify pricing in `Checkout.jsx`
- Change email templates in `emailService.js`

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Great experience on tablets
- **Desktop** - Full features on desktop
- **Touch Friendly** - Easy to use on touch devices

## 🚀 Deployment

### Backend Deployment
1. **Environment Variables** - Set all production environment variables
2. **Database** - Use MongoDB Atlas for production
3. **Email Service** - Configure production email service
4. **Security** - Update JWT secrets and PhonePe credentials

### Frontend Deployment
1. **Build the project:**
   ```bash
   npm run build
   ```
2. **Deploy to hosting service** (Vercel, Netlify, etc.)
3. **Update API URLs** in components

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check MongoDB connection
- Verify environment variables
- Check port availability

**Payment not working:**
- Verify PhonePe credentials
- Check CORS settings
- Ensure HTTPS in production

**Emails not sending:**
- Check email credentials
- Verify Gmail app password
- Check firewall settings

## 📞 Support

For support and questions:
- Check the documentation
- Review error logs
- Verify configuration files

## 📄 License

This project is licensed under the MIT License.

## 🏗️ Built With

- **Frontend:** React, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Payment:** PhonePe
- **Email:** Nodemailer
- **Security:** JWT, Bcrypt, Helmet, CORS
- **Validation:** Express-validator

---

**🌿 Neelkanth Pharmacy - Natural • Safe • Effective 🌿**
