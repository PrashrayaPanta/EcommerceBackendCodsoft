const express = require("express");

const productCtrl = require("../controller/Product.js");

const isAuthenticated = require("../middleware/isAuth");

const productRoute = express.Router();

const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const isAdmin = require("../middleware/isAdmin.js");
const {
  deleteOnlyImageHandler,
  getImageDetailsHandlerForProduct,
  deleteImageHandlerForProduct,
} = require("../controller/File.js");
const { cloudinary } = require("../config/clodinaryConfig.js");

const WhereStorage = (folder) => {
  //!Configure multer storage cloudinary for image
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folder,
      allowedFormat: ["png", "jpeg"],
      public_id: (req, file) => file.fieldname + "_" + Date.now(),
    },
  });
};

///!Configure Multer for uploading image
const upload = (folder, maxsizeMb = 5) => {
  return multer({
    storage: WhereStorage(folder),
    limits: 1024 * 1024 * 5, //5MB LIMIt
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Not an image plz upload an image", false));
      }
    },
  });
};

module.exports = { upload };

// Upload folder name
const PRODUCT_IMAGES_FOLDER = "nodejsproductImages";

productRoute.post(
  "/admin/products",
  isAuthenticated,
  isAdmin,
  upload(PRODUCT_IMAGES_FOLDER).array("images"),
  productCtrl.createProduct
);

productRoute.delete(
  "/admin/products/:slug/nodejsProductImages/:filename",
  deleteImageHandlerForProduct
);

productRoute.get("/products/search", productCtrl.searchProduct);

productRoute.get("/products/Latestproducts", productCtrl.Latestproducts);

productRoute.get("/products/lowtohigh", productCtrl.lowtoHighPriceProduct);

productRoute.get("/products/:slug", productCtrl.getCertainproduct);

// productRoute.get("/frontend/latestproducts", )

productRoute.put(
  "/admin/products/:slug",
  isAuthenticated,
  isAdmin,
  upload(PRODUCT_IMAGES_FOLDER).array("images"),
  productCtrl.updateCertainproduct
);

// productRoute.get("/:categoryName", isAuthenticated, isAdmin,  productCtrl.getAllProductsByCategoryName);

// productRoute.get("/latestproduct", isAuthenticated, isAdmin, productCtrl.Latestproducts);

// productRoute.get("/search",  isAuthenticated, isAdmin,  productCtrl.searchproduct);

productRoute.get(
  "/admin/products/:slug",
  isAuthenticated,
  isAdmin,
  productCtrl.getCertainproduct
);

productRoute.get(
  "/admin/products",
  isAuthenticated,
  isAdmin,
  productCtrl.getAllproduct
);

productRoute.get(
  "/nodejsProductImages/:filename",
  getImageDetailsHandlerForProduct
);

productRoute.delete(
  "/admin/products/:slug",
  isAuthenticated,
  isAdmin,
  productCtrl.deleteproduct
);

productRoute.get(
  "/admin/products/:slug/reviews",
  isAuthenticated,
  isAdmin,
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
