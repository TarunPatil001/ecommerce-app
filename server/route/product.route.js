import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createProduct, deleteAllUnWantedImages, deleteMultipleProduct, deleteProduct, getAllFeaturedProducts, getAllProducts, getAllProductsByCategoryId, getAllProductsByCategoryName, getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCategoryId, getAllProductsBySubCategoryName, getAllProductsByThirdSubCategoryId, getAllProductsByThirdSubCategoryName, getAllProductsCount, getProduct, removeImageProductFromCloudinary, updateProduct, uploadProductImages } from "../controllers/product.controller.js";


// const productRouter = Router();
const productRouter = Router();

// Upload product images
productRouter.post("/upload-product-images", auth, upload.array("images"), uploadProductImages);

// remove image from cloudinary
productRouter.delete("/delete-product-image", auth, removeImageProductFromCloudinary);

// Create a new product
productRouter.post("/create-product", auth, createProduct);

// Get all products
productRouter.get("/get-all-products", getAllProducts);

// Get all products by categoryId
productRouter.get("/get-all-products-byCategoryId/:id", getAllProductsByCategoryId);

// Get all products by categoryName
productRouter.get("/get-all-products-byCategoryName", getAllProductsByCategoryName);

// Get all products by subCategoryId
productRouter.get("/get-all-products-bySubCategoryId/:id", getAllProductsBySubCategoryId);

// Get all products by subCategoryName
productRouter.get("/get-all-products-bySubCategoryName", getAllProductsBySubCategoryName);

// Get all products by thirdSubCategoryId
productRouter.get("/get-all-products-byThirdSubCategoryId/:id", getAllProductsByThirdSubCategoryId);

// Get all products by thirdSubCategoryName
productRouter.get("/get-all-products-byThirdSubCategoryName", getAllProductsByThirdSubCategoryName);

// Get all products by price
productRouter.get("/get-all-products-byPrice", getAllProductsByPrice);

// Get all products by rating
productRouter.get("/get-all-products-byRating", getAllProductsByRating);

// Get all products count
productRouter.get("/get-all-productsCount", getAllProductsCount);

// Get all featured products
productRouter.get("/get-all-featuredProducts", getAllFeaturedProducts);

// delete product
productRouter.delete("/:id", auth, deleteProduct);

// delete product
productRouter.delete("/delete-multiple-products", auth, deleteMultipleProduct);

// get single product
productRouter.get("/:id", getProduct);

// update product
productRouter.put("/updateProduct/:id", auth, updateProduct);
 
// Create a new product
productRouter.post("/deleteAllUnWantedImages", auth, deleteAllUnWantedImages);

export default productRouter;
