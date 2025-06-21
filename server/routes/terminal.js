const express = require('express');
const router = express.Router();

// @route   GET /api/terminal/commands
// @desc    Get available terminal commands
// @access  Public
router.get('/commands', (req, res) => {
  const commands = [
    {
      name: 'help',
      description: 'Show available commands',
      usage: 'help [command]',
      category: 'system'
    },
    {
      name: 'whoami',
      description: 'Display current user information',
      usage: 'whoami',
      category: 'system'
    },
    {
      name: 'skills',
      description: 'Display technical skills and expertise',
      usage: 'skills [category]',
      category: 'portfolio'
    },
    {
      name: 'projects',
      description: 'List security projects and engagements',
      usage: 'projects [filter]',
      category: 'portfolio'
    },
    {
      name: 'showcerts',
      description: 'Display security certifications',
      usage: 'showcerts',
      category: 'portfolio'
    },
    {
      name: 'nmap',
      description: 'Network discovery and security auditing (simulated)',
      usage: 'nmap [options] [target]',
      category: 'security-tools'
    },
    {
      name: 'exploit',
      description: 'Simulated exploit framework (educational)',
      usage: 'exploit [payload] [target]',
      category: 'security-tools'
    }
  ];

  res.json({
    success: true,
    count: commands.length,
    data: commands
  });
});

// @route   POST /api/terminal/execute
// @desc    Execute terminal command (for logging/analytics)
// @access  Public
router.post('/execute', (req, res) => {
  const { command, args, timestamp } = req.body;
  
  // In a real application, you might log commands for analytics
  console.log(`Terminal command executed: ${command} ${args ? args.join(' ') : ''}`);
  
  res.json({
    success: true,
    message: 'Command logged',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
