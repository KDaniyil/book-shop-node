const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error.controller");

const app = express();

const User = require("./models/user.model");

const adminRoutes = require("./routes/admin.routes");
const shopRoutes = require("./routes/shop.routes");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("662d14611dd75ca82ab59e03");
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb+srv://Dani:D130319900k!@cluster0.rtvebxo.mongodb.net/shop")
  .then(async (result) => {
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
