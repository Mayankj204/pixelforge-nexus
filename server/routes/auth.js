const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware
const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged-in user's data
// @access  Private (because we use the 'auth' middleware)
router.get('/', auth, async (req, res) => {
  try {
    // req.user.id is available because our middleware added it
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;