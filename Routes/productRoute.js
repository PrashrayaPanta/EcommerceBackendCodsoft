const express = require("express");

const productCtrl = require("../controller/Product.js");

const isAuthenticated = require("../middleware/isAuth");

const productRoute = express.Router();

const { upload } = require("../upload/upload.js");

const isAdmin = require("../middleware/isAdmin.js");

const {
  deleteOnlyImageHandler,
  getImageDetailsHandlerForProduct,
  deleteImageHandlerForProduct,
} = require("../controller/File.js");
const isAdminOrStaff = require("../middleware/isAdminOrStaff.js");
const withPagination = require("../middleware/withPagination.js");
const Product = require("../model/Product.js");

// Upload folder name
const PRODUCT_IMAGES_FOLDER = "nodejsproductImages";

productRoute.post(
  "/cms/products",
  isAuthenticated,
  isAdminOrStaff,
  upload(PRODUCT_IMAGES_FOLDER).array("images"),
  productCtrl.createProduct
);

productRoute.delete(
  "/cms/products/:slug/nodejsProductImages/:filename",
  deleteImageHandlerForProduct
);



productRoute.get("/products/search", productCtrl.searchProduct);

//! Both admin and staff and customer and normal user can access the resource
productRoute.get("/products",  withPagination(Product));



productRoute.get("/products/:slug", productCtrl.getCertainproduct);


productRoute.put(
  "/cms/products/:slug",
  isAuthenticated,
  isAdminOrStaff,
  upload(PRODUCT_IMAGES_FOLDER).array("images"),
  productCtrl.updateCertainproduct
);


productRoute.get(
  "/cms/products/:slug",
  isAuthenticated,
  isAdminOrStaff,
  productCtrl.getCertainproduct
);



productRoute.get(
  "/products/nodejsProductImages/:filename",
  getImageDetailsHandlerForProduct
);

productRoute.delete(
  "/cms/products/:slug",
  isAuthenticated,
  isAdminOrStaff,
  productCtrl.deleteproduct
);

productRoute.get(
  "/cms/products/:slug/reviews",
  isAuthenticated,
  isAdminOrStaff,
  productCtrl.getCertainProductReviews
);

// productRoute.get("/latestproduct", isAuthenticated,  productCtrl.Latestproducts);

// productRoute.get("/search",  isAuthenticated,  productCtrl.searchproduct);

productRoute.post(
  "/products/:slug/reviews",
  isAuthenticated,
  productCtrl.createCertainProductReviews
);

productRoute.get(
  "/products/:slug/reviews",
  isAuthenticated,
  productCtrl.getCertainProductReviews
);

// productCtrl.get("/cms/reviews", isAuthenticated, isAdmin, )

//!FrontEnd Part

// productRoute.get("/products", productCtrl.getAllproduct);

// productRoute.get("/sub-categories/:id/products", productCtrl.getAllProductsBySubCategoryId)

// productRoute.get("/products/categories/:id/products", productCtrl.getAllProductByCategoryId)

//! Top Latest Product

// productRoute.get("/frontend/brands/:slug/products", productCtrl.getAllProductByBrandId )

module.exports = productRoute;
