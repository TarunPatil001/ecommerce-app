import mongoose from "mongoose";

const betaProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    images: {
      type: [String], // Ensures an array of strings
      required: true,
      validate: [(val) => val.length > 0, "At least one image is required"],
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const BetaProductModel = mongoose.model("BetaProduct", betaProductSchema);

export default BetaProductModel;
