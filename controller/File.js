const Brand = require("../model/Brand");

const Product = require("../model/Product");

const cloudinary = require("cloudinary").v2; // Import the Brand model

const getImageDetailsHandlerForBrand = async (req, res) => {
  console.log("IUHDSKFHKJHDFJKLHSK sdfknkjsdnfkjn");

  console.log("I am here kjnkjnjkn");

  try {
    console.log("I am inside the image details handler for brand");

    // const {filename1, nodejsProductImages} = req.params;

    // console.log(nodejsProductImages);

    console.log("IUGHiuhbhju");

    const { filename, nodejsBrandImage } = req.params; // Extract parameters from the request

    console.log(filename, nodejsBrandImage);

    console.log("Fetching image for:", filename, nodejsBrandImage);

    // Combine folder name and filename to form the public ID
    const publicIDBrand = `${nodejsBrandImage}/${filename}`;

    // console.log("sdiofjiosdjnfkjnkjsdfnjkv");

    // const publicIdProduct = `${nodejsProductImages}/${filename1}`

    // console.log("Fetching details for publicId:", publicID);

    // console.log(publicID)

    // Fetch image details from Cloudinary  `
    const result = await cloudinary.api.resource(publicIDBrand);
    // const result1 = await cloudinary.api.resource(publicIdProduct);

    // console.log(result1);

    // Check if the result contains a secure URL or if the image exists

    if (!result || !result.secure_url) {
      return res.status(404).json({ message: "Image not found in Cloudinary" });
    }

    // Redirect the client to the image URL
    res.redirect(result.secure_url);
  } catch (error) {
    console.error("Error fetching image details:", error.message);

    // Send an error response to the client
    res.status(500).json({
      message: "Failed to fetch image details",
      error: error.message,
    });
  }
};

const getImageDetailsHandlerForProduct = async (req, res) => {
  try {
    const { filename } = req.params;




    // console.log(req.path);

    // const twoArray = req.path.split("/");

    // console.log(twoArray[1]);

    // console.log(nodejsProductImages);

    // Combine folder name and filename to form the public ID
    const publicID = `nodejsProductImages/${filename}`;

    // Fetch image details from Cloudinary  `
    // const result = await cloudinary.api.resource(publicID);


    
    const result =  cloudinary.url(publicID, {
      quality: "auto",
      fetch_format: "auto",
    });

  


    // console.log("succesfull get the image");


    // console.log(result);

    // console.log(result);

    res.redirect(result)
    

    

    // Redirect the client to the image URL
    // res.redirect(result.secure_url);


  } catch (error) {
    console.log(error);
  }
};

const deleteOnlyImageHandlerForBrand = async (req, res) => {
  console.log("I am inside here deleye image for brand");
  const { id } = req.params;

  const { filename } = req.params;

  const { whichfolderinside } = req.params; // Get the folder name from request parameters

  const publicIdFull = whichfolderinside + "/" + filename;

  console.log(publicIdFull);

  try {
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicIdFull);

    // Update the Brand document to remove the logo
    await Brand.findByIdAndUpdate(
      id,
      { logo: null }, // Set the logo field to null
      { new: true }
    );

    res.status(200).json({
      message: "Image deleted successfully and brand updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

const deleteImageHandlerForProduct = async (req, res) => {
  console.log("I am inside the delete image handler for product");
  const { id } = req.params;

  console.log(id);

  const { filename } = req.params;

  console.log(filename);


  
  const publicIdFull = `nodejsproductImages/${filename}`;

  // console.log(publicIdFull);
  

  // console.log(publicIdFull);

  try {
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicIdFull);

    const product = await Product.findById(id);


    console.log(product);
    

    // console.log(product);

    const Images = product?.images;

    console.log(Images);
    

    //filter on the basis of public_id match or not
    const filteredArrayImage = Images.filter(
      (image) => image.public_id !== publicIdFull
    );


    console.log(filteredArrayImage);
    

   
      // Update the Product document to remove the
    const updatedProduct =   await Product.findByIdAndUpdate(
        id,
        { images: filteredArrayImage }, // set the images with filteredArrayImage
        { new: true }
      );

    console.log(updatedProduct);
      


    res.status(200).json({
      message: "Image deleted successfully and Product updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

module.exports = {
  getImageDetailsHandlerForBrand,
  getImageDetailsHandlerForProduct,
  deleteOnlyImageHandlerForBrand,
  deleteImageHandlerForProduct,
};
