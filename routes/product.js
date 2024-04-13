const express = require("express");
const router = express.Router({mergeParams:true});
const { isLoggedIn, saveRedirectUrl, isOwner } = require("../middleware");
const Product = require("../models/product");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const productController = require("../controllers/product");

router.get("/", productController.index);

//add
router.get("/add", isLoggedIn, productController.renderAdd);

// add save
router.post(
  "/",
  isLoggedIn,
  upload.single("product[imgUrl]"),
  productController.addProduct
);
//edit
router.get("/edit/:id", isLoggedIn, isOwner, productController.editProduct);

// show
router.get("/:id", productController.renderShowPage);

// update product info
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("product[imgUrl]"),
  productController.updateProductInfo
);

// delete route for product
router.delete("/:id", isLoggedIn, isOwner, productController.deleteProduct);

module.exports = router;
