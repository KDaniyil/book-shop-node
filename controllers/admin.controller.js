const Product = require("../models/product.model");

/**
 * Renders the add-product page with specified properties.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {void}
 */
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
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
  req.user
    .createProduct({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  try {
    const products = await req.user.getProducts({ where: { id: productId } });
    const product = products[0];
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { id, title, imageUrl, description, price } = req.body;

  try {
    await Product.update(
      {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
      },
      { where: { id: id } }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  try {
    await Product.destroy({
      where: {
        id: productId,
      },
    });
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};
