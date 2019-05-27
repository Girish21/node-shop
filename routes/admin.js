const path = require("path");

const { check, body } = require("express-validator/check");

const express = require("express");

const adminController = require("../controllers/admin");

const authGuard = require("../middleware/isAuth");

const router = express.Router();

// // /admin/add-product => GET
router.get("/add-product", authGuard, adminController.getAddProduct);

// // /admin/products => GET
router.get("/products", authGuard, adminController.getProducts);

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    check("title", "Title cannot be empty")
      .not()
      .isEmpty(),
    check("imageUrl", "Image URL cannot be empty")
      .not()
      .isEmpty(),
    check("price", "Price cannot be empty")
      .not()
      .isEmpty(),
    check("description", "Description cannot be empty")
      .not()
      .isEmpty(),
    check("title", "Title should be atleast 3 charaters in length").isLength({
      min: 3
    })
  ],
  authGuard,
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  authGuard,
  adminController.getEditProduct
);

router.post("/edit-product", authGuard, adminController.postEditProduct);

router.post("/delete-product", authGuard, adminController.postDeleteProduct);

module.exports = router;
