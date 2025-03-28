import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addHomeSlide, deleteHomeSlide, deleteMultipleHomeSlides, getHomeSlide, getHomeSlideByID, removeHomeSlideImageFromCloudinary, updateHomeSlide } from "../controllers/homeSlider.controller.js";

const homeSlideRouter = Router();

// Upload homeSlide images
// Create a new homeSlide
homeSlideRouter.post("/add-homeSlide", auth, upload.fields([{ name: "images" }]), addHomeSlide);
// homeSlideRouter.post("/add-homeSlide", auth, addHomeSlide);

// Get all homeSlide
homeSlideRouter.get("/", getHomeSlide);

// Get all homeSlide by ID
homeSlideRouter.get("/:id", getHomeSlideByID);

// Delete a homeSlide image from Cloudinary
homeSlideRouter.delete("/delete-homeSlide-image", auth, removeHomeSlideImageFromCloudinary);

// Delete a homeSlide by ID
homeSlideRouter.delete("/:id", auth, deleteHomeSlide);

// Delete multiple homeSlide 
homeSlideRouter.post("/:id", auth, deleteMultipleHomeSlides);

// Update a homeSlide by ID
// homeSlideRouter.put("/:id", auth, updateHomeSlide);
homeSlideRouter.put("/:id", auth, upload.fields([{ name: "newHomeSlideImages" }]), updateHomeSlide);


export default homeSlideRouter;