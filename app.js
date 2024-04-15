const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error.controller");
const sequelize = require("./util/database");
const Product = require("./models/product.model");
const User = require("./models/user.model");

const app = express();

const adminRoutes = require("./routes/admin.routes");
const shopRoutes = require("./routes/shop.routes");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("middleware");
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Dani", email: "dani@test.com" });
    }

    return user;
  })
  .then((user) => {
    //console.log(user, "user");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
