import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addToCartItemController, deleteCartItemController, getCartItemController, updateCartItemController } from "../controllers/cartProduct.controller.js";

const cartProductRouter = Router();

cartProductRouter.post("/add-product-to-cart", auth, addToCartItemController);
cartProductRouter.get("/get-product-from-cart", auth, getCartItemController);
cartProductRouter.put("/update-product-qty-in-cart", auth, updateCartItemController);
cartProductRouter.delete("/delete-cart-item/:id", auth, deleteCartItemController);

export default cartProductRouter;