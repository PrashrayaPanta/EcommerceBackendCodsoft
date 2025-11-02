const express = require("express");

const isAuthenticated = require("../middleware/isAuth.js");

const brandRoute = express.Router();

const brandCtrl = require("../controller/Brand.js");
const isAdmin = require("../middleware/isAdmin.js");

const {
  deleteOnlyImageHandlerForBrand,
  getImageDetailsHandlerForBrand,
} = require("../controller/File.js");

const productRoute = require("./productRoute.js");
const productCtrl = require("../controller/Product.js");
const { upload } = require("../upload/upload.js");
const isAdminOrStaff = require("../middleware/isAdminOrStaff.js");

// Upload folder name
const Brand_IMAGES_FOLDER = "nodejsbrandImages";

//! Admin and Staff Routes for Brand Management

brandRoute.post(
  "/cms/brands",
  isAuthenticated,
  isAdminOrStaff,
  upload(Brand_IMAGES_FOLDER).single("image"),
  brandCtrl.createBrand
);

brandRoute.get(
  "/cms/brands/:slug",
  isAuthenticated,
  isAdminOrStaff,
  brandCtrl.GetCertainBrand
);

brandRoute.delete(
  "/cms/brands/:slug",
  isAuthenticated,
  isAdminOrStaff,
  brandCtrl.deleteCertainBrand
);

brandRoute.put(
  "/cms/brands/:slug",
  isAuthenticated,
  isAdminOrStaff,
  upload(Brand_IMAGES_FOLDER).single("image"),
  brandCtrl.EditCertainBrand
);

brandRoute.delete(
  "/cms/brands/:slug/nodejsBrandImages/:filename",
  isAuthenticated,
  isAdminOrStaff,
  deleteOnlyImageHandlerForBrand
);

brandRoute.get("/cms/brands", brandCtrl.getAllBrand);

brandRoute.get("/brands/:slug", brandCtrl.GetCertainBrand);

productRoute.get("/brands/:slug/products", productCtrl.getAllProductByBrandId);

brandRoute.get(
  "/brands/nodejsBrandImages/:filename",
  getImageDetailsHandlerForBrand
);

//!FrontEnd Part
brandRoute.get("/brands", brandCtrl.getAllBrand);

module.exports = brandRoute;
