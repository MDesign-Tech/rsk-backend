
const Module = require('../models/Module');
const Permission = require('../models/Permission');

/**
 * Middleware factory that checks if the authenticated user has the required
 *
 * Usage:
 *   router.post('/hero', protect, authorize('Hero', 'create'), createHero);
 *   router.get('/hero', protect, authorize('Hero', 'read'), getHero);
 */
const authorize = (moduleName, action) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
        errors: ['Please login to access this resource'],
      });
    }

    // Admin role has full access to everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Find the module
    const moduleDoc = await Module.findOne({ name: moduleName, isActive: true });
    if (!moduleDoc) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        errors: [`Module "${moduleName}" not found or is not active`],
      });
    }
    next();
  };
};

module.exports = { authorize };
