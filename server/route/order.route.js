import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createOrderController, getOrderDetailsController } from "../controllers/order.controller.js";


const orderRouter = Router();

// Upload homeSlide images
orderRouter.post("/create-order", auth, createOrderController);
orderRouter.get("/order-list", auth, getOrderDetailsController);


export default orderRouter;