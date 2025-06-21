const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Can store strings, objects, arrays
    required: true
  },
  contentType: {
    type: String,
    enum: ['text', 'html', 'markdown', 'json', 'array'],
    default: 'text'
  },
  category: {
    type: String,
    required: true,
    enum: ['home', 'about', 'skills', 'projects', 'blog', 'contact', 'terminal', 'general'],
    default: 'general'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastModified on save
ContentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('Content', ContentSchema);
