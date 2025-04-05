// const mongoose = require('mongoose');
import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import paypal from "@paypal/checkout-server-sdk";
import UserModel from './../models/user.model.js';


export const createOrderController = async (request, response) => {
    // Check if delivery address is provided
    if (!request.body.delivery_address) {
        return response.status(400).json({
            message: "Delivery address is required",
            error: true,
            success: false,
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Validate stock before creating the order
        for (let i = 0; i < request.body.products.length; i++) {
            const product = await ProductModel.findById(request.body.products[i].productId);
            if (!product) {
                return response.status(400).json({
                    message: `Product not found: ${request.body.products[i].productId}`,
                    error: true,
                    success: false,
                });
            }
            // Check if stock is sufficient for each product
            if (product.countInStock < request.body.products[i].quantity) {
                return response.status(400).json({
                    message: `Insufficient stock for product: ${product.name}`,
                    error: true,
                    success: false,
                });
            }
        }

        // Create new order
        let order = new OrderModel({
            userId: request.body.userId,
            products: request.body.products,
            paymentId: request.body.paymentId,
            payment_status: request.body.payment_status,
            delivery_address: request.body.delivery_address,
            order_status: request.body.order_status,
            totalAmt: request.body.totalAmt,
        });

        // Check if order object is created properly
        if (!order) {
            return response.status(400).json({
                message: "Invalid order details",
                error: true,
                success: false,
            });
        }

        // Update stock for each product within a transaction
        for (let i = 0; i < request.body.products.length; i++) {
            const product = await ProductModel.findById(request.body.products[i].productId);

            // Ensure stock does not go negative
            const newStock = product.countInStock - request.body.products[i].quantity;
            if (newStock < 0) {
                return response.status(400).json({
                    message: `Not enough stock for product: ${product.name}`,
                    error: true,
                    success: false,
                });
            }

            // Decrement stock if sufficient quantity is available
            await ProductModel.findByIdAndUpdate(
                request.body.products[i].productId,
                {
                    $inc: {
                        countInStock: -request.body.products[i].quantity,
                        sale: request.body.products[i].quantity,
                    }
                },
                { new: true, session } // Include session for transaction
            );
        }

        // Save the order to the database within a transaction
        const savedOrder = await order.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return response.status(201).json({
            message: "Order placed!",
            error: false,
            success: true,
            order: savedOrder,
        });

    } catch (error) {
        // If error, abort transaction
        await session.abortTransaction();
        session.endSession();

        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
};



export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId);

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10; // Default to 10 orders per page

        let orderFilter = {};
        if (user.role !== "ADMIN") {
            // If user is not admin, only fetch their own orders
            orderFilter.userId = userId;
        }

        const totalOrders = await OrderModel.countDocuments(orderFilter);
        const totalPages = Math.ceil(totalOrders / perPage);

        if (page > totalPages && totalOrders > 0) {
            return response.status(200).json({
                message: "No more orders",
                error: false,
                success: true,
                data: [],
                totalOrders: totalOrders,
                totalPages: totalPages,
                page: page,
                perPage: perPage,
                totalAddresses: 0,
            });
        }

        const orderList = await OrderModel.find(orderFilter)
            .sort({ createdAt: -1 })
            .populate("delivery_address userId")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        const totalAddresses = (await OrderModel.distinct("delivery_address", orderFilter)).length;

        return response.status(200).json({
            message: "Order details fetched successfully",
            error: false,
            success: true,
            data: orderList,
            totalOrders: totalOrders,
            totalPages: totalPages,
            page: page,
            perPage: perPage,
            totalAddresses: totalAddresses,
        });
    } catch (error) {
        console.error("Error in getOrderDetailsController:", error.message || error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}




function getPaypalClient() {
    const environment = process.env.PAYPAL_MODE === 'live'
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID_LIVE,
            process.env.PAYPAL_SECRET_LIVE
        )
        :
        new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID_TEST,
            process.env.PAYPAL_SECRET_TEST
        );
    return new paypal.core.PayPalHttpClient(environment);
}


export const createOrderPaypalController = async (request, response) => {
    try {

        const req = new paypal.orders.OrdersCreateRequest();
        req.prefer('return=representation');

        req.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: request.query.totalAmount,
                }
            }]
        });

        try {
            const client = getPaypalClient();
            const order = await client.execute(req);
            response.json({ id: order.result.id });
        } catch {
            response.status(400).json({
                message: 'Error creating PayPal order',
                error: true,
                success: false,
            })
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}


export const captureOrderPaypalController = async (request, response) => {
    const session = await mongoose.startSession();
    session.startTransaction();  // Start transaction

    try {
        // Check if delivery address is provided
        if (!request.body.delivery_address) {
            return response.status(400).json({
                message: "Delivery address is required",
                error: true,
                success: false,
            });
        }

        const { paymentId } = request.body;
        const req = new paypal.orders.OrdersCaptureRequest(paymentId);
        req.requestBody({});

        // Capture Payment (Simulated)
        const captureResponse = await paypalClient.execute(req);
        if (!captureResponse || captureResponse.statusCode !== 201) {
            throw new Error("PayPal Payment Capture Failed");
        }

        // Create Order
        const orderInfo = {
            userId: request.body.userId,
            products: request.body.products,
            paymentId: request.body.paymentId,
            payment_status: request.body.payment_status,
            delivery_address: request.body.delivery_address,
            order_status: request.body.order_status,
            totalAmt: request.body.totalAmount,
            data: request.body.data,
        };

        const order = new OrderModel(orderInfo);
        await order.save({ session });

        // Update stock for each product
        for (let i = 0; i < request.body.products.length; i++) {
            const productUpdate = await ProductModel.findByIdAndUpdate(
                request.body.products[i].productId,
                {
                    $inc: {
                        countInStock: -request.body.products[i].quantity,
                        sale: request.body.products[i].quantity,
                    }
                },
                { new: true, session }
            );

            if (!productUpdate) {
                throw new Error(`Stock update failed for product ${request.body.products[i].productId}`);
            }
        }

        // Commit transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        response.json({
            message: "Order Placed",
            error: false,
            success: true,
            order: order,
        });

    } catch (error) {
        await session.abortTransaction(); // Rollback changes
        session.endSession();

        console.error("Order Processing Error:", error);

        // Delete the created order if it exists
        if (request.body.paymentId) {
            await OrderModel.findOneAndDelete({ paymentId: request.body.paymentId });
        }

        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
};



export const orderStatusController = async (request, response) => {
    try {
        const { id, order_status } = request.body;

        const updateOrder = await OrderModel.updateOne(
            {
                _id: id,
            },
            {
                order_status: order_status,
            },
            {
                new: true,
            }
        )

        response.json({
            message: 'Order Status Updated',
            error: false,
            success: true,
            data: updateOrder
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}

export const totalSalesController = async (request, response) => {
    try {
        const currentYear = new Date().getFullYear();

        const orderList = await OrderModel.find();

        let totalSales = 0;
        let monthlySales = [
            { name: 'JAN', TotalSales: 0 },
            { name: 'FEB', TotalSales: 0 },
            { name: 'MAR', TotalSales: 0 },
            { name: 'APR', TotalSales: 0 },
            { name: 'MAY', TotalSales: 0 },
            { name: 'JUN', TotalSales: 0 },
            { name: 'JUL', TotalSales: 0 },
            { name: 'AUG', TotalSales: 0 },
            { name: 'SEPT', TotalSales: 0 },
            { name: 'OCT', TotalSales: 0 },
            { name: 'NOV', TotalSales: 0 },
            { name: 'DEC', TotalSales: 0 }
        ];

        for (let i = 0; i < orderList.length; i++) {
            totalSales += parseInt(orderList[i].totalAmt);

            const createdAt = new Date(orderList[i].createdAt);
            const year = createdAt.getFullYear();
            const month = createdAt.getMonth(); // 0 (Jan) to 11 (Dec)

            if (currentYear === year) {
                monthlySales[month].TotalSales += parseInt(orderList[i].totalAmt);
            }
        }

        return response.status(200).json({
            totalSales: totalSales,
            monthlySales: monthlySales,
            success: true,
            error: false,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        })
    }
}



export const totalUsersController = async (request, response) => {
    try {
        const currentYear = new Date().getFullYear();

        const users = await UserModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            }
        ]);

        let monthlyUsers = [
            { name: 'JAN', TotalUsers: 0 },
            { name: 'FEB', TotalUsers: 0 },
            { name: 'MAR', TotalUsers: 0 },
            { name: 'APR', TotalUsers: 0 },
            { name: 'MAY', TotalUsers: 0 },
            { name: 'JUN', TotalUsers: 0 },
            { name: 'JUL', TotalUsers: 0 },
            { name: 'AUG', TotalUsers: 0 },
            { name: 'SEPT', TotalUsers: 0 },
            { name: 'OCT', TotalUsers: 0 },
            { name: 'NOV', TotalUsers: 0 },
            { name: 'DEC', TotalUsers: 0 }
        ];

        let totalUsers = 0;

        for (let i = 0; i < users.length; i++) {
            const { year, month } = users[i]._id;

            if (year === currentYear) {
                monthlyUsers[month - 1].TotalUsers = users[i].count;
                totalUsers += users[i].count;
            }
        }

        return response.status(200).json({
            TotalUsers: totalUsers,
            monthlyUsers: monthlyUsers,
            success: true,
            error: false,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
          });
          
    }
};


