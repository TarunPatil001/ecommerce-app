import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addHomeSlide, deleteHomeSlide, deleteMultipleHomeSlides, getHomeSlide, getHomeSlideByID, removeHomeSlideImageFromCloudinary, updateHomeSlide, uploadHomeSlideImages } from "../controllers/homeSlider.controller.js";

const homeSlideRouter = Router();

// Upload homeSlide images
homeSlideRouter.post("/upload-homeSlide-images", auth, upload.array("images"), uploadHomeSlideImages);

// Create a new homeSlide
homeSlideRouter.post("/add-homeSlide", auth, addHomeSlide);

// Get all homeSlide
homeSlideRouter.get("/", getHomeSlide);

// Get all homeSlide by ID
homeSlideRouter.get("/:id", getHomeSlideByID);

// Delete a homeSlide image from Cloudinary
homeSlideRouter.delete("/delete-homeSlide-image", auth, removeHomeSlideImageFromCloudinary);

// Delete a homeSlide by ID
homeSlideRouter.delete("/:id", auth, deleteHomeSlide);

// Delete multiple homeSlide 
homeSlideRouter.delete("/:id", auth, deleteMultipleHomeSlides);

// Update a homeSlide by ID
homeSlideRouter.put("/:id", auth, updateHomeSlide);


export default homeSlideRouter;