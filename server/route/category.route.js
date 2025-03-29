import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createCategory, deleteCategory, deleteMultipleCategories, getCategories, getCategoriesCount, getCategory, getSubCategoriesCount, updateCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();

// Upload category images
// categoryRouter.post("/upload-category-images", auth, upload.array("images"), uploadCategoryImages);

// Create a new category
// categoryRouter.post("/create-category", auth, createCategory);
categoryRouter.post("/create-category", auth, upload.fields([{ name: "images" }]), createCategory);

// Get all categories
categoryRouter.get("/", getCategories);

// Get count of root categories
categoryRouter.get("/get/count", getCategoriesCount);

// Get count of subcategories
categoryRouter.get("/get/count/sub-categories", getSubCategoriesCount);

// Get a single category by ID
categoryRouter.get("/:id", getCategory);

// Delete a category by ID
categoryRouter.delete("/:id", auth, deleteCategory);

// delete multiple categories
categoryRouter.post("/delete-multiple-categories", auth, deleteMultipleCategories);

// Update a category by ID
categoryRouter.put("/:id", auth, upload.fields([{ name: "newCategoryImages" }]), updateCategory);

export default categoryRouter;


