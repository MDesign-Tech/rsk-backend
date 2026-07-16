const express = require('express');
const { body } = require('express-validator');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceVisibility,
} = require('../controllers/serviceController');
const { validateService } = require('../validators/serviceValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', validateService, createService);
router.put('/:id', validateService, updateService);
router.delete('/:id', deleteService);
router.patch('/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleServiceVisibility);

module.exports = router;
