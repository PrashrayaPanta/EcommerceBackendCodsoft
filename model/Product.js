const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    initialPrice: {
      type: String,
      required: true,
    },

    discountedPrice: {
      type: String,
    },

    oldPrice: {
      type: Number, // Store the previous price of the product
      default: null,
    },

    images: [
      {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],

    colors: [
      {
        name: {
          type: String,
          required: true,
        },

        hexCode: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    sizes: [
      {
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],

    stock: {
      type: Number,
      default: 0,
      required: true,
    },

    slug: {
      type: String,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to Category model
      required: true,
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
    },

    brandName: {
      type: String,
      required: true,
    },

    categorySlug:{

        type: String,
        required: true,
    },

    brandSlug:{

      type: String,
      required:true
    },

    reviews: [
      {
        comment: {
          type: String,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },

        DoneBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User model
        },

        date: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
