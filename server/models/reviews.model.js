import mongoose from "mongoose";

const reviewsSchema = mongoose.Schema({
    image:{
        type:String,
        default: ""
    },
    userName:{
        type:String,
        default: ""
    },
    review:{
        type:String,
        default: ""
    },
    rating:{
        type:Number,
        default:1,
    },
    userId:{
        type:String,
        default: "",
    },
    productId:{
        type:String,
        default: "",
    },
},{
    timestamps:true
})

const ReviewModel = mongoose.model("reviews", reviewsSchema);

export default ReviewModel;