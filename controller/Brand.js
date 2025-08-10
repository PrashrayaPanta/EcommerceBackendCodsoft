const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");
const Brand = require("../model/Brand");

const cloudinary = require("cloudinary").v2;

const brandCtrl = {
  createBrand: asyncHandler(async (req, res) => {
    console.log("Inside createBrand controller");

    console.log(req.file);

    console.log(req.body);

    const { name, slogan } = req.body;

    const slug = name.toLowerCase();

    //  //!empty value validation
    if (!name || !slogan || !req.file) {
      throw new Error("All fields are required");
    }

    const brandDocument = await Brand.findOne({ name });

    if (brandDocument) {
      throw new Error("Brand with this name  already exists");
    }

    // Create the brand

    const brand = await Brand.create({
      name,
      slogan,
      logo: {
        url: req.file.path,
        public_id: req.file.filename,
      },
      slug,
    });

    res.status(201).json({ message: "Brand created successfully", brand });
  }),

  deleteCertainBrand: asyncHandler(async (req, res) => {
    console.log("Taile yo run gararako ho");

    const { id } = req.params;

    // Find the brand by ID
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Check if the brand has a logo and delete it from Cloudinary
    if (brand.logo && brand.logo.public_id) {
      try {
        // await deleteImageByPublicId(brand.logo.public_id);

        await cloudinary.uploader.destroy(brand.logo.public_id);

        console.log("Image deleted successfully from Cloudinary.");
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error.message);
        return res.status(500).json({
          message: "Failed to delete image from Cloudinary",
          error: error.message,
        });
      }
    }

    // Delete the brand from the database
    await Brand.findByIdAndDelete(id);

    res.json({
      message: "Brand and associated image deleted successfully",
    });
  }),

  getAllBrand: asyncHandler(async (req, res) => {
    console.log("Hello I am get Al Brand functionality");

    console.log("Hello K xa I am inside get all brand");

    const brands = await Brand.find();

    res.json({ brands });
  }),

  EditCertainBrand: asyncHandler(async (req, res) => {
    console.log("I am inside the edit certain brand");

    const { id } = req.params;

    const { name, slogan } = req.body;

    console.log(name, slogan);

    const BrandDocument = await Brand.findById(id);

    if (!BrandDocument) {
      throw new Error("Brand not found in");
    }

    // Delete the old image from Cloudinary
    // if (BrandDocument.logo && BrandDocument.logo.public_id)
    // {
    //   await cloudinary.uploader.destroy(BrandDocument?.logo?.public_id);

    // }

    if (!req.file) {
      throw new Error("The image field value shouldnot be empty");
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        name,
        slogan,
        logo: {
          url: req.file.path,
          public_id: req.file.filename,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Brand updated successfully",
      updatedBrand,
    });
  }),

  GetCertainBrand: asyncHandler(async (req, res) => {
    console.log("I ma inside Brand By Id");
    console.log("Hello I am inside get certain Brand");

    const { slug } = req.params;

    // console.log(slug);

    console.log(slug);
    

    // console.log(typeof id);

    // const brand = await Brand.findById(slug);

    const brand = await Brand.find({slug});

    console.log(brand);

    if (!brand) {
      return res.status(400).json({ message: "Brand not found" });
    }

    res.json({
      message: "Brand fetched successfully",
      brand,
    });
  }),
};

module.exports = brandCtrl;
