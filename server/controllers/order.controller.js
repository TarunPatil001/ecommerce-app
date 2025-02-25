import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import paypal from "@paypal/checkout-server-sdk";


export const createOrderController = async (request, response) => {
    try {
        // Create new order
        let order = new OrderModel({
            userId: request.body.userId,
            products: request.body.products,
            paymentId: request.body.paymentId,
            payment_status: request.body.payment_status,
            delivery_address: request.body.delivery_address,
            totalAmt: request.body.totalAmt,
        });

        // Check if order object is created properly
        if (!order) {
            return response.status(400).json({
                message: "Invalid order details",
                error: true,
                success: false
            });
        }

        // Update stock for each product
        for (let i = 0; i < request.body.products.length; i++) {
            await ProductModel.findByIdAndUpdate(
                request.body.products[i].productId,
                {
                    $inc: { countInStock: -request.body.products[i].quantity } // Efficient stock decrement
                },
                { new: true }
            );
        }

        // Save the order to the database
        const savedOrder = await order.save();

        return response.status(201).json({
            message: "Order placed!",
            error: false,
            success: true,
            order: savedOrder,
        });

    } catch (error) {
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

        const orderList = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address userId');

        return response.status(200).json({
            message: "Order details fetched successfully",
            error: false,
            success: true,
            data: orderList,
        });

    } catch (error) {
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
    try {

        const { paymentId } = request.body;
        const req = new paypal.orders.OrdersCaptureRequest(paymentId);
        req.requestBody({});

        const orderInfo = {
            userId: request.body.userId,
            products: request.body.products,
            paymentId: request.body.paymentId,
            payment_status: request.body.payment_status,
            delivery_address: request.body.delivery_address,
            totalAmt: request.body.totalAmount,
            data: request.body.data,
        }

        const order = new OrderModel(orderInfo);
        await order.save();

        // Update stock for each product
        for (let i = 0; i < request.body.products.length; i++) {
            await ProductModel.findByIdAndUpdate(
                request.body.products[i].productId,
                {
                    $inc: { countInStock: -request.body.products[i].quantity } // Efficient stock decrement
                },
                { new: true }
            );
        }
        response.json({
            message: 'Order Placed',
            error: false,
            success: true,
            order: order,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}