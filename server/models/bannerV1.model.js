import mongoose from "mongoose";

const bannerV1Schema = mongoose.Schema(
    {
        bannerTitle: {
            type: String,
            default: '',
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
        parentCategoryId: {
            type: String,
            default: '',
            required: true,
        },
        subCategoryId: {
            type: String,
            default: '',
            required: true,
        },
        thirdSubCategoryId: {
            type: String,
            default: '',
            required: true,
        },
        
        // parentCategoryId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Category",
        //     required: true,
        // },
        // subCategoryId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Category",
        //     required: true,
        // },
        // thirdSubCategoryId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Category",
        //     required: true,
        // },
        
        price: {
            type: Number,
            default: '',
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const BannerV1Model = mongoose.model("bannerV1", bannerV1Schema);

export default BannerV1Model;

