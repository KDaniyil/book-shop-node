const express = require("express");

const path = require("path");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

const shopController = require("../controllers/shop.controller");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/create-order", isAuth, shopController.postOrder);

// router.get("/checkout", shopController.getCheckout);

router.get("/products/:productId", isAuth, shopController.getProduct);

module.exports = router;
