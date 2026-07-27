const express = require('express');
const {
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
} = require('../controllers/moduleController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Module', 'read'), getModules);
router.get('/:id', authorize('Module', 'read'), getModule);
router.post('/', authorize('Module', 'create'), createModule);
router.put('/:id', authorize('Module', 'update'), updateModule);
router.delete('/:id', authorize('Module', 'delete'), deleteModule);

module.exports = router;
