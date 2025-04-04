import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createProduct, createProductRams, createProductSize, createProductWeight, deleteAllUnWantedImages, deleteMultipleProduct, deleteMultipleProductRams, deleteMultipleProductSize, deleteMultipleProductWeight, deleteProduct, deleteProductRams, deleteProductSize, deleteProductWeight, filters, getAllFeaturedProducts, getAllFilteredProducts, getAllProductRams, getAllProducts, getAllProductsByCategoryId, getAllProductsByCategoryName, getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCategoryId, getAllProductsBySubCategoryName, getAllProductsByThirdSubCategoryId, getAllProductsByThirdSubCategoryName, getAllProductsCount,  getAllProductSize,  getAllProductWeight, getProduct, getProductRamById, getProductSizeById, getProductWeightById, getTotalSales, searchProductController, sortBy, updateProduct, updateProductRams, updateProductSize, updateProductWeight, } from "../controllers/product.controller.js";


// const productRouter = Router();
const productRouter = Router();

// ---------------------------------------------------------------------------------------------
// Product Routes

// Create a new product
productRouter.post("/create-product", auth, upload.fields([{ name: "images" }, { name: "bannerImages" }]), createProduct);

// Get all products
productRouter.get("/get-all-products", getAllProducts);

// Get all filtered products
productRouter.get("/get-all-filtered-products", getAllFilteredProducts);

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

// Get all featured products
productRouter.get("/get-total-sales", getTotalSales);

// delete product
productRouter.delete("/:id", auth, deleteProduct);

// delete multiple products
productRouter.post("/delete-multiple-products", auth,  deleteMultipleProduct);

// get single product
productRouter.get("/:id", getProduct);

// update product
productRouter.put("/updateProduct/:id", auth, upload.fields([{ name: "newProductImages" }, { name: "newBannerImages" }]), updateProduct);
 
// delete All UnWanted Images
productRouter.post("/deleteAllUnWantedImages", auth, deleteAllUnWantedImages);


// =======================================================================================================================

// Product Rams routes

// create product Rams 
productRouter.post("/productRams/create", auth, createProductRams);

// Get all productRams
productRouter.get("/productRams/get-all-productRams", getAllProductRams);

// Get all productRams
productRouter.get("/productRams/get-productRamsById/:id", getProductRamById);

// update productRams
productRouter.put("/productRams/updateProductRams/:id", auth, updateProductRams);

// delete productRams
productRouter.delete("/productRams/:id", auth, deleteProductRams);

// delete multiple productRams
productRouter.post("/productRams/delete-multiple-productRams", auth, deleteMultipleProductRams);


// =======================================================================================================================

// Product Weight routes

// create productWeight 
productRouter.post("/productWeight/create", auth, createProductWeight);

// Get all productWeight
productRouter.get("/productWeight/get-all-productWeight", getAllProductWeight);

// Get productWeight by id
productRouter.get("/productRams/get-productWeightById/:id", getProductWeightById);

// update productWeight
productRouter.put("/productWeight/updateProductWeight/:id", auth, updateProductWeight);

// delete productWeight
productRouter.delete("/productWeight/:id", auth, deleteProductWeight);

// delete multiple productWeight
productRouter.post("/productWeight/delete-multiple-productWeight", auth, deleteMultipleProductWeight);


// =======================================================================================================================

// Product Size routes

// create productSize 
productRouter.post("/productSize/create", auth, createProductSize);

// Get all productSize
productRouter.get("/productSize/get-all-productSize", getAllProductSize);

// Get productSize by id
productRouter.get("/productRams/get-getProductSizeById/:id", getProductSizeById);

// update productSize
productRouter.put("/productSize/updateProductSize/:id", auth, updateProductSize);

// delete productSize
productRouter.delete("/productSize/:id", auth, deleteProductSize);

// delete multiple productSize
productRouter.post("/productSize/delete-multiple-productSize", auth, deleteMultipleProductSize);

// ---------------------------------------------------------------------------------------------------------------------------

// filter the products
productRouter.post("/filters", filters);

// sortBy the products
productRouter.post("/sortBy", sortBy);

// ---------------------------------------------------------------------------------------------------------------------------

productRouter.post("/search/get", searchProductController);



export default productRouter;
