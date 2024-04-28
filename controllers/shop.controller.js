const Product = require("../models/product.model");
const Order = require("../models/order.model");

/**
 * Retrieves and renders the products on the 'shop' page.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {void}
 */
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      isAuthenticated: req.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      isAuthenticated: req.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    res.render("shop/cart", {
      products: user.cart.items,
      path: "/cart",
      pageTitle: "Your Cart",
      isAuthenticated: req.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  try {
    await req.user.deleteItemFromCart(productId);
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((item) => ({
      product: { ...item.productId._doc },
      quantity: item.quantity,
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
    });
    await order.save();

    await req.user.clearCart();

    res.redirect("shop/orders");
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });
    res.render("shop/orders", {
      orders: orders,
      pageTitle: "Your Orders",
      path: "/orders",
      isAuthenticated: req.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    isAuthenticated: req.isLoggedIn,
  });
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product?.title,
      path: "/products",
      isAuthenticated: req.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};
