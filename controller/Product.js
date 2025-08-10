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
const PriceHistory = require("../model/PriceHistory.js"); // Import the PriceHistory model

const productCtrl = {
  createProduct: asyncHandler(async (req, res) => {
    console.log("Request body:", req.body); // Log the entire request body

    const {
      name,
      description,
      categoryId,
      initialPrice,
      colors,
      sizes,
      brandId,
      summary,
      discountedPrice,
    } = req.body;

    if (!name || !description || !categoryId || !initialPrice) {
      return res
        .status(400)
        .json({ message: "Some fields are missing in the request body" });
    }

    // console.log(discountPercentage);

    const category = await Category.findById(categoryId);

    console.log(category);

    const brand = await Brand.findById(brandId);

    console.log(brand);

    // Parse JSON strings for colors and sizes
    const parsedColors =
      typeof colors === "string" ? JSON.parse(colors) : colors;
    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    // console.log(typeof parsedColors, typeof parsedSizes);

    console.log(typeof parsedColors);

    const slug = name.split(" ").join("-");

    console.log(slug);

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
      initialPrice,
      discountedPrice,
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

    res.status(201).json({ message: "Product created successfully", product });
  }),

  deleteproduct: asyncHandler(async (req, res) => {
    const { id } = req.params;

    console.log("ID from req.params:", id);

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find product by ID
    const productFound = await Product.findById(id);

    if (!productFound) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product found:", productFound);

    // Delete images from Cloudinary
    productFound.images?.map(async (image) => {
      await cloudinary.uploader.destroy(image?.public_id);
    });

    // Delete product from database
    await Product.findByIdAndDelete(id, {deleted:true});



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
    console.log("I am lower endpoint");
    const products = await Product.find();

    res.status(201).json({ products });

    //
  }),

  getCertainproduct: asyncHandler(async (req, res) => {
    console.log("Hello I am inside get product By Id");

    const { id } = req.params;

    const product = await Product.findById(id).populate({
      path: "reviews.DoneBy",
      select: "username email",
    });

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
    console.log("I am inside the get all product by category Id");

    // const { id } = req.params;



    const {slug} = req.params;

    const products = await Product.find({ categorySlug:slug });

    console.log(products);

    res.json({ products });
  }),

  getAllProductByBrandId: asyncHandler(async (req, res) => {

    console.log("I am inside the get all product by brand Id");
    
    // const { id } = req.params;

    // console.log(id);

    const { slug } = req.params;

    console.log(slug);

    const products = await Product.find({  brandName:slug });

    console.log(products);

    res.json({ products });
  }),

  getAllProductsBySubCategoryId: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const products = await Product.find({ subCategory: id });

    console.log(products);

    res.json({ products });
  }),

  //! Update the product
  updateCertainproduct: asyncHandler(async (req, res) => {
    console.log("I am inside the edit certain product controoler");

    console.log(req.files);
    

    const { id } = req.params;

    // console.log(id);

    console.log(req.files);

    const images = await Promise.all(
      req.files?.map(async (file) => {
        return {
          url: file.path,
          public_id: file.filename,
        };
      })
    );

  
  // console.log(images);
  

    const {
      name,
      description,
      summary,
      categoryId,
      brandId,
      initialPrice,
      discountedPrice,
    } = req.body;

    console.log(name, description, summary, categoryId, brandId);

    const category = await Category.findById(categoryId);

    const brand = await Brand.findById(brandId);

    const product = await Product.findById(id);

    console.log(product);

    if (!product) {
      throw new Error("Product Not Found");
    }

    // console.log(product);

    // if(product.name === name && product.description === description  && product.summary === summary && product.category_id === categoryId && product.brand_id === brandId ){
    //   throw new Error("Same Name");
    // }

    const updateProduct = await Product.findByIdAndUpdate(id, {
      name,
      summary,
      description,
      categoryId,
      brandId,
      images,
      initialPrice,
      discountedPrice,
      categoryName: category?.name,
      brandName: brand?.name,
    });

    console.log(updateProduct);

    res.json({ message: "Updated succesfully", updateProduct });
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

  // getAllProductsByCategoryName: asyncHandler(async (req, res) => {
  //   const { categoryName } = req.params; // Get the categoryName from the request parameters

  //   // Find the category by name
  //   const category = await Category.findOne({ categoryName });

  //   if (!category) {
  //     return res.status(404).json({ message: "Category not found" });
  //   }

  //   // Use the category's _id to fetch products
  //   const products = await Product.find({ category_id: category._id }).populate("category_id");

  //   if (!products || products.length === 0) {
  //     return res.status(404).json({ message: "No products found for this category" });
  //   }

  //   res.status(200).json({ products });
  // }),

  createCertainProductReviews: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).select(
      "-description -images -colors -sizes"
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
    const { id } = req.params;

    const productReviews = await Product.findById(id).populate(
      "reviews.DoneBy"
    );

    res.json({ productReviews });
  }),

  updateProductPrice: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newPrice } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Save the old price in the Product model
    const oldPrice = product.finalPrice;
    product.oldPrice = oldPrice;
    product.finalPrice = newPrice;

    await product.save();

    // Alternatively, save the old price in the PriceHistory model
    await PriceHistory.create({
      product_id: id,
      oldPrice,
    });

    res.json({ message: "Product price updated successfully", product });
  }),

  // getAllProductsReviews: asyncHandler(async(req, res) =>{

  //     const products = await Product.find();

  //     console.log(products);

  // })
};

module.exports = productCtrl;
