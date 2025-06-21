const express = require('express');
const Content = require('../models/Content');
const router = express.Router();

// @route   GET /api/content
// @desc    Get all published content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, key } = req.query;
    
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (key) {
      query.key = key;
    }

    const content = await Content.find(query)
      .select('-modifiedBy -__v')
      .sort({ lastModified: -1 });

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content'
    });
  }
});

// @route   GET /api/content/:key
// @desc    Get single content item by key
// @access  Public
router.get('/:key', async (req, res) => {
  try {
    const content = await Content.findOne({ 
      key: req.params.key, 
      isPublished: true 
    }).select('-modifiedBy -__v');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get content by key error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content'
    });
  }
});

module.exports = router;
