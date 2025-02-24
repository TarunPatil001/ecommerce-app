import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    name: {                 //----------------------
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        default: null,
        required: true,
    },
    address_line1: {
        type: String,
        required: true,
    },
    landmark: {         //----------------------
        type: String,
        default: "",
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: "",
        required: true,
    },
    addressType: {              //----------------------
        type: String,
        enum: ["Home", "Office"],
      },
    status: {
        type: Boolean,
        default: true
    },
    selected: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User", // Reference the UserModel
        required: true,
    }

}, {
    timestamps: true
})

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;