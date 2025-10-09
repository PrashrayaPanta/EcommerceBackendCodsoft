const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");
const Category = require("../model/Category.js");

const Post = require("../model/Product.js");

const categoryCtrl = {
  createCategory: asyncHandler(async (req, res) => {
    console.log("I am inside the create catgeory cointrooler");

    const { name } = req.body;

    console.log(name);

    //track the uniqueness of name
    const categoryname = await Category.findOne({ name });

    if (categoryname) {
      return res.status(400).json({
        message: "Category should be unique",
        succcess: false,
        data: null,
      });
    }

    const slug = name?.toLowerCase().split(" ").join("-");

    console.log(slug);

    const slugName = await Category.findOne({ slug });

    if (slugName) {
      return res
        .status(400)
        .json({ message: "Slug should be unique", success: false, data: null });
    }
    // console.log(slug);

    const categoryCreated = await Category.create({ name, slug });

    res.status(201).json({
      message: "Created Successfully",
      success: true,
      data: categoryCreated,
    });
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    //get the id
    const { slug } = req.params;

    console.log(slug);

    await Category.findOneAndDelete({ slug });

    res.json({
      message: "Deleted Certain Catgeory",
      status: "true",
      data: null,
      status: "success",
    });
  }),

  getAllCategory: asyncHandler(async (req, res) => {
    console.log("I am inside get all category");
    const Categories = await Category.find();

    res
      .json({
        message: "Categories get ",
        status: "success",
        data: Categories,
      })
      .status(203);
  }),

  getCategoryBySlug: asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "failed", data: null });
    }

    res.status(201).json({
      message: "Certain Category Fetched Successfully",
      status: "true",
      data: category,
    });
  }),

  EditCertainCategory: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { name } = req.body;

    const slugtoupdate = name.toLowerCase();

    const categoryDocument = await Category.findOne({ slug });

    if (!categoryDocument) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (categoryDocument.name === name) {
      return res.json({
        message: "Category name is unchanged, please modify it",
      });
    }

    const afterUpdation = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugtoupdate },
      { new: true }
    );

    res.status(202).json({
      message: "Updated successfully",
      categoryDocumentAfterUpdation: afterUpdation,
    });
  }),

  getCertainCategoryProducts: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate the `id`
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id).populate({
      path: "posts",
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    console.log(category);

    res
      .status(201)
      .json({ message: "Certain Category Fetched Successfully", category });
  }),
};

module.exports = categoryCtrl;
