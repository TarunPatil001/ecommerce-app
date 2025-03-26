import { v2 as cloudinary } from "cloudinary";
import fs from 'fs/promises';
import ProductModel from "../models/product.model.js";
import { mongoose } from 'mongoose';
import ProductRamsModel from "../models/productRams.model.js";
import ProductWeightModel from "../models/productWeight.model.js";
import ProductSizeModel from "../models/productSize.model.js";
import UserModel from "../models/user.model.js";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});


// =========================================================================================================================

// Product

// Upload images to Cloudinary
// 🔹 Helper function to upload images (Stores per User ID)
async function uploadImagesToCloudinary(files) {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("Invalid or empty file array received");
    }

    console.log("🚀 Uploading images to Cloudinary");

    // Use a general folder for all uploads (you can customize it as needed)
    const folderPath = `ecommerceApp/product_images`;

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        try {
          console.log(`📤 Uploading file: ${file.originalname} to ${folderPath}`);
          const result = await cloudinary.uploader.upload(file.path, {
            folder: folderPath,
            use_filename: true,
            unique_filename: false,
            overwrite: false,
          });

          console.log("✅ Upload successful:", result.secure_url);

          // ✅ Ensure correct use of `fs.unlink` to avoid errors
          await fs.unlink(file.path).catch((err) => {
            console.error(`❌ Error deleting local file ${file.path}:`, err);
          });

          return result.secure_url;
        } catch (error) {
          console.error(`❌ Cloudinary upload error for ${file.originalname}:`, error);
          return null; // Return null for failed uploads
        }
      })
    );

    // ✅ Filter out failed uploads before checking length
    const validUploads = uploadedImages.filter((img) => img !== null);
    console.log("✅ Successfully uploaded images:", validUploads);

    if (validUploads.length === 0) {
      throw new Error("All image uploads failed");
    }

    return validUploads;
  } catch (error) {
    console.error("❌ Image upload function error:", error);
    return [];
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// Create Product Function
export async function createProduct(req, res) {
  try {
    console.log("📥 Incoming request:", req.body);
    console.log("📂 Uploaded Files:", req.files);

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
      seller,
    } = req.body;

    // ✅ Validate required fields
    if (!name || !description || !brand || !price || !categoryId || !subCategoryId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Missing required fields. Please provide all necessary product details.",
      });
    }

    console.log("🛒 Received sellerId:", seller);

    // ✅ Validate sellerId
    if (!seller || !mongoose.Types.ObjectId.isValid(seller)) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Invalid or missing seller ID.",
      });
    }

    // ✅ Fetch seller details from DB
    const sellerData = await UserModel.findById(seller).select("sellerName").lean();
    if (!sellerData) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Seller not found.",
      });
    }

    console.log("✅ Seller found:", sellerData.sellerName);

    // ✅ Separate product images and banner images
    const images = req.files?.images || [];  // Use uploaded product images
    const bannerImages = req.files?.bannerImages || []; // Use uploaded banner images

    if (!images.length) {
      return res.status(400).json({ error: "At least one product image is required." });
    }

    // ✅ Upload images to Cloudinary
    const uploadedImageUrls = await uploadImagesToCloudinary(images);
    console.log("📸 Uploaded product image URLs:", uploadedImageUrls);

    if (!uploadedImageUrls.length) {
      return res.status(500).json({ error: "Product image upload failed." });
    }

    let uploadedBannerImageUrls = [];

    if (isBannerVisible === "true" && bannerImages.length > 0) {
      uploadedBannerImageUrls = await uploadImagesToCloudinary(bannerImages);
      console.log("📸 Uploaded banner image URLs:", uploadedBannerImageUrls);

      if (!uploadedBannerImageUrls.length) {
        return res.status(500).json({ error: "Banner image upload failed." });
      }
    }

    // ✅ Create new product object
    let product = new ProductModel({
      name,
      description,
      images: uploadedImageUrls,
      isBannerVisible,
      bannerImages: uploadedBannerImageUrls,
      bannerTitleName: isBannerVisible === "true" ? bannerTitleName : "",
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
      seller: {
        sellerId: seller,
        sellerName: sellerData.sellerName,
      },
    });

    // ✅ Save the product to the database
    product = await product.save();

    if (!product) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Product creation failed.",
      });
    }

    return res.status(201).json({
      message: "✅ Product created successfully.",
      success: true,
      error: false,
      data: {
        ...product._doc,
        sellerName: sellerData.sellerName || "Unknown Seller",
      },
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return res.status(500).json({
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
      .populate("category") // Populating category details
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

export async function getTotalSales(request, response) {
  try {
    // Calculate the total sales by summing the 'sale' field from all products
    const totalSales = await ProductModel.aggregate([
      {
        $group: {
          _id: null,  // We don't care about grouping, we just want the total
          totalSales: { $sum: "$sale" },  // Sum the 'sale' field
        },
      },
    ]);

    // If no sales found, set totalSales to 0
    const totalSalesAmount = totalSales.length > 0 ? totalSales[0].totalSales : 0;

    // Respond with the total sales amount
    response.status(200).json({
      success: true,
      error: false,
      totalSales: totalSalesAmount,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Error calculating total sales",
    });
  }
}


// ----------------------------------------------------------------------------------------------------------------------

// function extractPublicId(imageUrl) {
//   // Regex to match the Cloudinary URL and extract public ID
//   const regex = /https:\/\/res\.cloudinary\.com\/.*\/(ecommerceApp\/uploads\/.*)\.[a-zA-Z0-9]+$/;
//   const match = imageUrl.match(regex);

//   if (match && match[1]) {
//     // Return the full public ID (including folder path)
//     return match[1];
//   }

//   return null;
// }


// function extractPublicId(imageUrl) {
//   const regex = /\/upload\/(?:v\d+\/)?(ecommerceApp\/uploads\/[^.]+)\.[a-zA-Z0-9]+$/;
//   const match = imageUrl.match(regex);
//   return match ? match[1] : null;
// }

// function extractPublicId(imageUrl) {
//   // Updated regex to properly extract the public ID from Cloudinary URLs
//   const regex = /\/upload\/(?:v\d+\/)?([^/.]+)\.[a-zA-Z0-9]+$/;
//   const match = imageUrl.match(regex);
//   return match ? match[1] : null;
// }

const extractPublicId = (url) => {
  try {
    if (!url.includes("res.cloudinary.com")) return null;
    const parts = url.split("/");
    const filename = parts.pop().split(".")[0]; // Get filename without extension
    const folderIndex = parts.indexOf("ecommerceApp"); // Find "ecommerceApp" folder
    if (folderIndex !== -1) {
      return `${parts.slice(folderIndex).join("/")}/${filename}`;
    }
    return filename;
  } catch (error) {
    console.error("❌ Error extracting public ID:", error);
    return null;
  }
};


const deleteCloudinaryImages = async (imageUrls) => {
  const cloudinaryImages = imageUrls.filter(url => url.startsWith("https://res.cloudinary.com"));
  if (cloudinaryImages.length === 0) return;

  await Promise.all(
    cloudinaryImages.map(async (url) => {
      try {
        const publicId = extractPublicId(url);
        if (publicId) {
          const result = await cloudinary.uploader.destroy(publicId);
          if (result.result === "ok") {
            console.log(`Successfully deleted from Cloudinary: ${publicId}`);
          } else {
            console.error(`Failed to delete from Cloudinary: ${publicId}`);
          }
        } else {
          console.error(`Invalid public ID for URL: ${url}`);
        }
      } catch (error) {
        console.error(`Error deleting image from Cloudinary: ${url}`, error);
      }
    })
  );
};


// ----------------------------------------------------------------------------------------------------------------------

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

//     // Function to delete images from Cloudinary
//     async function deleteImages(images, type) {
//       if (!images || images.length === 0) return [];

//       return Promise.allSettled(
//         images.map(async (imageUrl, index) => {
//           const publicId = extractPublicId(imageUrl);
//           if (!publicId) return `Failed to extract public ID for ${type} image ${index + 1}.`;

//           console.log(`Deleting ${type} image: ${publicId}`);
//           try {
//             const result = await cloudinary.uploader.destroy(publicId);
//             return result.result === "ok"
//               ? `${type} Image ${index + 1} deleted successfully.`
//               : `Failed to delete ${type} image ${index + 1}: ${result.error?.message || "Unknown error"}`;
//           } catch (error) {
//             return `Error deleting ${type} image ${index + 1}: ${error.message}`;
//           }
//         })
//       );
//     }

//     // Delete product images and banner images
//     const [productImageResults, bannerImageResults] = await Promise.all([
//       deleteImages(product.images, "Product"),
//       deleteImages(product.bannerImages, "Banner"),
//     ]);

//     // Delete the product from the database
//     await ProductModel.findByIdAndDelete(productId);

//     console.log(`Product ${productId} and its images deleted successfully.`);
//     return response.status(200).json({
//       message: "Product and associated images deleted successfully.",
//       success: true,
//       error: false,
//       productImageResults,
//       bannerImageResults,
//     });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return response.status(500).json({
//       message: error.message || "Internal Server Error",
//       error: true,
//       success: false,
//     });
//   }
// }

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

    // Delete product and banner images from Cloudinary
    await deleteCloudinaryImages([...product.images, ...product.bannerImages]);

    // Delete the product from the database
    await ProductModel.findByIdAndDelete(productId);

    console.log(`Product ${productId} and its images deleted successfully.`);
    return response.status(200).json({
      message: "Product and associated images deleted successfully.",
      success: true,
      error: false,
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

    // Extract and delete images using helper function
    const allImages = products.flatMap(product => [...product.images, ...product.bannerImages]);
    await deleteCloudinaryImages(allImages);

    // Delete products from DB
    await ProductModel.deleteMany({ _id: { $in: idArray } });

    console.log("Products deleted successfully.");

    return res.status(200).json({
      message: "Products and associated images deleted successfully.",
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

// Function to update product
export async function updateProduct(request, response) {
  try {
    const productId = request.params.id;
    const product = await ProductModel.findById(productId).populate("seller").lean();

    if (!product) {
      return response.status(404).json({ error: true, success: false, message: "Product not found!" });
    }

    let { seller, images, bannerImages, removedFiles, removedBannerFiles, bannerTitleName, isBannerVisible } = request.body;

    console.log("Incoming request body:", request.body); // Log incoming request body

    // Parse and validate the seller object
    if (seller) {
      if (typeof seller === "string") {
        // If seller is a string, parse it directly
        try {
          seller = JSON.parse(seller);
        } catch (err) {
          console.error("Error parsing seller:", err);
          seller = null;
        }
      } else if (Array.isArray(seller)) {
        // If seller is an array, find the valid JSON string
        const validSellerString = seller.find((item) => {
          try {
            JSON.parse(item); // Check if the item is a valid JSON string
            return true;
          } catch (e) {
            return false;
          }
        });

        if (validSellerString) {
          try {
            seller = JSON.parse(validSellerString); // Parse the valid JSON string
          } catch (err) {
            console.error("Error parsing valid seller string:", err);
            seller = null;
          }
        } else {
          console.error("No valid seller JSON string found in the array:", seller);
          seller = null;
        }
      } else if (typeof seller === "object") {
        // If seller is already an object, use it directly
        console.log("Seller is already an object:", seller);
      } else {
        console.error("Invalid seller format:", seller);
        seller = null;
      }
    } else {
      console.error("Seller is missing or null.");
      seller = null;
    }

    // If seller is still invalid, delete the previous seller data
    if (!seller || typeof seller !== "object" || !seller.sellerId || !seller.sellerName) {
      console.log("Invalid seller data. Deleting previous seller data.");
      seller = {
        sellerId: product.seller?.sellerId || null,
        sellerName: product.seller?.sellerName || null,
      };
    }

    console.log("Parsed seller object:", seller); // Log the parsed seller object

    // Rest of the code remains the same...
    isBannerVisible = isBannerVisible === "true";
    console.log("isBannerVisible:", isBannerVisible); // Log the banner visibility status

    // ✅ Ensure `removedFiles` and `removedBannerFiles` are parsed correctly and only contain valid Cloudinary URLs
    if (removedFiles && typeof removedFiles === "string") {
      try {
        removedFiles = JSON.parse(removedFiles);
        if (!Array.isArray(removedFiles)) {
          removedFiles = [];
        }
        removedFiles = removedFiles.filter((file) => typeof file === "string" && file.startsWith("https://res.cloudinary.com"));
      } catch (err) {
        console.error("Error parsing removedFiles:", err);
        removedFiles = [];
      }
    } else if (!Array.isArray(removedFiles)) {
      removedFiles = [];
    }

    if (removedBannerFiles && typeof removedBannerFiles === "string") {
      try {
        removedBannerFiles = JSON.parse(removedBannerFiles);
        if (!Array.isArray(removedBannerFiles)) {
          removedBannerFiles = [];
        }
        removedBannerFiles = removedBannerFiles.filter((file) => typeof file === "string" && file.startsWith("https://res.cloudinary.com"));
      } catch (err) {
        console.error("Error parsing removedBannerFiles:", err);
        removedBannerFiles = [];
      }
    } else if (!Array.isArray(removedBannerFiles)) {
      removedBannerFiles = [];
    }

    console.log("removedFiles after parsing:", removedFiles); // Log the parsed removed files
    console.log("removedBannerFiles after parsing:", removedBannerFiles); // Log the parsed removed banner files

    // ✅ Ensure `images` and `bannerImages` are parsed correctly
    try {
      images = Array.isArray(images) ? images : images ? JSON.parse(images) : product.images || [];
      bannerImages = Array.isArray(bannerImages) ? bannerImages : bannerImages ? JSON.parse(bannerImages) : product.bannerImages || [];
    } catch (err) {
      console.error("Error parsing images or bannerImages:", err);
      images = product.images || [];
      bannerImages = product.bannerImages || [];
    }

    console.log("images after parsing:", images); // Log the parsed images
    console.log("bannerImages after parsing:", bannerImages); // Log the parsed banner images

    // ✅ Upload new images if provided
    const newImages = request.files?.newProductImages ? await uploadImagesToCloudinary(request.files.newProductImages) : [];
    const newBannerImages = request.files?.newBannerImages ? await uploadImagesToCloudinary(request.files.newBannerImages) : [];

    console.log("newImages uploaded:", newImages); // Log new images uploaded
    console.log("newBannerImages uploaded:", newBannerImages); // Log new banner images uploaded

    // ✅ Remove only Cloudinary product images
    await deleteCloudinaryImages(removedFiles);
    images = images.filter((img) => !removedFiles.includes(img));

    console.log("images after removal:", images); // Log images after removal of Cloudinary images

    // ✅ Remove only Cloudinary banner images
    await deleteCloudinaryImages(removedBannerFiles);
    bannerImages = bannerImages.filter((img) => !removedBannerFiles.includes(img));

    console.log("bannerImages after removal:", bannerImages); // Log banner images after removal

    // ✅ Append new images and banners in the pattern you provided
    const updatedImages = [...images, ...newImages];
    let updatedBannerImages = [...bannerImages, ...newBannerImages];

    console.log("updatedImages:", updatedImages); // Log the updated images
    console.log("updatedBannerImages:", updatedBannerImages); // Log the updated banner images

    // ✅ Handle banner logic based on `isBannerVisible`
    if (!isBannerVisible) {
      // Do not delete bannerTitleName or updatedBannerImages
      // Just set isBannerVisible to false
      isBannerVisible = false;
    } else {
      // If isBannerVisible is true, ensure bannerTitleName and updatedBannerImages are valid
      if (!bannerTitleName?.trim()) {
        console.log("Banner title is missing!");
        return response.status(400).json({
          error: true,
          success: false,
          message: "Banner is enabled but missing title.",
        });
      }

      if (updatedBannerImages.length === 0) {
        console.log("No valid banner images provided!");
        return response.status(400).json({
          error: true,
          success: false,
          message: "Banner is enabled but no valid banner images provided.",
        });
      }
    }

    // ✅ Filter and sort product RAM
    const validProductRams = await getValidProductRams();
    const filteredProductRams = (request.body.productRam || [])
      .filter((ram) => validProductRams.includes(ram))
      .sort((a, b) => parseRamSize(a) - parseRamSize(b));

    // ✅ Filter and sort product weight
    const validWeights = await ProductWeightModel.find({});
    const weightOrder = validWeights.reduce((acc, weight, index) => ({ ...acc, [weight.name]: index + 1 }), {});
    const parseWeightToGrams = (weight) => (weight.includes("kg") ? parseFloat(weight) * 1000 : parseFloat(weight));
    const sortedWeights = (request.body.productWeight || [])
      .filter((weight) => weightOrder[weight])
      .sort((a, b) => parseWeightToGrams(a) - parseWeightToGrams(b));

    // ✅ Filter and sort product sizes
    const predefinedSizeOrder = ["S", "M", "L", "XL", "XXL", "XXXL"];
    const validSizesFromDB = await ProductSizeModel.find({});
    const validSizeNames = validSizesFromDB.map((size) => size.name);
    const sortedSizes = (request.body.size || [])
      .filter((size) => validSizeNames.includes(size))
      .sort((a, b) => predefinedSizeOrder.indexOf(a) - predefinedSizeOrder.indexOf(b));

    // ✅ Update product in DB
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        ...request.body,
        images: updatedImages,
        bannerImages: updatedBannerImages,
        productRam: filteredProductRams,
        productWeight: sortedWeights,
        size: sortedSizes,
        isBannerVisible: isBannerVisible,
        bannerTitleName: bannerTitleName,
        seller: seller, // Use the formatted seller object
      },
      { new: true }
    ).populate("seller", "sellerName contact");

    if (!updatedProduct) {
      return response.status(400).json({ error: true, success: false, message: "Product update failed!" });
    }

    return response.status(200).json({
      message: "Product updated successfully.",
      success: true,
      product: updatedProduct,
      seller: updatedProduct.seller, // Use the formatted seller object
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return response.status(500).json({ message: error.message || "An error occurred during product update.", success: false, error });
  }
}


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


// ----------------------------------------------------------------------------------------------------------------------


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

    const imagesToDelete = cloudinaryImages.resources
      .map((img) => img.secure_url)
      .filter((imgUrl) => !linkedImages.has(imgUrl));

    console.log("Images to delete:", imagesToDelete);

    await deleteCloudinaryImages(imagesToDelete);

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
  const { categoryId, subCategoryId, thirdSubCategoryId, minPrice, maxPrice, size, rating, page, limit } = request.body;

  const filters = {}

  if (categoryId?.length) {
    filters.categoryId = { $in: categoryId };
  }
  if (subCategoryId?.length) {
    filters.subCategoryId = { $in: subCategoryId };
  }
  if (thirdSubCategoryId?.length) {
    filters.thirdSubCategoryId = { $in: thirdSubCategoryId };
  }

  if (minPrice || maxPrice) {
    filters.price = { $gte: +minPrice || 0, $lte: +maxPrice || Infinity };
  }

  if (rating?.length) {
    filters.rating = { $gte: Math.min(...rating) }; // Use lowest selected rating
  }

  try {

    const products = await ProductModel.find(filters).populate("category").skip((page - 1) * limit).limit(parseInt(limit));
    const total = await ProductModel.countDocuments(filters);

    return response.status(200).json({
      message: "Products filtered successfully!",
      error: false,
      success: true,
      data: products,
      total: total,
      limit: limit,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "An error occurred during product filtering.",
      error: true,
      success: false,
    })
  }
}


// // Utility function to sort products
// const sortItems = ({ data: products }, sortBy = "name", order = "asc") => {
//   // Create a copy of the array to avoid mutating the original
//   return products.slice().sort((a, b) => {
//     if (sortBy === "name") {
//       return order === "asc"
//         ? a.name.localeCompare(b.name)
//         : b.name.localeCompare(a.name);
//     }

//     if (sortBy === "price") {
//       return order === "asc" ? a.price - b.price : b.price - a.price;
//     }

//     if (sortBy === "rating") {
//       return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
//     }

//     return 0; // Default case: no sorting
//   });
// };

// API endpoint to handle sorting
export async function sortBy(request, response) {
  try {
    const { data: products, sortBy, order } = request.body;

    if (!Array.isArray(products)) {
      return response.status(400).json({
        message: "Invalid input: 'data' must be an array of products.",
        error: true,
        success: false,
      });
    }

    const sortedItems = sortItems({ data: products }, sortBy, order);

    return response.status(200).json({
      message: "Products sorted successfully!",
      error: false,
      success: true,
      data: sortedItems,
      page: 0,
      totalPages: 0,
    });
  } catch (error) {
    console.error("Error sorting products:", error);
    return response.status(500).json({
      message: "An error occurred while sorting products.",
      error: true,
      success: false,
    });
  }
}



// Enhanced utility function to sort products with price range support
const sortItems = ({ data: products }, sortBy = "relevance", order = "asc", priceRange = null) => {
  let filteredProducts = products.slice();
  
  // Apply price range filter if specified
  if (priceRange) {
    filteredProducts = filteredProducts.filter(product => {
      return product.price <= priceRange;
    });
  }

  // Apply sorting
  return filteredProducts.sort((a, b) => {
    if (sortBy === "relevance") {
      // Maintain original order if relevance is selected
      return 0;
    }
    if (sortBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortBy === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    }
    if (sortBy === "rating") {
      return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
    }
    return 0;
  });
};

// export async function searchProductController(request, response) {
//   try {
//     const { query, page, limit, sortBy, category } = request.body;

//     if (!query) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Query is required.",
//       });
//     }

//     const pageNumber = parseInt(page) || 1;
//     const limitNumber = parseInt(limit) || 30;
//     const sortOption = sortBy || 'relevance';

//     // Extract price range from query (e.g., "mobiles under 5000")
//     let priceRange = null;
//     const priceRangeMatch = query.match(/(under|below|less than)\s*(\d+)/i);
//     if (priceRangeMatch) {
//       priceRange = parseInt(priceRangeMatch[2]);
//     }

//     // Process query into individual terms (excluding price range terms)
//     const queryTerms = query
//       .replace(/(under|below|less than)\s*\d+/i, '') // Remove price range terms
//       .trim()
//       .toLowerCase()
//       .split(/\s+/)
//       .filter(word => word.length > 0);

//     if (queryTerms.length === 0 && !priceRange) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "No valid search terms provided.",
//       });
//     }

//     // Base filter - include category filter if provided
//     const baseFilter = category ? { categoryName: new RegExp(category, 'i') } : {};

//     // Add price range to filter if specified
//     if (priceRange) {
//       baseFilter.price = { $lte: priceRange };
//     }

//     // Function to create regex that matches words starting with term
//     const createStartsWithRegex = (term) => {
//       const chars = term.split('');
//       const abbrevPattern = chars.join('[.\\s]*');
//       return `(^|\\s)${abbrevPattern}`;
//     };

//     // Build search conditions
//     const searchConditions = queryTerms.length > 0 ? queryTerms.map(term => ({
//       $or: [
//         { name: { $regex: createStartsWithRegex(term), $options: 'i' } },
//         { brand: { $regex: createStartsWithRegex(term), $options: 'i' } },
//         { categoryName: { $regex: `^${term}`, $options: 'i' } },
//         { subCategoryName: { $regex: `^${term}`, $options: 'i' } },
//         { thirdSubCategoryName: { $regex: `^${term}`, $options: 'i' } },
//         { tags: { $regex: `^${term}`, $options: 'i' } }
//       ]
//     })) : [{}]; // If only price range specified

//     // Combine filters
//     const filters = {
//       ...baseFilter,
//       $and: [
//         { $or: searchConditions }
//       ]
//     };

//     // Enhanced scoring pipeline
//     const scorePipeline = [
//       {
//         $addFields: {
//           score: {
//             $add: [
//               { $multiply: [
//                 { $size: {
//                   $filter: {
//                     input: queryTerms,
//                     as: "term",
//                     cond: { 
//                       $regexMatch: { 
//                         input: "$brand", 
//                         regex: createStartsWithRegex("$$term"), 
//                         options: "i" 
//                       }
//                     }
//                   }
//                 }},
//                 60
//               ]},
//               { $multiply: [
//                 { $size: {
//                   $filter: {
//                     input: queryTerms,
//                     as: "term",
//                     cond: { 
//                       $regexMatch: { 
//                         input: "$name", 
//                         regex: createStartsWithRegex("$$term"), 
//                         options: "i" 
//                       }
//                     }
//                   }
//                 }},
//                 50
//               ]},
//               { $multiply: [
//                 { $size: {
//                   $filter: {
//                     input: queryTerms,
//                     as: "term",
//                     cond: { $or: [
//                       { $regexMatch: { input: "$categoryName", regex: `^$$term`, options: "i" } },
//                       { $regexMatch: { input: "$subCategoryName", regex: `^$$term`, options: "i" } },
//                       { $regexMatch: { input: "$thirdSubCategoryName", regex: `^$$term`, options: "i" } }
//                     ]}
//                   }
//                 }},
//                 40
//               ]},
//               { $cond: [
//                 { $regexMatch: { input: "$name", regex: `^${queryTerms.join(' ')}`, options: "i" } },
//                 100,
//                 { $cond: [
//                   { $regexMatch: { input: "$brand", regex: `^${queryTerms.join(' ')}`, options: "i" } },
//                   90,
//                   0
//                 ]}
//               ]},
//               { $cond: [
//                 { $ifNull: ["$popularity", false] },
//                 { $multiply: ["$popularity", 0.1] },
//                 0
//               ]},
//               { $cond: [
//                 { $gt: ["$stock", 0] },
//                 15,
//                 0
//               ]}
//             ]
//           }
//         }
//       }
//     ];

//     // Sorting options
//     const sortOptions = {
//       relevance: { score: -1, popularity: -1 },
//       newest: { createdAt: -1 },
//       oldest: { createdAt: 1 },
//       price_asc: { price: 1 },
//       price_desc: { price: -1 },
//       popular: { popularity: -1 }
//     };

//     // Count pipeline
//     const countPipeline = [
//       { $match: filters },
//       ...scorePipeline,
//       { $count: "total" }
//     ];

//     const countResult = await ProductModel.aggregate(countPipeline);
//     const total = countResult[0]?.total || 0;

//     // Items pipeline with projection
//     const itemsPipeline = [
//       { $match: filters },
//       ...scorePipeline,
//       { $sort: sortOptions[sortOption] || sortOptions.relevance },
//       { $skip: (pageNumber - 1) * limitNumber },
//       { $limit: limitNumber },
//       { $lookup: {
//         from: "categories",
//         localField: "category",
//         foreignField: "_id",
//         as: "category"
//       }},
//       { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
//       { $project: {
//         _id: 1,
//         name: 1,
//         brand: 1,
//         price: 1,
//         images: 1,
//         categoryName: 1,
//         subCategoryName: 1,
//         thirdSubCategoryName: 1,
//         stock: 1,
//         popularity: 1,
//         score: 1,
//         category: {
//           _id: 1,
//           name: 1,
//           slug: 1
//         }
//       }}
//     ];

//     let items = await ProductModel.aggregate(itemsPipeline);

//     // Apply additional sorting if needed (client-side fallback)
//     if (sortOption === 'price_asc' || sortOption === 'price_desc') {
//       items = sortItems({ data: items }, 'price', sortOption === 'price_asc' ? 'asc' : 'desc');
//     }

//     return response.status(200).json({
//       error: false,
//       success: true,
//       data: items,
//       total,
//       page: pageNumber,
//       limit: limitNumber,
//       totalPages: Math.ceil(total / limitNumber),
//       searchTerms: queryTerms,
//       priceRange: priceRange || undefined
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// }

export async function searchProductController(request, response) {
  try {
    const { query, page, limit, sortBy, category } = request.body;

    if (!query) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Query is required.",
      });
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 30;
    const sortOption = sortBy || 'relevance';

    // Extract price range from query (e.g., "mobiles under 5000")
    let priceRange = null;
    const priceRangeMatch = query.match(/(under|below|less than)\s*(\d+)/i);
    if (priceRangeMatch) {
      priceRange = parseInt(priceRangeMatch[2]);
    }

    // Process query into individual terms (excluding price range terms)
    const queryTerms = query
      .replace(/(under|below|less than)\s*\d+/i, '')
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 0);

    if (queryTerms.length === 0 && !priceRange) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "No valid search terms provided.",
      });
    }

    // Base filter - include category filter if provided
    const baseFilter = category ? { categoryName: new RegExp(category, 'i') } : {};

    // Add price range to filter if specified
    if (priceRange) {
      baseFilter.price = { $lte: priceRange };
    }

    // Function to create regex that matches words starting with term
    const createStartsWithRegex = (term) => {
      const chars = term.split('');
      const abbrevPattern = chars.join('[.\\s]*');
      return `(^|\\s)${abbrevPattern}`;
    };

    // Build search conditions
    const searchConditions = queryTerms.length > 0 ? queryTerms.map(term => ({
      $or: [
        { name: { $regex: createStartsWithRegex(term), $options: 'i' } },
        { brand: { $regex: createStartsWithRegex(term), $options: 'i' } },
        { categoryName: { $regex: `^${term}`, $options: 'i' } },
        { subCategoryName: { $regex: `^${term}`, $options: 'i' } },
        { thirdSubCategoryName: { $regex: `^${term}`, $options: 'i' } },
        { tags: { $regex: `^${term}`, $options: 'i' } }
      ]
    })) : [{}];

    // Combine filters
    const filters = {
      ...baseFilter,
      $and: [
        { $or: searchConditions }
      ]
    };

    // Count total matching products
    const total = await ProductModel.countDocuments(filters);

    // Calculate score for each product
    const calculateScore = (product) => {
      let score = 0;
      
      queryTerms.forEach(term => {
        // Brand matches
        if (product.brand && new RegExp(createStartsWithRegex(term), 'i').test(product.brand)) {
          score += 60;
        }
        
        // Name matches
        if (product.name && new RegExp(createStartsWithRegex(term), 'i').test(product.name)) {
          score += 50;
        }
        
        // Category matches
        if (
          (product.categoryName && new RegExp(`^${term}`, 'i').test(product.categoryName)) ||
          (product.subCategoryName && new RegExp(`^${term}`, 'i').test(product.subCategoryName)) ||
          (product.thirdSubCategoryName && new RegExp(`^${term}`, 'i').test(product.thirdSubCategoryName))
        ) {
          score += 40;
        }
      });

      // Exact matches
      if (product.name && new RegExp(`^${queryTerms.join(' ')}`, 'i').test(product.name)) {
        score += 100;
      } else if (product.brand && new RegExp(`^${queryTerms.join(' ')}`, 'i').test(product.brand)) {
        score += 90;
      }

      // Popularity boost
      if (product.popularity) {
        score += product.popularity * 0.1;
      }

      // In stock boost
      if (product.countInStock > 0) {
        score += 15;
      }

      return score;
    };

    // Fetch products with all fields
    let products = await ProductModel.find(filters)
      .populate('seller')
      .populate('category')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean(); // Use lean() to get plain JavaScript objects

    // Add score to each product without modifying other fields
    products = products.map(product => ({
      ...product,
      score: calculateScore(product)
    }));

    // Apply sorting based on the score and other criteria
    const sortProducts = (a, b) => {
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      if (sortOption === 'popular') return (b.popularity || 0) - (a.popularity || 0);
      
      // Default: sort by relevance (score)
      return b.score - a.score;
    };

    products.sort(sortProducts);

    return response.status(200).json({
      error: false,
      success: true,
      data: products,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      searchTerms: queryTerms,
      priceRange: priceRange || undefined
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}