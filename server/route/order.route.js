import { Router } from "express";
import auth from "../middlewares/auth.js";
import { captureOrderPaypalController, createOrderController, createOrderPaypalController, getOrderDetailsController, orderStatusController, totalSalesController, totalUsersController } from "../controllers/order.controller.js";


const orderRouter = Router();

// Upload homeSlide images
orderRouter.post("/create-order", auth, createOrderController);
orderRouter.get("/order-list", auth, getOrderDetailsController);
orderRouter.get("/create-order-paypal", auth, createOrderPaypalController);
orderRouter.post("/capture-order-paypal", auth, captureOrderPaypalController);
orderRouter.put("/order-status/:id", auth, orderStatusController);

orderRouter.get("/sales", auth, totalSalesController);
orderRouter.get("/users", auth, totalUsersController);

export default orderRouter;