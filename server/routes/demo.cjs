const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  return res.success({ hello: 'Hello from API!', timestamp: new Date().toISOString() });
});

module.exports = router;