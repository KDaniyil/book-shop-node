const Product = require("../models/product.model");

const Cart = require("../models/cart.model");

/**
 * Retrieves and renders the products on the 'shop' page.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {void}
 */
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        products: products,
        path: "/cart",
        pageTitle: "Your Cart",
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart
        .getProducts({
          where: {
            id: productId,
          },
        })
        .then((products) => {
          let product;
          if (products.length > 0) {
            product = products[0];
          }

          if (product) {
            const oldQty = product.cartItem.quantity;
            newQuantity = oldQty + 1;
            return product;
          }
          return Product.findByPk(productId);
        })
        .then((product) => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        })
        .then(() => {
          res.redirect("/cart");
        });
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product?.title,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};
