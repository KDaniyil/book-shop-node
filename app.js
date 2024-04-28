const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const DB_URL =
  "mongodb+srv://Dani:D130319900k!@cluster0.rtvebxo.mongodb.net/shop";

const errorController = require("./controllers/error.controller");

const app = express();

const store = new MongoDBStore({
  uri: DB_URL,
  collection: "sessions",
});

//models
const User = require("./models/user.model");

//Routes
const adminRoutes = require("./routes/admin.routes");
const shopRoutes = require("./routes/shop.routes");
const authRoutes = require("./routes/auth.routes");

app.set("view engine", "ejs");
app.set("views", "views");

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

// use Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(DB_URL)
  .then(async (result) => {
    console.log("DB connected");
    let user = await User.findOne();
    if (!user) {
      user = new User({
        name: "Dani",
        email: "dani@gmail.com",
        cart: { items: [] },
      });
      user.save();
    }

    app.listen(3000);
  })
  .catch((err) => console.log(err));
