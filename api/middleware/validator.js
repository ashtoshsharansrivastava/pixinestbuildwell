import { check, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRegistration = [
  check("fullName", "Full name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
  check("phoneNumber", "Phone number is required").not().isEmpty(),
  handleValidationErrors,
];

export const validateOtpVerification = [
  check("email", "Please include a valid email").isEmail(),
  check("otp", "OTP is required").not().isEmpty(),
  handleValidationErrors,
];

export const validateLogin = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  handleValidationErrors,
];

export const validateForgotPassword = [
  check("email", "Please include a valid email").isEmail(),
  handleValidationErrors,
];

export const validateResetPassword = [
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
  handleValidationErrors,
];
