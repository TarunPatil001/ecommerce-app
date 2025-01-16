import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } from "../controllers/cartProduct.controller.js";

const cartProductRouter = Router();

cartProductRouter.post("/add-product", auth, addToCartItemController);
cartProductRouter.get("/get-product", auth, getCartItemController);
cartProductRouter.put("/update-qty", auth, updateCartItemQtyController);
cartProductRouter.delete("/delete-cart-item", auth, deleteCartItemQtyController);

export default cartProductRouter;