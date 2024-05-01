const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
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
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};
