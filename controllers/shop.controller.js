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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (const product of cart.products) {
        const cartProductData = products.find((prod) => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({
            productData: cartProductData,
            qty: product.qty,
          });
        }
      }
      res.render("shop/cart", {
        products: cartProducts,
        path: "/cart",
        pageTitle: "Your Cart",
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.getProductById(productId, (product) => {
    Cart.addProduct(productId, product.price);
    res.redirect("/cart");
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.getProductById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
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
