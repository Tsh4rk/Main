const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  acronym: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['penetration-testing', 'ethical-hacking', 'incident-response', 'forensics', 'governance', 'compliance', 'cloud-security', 'network-security', 'application-security', 'management']
  },
  level: {
    type: String,
    required: true,
    enum: ['entry', 'associate', 'professional', 'expert', 'master']
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  skills: [{
    type: String,
    trim: true
  }],
  dateObtained: {
    type: Date,
    required: true
  },
  expirationDate: {
    type: Date
  },
  credentialId: {
    type: String,
    trim: true
  },
  verificationUrl: {
    type: String,
    trim: true
  },
  badgeUrl: {
    type: String,
    trim: true
  },
  certificateUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isRenewed: {
    type: Boolean,
    default: false
  },
  renewalHistory: [{
    renewalDate: Date,
    expirationDate: Date,
    credentialId: String
  }],
  cpe: {
    required: {
      type: Number,
      default: 0
    },
    completed: {
      type: Number,
      default: 0
    },
    cycle: {
      type: String,
      enum: ['annual', 'biennial', 'triennial', 'none'],
      default: 'none'
    }
  },
  examDetails: {
    examCode: String,
    passingScore: Number,
    achievedScore: Number,
    examDate: Date,
    retakeCount: {
      type: Number,
      default: 0
    }
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  cost: {
    examFee: Number,
    renewalFee: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  studyResources: [{
    name: String,
    type: {
      type: String,
      enum: ['book', 'course', 'practice-exam', 'lab', 'bootcamp', 'video', 'website']
    },
    url: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  priority: {
    type: Number,
    default: 0 // Higher number = higher priority for display
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
CertificationSchema.index({ category: 1, isActive: 1 });
CertificationSchema.index({ level: 1, dateObtained: -1 });
CertificationSchema.index({ featured: 1, priority: -1 });

// Virtual for status
CertificationSchema.virtual('status').get(function() {
  if (!this.isActive) return 'inactive';
  if (!this.expirationDate) return 'active';
  
  const now = new Date();
  const monthsUntilExpiry = (this.expirationDate - now) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsUntilExpiry < 0) return 'expired';
  if (monthsUntilExpiry < 3) return 'expiring-soon';
  return 'active';
});

// Virtual for years held
CertificationSchema.virtual('yearsHeld').get(function() {
  const now = new Date();
  const yearsHeld = (now - this.dateObtained) / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(yearsHeld * 10) / 10; // Round to 1 decimal place
});

// Virtual for days until expiration
CertificationSchema.virtual('daysUntilExpiration').get(function() {
  if (!this.expirationDate) return null;
  const now = new Date();
  const daysUntilExpiry = (this.expirationDate - now) / (1000 * 60 * 60 * 24);
  return Math.ceil(daysUntilExpiry);
});

// Method to check if certification needs renewal
CertificationSchema.methods.needsRenewal = function() {
  if (!this.expirationDate) return false;
  const now = new Date();
  const monthsUntilExpiry = (this.expirationDate - now) / (1000 * 60 * 60 * 24 * 30);
  return monthsUntilExpiry <= 6; // Needs renewal if expiring within 6 months
};

// Method to get certification color based on level
CertificationSchema.methods.getLevelColor = function() {
  const colors = {
    'entry': '#4CAF50',
    'associate': '#2196F3',
    'professional': '#FF9800',
    'expert': '#F44336',
    'master': '#9C27B0'
  };
  return colors[this.level] || '#757575';
};

module.exports = mongoose.model('Certification', CertificationSchema);
