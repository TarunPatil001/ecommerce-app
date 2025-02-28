import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js"; // Multer for handling file uploads
import { createBetaProduct } from "../controllers/betaProduct.controller.js";

const betaProductRouter = Router();

// 🔹 Create a new product (with file upload)
betaProductRouter.post("/create-product", auth, upload.array("images"), createBetaProduct);

export default betaProductRouter;
