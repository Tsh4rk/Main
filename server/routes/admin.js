const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const Content = require('../models/Content');
const User = require('../models/User');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const router = express.Router();

// Apply auth middleware to all admin routes
router.use(auth);
router.use(adminAuth);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get counts from database
    const [contentCount, userCount, projectCount, blogCount] = await Promise.all([
      Content.countDocuments(),
      User.countDocuments(),
      Project.countDocuments(),
      Blog.countDocuments()
    ]);

    // Sample dashboard data (you can enhance this with real analytics)
    const dashboardData = {
      stats: {
        totalContent: contentCount,
        totalUsers: userCount,
        totalProjects: projectCount,
        totalBlogs: blogCount,
        terminalSessions: Math.floor(Math.random() * 1000) + 400,
        uniqueVisitors: Math.floor(Math.random() * 2000) + 1000
      },
      recentActivity: [
        {
          type: 'content_update',
          action: 'Content updated',
          timestamp: new Date().toISOString(),
          user: req.user.username
        },
        {
          type: 'user_login',
          action: 'Admin login',
          timestamp: new Date().toISOString(),
          user: req.user.username
        }
      ],
      systemStatus: {
        server: 'online',
        database: 'connected',
        lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/content
// @desc    Get all content for editing
// @access  Private (Admin only)
router.get('/content', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } }
      ];
    }

    const content = await Content.find(query)
      .populate('modifiedBy', 'username')
      .sort({ lastModified: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(query);

    res.json({
      success: true,
      data: {
        content,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content'
    });
  }
});

// @route   GET /api/admin/content/:id
// @desc    Get single content item
// @access  Private (Admin only)
router.get('/content/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('modifiedBy', 'username');
    
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
    console.error('Get content by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content'
    });
  }
});

// @route   POST /api/admin/content
// @desc    Create new content
// @access  Private (Admin only)
router.post('/content', async (req, res) => {
  try {
    const { key, title, content, contentType, category, isPublished } = req.body;

    // Validation
    if (!key || !title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Key, title, content, and category are required'
      });
    }

    // Check if key already exists
    const existingContent = await Content.findOne({ key });
    if (existingContent) {
      return res.status(400).json({
        success: false,
        message: 'Content with this key already exists'
      });
    }

    const newContent = new Content({
      key,
      title,
      content,
      contentType: contentType || 'text',
      category,
      isPublished: isPublished !== undefined ? isPublished : true,
      modifiedBy: req.user._id
    });

    await newContent.save();
    await newContent.populate('modifiedBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: newContent
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating content'
    });
  }
});

// @route   PUT /api/admin/content/:id
// @desc    Update content
// @access  Private (Admin only)
router.put('/content/:id', async (req, res) => {
  try {
    const { title, content, contentType, category, isPublished } = req.body;

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        contentType,
        category,
        isPublished,
        modifiedBy: req.user._id,
        lastModified: new Date()
      },
      { new: true }
    ).populate('modifiedBy', 'username');

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content'
    });
  }
});

// @route   DELETE /api/admin/content/:id
// @desc    Delete content
// @access  Private (Admin only)
router.delete('/content/:id', async (req, res) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.id);

    if (!deletedContent) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting content'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, isActive },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// @route   GET /api/admin/logs
// @desc    Get system logs
// @access  Private (Admin only)
router.get('/logs', async (req, res) => {
  try {
    // This is a simplified version - in production you'd have a proper logging system
    const sampleLogs = [
      {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: `Admin ${req.user.username} accessed logs`,
        source: 'admin'
      },
      {
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: 'INFO',
        message: 'User accessed terminal interface',
        source: 'terminal'
      },
      {
        timestamp: new Date(Date.now() - 600000).toISOString(),
        level: 'INFO',
        message: 'API request to /api/projects',
        source: 'api'
      },
      {
        timestamp: new Date(Date.now() - 900000).toISOString(),
        level: 'WARN',
        message: 'Rate limit exceeded for IP 192.168.1.100',
        source: 'security'
      }
    ];

    res.json({
      success: true,
      data: sampleLogs
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching logs'
    });
  }
});

// @route   POST /api/admin/seed-content
// @desc    Seed initial content (development only)
// @access  Private (Admin only)
router.post('/seed-content', async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Seeding not allowed in production'
      });
    }

    const seedContent = [
      {
        key: 'home_hero_title',
        title: 'Hero Title',
        content: 'CYBERSECURITY EXPERT',
        contentType: 'text',
        category: 'home'
      },
      {
        key: 'home_hero_subtitle',
        title: 'Hero Subtitle', 
        content: 'Penetration Testing • Red Team Operations • Security Research',
        contentType: 'text',
        category: 'home'
      },
      {
        key: 'about_description',
        title: 'About Description',
        content: 'Cybersecurity professional specializing in offensive security operations, with extensive experience in penetration testing, red team exercises, and security research.',
        contentType: 'text',
        category: 'about'
      }
    ];

    for (const item of seedContent) {
      const existing = await Content.findOne({ key: item.key });
      if (!existing) {
        await Content.create({
          ...item,
          modifiedBy: req.user._id
        });
      }
    }

    res.json({
      success: true,
      message: 'Content seeded successfully'
    });
  } catch (error) {
    console.error('Seed content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding content'
    });
  }
});

module.exports = router;
