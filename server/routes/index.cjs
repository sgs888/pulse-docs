const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.cjs');
const loginRoutes = require('./login.cjs');
const demoRoutes = require('./demo.cjs');

router.use(loginRoutes);
router.use('/demo', authenticateToken, demoRoutes);

router.use((req, res) => {
  res.status(404).json({
    error: 'API endpoint not found'
  });
});

module.exports = router;