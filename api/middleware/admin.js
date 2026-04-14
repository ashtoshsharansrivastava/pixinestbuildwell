import User from '../models/User.js';

const admin = async (req, res, next) => {
  try {
    // Re-fetch user from DB to ensure role is up-to-date
    const user = await User.findById(req.user.id);

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as an admin' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying admin status' });
  }
};

export { admin };
