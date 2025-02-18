import mongoose from "mongoose";

const cartProductSchema = mongoose.Schema({
    productTitle: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    sellerDetails: {
        sellerId: {
            type: String,
            required: true,
        },
        sellerName: {
            type: String,
            required: true,
        }
    },
    rating: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
    },
    availableOptions: {
        size: [{ type: String, }], // Available sizes
        productWeight: [{ type: String, }], // Available weights
        productRam: [{ type: String, }], // Available RAMs
    },
    selectedOptions: {
        size: { type: String },
        productWeight: { type: String },
        productRam: { type: String },
    },
    price: {
        type: Number,
        required: true,
    },
    oldPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1
    },
    discount: {
        type: Number,
        default: 0,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    subTotalOldPrice: {
        type: Number,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const CartProductModel = mongoose.model("cart", cartProductSchema);

export default CartProductModel;