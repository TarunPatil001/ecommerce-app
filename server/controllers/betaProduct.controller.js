import BetaProductModel from "../models/BetaProductModel.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});


// =========================================================================================================================

// Product




// Upload images to Cloudinary
export async function uploadProductImages(req, res) {
  try {
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "ecommerceApp/uploads",
            use_filename: true,
            unique_filename: false,
            overwrite: false,
          });

          fs.unlinkSync(file.path); // Remove local file
          return result.secure_url; // Return Cloudinary URL
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          return null;
        }
      })
    );

    // Filter out failed uploads
    const validImages = uploadedImages.filter(Boolean);

    if (validImages.length === 0) {
      return res.status(500).json({ error: "Image upload failed" });
    }

    return res.status(200).json({ images: validImages });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create a product
export async function createProduct(req, res) {
  try {
    const { name, images } = req.body;

    if (!name || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Name and images are required" });
    }

    const newProduct = new BetaProductModel({
      name,
      images,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}





// ----------------------------------------------------------------------------------------------------------------------

// Get all products (Paginated)
export async function getAllProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Default to 10 per page

    const totalProducts = await BetaProductModel.countDocuments();

    if (totalProducts === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const totalPages = Math.ceil(totalProducts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ message: "Page not found" });
    }

    const products = await BetaProductModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      message: "Products retrieved successfully",
      products,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


// ----------------------------------------------------------------------------------------------------------------------------------
// Get a single product by ID
export async function getProduct(req, res) {
  try {
    const product = await BetaProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


import BetaProductModel from "../models/BetaProductModel.js";
import cloudinary from "cloudinary";

// Function to extract Cloudinary public ID
function extractPublicId(imageUrl) {
  const regex = /https:\/\/res\.cloudinary\.com\/.*\/(ecommerceApp\/uploads\/.*)\.[a-zA-Z0-9]+$/;
  const match = imageUrl.match(regex);
  return match ? match[1] : null;
}

// Function to delete images from Cloudinary
async function deleteImages(images) {
  if (!images || images.length === 0) return [];

  return Promise.allSettled(
    images.map(async (imageUrl, index) => {
      const publicId = extractPublicId(imageUrl);
      if (!publicId) return `Failed to extract public ID for image ${index + 1}.`;

      try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === "ok"
          ? `Image ${index + 1} deleted successfully.`
          : `Failed to delete image ${index + 1}: ${result.error?.message || "Unknown error"}`;
      } catch (error) {
        return `Error deleting image ${index + 1}: ${error.message}`;
      }
    })
  );
}

// Delete product
export async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const product = await BetaProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Delete associated images
    const imageResults = await deleteImages(product.images);

    // Delete product from database
    await BetaProductModel.findByIdAndDelete(productId);

    console.log(`Product ${productId} deleted successfully.`);
    return res.status(200).json({
      message: "Product and images deleted successfully.",
      imageResults,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
    const product = await ProductModel.findById(productId).populate("seller").lean(); // Fetch seller details

    if (!product) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Product not found!",
      });
    }

    // ✅ Check if seller exists
    if (!product.seller) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Seller details not found!",
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
    ).populate("seller", "sellerName contact"); // Ensure seller remains populated

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
      seller: updatedProduct.seller, // ✅ Include seller details in response
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

// const sortItems = (products, sortBy, order) => {
//   return products.sort((a, b) => {
//     if (sortBy === "name") {
//       return order === "asc" ? a.name.localCompare(b.name) : b.name.localCompare(a.name);
//     }

//     if (sortBy === "price") {
//       return order === "asc" ? a.price - b.price : b.price - a.price;
//     }
    
//     if (sortBy === "rating") {
//       return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
//     }
//   })
// }

// export async function sortBy(request, response) {
//   const { products, sortBy, order } = request.body;
//   const sortedItems = sortItems([...products?.products], sortBy, order);

//   return response.status(200).json({
//     message: "Products sorted successfully!",
//     error: false,
//     success: true,
//     data: sortedItems,
//     page: 0,
//     totalPages: 0,
//     });

// }

// Utility function to sort products
const sortItems = ({ data: products }, sortBy = "name", order = "asc") => {
  // Create a copy of the array to avoid mutating the original
  return products.slice().sort((a, b) => {
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

    return 0; // Default case: no sorting
  });
};

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