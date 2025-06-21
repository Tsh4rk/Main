const express = require('express');
const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (would require authentication in production)
router.get('/dashboard', (req, res) => {
  // Sample dashboard data
  const dashboardData = {
    stats: {
      totalVisitors: 1247,
      terminalSessions: 456,
      blogViews: 789,
      projectViews: 321
    },
    recentActivity: [
      {
        type: 'terminal_command',
        command: 'skills red-team',
        timestamp: new Date().toISOString(),
        ip: '192.168.1.100'
      },
      {
        type: 'page_view',
        page: '/projects',
        timestamp: new Date().toISOString(),
        ip: '10.0.0.50'
      }
    ],
    systemStatus: {
      server: 'online',
      database: 'connected',
      lastBackup: '2024-01-20T10:30:00Z'
    }
  };

  res.json({
    success: true,
    data: dashboardData,
    note: 'This is a demo admin dashboard - authentication would be required in production'
  });
});

// @route   GET /api/admin/logs
// @desc    Get system logs
// @access  Private
router.get('/logs', (req, res) => {
  const sampleLogs = [
    {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: 'User accessed terminal interface',
      source: 'terminal'
    },
    {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: 'API request to /api/projects',
      source: 'api'
    },
    {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message: 'High number of requests from IP 192.168.1.100',
      source: 'security'
    }
  ];

  res.json({
    success: true,
    data: sampleLogs,
    note: 'This is a demo log system'
  });
});

module.exports = router;
