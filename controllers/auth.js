const passport = require('passport')
const validator = require('validator')

const User = require('../models/User')

exports.getLogin = (req, res) => {
  res.render('landingPage/login.ejs');
}

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/sellerHome")
  }
  res.render('landingPage/signup.ejs');
};

exports.postSignup = async (req, res, next) => {
  console.log(req.body);
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.redirect("../signup");
    }

    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      res.redirect("/sellerHome");
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

