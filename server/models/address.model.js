import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    address_line1:{
        type:String,
        default: ""
    },
    city:{
        type:String,
        default: ""
    },
    state:{
        type:String,
        default: ""
    },
    pincode:{
        type:String
    },
    country:{
        type:String
    },
    mobile:{
        type:Number,
        default: null
    },
    status:{
        type:Boolean,
        default: true
    },
    selected:{
        type:Boolean,
        default: true
    },
    // userId:{
    //     type:String,
    //     default: ""
    // }
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User", // Reference the UserModel
        required: true,
    }
    
},{
    timestamps:true
})

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;