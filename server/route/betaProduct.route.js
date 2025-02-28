import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

// const productRouter = Router();
const betaProductRouter = Router();

// Create a new product
betaProductRouter.post("/create-product", auth, createProduct);

export default betaProductRouter;