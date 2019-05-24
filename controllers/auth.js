const User = require('../models/user')
const Bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }, (err, user) => {
    if (!user)
      return res.redirect('/login')
    Bcrypt.compare(password, user.password)
      .then(result => {
        if (result) {
          req.session.user = user
          req.session.isAuthenticated = true;
          req.session.save((err) => {
            return res.redirect('/');
          });
        } else {
          req.flash('error', 'Invalid email or password')
          return res.redirect('/login')
        }
      })
      .catch(err => {
        console.log(err)
        return res.redirect('/login')
      })
  })
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.redirect('/signup');
      }
      return Bcrypt.hash(password, 12).then(hash => {
        const user_new = new User({
          email: email,
          password: hash,
          cart: {
            items: []
          }
        })
        return user_new.save()
      })
        .then((result) => {
          res.redirect('/login');
        })
    })
    .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // if (!err)
    // console.log(err)
    return res.redirect('/');
  });
}
