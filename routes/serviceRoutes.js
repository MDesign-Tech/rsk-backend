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
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Service', 'read'), getServices);
router.get('/:id', authorize('Service', 'read'), getService);
router.post('/', authorize('Service', 'create'), validateService, validate, createService);
router.put('/:id', authorize('Service', 'update'), validateService, validate, updateService);
router.delete('/:id', authorize('Service', 'delete'), deleteService);
router.patch('/:id/visibility', authorize('Service', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), toggleServiceVisibility);

module.exports = router;
