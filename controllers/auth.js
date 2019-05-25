const crypto = require("crypto");

const Bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLogin = (req, res, next) => {
  let messages = req.flash("error");
  if (messages.length == 0) messages = null;
  else messages = messages[0];

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: messages
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }, (err, user) => {
    if (!user) return res.redirect("/login");
    Bcrypt.compare(password, user.password)
      .then(result => {
        if (result) {
          req.session.user = user;
          req.session.isAuthenticated = true;
          req.session.save(err => {
            return res.redirect("/");
          });
        } else {
          req.flash("error", "Invalid email or password");
          return res.redirect("/login");
        }
      })
      .catch(err => {
        console.log(err);
        return res.redirect("/login");
      });
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.redirect("/signup");
      }
      return Bcrypt.hash(password, 12)
        .then(hash => {
          const user_new = new User({
            email: email,
            password: hash,
            cart: {
              items: []
            }
          });
          return user_new.save();
        })
        .then(result => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "shop@node-test.com",
            subject: "Signup Success",
            html: "<h1>You Successfully signed up!</h1>"
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    // if (!err)
    // console.log(err)
    return res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let messages = req.flash("error");
  if (messages.length == 0) messages = null;
  else messages = messages[0];

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: messages
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/login");
    }
    const token = buffer.toString("hex");
    let email = req.body.email;
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that Email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        return transporter.sendMail({
          to: email,
          from: "shop@node-test.com",
          subject: "Reset Password",
          html: `
            <p>You requested a password reset.</p>
            <p>Click this <a href="http://http://localhost:3000/reset/${token}">link</a> to set a new Password.</p>
          `
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  let messages = req.flash("error");
  if (messages.length == 0) messages = null;
  else messages = messages[0];

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        userId: user._id.toString(),
        token: token,
        errorMessage: messages
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassowrd = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token;
  let resetUser;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return Bcrypt.hash(newPassowrd, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(_ => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
};
