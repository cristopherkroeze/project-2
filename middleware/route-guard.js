const User = require('../models/User.model.js');

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  User.findById(req.session.user._id)
    .populate({ path: 'favorites', populate: { path: 'owner' } })
    .populate({ path: 'watchList', populate: { path: 'owner' } })
    .then(foundUser => {
      req.session.user = foundUser;
      console.log('req.session.user:', req.session.user);
      next();
    })
    .catch(error => console.log(error));
};

const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};
