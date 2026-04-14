// backend/utils/generatePassword.js

/**
 * Generates a random, secure temporary password.
 * @returns {string} A random string suitable for a temporary password.
 */
export const generatePassword = () => {
  // Use a combination of random numbers and letters
  return Math.random().toString(36).slice(-10);
};