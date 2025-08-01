const { body, validationResult, param, query } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Cricket Registration validation rules
const validateOrderCreation = [
  body('player.fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  
  body('player.email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('player.phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit Indian phone number is required'),
  
  body('player.ageGroup')
    .isIn(['Under 19', 'Senior Player'])
    .withMessage('Age group must be either Under 19 or Senior Player'),
  
  body('player.state')
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 50 })
    .withMessage('State name must be less than 50 characters'),
  
  body('player.playingRole')
    .isIn(['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper', 'Wicket Keeper Batsman'])
    .withMessage('Invalid playing role selected'),
  
  body('player.battingHandedness')
    .isIn(['Right Handed', 'Left Handed'])
    .withMessage('Batting handedness must be either Right Handed or Left Handed'),
  
  body('player.bowlingStyle')
    .isIn(['Right Arm Fast', 'Right Arm Medium', 'Left Arm Fast', 'Left Arm Medium', 'Right Arm Spin', 'Left Arm Spin', 'Not Applicable'])
    .withMessage('Invalid bowling style selected'),
  
  body('player.battingOrder')
    .isIn(['Top Order', 'Middle Order', 'Lower Order'])
    .withMessage('Batting order must be Top Order, Middle Order, or Lower Order'),
  
  body('payment.method')
    .isIn(['phonepe', 'cod'])
    .withMessage('Payment method must be phonepe or cod'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  
  handleValidationErrors
];

// Admin login validation
const validateAdminLogin = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

// Order status update validation
const validateOrderStatusUpdate = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  
  body('trackingNumber')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Tracking number must be less than 50 characters'),
  
  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes must be less than 1000 characters'),
  
  handleValidationErrors
];

// Payment verification validation (PhonePe)
const validatePaymentVerification = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  
  handleValidationErrors
];

// Query validation for orders list
const validateOrdersQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status filter'),
  
  query('sortBy')
    .optional()
    .isIn(['orderDate', 'totalAmount', 'status'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

// Contact form validation (if needed)
const validateContact = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit phone number required'),
  
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  
  handleValidationErrors
];

// Sanitize input middleware
const sanitizeInput = (req, res, next) => {
  // Remove any HTML tags from string inputs
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value.replace(/<[^>]*>/g, '').trim();
    }
    return value;
  };

  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else {
        obj[key] = sanitizeValue(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

module.exports = {
  validateOrderCreation,
  validateAdminLogin,
  validateOrderStatusUpdate,
  validatePaymentVerification,
  validateOrdersQuery,
  validateContact,
  sanitizeInput,
  handleValidationErrors
}; 