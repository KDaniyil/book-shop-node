const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: errorMessage,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return await req.session.save((error) => {
        res.redirect("/");
      });
    }
    req.flash("error", "Invalid email or password");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    res.redirect("/");
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  try {
    const userDoc = await User.findOne({ email: email });

    if (userDoc) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      await user.save();
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: errorMessage,
  });
};
