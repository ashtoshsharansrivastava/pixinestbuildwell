import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Property from '../models/Property.js';

// @desc    Get a broker's dashboard data
// @route   GET /api/brokers/:id/dashboard
// @access  Private/Broker
const getBrokerDashboardData = asyncHandler(async (req, res) => {
  const brokerId = req.params.id?.toString();
  const authUserId = req.user?._id?.toString();
  console.log("🔑 brokerId (from params):", brokerId);
  console.log("🔑 authUserId (from token):", authUserId);
  console.log("🔑 req.user:", req.user);


  if (!req.user) {
    res.status(401);
    throw new Error('User not logged in or token is invalid.');
  }

  if (authUserId !== brokerId) {
    res.status(403);
    throw new Error('Not authorized to access this dashboard');
  }

  const broker = await User.findById(brokerId).select('fullName email referralCode');
  
  if (!broker) {
    res.status(404);
    throw new Error('Broker not found in database');
  }
  
  const listings = await Property.find({ agent: brokerId });
  const activeListings = listings.filter(l => l.status === 'published').length;
  const referredBrokers = await User.find({ referredBy: brokerId }).select('fullName email');
  
  res.json({
    stats: {
      referralCode: broker?.referralCode || 'N/A', 
      totalListings: listings.length,
      activeListings: activeListings,
      profit: 0,
    },
    listings: listings.map(l => ({
      id: l._id,
      title: l.title,
      price: l.price,
      status: l.status,
      views: l.views,
      createdAt: l.createdAt,
    })),
    referredBrokers: referredBrokers,
  });
});

export { getBrokerDashboardData };