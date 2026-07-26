const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder - module routes can be implemented as needed
router.use(protect);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Modules endpoint',
    data: { modules: [] },
  });
});

module.exports = router;
