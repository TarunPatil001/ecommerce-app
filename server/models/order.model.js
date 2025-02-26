import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product"
                },
                productTitle: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                price: {
                    type: Number
                },
                image: {
                    type: String
                },
                subTotal: {
                    type: Number,
                    default: 0
                }
            }
        ],
        paymentId: {
            type: String,
            default: ""
        },
        payment_status: {
            type: String,
            default: "pending"
        },
        delivery_address: {
            type: mongoose.Schema.ObjectId,
            ref: "address"
        },
        order_status: {
            type: String,
            default: "pending"
        },
        totalAmt: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
