const { cloudinary } = require("../config/clodinaryConfig");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
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
const upload = (folder) => {
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
