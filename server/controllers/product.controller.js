import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ProductModel from "../models/product.model.js";
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

var bannerImagesArr = {}; // Ensure structure consistency

// Upload product banner images
export async function uploadProductBannerImages(request, response) {
  try {
    const { productId } = request.body;
    const bannerImages = request.files;

    console.log("Received productId:", productId);
    console.log("Uploaded files:", bannerImages);

    if (!bannerImages || bannerImages.length === 0) {
      return response.status(400).json({ error: "No banner images provided" });
    }

    // Ensure bannerImagesArr is properly initialized as an object containing arrays
    if (!productId) {
      if (!Array.isArray(bannerImagesArr["new"])) bannerImagesArr["new"] = []; 
    } else {
      if (!Array.isArray(bannerImagesArr[productId])) bannerImagesArr[productId] = [];
    }

    // Upload banner images and update bannerImagesArr after successful upload
    const uploadedImages = await Promise.all(
      bannerImages.map(async (file) => {
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
    console.log("Valid uploaded banner images:", validImages);

    // Append images to array
    if (productId) {
      bannerImagesArr[productId].push(...validImages);
    } else {
      bannerImagesArr["new"].push(...validImages);
    }

    // Debugging: Check bannerImagesArr before returning response
    console.log("Updated bannerImagesArr:", bannerImagesArr);

    return response.status(200).json({
      bannerImages: productId ? bannerImagesArr[productId] : bannerImagesArr["new"],
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
// export async function createProduct(request, response) {
//   try {
//     const {
//       name,
//       description,
//       isBannerVisible,
//       bannerTitleName,
//       brand,
//       price,
//       oldPrice,
//       categoryName,
//       categoryId,
//       subCategoryName,
//       subCategoryId,
//       thirdSubCategoryName,
//       thirdSubCategoryId,
//       category,
//       countInStock,
//       rating,
//       isFeatured,
//       discount,
//       productRam,
//       size,
//       productWeight,
//     } = request.body;

//     // Check if required fields are present
//     if (!name || !description || !brand || !price || !categoryId || !subCategoryId) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Missing required fields. Please provide all necessary product details.",
//       });
//     }

//     // Validate banner fields if isBannerVisible is true
//     if (isBannerVisible) {
//       if (!bannerTitleName || !Array.isArray(request.body.bannerImages) || request.body.bannerImages.length === 0) {
//         return response.status(400).json({
//           error: true,
//           success: false,
//           message: "Banner is enabled, but bannerTitleName or bannerImages are missing.",
//         });
//       }
//     }

//     // Validate and fetch product images
//     const productId = request.body.productId && mongoose.Types.ObjectId.isValid(request.body.productId)
//       ? new mongoose.Types.ObjectId(request.body.productId)
//       : null;
    
//     const imagesForProduct = productId ? imagesArr[productId] || [] : imagesArr["new"] || [];
//     const bannerImagesForProduct = productId ? bannerImagesArr[productId] || [] : bannerImagesArr["new"] || [];

//     if (!Array.isArray(imagesForProduct) || imagesForProduct.length === 0) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Images array is missing or empty.",
//       });
//     }

//     if (!Array.isArray(bannerImagesForProduct)) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Banner images must be an array.",
//       });
//     }

//     // Create new product object
//     let product = new ProductModel({
//       name,
//       description,
//       images: [...imagesForProduct],
//       isBannerVisible,
//       bannerImages: [...bannerImagesForProduct],
//       bannerTitleName,
//       brand,
//       price,
//       oldPrice,
//       categoryName,
//       categoryId,
//       subCategoryName,
//       subCategoryId,
//       thirdSubCategoryName,
//       thirdSubCategoryId,
//       category,
//       countInStock,
//       rating,
//       isFeatured,
//       discount,
//       productRam,
//       size,
//       productWeight,
//     });

//     // Save the product to the database
//     product = await product.save();

//     if (!product) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Product creation failed",
//       });
//     }

//     // Clear images array after product creation to avoid conflicts with subsequent uploads
//     if (productId) {
//       imagesArr[productId] = new Set();
//       bannerImagesArr[productId] = new Set();
//     } else {
//       imagesArr["new"] = new Set();
//       bannerImagesArr["new"] = new Set();
//     }

//     return response.status(200).json({
//       message: "Product created successfully.",
//       success: true,
//       error: false,
//       data: product,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || "Internal Server Error",
//       error: true,
//       success: false,
//     });
//   }
// }

// Create Product  
export async function createProduct(request, response) {
  try {
    const {
      name,
      description,
      isBannerVisible,
      bannerTitleName,
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

    // Validate and fetch product images
    const productId =
      request.body.productId && mongoose.Types.ObjectId.isValid(request.body.productId)
        ? new mongoose.Types.ObjectId(request.body.productId)
        : null;

    const imagesForProduct = productId ? imagesArr[productId] || [] : imagesArr["new"] || [];

    if (!Array.isArray(imagesForProduct) || imagesForProduct.length === 0) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Images array is missing or empty.",
      });
    }

    let bannerImagesForProduct = [];

    if (isBannerVisible) {
      if (!bannerTitleName || !Array.isArray(request.body.bannerImages) || request.body.bannerImages.length === 0) {
        return response.status(400).json({
          error: true,
          success: false,
          message: "Banner is enabled, but bannerTitleName or bannerImages are missing.",
        });
      }
      bannerImagesForProduct = productId ? bannerImagesArr[productId] || [] : bannerImagesArr["new"] || [];
    }

    // Create new product object
    let product = new ProductModel({
      name,
      description,
      images: [...imagesForProduct],
      isBannerVisible,
      bannerImages: [...bannerImagesForProduct],
      bannerTitleName: isBannerVisible ? bannerTitleName : "",
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
    if (productId) {
      imagesArr[productId] = new Set();
      bannerImagesArr[productId] = new Set();
    } else {
      imagesArr["new"] = new Set();
      bannerImagesArr["new"] = new Set();
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




// ----------------------------------------------------------------------------------------------------------------------------------

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



// export async function deleteProduct(request, response) {
//   try {
//     const productId = request.params.id;
//     const product = await ProductModel.findById(productId);

//     if (!product) {
//       return response.status(404).json({
//         message: "Product not found.",
//         success: false,
//         error: true,
//       });
//     }

//     let cloudinaryMessages = [];

//     for (let i = 0; i < product.images.length; i++) {
//       const imageUrl = product.images[i];
//       const publicId = extractPublicId(imageUrl);

//       if (!publicId) {
//         cloudinaryMessages.push(`Failed to extract public ID for image ${i + 1}.`);
//         continue;
//       }

//       // Add the folder path for Cloudinary deletion
//       const fullPublicId = `ecommerceApp/uploads/${publicId}`;
//       console.log(`Attempting to delete image with full public ID: ${fullPublicId}`);

//       // Delete image from Cloudinary and check the response
//       const result = await cloudinary.uploader.destroy(fullPublicId);

//       console.log('Cloudinary delete result:', result);  // Log the entire result

//       if (result.result === 'ok') {
//         cloudinaryMessages.push(`Image ${i + 1} deleted successfully from Cloudinary.`);
//       } else {
//         cloudinaryMessages.push(`Failed to delete image ${i + 1} from Cloudinary. Error: ${result.error ? result.error.message : 'Unknown error'}`);
//       }
//     }

//     let cloudinaryMessagesForBanner = [];

//     for (let i = 0; i < product.bannerImages.length; i++) {
//       const imageUrl = product.bannerImages[i];
//       const publicId = extractPublicId(imageUrl);

//       if (!publicId) {
//         cloudinaryMessages.push(`Failed to extract public ID for image ${i + 1}.`);
//         continue;
//       }

//       // Add the folder path for Cloudinary deletion
//       const fullPublicId = `ecommerceApp/uploads/${publicId}`;
//       console.log(`Attempting to delete image with full public ID: ${fullPublicId}`);

//       // Delete image from Cloudinary and check the response
//       const result = await cloudinary.uploader.destroy(fullPublicId);

//       console.log('Cloudinary delete result:', result);  // Log the entire result

//       if (result.result === 'ok') {
//         cloudinaryMessagesForBanner.push(`Image ${i + 1} deleted successfully from Cloudinary.`);
//       } else {
//         cloudinaryMessagesForBanner.push(`Failed to delete image ${i + 1} from Cloudinary. Error: ${result.error ? result.error.message : 'Unknown error'}`);
//       }
//     }

//     const deletedProduct = await ProductModel.findByIdAndDelete(productId);

//     if (!deletedProduct) {
//       return response.status(400).json({
//         message: "Product deletion failed.",
//         success: false,
//         error: true,
//       });
//     }

//     return response.status(200).json({
//       message: "Product and associated images deleted successfully.",
//       success: true,
//       error: false,
//       cloudinaryMessages: cloudinaryMessages,
//       cloudinaryMessagesForBanner: cloudinaryMessagesForBanner,
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       status: false,
//     });
//   }
// }



// // ----------------------------------------------------------------------------------------------------------------------

// // delete multiple products
// export async function deleteMultipleProduct(req, res) {
//   try {
//     const { ids } = req.query;

//     // Check if ids exist and are valid
//     if (!ids) {
//       return res.status(400).json({
//         message: "No product IDs provided.",
//         success: false,
//         error: true,
//       });
//     }

//     console.log("Received IDs:", ids);

//     // Convert comma-separated string to an array and trim spaces
//     const idArray = ids.split(',').map(id => id.trim());

//     // Validate the IDs
//     if (idArray.length === 0 || idArray.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//       return res.status(400).json({
//         message: "Invalid product IDs.",
//         success: false,
//         error: true,
//       });
//     }

//     // Fetch products before deletion
//     const products = await ProductModel.find({ _id: { $in: idArray } });

//     if (products.length === 0) {
//       return res.status(404).json({
//         message: "No products found with the given IDs.",
//         success: false,
//         error: true,
//       });
//     }

//     console.log(`Found ${products.length} products for deletion.`);

//     // Delete images from Cloudinary, handling individual image deletion errors
//     const imageDeletePromises = products.flatMap((product) =>
//       product.images.map(async (imgUrl) => {
//         try {
//           const imageName = imgUrl.split("/").pop().split(".")[0];
//           await cloudinary.uploader.destroy(`ecommerceApp/uploads/${imageName}`);
//           console.log(`Deleted image: ${imageName}`);
//         } catch (err) {
//           console.error(`Error deleting image ${imgUrl}:`, err);
//         }
//       })
//     );

//     // Delete images from Cloudinary, handling individual image deletion errors
//     const bannerImageDeletePromises = products.flatMap((product) =>
//       product.bannerImages.map(async (imgUrl) => {
//         try {
//           const imageName = imgUrl.split("/").pop().split(".")[0];
//           await cloudinary.uploader.destroy(`ecommerceApp/uploads/${imageName}`);
//           console.log(`Deleted banner image: ${imageName}`);
//         } catch (err) {
//           console.error(`Error deleting banner image ${imgUrl}:`, err);
//         }
//       })
//     );

//     // Wait for all image deletions to complete, continue even if some fail
//     await Promise.allSettled(imageDeletePromises);
//     // Wait for all image deletions to complete, continue even if some fail
//     await Promise.allSettled(bannerImageDeletePromises);

//     // Delete products from the database
//     await ProductModel.deleteMany({ _id: { $in: idArray } });

//     console.log("Products deleted successfully.");

//     return res.status(200).json({
//       message: "Product(s) deleted successfully.",
//       success: true,
//       error: false,
//     });

//   } catch (error) {
//     console.error("Error deleting products:", error);
//     return res.status(500).json({
//       message: "Internal Server Error.",
//       success: false,
//       error: true,
//     });
//   }
// }





// ----------------------------------------------------------------------------------------------------------------------

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

    // Function to delete images from Cloudinary
    async function deleteImages(images, type) {
      if (!images || images.length === 0) return [];
      
      return Promise.allSettled(
        images.map(async (imageUrl, index) => {
          const publicId = extractPublicId(imageUrl);
          if (!publicId) return `Failed to extract public ID for ${type} image ${index + 1}.`;

          console.log(`Deleting ${type} image: ${publicId}`);
          try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === "ok"
              ? `${type} Image ${index + 1} deleted successfully.`
              : `Failed to delete ${type} image ${index + 1}: ${result.error?.message || "Unknown error"}`;
          } catch (error) {
            return `Error deleting ${type} image ${index + 1}: ${error.message}`;
          }
        })
      );
    }

    // Delete product images and banner images
    const [productImageResults, bannerImageResults] = await Promise.all([
      deleteImages(product.images, "Product"),
      deleteImages(product.bannerImages, "Banner"),
    ]);

    // Delete the product from the database
    await ProductModel.findByIdAndDelete(productId);

    console.log(`Product ${productId} and its images deleted successfully.`);
    return response.status(200).json({
      message: "Product and associated images deleted successfully.",
      success: true,
      error: false,
      productImageResults,
      bannerImageResults,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------------------

export async function deleteMultipleProduct(req, res) {
  try {
    const { ids } = req.query;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        message: "No product IDs provided.",
        success: false,
        error: true,
      });
    }

    const idArray = Array.isArray(ids) ? ids : ids.split(",").map((id) => id.trim());

    if (idArray.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        message: "Invalid product IDs.",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ _id: { $in: idArray } });

    if (!products.length) {
      return res.status(404).json({
        message: "No products found with the given IDs.",
        success: false,
        error: true,
      });
    }

    console.log(`Found ${products.length} products for deletion.`);

    // Extract and delete images
    async function deleteImages(images, type) {
      if (!images || images.length === 0) return [];

      return Promise.allSettled(
        images.map(async (imageUrl, index) => {
          const publicId = extractPublicId(imageUrl);
          if (!publicId) return `Failed to extract public ID for ${type} image ${index + 1}.`;

          console.log(`Deleting ${type} image: ${publicId}`);

          try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === "ok"
              ? `${type} Image ${index + 1} deleted successfully.`
              : `Failed to delete ${type} image ${index + 1}: ${result.error?.message || "Unknown error"}`;
          } catch (error) {
            return `Error deleting ${type} image ${index + 1}: ${error.message}`;
          }
        })
      );
    }

    const deletionPromises = products.map(async (product) => {
      const [productImageMessages, bannerImageMessages] = await Promise.all([
        deleteImages(product.images, "Product"),
        deleteImages(product.bannerImages, "Banner"),
      ]);
      return [...productImageMessages, ...bannerImageMessages];
    });

    const cloudinaryMessages = (await Promise.all(deletionPromises)).flat();

    // Delete products from DB
    await ProductModel.deleteMany({ _id: { $in: idArray } });

    console.log("Products deleted successfully.");

    return res.status(200).json({
      message: "Products and associated images deleted successfully.",
      success: true,
      error: false,
      cloudinaryMessages,
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

// export async function removeImageProductFromCloudinary(request, response) {
//   try {
//     const { imgUrl, productId } = request.query;
//     console.log("Request received for product image deletion:", request.query);

//     if (!imgUrl) {
//       return response.status(400).json({ error: "Image URL is required" });
//     }

//     let imageRemoved = false;

//     if (productId) {
//       const product = await ProductModel.findById(productId);
//       if (!product) {
//         console.log(`Product with ID ${productId} not found.`);
//         return response.status(404).json({ error: "Product not found" });
//       }

//       // Remove image from product's image array
//       const updatedImages = product.images.filter(imageUrl => imageUrl.trim() !== imgUrl.trim());
//       if (updatedImages.length !== product.images.length) {
//         product.images = updatedImages;
//         await product.save();
//         imageRemoved = true;
//         console.log(`Image removed from product: ${productId}`);
//       }
//     }

//     if (imagesArr["new"] && imagesArr["new"].includes(imgUrl)) {
//       imagesArr["new"] = imagesArr["new"].filter(url => url.trim() !== imgUrl.trim());
//       console.log("Image removed from temporary storage.");
//       imageRemoved = true;
//     }

//     if (productId && imagesArr[productId]) {
//       if (imagesArr[productId].includes(imgUrl)) {
//         imagesArr[productId] = imagesArr[productId].filter(url => url.trim() !== imgUrl.trim());
//         console.log(`Image removed from in-memory storage for product: ${productId}`);
//         imageRemoved = true;
//       }
//     }

//     if (!imageRemoved) {
//       console.log("Image not found in database or temporary storage.");
//       return response.status(404).json({ error: "Image not found in database or memory" });
//     }

//     const publicId = extractPublicId(imgUrl);
//     if (!publicId) {
//       console.log("Invalid image URL format for Cloudinary deletion.");
//       return response.status(400).json({ error: "Invalid image URL format" });
//     }

//     console.log(`Deleting image from Cloudinary with public ID: ${publicId}`);
//     const result = await cloudinary.uploader.destroy(publicId);

//     if (result.result === "ok") {
//       console.log("Image successfully deleted from Cloudinary:", imgUrl);
//       return response.status(200).json({ message: "Image removed successfully from Cloudinary and product", success: true });
//     } else {
//       console.log("Cloudinary deletion failed:", result);
//       return response.status(500).json({ error: "Failed to delete image from Cloudinary" });
//     }
//   } catch (error) {
//     console.error("Error in removeImageProductFromCloudinary:", error);
//     return response.status(500).json({ message: "Failed to remove image", success: false, error: true });
//   }
// }


// ----------------------------------------------------------------------------------------------------------------------

export async function removeImageBannerFromCloudinary(request, response) {
  try {
    const { imgUrl, productId } = request.query;  // Expecting both imgUrl and productId in query
    console.log("Request Query:", request.query);  // Log the incoming request query

    // Validate input
    if (!imgUrl) {
      return response.status(400).json({ error: "Banner image URL is required" });
    }

    // Handle image removal logic for both new and existing products
    if (productId) {
      // If productId is provided, handle for editing an existing product
      const product = await ProductModel.findById(productId);

      if (!product) {
        return response.status(404).json({ error: "Product not found" });
      }

      // Remove the image from the product's bannerImages array
      const updatedBannerImages = product.bannerImages.filter(imageUrl => imageUrl.trim() !== imgUrl.trim());
      if (updatedBannerImages.length === product.bannerImages.length) {
        return response.status(404).json({ error: "Banner image not found in product images" });
      }

      // Update the product in the database
      product.bannerImages = updatedBannerImages;
      await product.save();

      // Also update the bannerImagesArr in-memory (or your state management) to reflect the changes
      if (bannerImagesArr[productId]) {
        bannerImagesArr[productId] = bannerImagesArr[productId].filter(url => url.trim() !== imgUrl.trim());
      }

      console.log("Banner image removed from product", productId);
    } else {
      // If no productId is provided, handle as new product
      if (bannerImagesArr["new"] && bannerImagesArr["new"].includes(imgUrl)) {
        const index = bannerImagesArr["new"].indexOf(imgUrl);
        bannerImagesArr["new"].splice(index, 1);  // Remove from the global new set
        console.log("Banner image removed from global set");
      } else {
        return response.status(404).json({ error: "Banner image URL not found in global images" });
      }
    }

    // Extract the public ID from the imgUrl for Cloudinary deletion
    const publicId = extractPublicId(imgUrl);
    if (!publicId) {
      return response.status(400).json({
        message: "Invalid banner image URL format",
        success: false,
        error: true,
      });
    }

    console.log("Deleting banner image with public ID:", publicId);

    // Attempt to delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log("Banner image successfully deleted from Cloudinary:", imgUrl);
      return response.status(200).json({
        message: "Banner image removed successfully from Cloudinary and product",
        success: true,
      });
    }

    // If the Cloudinary deletion result is not 'ok'
    return response.status(404).json({
      message: "Banner image not found in Cloudinary",
      success: false,
      error: true,
    });
  } catch (error) {
    console.error("Error in removeImageBannerFromCloudinary:", error);
    return response.status(500).json({
      message: "Failed to remove banner image",
      success: false,
      error: true,
    });
  }
}


// export async function removeImageBannerFromCloudinary(request, response) {
//   try {
//     const { imgUrl, productId } = request.query;
//     console.log("Received request to remove banner image:", request.query);

//     if (!imgUrl) {
//       return response.status(400).json({ error: "Banner image URL is required" });
//     }

//     let imageRemoved = false;

//     // If productId is provided, remove from existing product
//     if (productId) {
//       const product = await ProductModel.findById(productId);
//       if (!product) {
//         console.log(`Product with ID ${productId} not found.`);
//         return response.status(404).json({ error: "Product not found" });
//       }

//       // Remove from product's bannerImages array
//       const updatedBannerImages = product.bannerImages.filter(imageUrl => imageUrl.trim() !== imgUrl.trim());
//       if (updatedBannerImages.length !== product.bannerImages.length) {
//         product.bannerImages = updatedBannerImages;
//         await product.save();
//         imageRemoved = true;
//         console.log(`Banner image removed from product in DB: ${productId}`);
//       }
//     }

//     // Remove from in-memory storage
//     if (bannerImagesArr["new"] && bannerImagesArr["new"].includes(imgUrl)) {
//       bannerImagesArr["new"] = bannerImagesArr["new"].filter(url => url.trim() !== imgUrl.trim());
//       console.log("Banner image removed from temporary storage.");
//       imageRemoved = true;
//     }

//     if (productId && bannerImagesArr[productId]) {
//       if (bannerImagesArr[productId].includes(imgUrl)) {
//         bannerImagesArr[productId] = bannerImagesArr[productId].filter(url => url.trim() !== imgUrl.trim());
//         console.log(`Banner image removed from in-memory storage for product: ${productId}`);
//         imageRemoved = true;
//       }
//     }

//     if (!imageRemoved) {
//       console.log("Banner image not found in DB or memory.");
//       return response.status(404).json({ error: "Banner image not found in database or memory" });
//     }

//     // Extract Public ID from Cloudinary URL
//     const publicId = extractPublicId(imgUrl);
//     if (!publicId) {
//       console.log("Invalid banner image URL format.");
//       return response.status(400).json({
//         message: "Invalid banner image URL format",
//         success: false,
//         error: true,
//       });
//     }

//     console.log(`Deleting banner image from Cloudinary. Public ID: ${publicId}`);
    
//     // Delete from Cloudinary
//     const result = await cloudinary.uploader.destroy(publicId);
//     console.log("Cloudinary Response:", result);

//     if (result.result === "ok" || result.result === "deleted") {
//       console.log("Banner image successfully deleted from Cloudinary:", imgUrl);
//       return response.status(200).json({
//         message: "Banner image removed successfully from Cloudinary and product",
//         success: true,
//       });
//     }

//     return response.status(500).json({
//       message: "Failed to remove banner image from Cloudinary",
//       success: false,
//       error: true,
//     });
//   } catch (error) {
//     console.error("Error in removeImageBannerFromCloudinary:", error);
//     return response.status(500).json({
//       message: "Failed to remove banner image",
//       success: false,
//       error: true,
//     });
//   }
// }








// ----------------------------------------------------------------------------------------------------------------------

// Function to parse RAM size into GB for sorting
const parseRamSize = (ramSize) => {
  const sizeValue = parseInt(ramSize);
  if (ramSize.includes("TB")) {
    return sizeValue * 1024; // Convert TB to GB
  } else if (ramSize.includes("GB")) {
    return sizeValue; // In GB
  } else if (ramSize.includes("MB")) {
    return sizeValue / 1024; // Convert MB to GB
  }
  return 0; // Default case if no match
};

// Function to get valid RAMs dynamically from DB and sort from small to large
const getValidProductRams = async () => {
  try {
    const res = await ProductRamsModel.find().select("name"); // Fetch only RAM names

    if (res.length === 0) {
      console.log("No product RAMs found.");
      return [];
    }

    // Extract RAM names from the database response
    const validProductRams = res.map((ram) => ram.name);

    // Sort RAM sizes from small to large by numerical value
    const sortedValidProductRams = validProductRams.sort((a, b) => parseRamSize(a) - parseRamSize(b));

    return sortedValidProductRams;

  } catch (error) {
    console.error("Error fetching product RAMs:", error);
    return []; // Return empty array if there's an error
  }
};



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

    let newImages = request.body.images || [];
    let newBannerImages = request.body.bannerImages || [];
    let cloudinaryMessages = [];
    let validNewImages = [];
    let validNewBannerImages = [];

    // ✅ Validate new images exist in Cloudinary
    for (let newImageUrl of newImages) {
      const publicId = extractPublicId(newImageUrl);
      if (publicId) {
        try {
          const result = await cloudinary.api.resource(publicId);
          if (result) validNewImages.push(newImageUrl);
          else cloudinaryMessages.push(`Image does not exist in Cloudinary: ${newImageUrl}`);
        } catch (error) {
          cloudinaryMessages.push(`Error checking image in Cloudinary: ${newImageUrl}`);
        }
      }
    }

    // ✅ Validate new banner images exist in Cloudinary
    for (let newBannerUrl of newBannerImages) {
      const publicId = extractPublicId(newBannerUrl);
      if (publicId) {
        try {
          const result = await cloudinary.api.resource(publicId);
          if (result) validNewBannerImages.push(newBannerUrl);
          else cloudinaryMessages.push(`Banner image does not exist in Cloudinary: ${newBannerUrl}`);
        } catch (error) {
          cloudinaryMessages.push(`Error checking banner image in Cloudinary: ${newBannerUrl}`);
        }
      }
    }

    // ✅ Preserve existing images if new images are not provided
    product.images = validNewImages.length > 0 ? validNewImages : product.images;

    // ✅ Handle `isBannerVisible` toggle without deleting banner data
    if (request.body.isBannerVisible !== undefined) {
      product.isBannerVisible = request.body.isBannerVisible;
    }

    // ✅ Only update banner title & images if new values are provided
    if (request.body.isBannerVisible) {
      if (!request.body.bannerTitleName || request.body.bannerTitleName.trim() === "") {
        return response.status(400).json({
          error: true,
          success: false,
          message: "Banner is enabled but missing title.",
        });
      }
      if (!Array.isArray(validNewBannerImages) || validNewBannerImages.length === 0) {
        // If banner images are missing, but existing ones are present, keep them
        if (product.bannerImages.length > 0) {
          validNewBannerImages = product.bannerImages;
        } else {
          return response.status(400).json({
            error: true,
            success: false,
            message: "Banner is enabled but no valid banner images provided.",
          });
        }
      }
      product.bannerTitleName = request.body.bannerTitleName;
      product.bannerImages = validNewBannerImages;
    }

    // ✅ Fetch valid RAMs dynamically
    const validProductRams = await getValidProductRams();
    const filteredProductRams = (request.body.productRam || [])
      .filter(ram => validProductRams.includes(ram))
      .sort((a, b) => parseRamSize(a) - parseRamSize(b));

    // ✅ Fetch and sort valid weights dynamically
    const validWeights = await ProductWeightModel.find({});
    const weightOrder = validWeights.reduce((acc, weight, index) => {
      acc[weight.name] = index + 1;
      return acc;
    }, {});

    const parseWeightToGrams = weight => (weight.includes('kg') ? parseFloat(weight) * 1000 : parseFloat(weight));
    const sortedWeights = (request.body.productWeight || [])
      .filter(weight => weightOrder[weight])
      .sort((a, b) => parseWeightToGrams(a) - parseWeightToGrams(b));

    // ✅ Fetch and sort valid sizes dynamically
    const predefinedSizeOrder = ["S", "M", "L", "XL", "XXL", "XXXL"];
    const validSizesFromDB = await ProductSizeModel.find({});
    const validSizeNames = validSizesFromDB.map(size => size.name);
    const filteredSizes = (request.body.size || []).filter(size => validSizeNames.includes(size));
    const sortedSizes = filteredSizes.sort((a, b) => predefinedSizeOrder.indexOf(a) - predefinedSizeOrder.indexOf(b));

    // ✅ Update product in the database
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        ...request.body,
        images: product.images,
        bannerImages: product.bannerImages,
        productRam: filteredProductRams,
        productWeight: sortedWeights,
        size: sortedSizes,
        isBannerVisible: product.isBannerVisible,
        bannerTitleName: product.bannerTitleName,
      },
      { new: true }
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
      name: request.body.name,
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
      name: request.body.name,
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
    const productWeight = await ProductWeightModel.findById(id);

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




// ===========================================================================================================================
// ===========================================================================================================================

// Product Size


// Create productSize
export async function createProductSize(request, response) {
  try {
    // Create new productSize
    let productSize = new ProductSizeModel({
      name: request.body.name,
    });

    // Save the product to the database
    productSize = await productSize.save();

    if (!productSize) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product Size creation failed",
      });
    }

    return response.status(200).json({
      message: "Product Size created successfully.",
      success: true,
      error: false,
      data: productSize,
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

export async function getAllProductSize(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000; // Use 10 as default limit
    const totalPosts = await ProductSizeModel.countDocuments();

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No product size found",
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

    const productSize = await ProductSizeModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      message: "Product size retrieved successfully",
      error: false,
      success: true,
      data: productSize,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getting all product size: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during getting all product size.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// get product weight by id
export async function getProductSizeById(request, response) {
  try {
    const { id } = request.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid productSize ID",
        error: true,
        success: false,
      });
    }

    // Fetch the productSize by ID
    const productSize = await ProductSizeModel.findById(id);

    if (!productSize) {
      return response.status(404).json({
        message: "Product Size not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Product Size retrieved successfully",
      error: false,
      success: true,
      data: productSize,
    });
  } catch (error) {
    console.error("Error in getting product size:", error);
    return response.status(500).json({
      message: error.message || "An error occurred while retrieving the product size.",
      error: true,
      success: false,
    });
  }
}



// ---------------------------------------------------------------------------------------------------------------------

export async function deleteProductSize(request, response) {
  try {
    const productSizeId = request.params.id;
    const productSize = await ProductSizeModel.findById(productSizeId);

    if (!productSize) {
      return response.status(404).json({
        message: "Product Size not found.",
        success: false,
        error: true,
      });
    }

    const deletedProductSize = await ProductSizeModel.findByIdAndDelete(productSizeId);

    if (!deletedProductSize) {
      return response.status(400).json({
        message: "Product Size deletion failed.",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      message: "Product Size deleted successfully.",
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
export async function deleteMultipleProductSize(req, res) {
  try {
    const { ids } = req.query;

    // Check if ids exist and are valid
    if (!ids) {
      return res.status(400).json({
        message: "No product size IDs provided.",
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
        message: "Invalid product size IDs.",
        success: false,
        error: true,
      });
    }

    // Fetch productRams before deletion
    const productSize = await ProductSizeModel.find({ _id: { $in: idArray } });

    if (productSize.length === 0) {
      return res.status(404).json({
        message: "No product size found with the provided IDs.",
        success: false,
        error: true,
      });
    }

    console.log(`Found ${productSize.length} productSize for deletion.`);

    // Delete products from the database
    await ProductSizeModel.deleteMany({ _id: { $in: idArray } });

    console.log("Product size(s) deleted successfully.");

    return res.status(200).json({
      message: "Product size(s) deleted successfully.",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error deleting product size:", error);
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false,
      error: true,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

export async function updateProductSize(request, response) {
  try {
    const productSizeId = request.params.id;
    const productSize = await ProductSizeModel.findById(productSizeId);

    if (!productSize) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Product size not found!",
      });
    }

    // Update the product details in the database
    const updatedProductSize = await ProductSizeModel.findByIdAndUpdate(
      productSizeId,
      {
        name: request.body.name,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProductSize) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product size update failed!",
      });
    }

    return response.status(200).json({
      message: "Product size updated successfully!",
      success: true,
      data: updatedProductSize,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "An error occurred during product size update.",
      success: false,
      error: error.message || error,
    });
  }
}


// ----------------------------------------------------------------------------------------------------------------------

export async function filters(request, response) {
  const {categoryId, subCategoryId, thirdSubCategoryId, minPrice, maxPrice, size, rating, page, limit} = request.body;

  const filters = {}

  if(categoryId?.length){
    filters.categoryId = {$in: categoryId};
  }
  if(subCategoryId?.length){
    filters.subCategoryId = {$in: subCategoryId};
  }
  if(thirdSubCategoryId?.length){
    filters.thirdSubCategoryId = {$in: thirdSubCategoryId};
  }

  if(minPrice || maxPrice){
    filters.price = {$gte: +minPrice || 0, $lte: +maxPrice || Infinity};
  }
  
  if (rating?.length) {
    filters.rating = { $gte: Math.min(...rating) }; // Use lowest selected rating
}

  


  try{

    const products = await ProductModel.find(filters).populate("category").skip((page - 1) * limit).limit(parseInt(limit));
    const total = await ProductModel.countDocuments(filters);
    
    return response.status(200).json({
      message: "Products filtered successfully!",
      error: false,
      success: true,
      data: products,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      });

  }catch(error){
    return response.status(500).json({
      message: error.message || "An error occurred during product filtering.",
      error: true,
      success: false,
    })
  }
}

