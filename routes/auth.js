const express = require("express");

const { check, body } = require("express-validator/check");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(
              "E-mail already exist, please pick a different one"
            );
          }
        });
      })
      .normalizeEmail(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters in length")
      .trim(),

    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error("Password dosen't match");
        return true;
      })
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
