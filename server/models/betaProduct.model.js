import mongoose from "mongoose";

const betaProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      }
    ],
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const BetaProductModel = mongoose.model("BetaProduct", betaProductSchema);

export default BetaProductModel;
