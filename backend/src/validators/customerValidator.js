const { body } = require("express-validator");

const customerValidation = [
  body("name").trim().notEmpty().withMessage("Customer name required"),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile must be 10 digits")
    .isNumeric()
    .withMessage("Mobile must contain only numbers"),
];

module.exports = {
  customerValidation,
};
