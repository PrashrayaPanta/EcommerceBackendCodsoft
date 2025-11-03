const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");

const Product = require("../model/Product.js");

const User = require("../model/User.js");

const cloudinary = require("cloudinary").v2; // Import the Brand model

const Category = require("../model/Category.js");

const subCategory = require("../model/SubCategory.js");

const Brand = require("../model/Brand.js");
const { deleteOnlyImageHandler } = require("./File.js");
const Review = require("../model/Review.js");

const productCtrl = {
  createProduct: asyncHandler(async (req, res) => {
    console.log("Request body:", req.body); // Log the entire request body

    const {
      name,
      description,
      categoryId,
      originalPrice,
      price,
      colors,
      sizes,
      brandId,
      summary,
    } = req.body;

    console.log(req.body);

    if (!name || !description || !categoryId || !originalPrice) {
      return res
        .status(400)
        .json({ message: "Some fields are missing in the request body" });
    }

    // console.log("I am after the empty validation");

    const productFromProduct = await Product.findOne({ name });

    if (productFromProduct) {
      return res.status(400).json({
        message: "Product with this name already exists",
        status: "false",
        data: null,
      });
    }

    console.log(sizes);

    // console.log(colors);

    // console.log(discountPercentage);

    const category = await Category.findById(categoryId);

    console.log(category);

    const brand = await Brand.findById(brandId);

    console.log(brand);

    console.log(colors);

    console.log(sizes);

    // console.log(json.parse(colors));

    // console.log(JSON.parse(colors));

    // Parse JSON strings for colors and sizes
    const parsedColors =
      typeof colors === "string" ? JSON.parse(colors) : colors;
    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    // console.log(typeof parsedColors, typeof parsedSizes);

    console.log(typeof parsedColors);

    const slug = name.toLowerCase().split(" ").join("-");

    console.log(slug);

    const slugFromProduct = await Product.findOne({ slug });

    if (slugFromProduct) {
      return res.status(400).json({
        message: "Slug should be unique",
        status: "false",
        data: null,
      });
    }

    // const categoryDocument = await Category.findOne({_id: categoryId});

    // console.log(categoryDocument)

    const images = await Promise.all(
      req.files.map(async (file) => {
        return {
          url: file.path,
          public_id: file.filename,
        };
      })
    );

    // Create the product
    const product = await Product.create({
      images,
      name,
      summary,
      description,
      originalPrice,
      price,
      slug,
      colors: parsedColors,
      sizes: parsedSizes,
      categoryId,
      brandId,
      categoryName: category?.name,
      brandName: brand?.name,
      categorySlug: category?.slug,
      brandSlug: brand?.slug,
    });

    // console.log(product);

    res.status(201).json({
      message: "Product created successfully",
      status: "true",
      data: product,
    });
  }),

  deleteproduct: asyncHandler(async (req, res) => {
    const { slug } = req.params;

    // Find product by ID
    const productFound = await Product.findOne({ slug });

    if (!productFound) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product found:", productFound);

    // Delete images from Cloudinary
    productFound.images?.map(async (image) => {
      await cloudinary.uploader.destroy(image?.public_id);
    });

    // Delete product from database
    await Product.findOneAndDelete({ slug });

    console.log("Successfully deleted");

    res.json({
      status: "Success",
      message: "Product deleted successfully",
    });
  }),

  deleteCertainProductReview: asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.params;

    console.log("Product ID:", productId, "Review ID:", reviewId);

    // Validate the product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Filter out the review with the matching reviewId
    const updatedReviews = product.reviews.filter(
      (review) => review._id != reviewId
    );

    console.log(updatedReviews);

    // Update the product's reviews array
    product.reviews = updatedReviews;

    // Save the updated product
    await product.save();

    res.json({
      message: "Review deleted successfully",
      product,
    });
  }),

  getAllproduct: asyncHandler(async (req, res) => {
    const products = await Product.find();

    res
      .status(201)
      .json({ status: "success", success: "true", data: products });

    //
  }),

  getCertainproduct: asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    console.log(product);

    if (!product) {
      return res.status(404).json({
        status: "Failed",
        message: "product not found",
      });
    }

    res.json({
      status: "Success",
      product,
    });
  }),

  getAllProductByCategoryId: asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const products = await Product.find({ categorySlug: slug });

    console.log(products);

    res.json({ products, status: "success" });
  }),

  getAllProductByBrandId: asyncHandler(async (req, res) => {
    console.log("I am inside the get all product by brand Id");

    // const { id } = req.params;

    // console.log(id);

    const { slug } = req.params;

    console.log(slug);

    const products = await Product.find({ brandSlug: slug });

    // console.log(products);

    res.json({ products, status: "true" });
  }),

  getAllProductsBySubCategoryId: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const products = await Product.find({ subCategory: id });

    console.log(products);

    res.json({ products });
  }),

  //! Update the product
  updateCertainproduct: asyncHandler(async (req, res) => {
    console.log("I am inside the edit certain product controller");
    console.log("req.file:", req.file);

    const { slug } = req.params;

    const {
      name,
      description,
      summary,
      categoryId,
      brandId,
      originalPrice,
      price,
    } = req.body;

    console.log(name, description, summary, categoryId, brandId);

    const category = await Category.findById(categoryId);
    const brand = await Brand.findById(brandId);
    const product = await Product.findOne({ slug });

    console.log(product);

    if (!product) {
      throw new Error("Product Not Found");
    }

    // Prepare update object with basic fields
    const updateData = {
      name,
      summary,
      description,
      categoryId,
      brandId,
      originalPrice,
      price,
      categoryName: category?.name,
      brandName: brand?.name,
      categorySlug: category?.slug,
      brandSlug: brand?.slug,
    };

    // Handle images: only update if new files are uploaded
    if (req.files && req.files.length > 0) {
      console.log("New files uploaded:", req.files.length);
      const newImages = await Promise.all(
        req.files.map(async (file) => {
          return {
            url: file.path,
            public_id: file.filename,
          };
        })
      );
      // Merge new images with existing images
      const existingImages = product.images || [];
      updateData.images = [...existingImages, ...newImages];
      console.log("Total images after merge:", updateData.images.length);
    } else {
      console.log("No new files, keeping existing images");
      // Keep existing images if no new images are uploaded
      updateData.images = product.images;
    }

    const updateProduct = await Product.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });

    console.log(updateProduct);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updateProduct,
    });
  }),

  getCertainproductCategory: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
      .select("-initialPrice -finalPrice -description")
      .populate("category_id");

    if (!product) {
      return res.status(404).json({
        status: "Failed",
        message: "product not found",
      });
    }

    res.json({
      status: "Success",
      product,
    });
  }),

  Latestproducts: asyncHandler(async (req, res) => {
    console.log("I am inside latest products");

    console.log("I am inside the latest products");
    const products = await Product.find()
      .limit(2)
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(201).json({
      status: "success",
      products,
    });
  }),

  //! Search product

  searchProduct: asyncHandler(async (req, res) => {
    const { query } = req;

    console.log(query);

    //! Populating the username and email only
    const products = await Product.find(query);

    console.log(products);

    res.status(200).json({
      status: "Success",
      message: "Search results",
      count: products.length,
      products,
    });
  }),

  lowtoHighPriceProduct: asyncHandler(async (req, res) => {
    console.log("Hellooop I am inside low to hight proce product");

    const products = await Product.find().sort({ finalPrice: 1 });

    res.json({ products });
  }),

  getAllProductsByCategory: asyncHandler(async (req, res) => {
    const { categoryId } = req.params; // Get the category ID from the request parameters

    // Validate the category ID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Fetch all products
    const allProducts = await Product.find().populate("category_id");

    // Filter products belonging to the specified category
    const filteredProducts = allProducts.filter(
      (product) =>
        product.category_id && product.category_id._id.toString() === categoryId
    );

    if (filteredProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json({ products: filteredProducts });
  }),

  createCertainProductReviews: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).select(
      "-description -images -colors -sizes -categoryName -brandSlug -categorySlug -brandName -stock"
    );
    // console.log(product);
    if (!product) {
      throw new Error("The product id provided trhere is not ");
    }

    //create the reviews
    const { comment, rating } = req.body;

    // console.log(comment, rating);

    product?.reviews.push({ comment, rating, DoneBy: req.user_id });
    await product?.save();
    res.json({ message: "review Created Succesfully", product });
  }),

  getCertainProductReviews: asyncHandler(async (req, res) => {
    console.log("Helo");

    const { slug } = req.params;

    const productReviews = await Product.findOne({ slug }).populate(
      "reviews.DoneBy"
    );

    res.json({ productReviews, status: "success" });
  }),
};

module.exports = productCtrl;
