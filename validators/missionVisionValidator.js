const { body } = require("express-validator");

// All fields optional so partial updates (e.g. toggling visibility) are allowed
// without re-sending every field.
const validateMissionVision = [
  body("missionTitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Mission title cannot be empty"),

  body("missionDescription")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Mission description cannot be empty"),

  body("visionTitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Vision title cannot be empty"),

  body("visionDescription")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Vision description cannot be empty"),

  body("visible")
    .optional()
    .isBoolean()
    .withMessage("visible must be a boolean")
    .toBoolean(),
];

module.exports = {
  validateMissionVision,
};