module.exports = function(req, res, next) {
  if (req.user && req.user.role === 'Project Lead') {
    next(); // User is a Project Lead, proceed
  } else {
    res.status(403).json({ msg: 'Access denied. Project Lead rights required.' });
  }
};
