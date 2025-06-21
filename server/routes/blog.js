const express = require('express');
const router = express.Router();

// @route   GET /api/blog
// @desc    Get all blog posts
// @access  Public
router.get('/', (req, res) => {
  // Sample blog posts data
  const samplePosts = [
    {
      id: 1,
      title: 'Advanced Persistent Threat (APT) Analysis',
      excerpt: 'Deep dive into APT tactics, techniques, and procedures...',
      category: 'red-team',
      author: 'CyberSec Expert',
      date: '2024-01-15',
      readTime: 8
    },
    {
      id: 2,
      title: 'Building a Home SOC Lab',
      excerpt: 'Complete guide to setting up your own Security Operations Center...',
      category: 'blue-team',
      author: 'CyberSec Expert',
      date: '2024-01-10',
      readTime: 12
    }
  ];

  res.json({
    success: true,
    count: samplePosts.length,
    data: samplePosts
  });
});

// @route   GET /api/blog/:id
// @desc    Get single blog post
// @access  Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: `Blog post ${id} endpoint - Content will be added later`,
    note: 'This is a demo portfolio'
  });
});

module.exports = router;
