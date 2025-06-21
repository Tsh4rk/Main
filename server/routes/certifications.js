const express = require('express');
const router = express.Router();

// @route   GET /api/certifications
// @desc    Get all certifications
// @access  Public
router.get('/', (req, res) => {
  // Sample certifications data
  const sampleCertifications = [
    {
      id: 1,
      name: 'Offensive Security Certified Professional',
      acronym: 'OSCP',
      issuer: 'Offensive Security',
      category: 'penetration-testing',
      level: 'professional',
      dateObtained: '2022-06-15',
      expirationDate: null,
      isActive: true,
      credentialId: 'OSCP-12345',
      verificationUrl: 'https://www.offensive-security.com/verify'
    },
    {
      id: 2,
      name: 'Certified Information Systems Security Professional',
      acronym: 'CISSP',
      issuer: '(ISC)²',
      category: 'governance',
      level: 'professional',
      dateObtained: '2021-03-20',
      expirationDate: '2024-03-20',
      isActive: true,
      credentialId: 'CISSP-67890',
      verificationUrl: 'https://www.isc2.org/verify'
    },
    {
      id: 3,
      name: 'Certified Ethical Hacker',
      acronym: 'CEH',
      issuer: 'EC-Council',
      category: 'ethical-hacking',
      level: 'associate',
      dateObtained: '2020-09-10',
      expirationDate: '2023-09-10',
      isActive: true,
      credentialId: 'CEH-11111',
      verificationUrl: 'https://www.eccouncil.org/verify'
    }
  ];

  res.json({
    success: true,
    count: sampleCertifications.length,
    data: sampleCertifications
  });
});

// @route   GET /api/certifications/:id
// @desc    Get single certification
// @access  Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: `Certification ${id} endpoint - Detailed content will be added later`,
    note: 'This is a demo portfolio'
  });
});

module.exports = router;
