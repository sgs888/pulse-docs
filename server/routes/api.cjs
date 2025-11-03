const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!', timestamp: new Date().toISOString() });
});

router.use((req, res) => {
  res.status(404).json({
    error: 'API endpoint not found'
  });
});

module.exports = router;