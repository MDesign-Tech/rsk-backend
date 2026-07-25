const Permission = require('../models/Permission');
const Module = require('../models/Module');

/**
 * Middleware factory that checks if the authenticated user has the required
 * permission for a specific module and action.
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

    // Find the user's permission for this module
    const permission = await Permission.findOne({
      user: req.user._id,
      module: moduleDoc._id,
    });

    if (!permission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        errors: [`You do not have permission to ${action} ${moduleName}`],
      });
    }

    // Check the specific action permission
    const hasPermission = permission[`can${action.charAt(0).toUpperCase() + action.slice(1)}`];
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        errors: [`You do not have permission to ${action} ${moduleName}`],
      });
    }

    // Attach permission to request for potential use in controllers
    req.permission = permission;
    next();
  };
};

module.exports = { authorize };
