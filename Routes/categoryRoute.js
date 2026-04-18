const express = require("express");

const isAuthenticated = require("../middleware/isAuth.js");

const categoryRoute = express.Router();

const categoryCtrl = require("../controller/Category.js");

const productCtrl = require("../controller/Product.js");

const productRoute = require("./productRoute.js");



const isAdmin = require("../middleware/isAdmin.js");
const isAdminOrStaff = require("../middleware/isAdminOrStaff.js");
const Category = require("../model/Category.js");
const withPagination = require("../middleware/withPagination.js");


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



//! Admin can access the route and staff can access the route but customer cannot accesste route
categoryRoute.get(
  "/cms/categories",
  isAuthenticated,
  isAdminOrStaff,
  withPagination(Category)
);

// categoryRoute.get("/:id", isAuthenticated,   categoryCtrl.getCertainCategory);

//! Customer part and //!Normal User
categoryRoute.get("/categories", categoryCtrl.getAllCategory);

categoryRoute.get("/categories/:slug", categoryCtrl.getCategoryBySlug);

productRoute.get(
  "/categories/:slug/products",
  productCtrl.getAllProductByCategoryId
);



module.exports = categoryRoute;
