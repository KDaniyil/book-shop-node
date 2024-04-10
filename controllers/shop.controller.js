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
exports.getProducts = async (req, res, next) => {
  try {
    const [rows, fieldData] = await Product.fetchAll();
    res.render("shop/product-list", {
      prods: rows,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
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
    const [product] = await Product.getProductById(productId);
    res.render("shop/product-detail", {
      product: product[0],
      pageTitle: product[0]?.title,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};
