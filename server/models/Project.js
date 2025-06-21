const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  longDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['penetration-testing', 'malware-analysis', 'vulnerability-research', 'red-team-ops', 'blue-team-defense', 'forensics', 'reverse-engineering', 'exploit-development', 'tool-development']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  tools: [{
    name: String,
    version: String,
    purpose: String
  }],
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'archived', 'public'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  thumbnail: {
    type: String,
    default: '/assets/default-project.png'
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  demoUrl: String,
  githubUrl: String,
  liveUrl: String,
  documentation: String,
  // Security-specific fields
  vulnerabilities: [{
    type: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    cvss: Number,
    description: String
  }],
  exploits: [{
    name: String,
    description: String,
    cveId: String,
    poc: String // Proof of concept code/steps
  }],
  targets: [{
    type: String,
    version: String,
    platform: String
  }],
  methodology: {
    reconnaissance: String,
    scanning: String,
    exploitation: String,
    postExploitation: String,
    reporting: String
  },
  findings: [{
    title: String,
    severity: String,
    description: String,
    impact: String,
    recommendation: String,
    evidence: [String] // URLs to screenshots/logs
  }],
  timeline: [{
    phase: String,
    description: String,
    duration: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  // Compliance and ethics
  ethicalDisclosure: {
    type: Boolean,
    default: true
  },
  responsibleDisclosure: {
    disclosed: Boolean,
    disclosureDate: Date,
    vendor: String,
    patchStatus: String
  },
  classification: {
    type: String,
    enum: ['public', 'restricted', 'confidential'],
    default: 'public'
  }
}, {
  timestamps: true
});

// Indexes
ProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ featured: 1, createdAt: -1 });

// Virtual for formatted date
ProjectSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware to generate slug
ProjectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Method to increment views
ProjectSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to get security rating based on vulnerabilities
ProjectSchema.methods.getSecurityRating = function() {
  if (!this.vulnerabilities || this.vulnerabilities.length === 0) {
    return 'N/A';
  }
  
  const criticalCount = this.vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = this.vulnerabilities.filter(v => v.severity === 'high').length;
  
  if (criticalCount > 0) return 'Critical';
  if (highCount > 2) return 'High';
  if (highCount > 0) return 'Medium';
  return 'Low';
};

module.exports = mongoose.model('Project', ProjectSchema);
