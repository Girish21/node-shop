const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const authGuard = require("../middleware/isAuth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", authGuard, shopController.getCart);

router.post("/cart", authGuard, shopController.postCart);

router.post(
  "/cart-delete-item",
  authGuard,
  shopController.postCartDeleteProduct
);

router.post("/create-order", authGuard, shopController.postOrder);

router.get("/orders", authGuard, shopController.getOrders);

router.get("/orders/:orderId", authGuard, shopController.getInvoice);

module.exports = router;
