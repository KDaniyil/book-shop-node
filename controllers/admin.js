const Product = require("../models/product");

/**
 * Renders the add-product page with specified properties.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {void}
 */
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

/**
 * Handles POST request on /admin/add-product route.
 * Adds new product to the database and redirects to the home page.
 * @param {Object} req Request object
 * @param {Object} req.body Request body. Expects 'title' property
 * @param {string} req.body.title Title of the product
 * @param {Object} res Response object
 * @param {Function} next Next middleware function
 */
exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.getProduct(productId, (products) => {
    const product = products.find((p) => p.id === productId);
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      product: product,
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};
