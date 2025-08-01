const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    default: () => `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  
  // Player Information
  player: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    ageGroup: {
      type: String,
      enum: ['Under 19', 'Senior Player'],
      required: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    playingRole: {
      type: String,
      enum: ['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper', 'Wicket Keeper Batsman'],
      required: true
    },
    battingHandedness: {
      type: String,
      enum: ['Right Handed', 'Left Handed'],
      required: true
    },
    bowlingStyle: {
      type: String,
      enum: ['Right Arm Fast', 'Right Arm Medium', 'Left Arm Fast', 'Left Arm Medium', 'Right Arm Spin', 'Left Arm Spin', 'Not Applicable'],
      required: true
    },
    battingOrder: {
      type: String,
      enum: ['Top Order', 'Middle Order', 'Lower Order'],
      required: true
    }
  },
  
  // Registration Details
  registration: {
    fee: {
      type: Number,
      required: true,
      default: 3300
    },
    season: {
      type: String,
      default: '2025'
    },
    category: {
      type: String,
      default: 'Indian Jabalpur Premier League'
    }
  },
  
  // Registration Amount
  totalAmount: {
    type: Number,
    required: true,
    default: 3300
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'registered', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['phonepe', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    phonePeTransactionId: String,
    phonePeOrderId: String,
    redirectUrl: String,
    transactionId: String,
    checkCount: {
      type: Number,
      default: 0
    }
  },
  
  // Registration Information
  registrationInfo: {
    playerNumber: String,
    teamAssignment: String,
    registrationDate: {
      type: Date,
      default: Date.now
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  
  // Notes and Special Instructions
  notes: String,
  adminNotes: String,
  
  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now
  },
  
  // Email Status
  emailSent: {
    player: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderId: 1 });
orderSchema.index({ 'player.email': 1 });
orderSchema.index({ 'player.phone': 1 });
orderSchema.index({ 'player.ageGroup': 1 });
orderSchema.index({ 'player.state': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ 'payment.status': 1 });

// Virtual for formatted registration date
orderSchema.virtual('formattedOrderDate').get(function() {
  return this.orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to get registration summary
orderSchema.methods.getRegistrationSummary = function() {
  return {
    orderId: this.orderId,
    playerName: this.player.fullName,
    ageGroup: this.player.ageGroup,
    playingRole: this.player.playingRole,
    fee: this.totalAmount,
    status: this.status,
    paymentStatus: this.payment.status
  };
};

module.exports = mongoose.model('Order', orderSchema); 