const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, and .webp formats are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// Wraps multer so file-related errors (e.g. wrong type / size) are returned as
// consistent JSON instead of the default HTML 500 response.
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      errors: [err.message],
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      errors: [err.message || 'Invalid file'],
    });
  }
  next();
};

module.exports = { upload, multerErrorHandler };
