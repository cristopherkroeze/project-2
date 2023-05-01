const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const User = require("../models/User.model.js");

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));


router.post('/signup', isLoggedOut, (req, res, next) => {
   console.log(req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
      }

      if (User.findOne({ email }) || User.findOne({ username })) {
        res.render('auth/signup', { errorMessage: 'Username or Email is taken' });
      }

      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regex.test(password)) {
        res
          .status(500)
          .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
      }
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
          User.create({
          username,
          email,
          password: hashedPassword
        })
        .then(userFromDB => {
          console.log("req.session:", req.session);
          console.log("userFromDB:", userFromDB);
          req.session.user = userFromDB;
          res.redirect('/auth/users/profile');
        })
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username and email need to be unique. Either username or email is already used.'
          });
        } else {
          next(error);
        }
      });
  });


  router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

  router.post('/login', isLoggedOut, (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    const { email, password } = req.body;
   
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both email and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            req.session.user = user;
            res.render('users/profile', { user });
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });


  router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });


  router.get('/users/profile', isLoggedIn, (req, res) => {
    res.render('users/profile', { userInSession: req.session.currentUser });
  });
module.exports = router;