import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ProductModel from "../models/product.model.js";
import CategoryModel from './../models/category.model.js';
import { mongoose } from 'mongoose';
import ProductRamsModel from "../models/productRams.model.js";
import ProductWeightModel from "../models/productWeight.model.js";
import ProductSizeModel from "../models/productSize.model.js";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});


// =========================================================================================================================

// Product


var imagesArr = {}; // Store images per product ID, replace with database storage in production

// Helper function to check if image exists in Cloudinary
async function checkImageExists(imageUrl) {
  try {
    const response = await axios.head(imageUrl); // HEAD request to check image existence
    return response.status === 200; // If status is 200, image exists
  } catch (error) {
    return false; // If request fails, image doesn't exist
  }
}

// Upload product images
export async function uploadProductImages(request, response) {
  try {
    const { productId } = request.body;
    const images = request.files;

    console.log("Received productId:", productId);
    console.log("Uploaded files:", images);

    if (!images || images.length === 0) {
      return response.status(400).json({ error: "No images provided" });
    }

    // Initialize imagesArr per product ID (replace with a database in production)
    if (!productId) {
      if (!Array.isArray(imagesArr["new"])) imagesArr["new"] = []; // Ensure it's an array
    } else {
      if (!Array.isArray(imagesArr[productId])) imagesArr[productId] = []; // Ensure it's an array
    }

    // Upload images and update imagesArr after successful upload
    const uploadedImages = await Promise.all(
      images.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "ecommerceApp/uploads",
            use_filename: true,
            unique_filename: false,
            overwrite: false,
          });

          console.log("Uploaded image URL:", result.secure_url);

          fs.unlinkSync(`uploads/${file.filename}`); // Remove uploaded file from local storage
          return result.secure_url; // Return uploaded image URL
        } catch (error) {
          console.log("Cloudinary upload error:", error);
          return null; // Return null in case of an error
        }
      })
    );

    // Filter out null values (failed uploads)
    const validImages = uploadedImages.filter(Boolean);
    console.log("Valid uploaded images:", validImages);

    // Update imagesArr after all uploads are completed
    if (productId) {
      imagesArr[productId].push(...validImages);
    } else {
      imagesArr["new"].push(...validImages);
    }

    // Debugging: Check imagesArr before returning response
    console.log("Updated imagesArr:", imagesArr);

    return response.status(200).json({
      images: productId ? imagesArr[productId] : imagesArr["new"],
    });

  } catch (error) {
    console.log("Server Error:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      status: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// Create Product  
export async function createProduct(request, response) {
  try {
    const {
      name,
      description,
      brand,
      price,
      oldPrice,
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      thirdSubCategoryName,
      thirdSubCategoryId,
      category,
      countInStock,
      rating,
      isFeatured,
      discount,
      productRam,
      size,
      productWeight,
    } = request.body;

    // Check if required fields are present
    if (!name || !description || !brand || !price || !categoryId || !subCategoryId) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Missing required fields. Please provide all necessary product details.",
      });
    }

    // Ensure imagesArr is defined and contains images for the given productId or 'new'
    const imagesForProduct = request.body.productId
      ? imagesArr[request.body.productId]
      : imagesArr["new"];

    if (!imagesForProduct || imagesForProduct.size === 0) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Images array is missing or empty.",
      });
    }

    // Convert the Set to an array before saving it to the database
    const imagesArray = Array.from(imagesForProduct);

    // Create new product object
    let product = new ProductModel({
      name,
      description,
      images: imagesArray, // Use the converted array of images
      brand,
      price,
      oldPrice,
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      thirdSubCategoryName,
      thirdSubCategoryId,
      category,
      countInStock,
      rating,
      isFeatured,
      discount,
      productRam,
      size,
      productWeight,
    });

    // Save the product to the database
    product = await product.save();

    if (!product) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product creation failed",
      });
    }

    // Clear images array after product creation to avoid conflicts with subsequent uploads
    if (request.body.productId) {
      imagesArr[request.body.productId] = new Set(); // Reset the images for the specific product
    } else {
      imagesArr["new"] = new Set(); // Reset global "new" set
    }

    return response.status(200).json({
      message: "Product created successfully.",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

export async function getAllProducts(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000; // Use 10 as default limit
    const totalPosts = await ProductModel.countDocuments();

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    const totalPages = Math.max(1, Math.ceil(totalPosts / perPage)); // Ensures at least 1 page

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

// Get all filtered products based on multiple categories, subcategories, or third subcategories
export async function getAllFilteredProducts(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Default to page 1
    const perPage = parseInt(request.query.perPage) || 10000; // Default to fetching 10000 products
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    // Build dynamic filter query based on provided categoryIds, subCategoryIds, thirdSubCategoryIds
    const filterQuery = {};

    // Apply category filter if categoryIds are provided
    if (request.query.categoryIds) {
      const categoryIds = request.query.categoryIds.split(",");
      filterQuery.categoryId = { $in: categoryIds };
    }

    // Apply subCategory filter if subCategoryIds are provided
    if (request.query.subCategoryIds) {
      const subCategoryIds = request.query.subCategoryIds.split(",");
      filterQuery.subCategoryId = { $in: subCategoryIds };
    }

    // Apply thirdSubCategory filter if thirdSubCategoryIds are provided
    if (request.query.thirdSubCategoryIds) {
      const thirdSubCategoryIds = request.query.thirdSubCategoryIds.split(",");
      filterQuery.thirdSubCategoryId = { $in: thirdSubCategoryIds };
    }

    // Fetch products that match the filters
    const products = await ProductModel.find(filterQuery)
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting filtered products: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during fetching products.",
      error: true,
      success: false,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------


// get all products by categoryId
export async function getAllProductsByCategoryId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    // Split the category IDs if multiple are sent as a comma-separated string
    const categoryIds = request.params.id.split(",");

    const products = await ProductModel.find({
      categoryId: { $in: categoryIds }, // Match multiple categories
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred while getting all products.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------



// get all products by categoryName
export async function getAllProductsByCategoryName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      categoryName: request.query.categoryName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// get all products by subCategoryId
export async function getAllProductsBySubCategoryId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    // Split the subcategory IDs if multiple are sent as a comma-separated string
    const subCategoryIds = request.params.id.split(",");

    const products = await ProductModel.find({
      subCategoryId: { $in: subCategoryIds }, // Match multiple subcategories
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred while getting all products.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// get all products by subCategoryName
export async function getAllProductsBySubCategoryName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      subCategoryName: request.query.subCategoryName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}






// ----------------------------------------------------------------------------------------------------------------------

// get all products by thirdSubCategoryId
export async function getAllProductsByThirdSubCategoryId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    // Split the third subcategory IDs if multiple are sent as a comma-separated string
    const thirdSubCategoryIds = request.params.id.split(",");

    const products = await ProductModel.find({
      thirdSubCategoryId: { $in: thirdSubCategoryIds }, // Match multiple third subcategories
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred while getting all products.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// get all products by thirdSubCategoryName
export async function getAllProductsByThirdSubCategoryName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      thirdSubCategoryName: request.query.thirdSubCategoryName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

// get all products by price
export async function getAllProductsByPrice(request, response) {
  let productList = [];

  if (
    request.query.categoryId !== "" &&
    request.query.categoryId !== undefined
  ) {
    const productListArr = await ProductModel.find({
      categoryId: request.query.categoryId,
    }).populate("category");

    productList = productListArr;
  }

  if (
    request.query.subCategoryId !== "" &&
    request.query.subCategoryId !== undefined
  ) {
    const productListArr = await ProductModel.find({
      subCategoryId: request.query.subCategoryId,
    }).populate("category");

    productList = productListArr;
  }

  if (
    request.query.thirdSubCategoryId !== "" &&
    request.query.thirdSubCategoryId !== undefined
  ) {
    const productListArr = await ProductModel.find({
      thirdSubCategoryId: request.query.thirdSubCategoryId,
    }).populate("category");

    productList = productListArr;
  }

  const filterProducts = await productList.filter((product) => {
    if (
      request.query.minPrice &&
      product.price < parseInt(+request.query.minPrice)
    ) {
      return false;
    }
    if (
      request.query.maxPrice &&
      product.price > parseInt(+request.query.maxPrice)
    ) {
      return false;
    }
    return true;
  });

  return response.status(200).json({
    error: false,
    success: true,
    data: filterProducts,
    totalPages: 0,
    page: 0,
  });
}





// ----------------------------------------------------------------------------------------------------------------------

// get all products by rating
export async function getAllProductsByRating(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Parse page from query or default to 1
    const perPage = parseInt(request.query.perPage) || 10000; // Parse perPage from query or default to 10000

    // Build a dynamic query based on provided filters
    const query = {};

    // Add dynamic rating filter if provided
    if (request.query.rating) {
      query.rating = { $gte: parseFloat(request.query.rating) }; // Use $gte for minimum rating
    }

    // Add category filters if provided
    if (request.query.categoryId) {
      query.categoryId = request.query.categoryId;
    }
    if (request.query.subCategoryId) {
      query.subCategoryId = request.query.subCategoryId;
    }
    if (request.query.thirdSubCategoryId) {
      query.thirdSubCategoryId = request.query.thirdSubCategoryId;
    }

    // Count the total number of matching documents for pagination
    const totalPosts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / perPage);

    // Handle case where the requested page exceeds available pages
    if (page > totalPages && totalPosts > 0) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    // Fetch products based on the query and pagination parameters
    const products = await ProductModel.find(query)
      .populate("category") // Populate category details
      .skip((page - 1) * perPage) // Skip records for pagination
      .limit(perPage) // Limit records per page
      .exec();

    // Handle case where no products match the query
    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    // Return the paginated list of products
    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// get all products count
export async function getAllProductsCount(request, response) {
  try {
    const productsCount = await ProductModel.countDocuments();

    if (!productsCount) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    response.status(200).json({
      message: "Products count retrieved successfully",
      error: false,
      success: true,
      data: productsCount,
    });
  } catch (error) {
    console.error(
      "Error in getting all products count: ",
      error.message || error
    );
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products count.",
      error: true,
      success: false,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------

// get all featured products
export async function getAllFeaturedProducts(request, response) {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
    }).populate("category");

    if (!products) {
      return response.status(404).json({
        message: "No featured products found",
        error: true,
        success: false,
      });
    }

    response.status(200).json({
      message: "Featured products retrieved successfully",
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(
      "Error in getting all products count: ",
      error.message || error
    );
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products count.",
      error: true,
      success: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

function extractPublicId(imageUrl) {
  // Regex to match the Cloudinary URL and extract public ID
  const regex = /https:\/\/res\.cloudinary\.com\/.*\/(ecommerceApp\/uploads\/.*)\.[a-zA-Z0-9]+$/;
  const match = imageUrl.match(regex);

  if (match && match[1]) {
    // Return the full public ID (including folder path)
    return match[1];
  }

  return null;
}



export async function deleteProduct(request, response) {
  try {
    const productId = request.params.id;
    const product = await ProductModel.findById(productId);

    if (!product) {
      return response.status(404).json({
        message: "Product not found.",
        success: false,
        error: true,
      });
    }

    let cloudinaryMessages = [];

    for (let i = 0; i < product.images.length; i++) {
      const imageUrl = product.images[i];
      const publicId = extractPublicId(imageUrl);

      if (!publicId) {
        cloudinaryMessages.push(`Failed to extract public ID for image ${i + 1}.`);
        continue;
      }

      // Add the folder path for Cloudinary deletion
      const fullPublicId = `ecommerceApp/uploads/${publicId}`;
      console.log(`Attempting to delete image with full public ID: ${fullPublicId}`);

      // Delete image from Cloudinary and check the response
      const result = await cloudinary.uploader.destroy(fullPublicId);

      console.log('Cloudinary delete result:', result);  // Log the entire result

      if (result.result === 'ok') {
        cloudinaryMessages.push(`Image ${i + 1} deleted successfully from Cloudinary.`);
      } else {
        cloudinaryMessages.push(`Failed to delete image ${i + 1} from Cloudinary. Error: ${result.error ? result.error.message : 'Unknown error'}`);
      }
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return response.status(400).json({
        message: "Product deletion failed.",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      message: "Product and associated images deleted successfully.",
      success: true,
      error: false,
      cloudinaryMessages: cloudinaryMessages,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      status: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// delete multiple products
export async function deleteMultipleProduct(req, res) {
  try {
    const { ids } = req.query;

    // Check if ids exist and are valid
    if (!ids) {
      return res.status(400).json({
        message: "No product IDs provided.",
        success: false,
        error: true,
      });
    }

    console.log("Received IDs:", ids);

    // Convert comma-separated string to an array and trim spaces
    const idArray = ids.split(',').map(id => id.trim());

    // Validate the IDs
    if (idArray.length === 0 || idArray.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        message: "Invalid product IDs.",
        success: false,
        error: true,
      });
    }

    // Fetch products before deletion
    const products = await ProductModel.find({ _id: { $in: idArray } });

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found with the given IDs.",
        success: false,
        error: true,
      });
    }

    console.log(`Found ${products.length} products for deletion.`);

    // Delete images from Cloudinary, handling individual image deletion errors
    const imageDeletePromises = products.flatMap((product) =>
      product.images.map(async (imgUrl) => {
        try {
          const imageName = imgUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`ecommerceApp/uploads/${imageName}`);
          console.log(`Deleted image: ${imageName}`);
        } catch (err) {
          console.error(`Error deleting image ${imgUrl}:`, err);
        }
      })
    );

    // Wait for all image deletions to complete, continue even if some fail
    await Promise.allSettled(imageDeletePromises);

    // Delete products from the database
    await ProductModel.deleteMany({ _id: { $in: idArray } });

    console.log("Products deleted successfully.");

    return res.status(200).json({
      message: "Product(s) deleted successfully.",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error deleting products:", error);
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false,
      error: true,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------

// get single products
export async function getProduct(request, response) {
  try {
    const product = await ProductModel.findById(request.params.id).populate(
      "category"
    );

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      data: product,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in getting product:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during product retrieval.",
      success: false,
      error: error.message || error,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

// Combined logic for both creating a new product and updating an existing product
export async function removeImageProductFromCloudinary(request, response) {
  try {
    const { imgUrl, productId } = request.query;  // Expecting both imgUrl and productId in query
    console.log("Request Query:", request.query);  // Log the incoming request query

    // Validate input
    if (!imgUrl) {
      return response.status(400).json({ error: "Image URL is required" });
    }

    // Handle image removal logic for both new and existing products
    if (productId) {
      // If productId is provided, handle for editing an existing product
      const product = await ProductModel.findById(productId);

      if (!product) {
        return response.status(404).json({ error: "Product not found" });
      }

      // Remove the image from the product's image array
      const updatedImages = product.images.filter(imageUrl => imageUrl.trim() !== imgUrl.trim());
      if (updatedImages.length === product.images.length) {
        return response.status(404).json({ error: "Image not found in product images" });
      }

      // Update the product in the database
      product.images = updatedImages;
      await product.save();

      // Also update the imagesArr in-memory (or your state management) to reflect the changes
      if (imagesArr[productId]) {
        imagesArr[productId] = imagesArr[productId].filter(url => url.trim() !== imgUrl.trim());
      }

      console.log("Image removed from product", productId);
    } else {
      // If no productId is provided, handle as new product
      if (imagesArr["new"] && imagesArr["new"].includes(imgUrl)) {
        const index = imagesArr["new"].indexOf(imgUrl);
        imagesArr["new"].splice(index, 1);  // Remove from the global new set
        console.log("Image removed from global set");
      } else {
        return response.status(404).json({ error: "Image URL not found in global images" });
      }
    }

    // Extract the public ID from the imgUrl for Cloudinary deletion
    const publicId = extractPublicId(imgUrl);
    if (!publicId) {
      return response.status(400).json({
        message: "Invalid image URL format",
        success: false,
        error: true,
      });
    }

    console.log("Deleting image with public ID:", publicId);

    // Attempt to delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log("Image successfully deleted from Cloudinary:", imgUrl);
      return response.status(200).json({
        message: "Image removed successfully from Cloudinary and product",
        success: true,
      });
    }

    // If the Cloudinary deletion result is not 'ok'
    return response.status(404).json({
      message: "Image not found in Cloudinary",
      success: false,
      error: true,
    });
  } catch (error) {
    console.error("Error in removeImageProduct:", error);
    return response.status(500).json({
      message: "Failed to remove image",
      success: false,
      error: true,
    });
  }
}







// ----------------------------------------------------------------------------------------------------------------------

export async function updateProduct(request, response) {
  try {
    const productId = request.params.id;
    const product = await ProductModel.findById(productId);

    if (!product) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Product not found!",
      });
    }

    let newImages = request.body.images || []; // Get new images from request body
    let cloudinaryMessages = [];
    let validNewImages = []; // Array to store images that exist in Cloudinary

    // Check if each new image exists in Cloudinary
    for (let newImageUrl of newImages) {
      const publicId = extractPublicId(newImageUrl); // Extract the publicId from the URL
      if (publicId) {
        try {
          const result = await cloudinary.api.resource(publicId);
          if (result) {
            validNewImages.push(newImageUrl); // If image exists in Cloudinary, add it to the valid list
          } else {
            cloudinaryMessages.push(`Image does not exist in Cloudinary: ${newImageUrl}`);
          }
        } catch (error) {
          cloudinaryMessages.push(`Error checking image existence in Cloudinary: ${newImageUrl}`);
        }
      } else {
        cloudinaryMessages.push(`Invalid image URL format: ${newImageUrl}`);
      }
    }

    // Compare old images with new images to determine which ones need to be deleted
    const imagesToDelete = product.images.filter(image => !validNewImages.includes(image));

    // Delete images from Cloudinary that are removed from the new images list
    if (imagesToDelete.length > 0) {
      for (let oldImageUrl of imagesToDelete) {
        const publicId = extractPublicId(oldImageUrl); // Extract the publicId from the URL
        if (publicId) {
          try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result === "ok") {
              cloudinaryMessages.push(`Deleted old image: ${publicId}`);
            } else {
              cloudinaryMessages.push(`Failed to delete old image: ${publicId}`);
            }
          } catch (error) {
            cloudinaryMessages.push(`Error deleting image: ${error.message}`);
          }
        }
      }
    }

    // Update the product's images with the valid new image URLs
    product.images = validNewImages.length > 0 ? validNewImages : product.images;

    // Filter and sort value arrays before updating
    const filterValidValues = (array) => {
      if (!Array.isArray(array)) return [];
      return array.filter(Boolean).sort((a, b) => parseInt(a) - parseInt(b));
    };

    // Filter valid size options from the request body
    const validSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const filteredSize = validSizes.filter(size => request.body.size.includes(size));

    // Update the product details in the database
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        name: request.body.name,
        description: request.body.description,
        images: product.images, // Updated images (new or existing)
        brand: request.body.brand,
        price: request.body.price,
        oldPrice: request.body.oldPrice,
        categoryName: request.body.categoryName,
        categoryId: request.body.categoryId,
        subCategoryName: request.body.subCategoryName,
        subCategoryId: request.body.subCategoryId,
        thirdSubCategoryName: request.body.thirdSubCategoryName,
        thirdSubCategoryId: request.body.thirdSubCategoryId,
        category: request.body.category,
        countInStock: request.body.countInStock,
        rating: request.body.rating,
        isFeatured: request.body.isFeatured,
        discount: request.body.discount,
        productRam: filterValidValues(request.body.productRam),
        size: filteredSize,
        productWeight: filterValidValues(request.body.productWeight),
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product update failed!",
      });
    }

    return response.status(200).json({
      message: "Product updated successfully.",
      success: true,
      cloudinaryMessages,
      product: updatedProduct,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "An error occurred during product update.",
      success: false,
      error: error.message || error,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------

// delete all unwanted images from cloudinary
export async function deleteAllUnWantedImages(req, res) {
  try {
    console.log("Fetching all products from DB...");
    const products = await ProductModel.find();
    console.log("Products fetched:", products);

    const linkedImages = new Set();
    products.forEach((product) => {
      product.images.forEach((img) => {
        linkedImages.add(img);
      });
    });
    console.log("Linked images:", linkedImages);

    console.log("Fetching images from Cloudinary...");
    const cloudinaryImages = await cloudinary.api.resources({
      type: "upload",
      prefix: "ecommerceApp/uploads",
    });
    console.log("Cloudinary images fetched:", cloudinaryImages);

    const imagesToDelete = cloudinaryImages.resources.filter(
      (img) => !linkedImages.has(img.secure_url)
    );
    console.log("Images to delete:", imagesToDelete);

    for (const img of imagesToDelete) {
      console.log("Deleting image:", img.public_id);
      await cloudinary.uploader.destroy(img.public_id);
    }

    return res.status(200).json({
      message: "Unwanted images deleted successfully.",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      status: false,
    });
  }
}





// ===========================================================================================================================
// ===========================================================================================================================

// Product Rams


// Create Product Rams
export async function createProductRams(request, response) {
  try {
    // Create new productRams
    let productRams = new ProductRamsModel({
      name : request.body.name,
    });

    // Save the product to the database
    productRams = await productRams.save();

    if (!productRams) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product Rams creation failed",
      });
    }

    return response.status(200).json({
      message: "Product Rams created successfully.",
      success: true,
      error: false,
      data: productRams,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------

export async function getAllProductRams(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000; // Use 10 as default limit
    const totalPosts = await ProductRamsModel.countDocuments();

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No product rams found",
        error: true,
        success: false,
      });
    }

    const totalPages = Math.max(1, Math.ceil(totalPosts / perPage)); // Ensures at least 1 page

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const productRams = await ProductRamsModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      message: "Product RAMs retrieved successfully",
      error: false,
      success: true,
      data: productRams,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getting all product Rams: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during getting all product Rams.",
      error: true,
      success: false,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------

// get productRam by id
export async function getProductRamById(request, response) {
  try {
    const { id } = request.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid productRam ID",
        error: true,
        success: false,
      });
    }

    // Fetch the product by ID
    const productRam = await ProductRamsModel.findById(id);

    if (!productRam) {
      return response.status(404).json({
        message: "Product RAM not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Product RAM retrieved successfully",
      error: false,
      success: true,
      data: productRam,
    });
  } catch (error) {
    console.error("Error in getting product RAM:", error);
    return response.status(500).json({
      message: error.message || "An error occurred while retrieving the product RAM.",
      error: true,
      success: false,
    });
  }
}





// ---------------------------------------------------------------------------------------------------------------------

export async function deleteProductRams(request, response) {
  try {
    const productRamsId = request.params.id;
    const productRams = await ProductRamsModel.findById(productRamsId);

    if (!productRams) {
      return response.status(404).json({
        message: "Product RAM not found.",
        success: false,
        error: true,
      });
    }

    const deletedProductRams = await ProductRamsModel.findByIdAndDelete(productRamsId);

    if (!deletedProductRams) {
      return response.status(400).json({
        message: "Product RAM deletion failed.",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      message: "Product RAM deleted successfully.",
      success: true,
      error: false,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      status: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// delete multiple productRam
export async function deleteMultipleProductRams(req, res) {
  try {
    const { ids } = req.query;

    // Check if ids exist and are valid
    if (!ids) {
      return res.status(400).json({
        message: "No product Rams IDs provided.",
        success: false,
        error: true,
      });
    }

    console.log("Received IDs:", ids);

    // Convert comma-separated string to an array and trim spaces
    const idArray = ids.split(',').map(id => id.trim());

    // Validate the IDs
    if (idArray.length === 0 || idArray.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        message: "Invalid product Rams IDs.",
        success: false,
        error: true,
      });
    }

    // Fetch productRams before deletion
    const productRams = await ProductRamsModel.find({ _id: { $in: idArray } });

    if (productRams.length === 0) {
      return res.status(404).json({
        message: "No product rams found with the provided IDs.",
        success: false,
        error: true,
      });
    }

    console.log(`Found ${productRams.length} productRams for deletion.`);

    // Delete products from the database
    await ProductRamsModel.deleteMany({ _id: { $in: idArray } });

    console.log("Product Rams deleted successfully.");

    return res.status(200).json({
      message: "Product Ram(s) deleted successfully.",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error deleting product Rams:", error); 
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false,
      error: true,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

export async function updateProductRams(request, response) {
  try {
    const productRamsId = request.params.id;
    const productRams = await ProductRamsModel.findById(productRamsId);

    if (!productRams) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Product RAM not found!",
      });
    }

    // Update the product details in the database
    const updatedProductRams = await ProductRamsModel.findByIdAndUpdate(
      productRamsId,
      {
        name: request.body.name,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProductRams) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product RAM update failed!",
      });
    }

    return response.status(200).json({
      message: "Product RAM updated successfully!",
      success: true,
      data: updatedProductRams,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "An error occurred during product ram update.",
      success: false,
      error: error.message || error,
    });
  }
}




// ===========================================================================================================================
// ===========================================================================================================================

// Product Weight


// Create Product Weight
export async function createProductWeight(request, response) {
  try {
    // Create new productRams
    let productWeight = new ProductWeightModel({
      name : request.body.name,
    });

    // Save the product to the database
    productWeight = await productWeight.save();

    if (!productWeight) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product Weight creation failed",
      });
    }

    return response.status(200).json({
      message: "Product Weight created successfully.",
      success: true,
      error: false,
      data: productWeight,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------
// get all product weight 
export async function getAllProductWeight(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000; // Use 10 as default limit
    const totalPosts = await ProductWeightModel.countDocuments();

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No product weights found",
        error: true,
        success: false,
      });
    }

    const totalPages = Math.max(1, Math.ceil(totalPosts / perPage)); // Ensures at least 1 page

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const productWeight = await ProductWeightModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      message: "Product weights retrieved successfully",
      error: false,
      success: true,
      data: productWeight,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getting all product weights: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during getting all product weights.",
      error: true,
      success: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

// get product weight by id
export async function getProductWeightById(request, response) {
  try {
    const { id } = request.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid productWeight ID",
        error: true,
        success: false,
      });
    }

    // Fetch the productWeight by ID
    const productWeight  = await ProductWeightModel.findById(id);

    if (!productWeight) {
      return response.status(404).json({
        message: "Product Weight not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Product Weight retrieved successfully",
      error: false,
      success: true,
      data: productWeight,
    });
  } catch (error) {
    console.error("Error in getting product weight:", error);
    return response.status(500).json({
      message: error.message || "An error occurred while retrieving the product weight.",
      error: true,
      success: false,
    });
  }
}



// ---------------------------------------------------------------------------------------------------------------------
// delete product weight
export async function deleteProductWeight(request, response) {
  try {
    const productWeightId = request.params.id;
    const productWeight = await ProductWeightModel.findById(productWeightId);

    if (!productWeight) {
      return response.status(404).json({
        message: "Product Weight not found.",
        success: false,
        error: true,
      });
    }

    const deletedProductWeight = await ProductWeightModel.findByIdAndDelete(productWeightId);

    if (!deletedProductWeight) {
      return response.status(400).json({
        message: "Product Weight deletion failed.",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      message: "Product Weight deleted successfully.",
      success: true,
      error: false,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      status: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// delete multiple product weight
export async function deleteMultipleProductWeight(req, res) {
  try {
    const { ids } = req.query;

    // Check if ids exist and are valid
    if (!ids) {
      return res.status(400).json({
        message: "No product weight IDs provided.",
        success: false,
        error: true,
      });
    }

    console.log("Received IDs:", ids);

    // Convert comma-separated string to an array and trim spaces
    const idArray = ids.split(',').map(id => id.trim());

    // Validate the IDs
    if (idArray.length === 0 || idArray.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        message: "Invalid product weight IDs.",
        success: false,
        error: true,
      });
    }

    // Fetch productRams before deletion
    const productWeight = await ProductWeightModel.find({ _id: { $in: idArray } });

    if (productWeight.length === 0) {
      return res.status(404).json({
        message: "No product weight found with the provided IDs.",
        success: false,
        error: true,
      });
    }

    console.log(`Found ${productWeight.length} productWeight for deletion.`);

    // Delete products from the database
    await ProductWeightModel.deleteMany({ _id: { $in: idArray } });

    console.log("Product weight(s) deleted successfully.");

    return res.status(200).json({
      message: "Product weight(s) deleted successfully.",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error deleting product weights:", error); 
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false,
      error: true,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------
// update Product Weight 
export async function updateProductWeight(request, response) {
  try {
    const productWeightId = request.params.id;
    const productWeight = await ProductWeightModel.findById(productWeightId);

    if (!productWeight) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Product weight not found!",
      });
    }

    // Update the product details in the database
    const updatedProductWeight = await ProductWeightModel.findByIdAndUpdate(
      productWeightId,
      {
        name: request.body.name,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProductWeight) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product weight update failed!",
      });
    }

    return response.status(200).json({
      message: "Product weight updated successfully!",
      success: true,
      data: updatedProductWeight,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "An error occurred during product weight update.",
      success: false,
      error: error.message || error,
    });
  }
}



