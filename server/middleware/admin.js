module.exports = function(req, res, next) {
  // Check if the user object exists and if the role is 'Admin'
  if (req.user && req.user.role === 'Admin') {
    next(); // User is an Admin, proceed to the route handler
  } else {
    res.status(403).json({ msg: 'Access denied. Admin rights required.' });
  }
};