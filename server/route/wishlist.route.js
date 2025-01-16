import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { addToWishlistController, getWishlistController, removeFromWishlistController } from '../controllers/wishlist.controller.js';

const wishlistRouter = Router();

wishlistRouter.post("/add-to-wishlist", auth, addToWishlistController);
wishlistRouter.delete("/remove-from-wishlist/:id", auth, removeFromWishlistController);
wishlistRouter.get("/get-wishlist", auth, getWishlistController);

export default wishlistRouter; 