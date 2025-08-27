import express from "express";
import {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  validateRegistration,
  validateOtpVerification,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validator.js";

const router = express.Router();

router.post("/register", validateRegistration, registerUser);
router.post("/verify-otp", validateOtpVerification, verifyOtp);
router.post("/login", validateLogin, loginUser);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

export default router;
