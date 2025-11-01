const express = require("express");

const isAuthenticated = require("../middleware/isAuth.js");

const categoryRoute = express.Router();

const categoryCtrl = require("../controller/Category.js");

const productCtrl = require("../controller/Product.js");

const productRoute = require("./productRoute.js");

const isAdmin = require("../middleware/isAdmin.js");
const isAdminOrStaff = require("../middleware/isAdminOrStaff.js");

//! AdminorStaff
categoryRoute.post(
  "/cms/categories",
  isAuthenticated,
  isAdminOrStaff,
  categoryCtrl.createCategory
);

categoryRoute.put(
  "/cms/categories/:slug",
  isAuthenticated,
  isAdminOrStaff,
  categoryCtrl.EditCertainCategory
);

categoryRoute.delete(
  "/cms/categories/:slug",
  isAuthenticated,
  isAdminOrStaff,
  categoryCtrl.deleteCategory
);

categoryRoute.get(
  "/cms/categories/:slug",
  isAuthenticated,
  isAdminOrStaff,
  categoryCtrl.getCategoryBySlug
);

categoryRoute.get(
  "/cms/categories",
  isAuthenticated,
  isAdminOrStaff,
  categoryCtrl.getAllCategory
);

// categoryRoute.get("/:id", isAuthenticated,   categoryCtrl.getCertainCategory);

//! Customer part and //!Normal User

categoryRoute.get("/categories", categoryCtrl.getAllCategory);

categoryRoute.get("/categories/:slug", categoryCtrl.getCategoryBySlug);

productRoute.get(
  "/categories/:slug/products",
  productCtrl.getAllProductByCategoryId
);

// categoryRoute.get("/frontend/categories/:id/posts",   categoryCtrl.getCertainCategoryProducts)

//! Normal Part

// categoryRoute.get("/frontend/categories", categoryCtrl.getAllCategory);

// categoryRoute.get("/frontend/categories/:id",  categoryCtrl.getCertainCategory)

// categoryRoute.get("/frontend/categories/:id/products", categoryCtrl.getCertainCategoryProducts)

// Route to get category ID by name
// categoryRoute.get("/getCategoryId/:categoryName", categoryCtrl.getCategoryId);

// Example route with missing callback function
// categoryRoute.get("/get", isAuthenticated, isAdmin, categoryCtrl.getCategories);

module.exports = categoryRoute;
