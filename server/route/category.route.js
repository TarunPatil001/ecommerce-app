import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createCategory, deleteCategory, getCategories, getCategoriesCount, getCategory, getSubCategoriesCount, removeCategoryImageFromCloudinary, updateCategory, uploadCategoryImages } from "../controllers/category.controller.js";

const categoryRouter = Router();

// Upload category images
categoryRouter.post("/upload-category-images", auth, upload.array("images"), uploadCategoryImages);

// Create a new category
categoryRouter.post("/create-category", auth, createCategory);

// Get all categories
categoryRouter.get("/", getCategories);

// Get count of root categories
categoryRouter.get("/get/count", getCategoriesCount);

// Get count of subcategories
categoryRouter.get("/get/count/sub-categories", getSubCategoriesCount);

// Get a single category by ID
categoryRouter.get("/:id", getCategory);

// Delete a category image from Cloudinary
categoryRouter.delete("/delete-category-image", auth, removeCategoryImageFromCloudinary);

// Delete a category by ID
categoryRouter.delete("/:id", auth, deleteCategory);

// Update a category by ID
categoryRouter.put("/:id", auth, updateCategory);

export default categoryRouter;


