const express = require('express');
const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', (req, res) => {
  // Sample projects data
  const sampleProjects = [
    {
      id: 1,
      title: 'Corporate Red Team Assessment',
      description: 'Full-scope penetration test with physical access simulation',
      category: 'red-team',
      status: 'completed',
      technologies: ['Metasploit', 'Cobalt Strike', 'PowerShell Empire'],
      date: '2024-01-01'
    },
    {
      id: 2,
      title: 'APT29 Simulation Exercise',
      description: 'Advanced persistent threat emulation based on real-world tactics',
      category: 'simulation',
      status: 'completed',
      technologies: ['MITRE ATT&CK', 'Atomic Red Team', 'Custom C2'],
      date: '2023-12-15'
    },
    {
      id: 3,
      title: 'Custom Malware Analysis Lab',
      description: 'Isolated environment for malware research and reverse engineering',
      category: 'blue-team',
      status: 'ongoing',
      technologies: ['VMware', 'Cuckoo Sandbox', 'YARA', 'Volatility'],
      date: '2023-11-01'
    }
  ];

  res.json({
    success: true,
    count: sampleProjects.length,
    data: sampleProjects
  });
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: `Project ${id} endpoint - Detailed content will be added later`,
    note: 'This is a demo portfolio'
  });
});

module.exports = router;
