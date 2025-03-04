import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import fs from 'fs/promises';
import BetaProductModel from "../models/betaProduct.model.js";
import UserModel from "../models/user.model.js";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});


// =========================================================================================================================

// 🔹 Helper function to upload images (Stores per User ID)
async function uploadImagesToCloudinary(files, userId) {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("Invalid or empty file array received");
    }
    if (!userId) {
      throw new Error("Missing userId. Cannot upload images.");
    }

    console.log("🚀 Uploading images to Cloudinary for user:", userId);
    
    // Use a separate folder for each user
    const folderPath = `ecommerceApp/product_images/${userId}`;

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

// 🔹 Controller function to create a product
export async function createBetaProduct(req, res) {
  try {
    console.log("📥 Incoming request:", req.body);
    console.log("📂 Uploaded Files:", req.files);

    const { name, userId } = req.body; // Get userId from request
    const images = req.files; // Array of images

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // ✅ Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!name) {
      return res.status(400).json({ error: "Product name is required" });
    }
    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // ✅ Upload images under the user's specific folder
    const uploadedImageUrls = await uploadImagesToCloudinary(images, userId);

    console.log("📸 Uploaded image URLs:", uploadedImageUrls); // ✅ Debugging log

    if (uploadedImageUrls.length === 0) {
      console.error("❌ No images were uploaded.");
      return res.status(500).json({ error: "Image upload failed, check logs" });
    }

    const newProduct = new BetaProductModel({
      name: name.trim(),
      images: uploadedImageUrls,
      userId, // Save user ID in product
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "✅ Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}




// // 🔹 Function to delete images from Cloudinary
// export async function deleteImagesFromCloudinary(imageUrls) {
//   try {
//     await Promise.all(
//       imageUrls.map(async (imageUrl) => {
//         const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
//         await cloudinary.uploader.destroy(`ecommerceApp/uploads/${publicId}`);
//       })
//     );
//   } catch (error) {
//     console.error("Error deleting images from Cloudinary:", error);
//   }
// }



// // ----------------------------------------------------------------------------------------------------------------------

// // Get all products (Paginated)
// export async function getAllProducts(req, res) {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const perPage = parseInt(req.query.perPage) || 10; // Default to 10 per page

//     const totalProducts = await BetaProductModel.countDocuments();

//     if (totalProducts === 0) {
//       return res.status(404).json({ message: "No products found" });
//     }

//     const totalPages = Math.ceil(totalProducts / perPage);

//     if (page > totalPages) {
//       return res.status(404).json({ message: "Page not found" });
//     }

//     const products = await BetaProductModel.find()
//       .skip((page - 1) * perPage)
//       .limit(perPage);

//     return res.status(200).json({
//       message: "Products retrieved successfully",
//       products,
//       totalPages,
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }


// // ----------------------------------------------------------------------------------------------------------------------------------
// // Get a single product by ID
// export async function getProduct(req, res) {
//   try {
//     const product = await BetaProductModel.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     return res.status(200).json({ product });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// // ----------------------------------------------------------------------------------------------------------------------------------

// // Function to extract Cloudinary public ID
// function extractPublicId(imageUrl) {
//   const regex = /https:\/\/res\.cloudinary\.com\/.*\/(ecommerceApp\/uploads\/.*)\.[a-zA-Z0-9]+$/;
//   const match = imageUrl.match(regex);
//   return match ? match[1] : null;
// }

// // Function to delete images from Cloudinary
// async function deleteImages(images) {
//   if (!images || images.length === 0) return [];

//   return Promise.allSettled(
//     images.map(async (imageUrl, index) => {
//       const publicId = extractPublicId(imageUrl);
//       if (!publicId) return `Failed to extract public ID for image ${index + 1}.`;

//       try {
//         const result = await cloudinary.uploader.destroy(publicId);
//         return result.result === "ok"
//           ? `Image ${index + 1} deleted successfully.`
//           : `Failed to delete image ${index + 1}: ${result.error?.message || "Unknown error"}`;
//       } catch (error) {
//         return `Error deleting image ${index + 1}: ${error.message}`;
//       }
//     })
//   );
// }

// // Delete product
// export async function deleteProduct(req, res) {
//   try {
//     const productId = req.params.id;
//     const product = await BetaProductModel.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found." });
//     }

//     // Delete associated images
//     const imageResults = await deleteImages(product.images);

//     // Delete product from database
//     await BetaProductModel.findByIdAndDelete(productId);

//     console.log(`Product ${productId} deleted successfully.`);
//     return res.status(200).json({
//       message: "Product and images deleted successfully.",
//       imageResults,
//     });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// // ----------------------------------------------------------------------------------------------------------------------

// // Combined logic for both creating a new product and updating an existing product
// export async function removeImageProductFromCloudinary(request, response) {
//   try {
//     const { imgUrl, productId } = request.query;  // Expecting both imgUrl and productId in query
//     console.log("Request Query:", request.query);  // Log the incoming request query

//     // Validate input
//     if (!imgUrl) {
//       return response.status(400).json({ error: "Image URL is required" });
//     }

//     // Handle image removal logic for both new and existing products
//     if (productId) {
//       // If productId is provided, handle for editing an existing product
//       const product = await ProductModel.findById(productId);

//       if (!product) {
//         return response.status(404).json({ error: "Product not found" });
//       }

//       // Remove the image from the product's image array
//       const updatedImages = product.images.filter(imageUrl => imageUrl.trim() !== imgUrl.trim());
//       if (updatedImages.length === product.images.length) {
//         return response.status(404).json({ error: "Image not found in product images" });
//       }

//       // Update the product in the database
//       product.images = updatedImages;
//       await product.save();

//       // Also update the imagesArr in-memory (or your state management) to reflect the changes
//       if (imagesArr[productId]) {
//         imagesArr[productId] = imagesArr[productId].filter(url => url.trim() !== imgUrl.trim());
//       }

//       console.log("Image removed from product", productId);
//     } else {
//       // If no productId is provided, handle as new product
//       if (imagesArr["new"] && imagesArr["new"].includes(imgUrl)) {
//         const index = imagesArr["new"].indexOf(imgUrl);
//         imagesArr["new"].splice(index, 1);  // Remove from the global new set
//         console.log("Image removed from global set");
//       } else {
//         return response.status(404).json({ error: "Image URL not found in global images" });
//       }
//     }

//     // Extract the public ID from the imgUrl for Cloudinary deletion
//     const publicId = extractPublicId(imgUrl);
//     if (!publicId) {
//       return response.status(400).json({
//         message: "Invalid image URL format",
//         success: false,
//         error: true,
//       });
//     }

//     console.log("Deleting image with public ID:", publicId);

//     // Attempt to delete the image from Cloudinary
//     const result = await cloudinary.uploader.destroy(publicId);

//     if (result.result === "ok") {
//       console.log("Image successfully deleted from Cloudinary:", imgUrl);
//       return response.status(200).json({
//         message: "Image removed successfully from Cloudinary and product",
//         success: true,
//       });
//     }

//     // If the Cloudinary deletion result is not 'ok'
//     return response.status(404).json({
//       message: "Image not found in Cloudinary",
//       success: false,
//       error: true,
//     });
//   } catch (error) {
//     console.error("Error in removeImageProduct:", error);
//     return response.status(500).json({
//       message: "Failed to remove image",
//       success: false,
//       error: true,
//     });
//   }
// }

// // export async function removeImageProductFromCloudinary(request, response) {
// //   try {
// //     const { imgUrl, productId } = request.query;
// //     console.log("Request received for product image deletion:", request.query);

// //     if (!imgUrl) {
// //       return response.status(400).json({ error: "Image URL is required" });
// //     }

// //     let imageRemoved = false;

// //     if (productId) {
// //       const product = await ProductModel.findById(productId);
// //       if (!product) {
// //         console.log(`Product with ID ${productId} not found.`);
// //         return response.status(404).json({ error: "Product not found" });
// //       }

// //       // Remove image from product's image array
// //       const updatedImages = product.images.filter(imageUrl => imageUrl.trim() !== imgUrl.trim());
// //       if (updatedImages.length !== product.images.length) {
// //         product.images = updatedImages;
// //         await product.save();
// //         imageRemoved = true;
// //         console.log(`Image removed from product: ${productId}`);
// //       }
// //     }

// //     if (imagesArr["new"] && imagesArr["new"].includes(imgUrl)) {
// //       imagesArr["new"] = imagesArr["new"].filter(url => url.trim() !== imgUrl.trim());
// //       console.log("Image removed from temporary storage.");
// //       imageRemoved = true;
// //     }

// //     if (productId && imagesArr[productId]) {
// //       if (imagesArr[productId].includes(imgUrl)) {
// //         imagesArr[productId] = imagesArr[productId].filter(url => url.trim() !== imgUrl.trim());
// //         console.log(`Image removed from in-memory storage for product: ${productId}`);
// //         imageRemoved = true;
// //       }
// //     }

// //     if (!imageRemoved) {
// //       console.log("Image not found in database or temporary storage.");
// //       return response.status(404).json({ error: "Image not found in database or memory" });
// //     }

// //     const publicId = extractPublicId(imgUrl);
// //     if (!publicId) {
// //       console.log("Invalid image URL format for Cloudinary deletion.");
// //       return response.status(400).json({ error: "Invalid image URL format" });
// //     }

// //     console.log(`Deleting image from Cloudinary with public ID: ${publicId}`);
// //     const result = await cloudinary.uploader.destroy(publicId);

// //     if (result.result === "ok") {
// //       console.log("Image successfully deleted from Cloudinary:", imgUrl);
// //       return response.status(200).json({ message: "Image removed successfully from Cloudinary and product", success: true });
// //     } else {
// //       console.log("Cloudinary deletion failed:", result);
// //       return response.status(500).json({ error: "Failed to delete image from Cloudinary" });
// //     }
// //   } catch (error) {
// //     console.error("Error in removeImageProductFromCloudinary:", error);
// //     return response.status(500).json({ message: "Failed to remove image", success: false, error: true });
// //   }
// // }


// // ----------------------------------------------------------------------------------------------------------------------



// export async function updateProduct(request, response) {
//   try {
//     const productId = request.params.id;
//     const product = await ProductModel.findById(productId).populate("seller").lean(); // Fetch seller details

//     if (!product) {
//       return response.status(404).json({
//         error: true,
//         success: false,
//         message: "Product not found!",
//       });
//     }

//     // ✅ Check if seller exists
//     if (!product.seller) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Seller details not found!",
//       });
//     }

//     let newImages = request.body.images || [];
//     let newBannerImages = request.body.bannerImages || [];
//     let cloudinaryMessages = [];
//     let validNewImages = [];
//     let validNewBannerImages = [];

//     // ✅ Validate new images exist in Cloudinary
//     for (let newImageUrl of newImages) {
//       const publicId = extractPublicId(newImageUrl);
//       if (publicId) {
//         try {
//           const result = await cloudinary.api.resource(publicId);
//           if (result) validNewImages.push(newImageUrl);
//           else cloudinaryMessages.push(`Image does not exist in Cloudinary: ${newImageUrl}`);
//         } catch (error) {
//           cloudinaryMessages.push(`Error checking image in Cloudinary: ${newImageUrl}`);
//         }
//       }
//     }

//     // ✅ Validate new banner images exist in Cloudinary
//     for (let newBannerUrl of newBannerImages) {
//       const publicId = extractPublicId(newBannerUrl);
//       if (publicId) {
//         try {
//           const result = await cloudinary.api.resource(publicId);
//           if (result) validNewBannerImages.push(newBannerUrl);
//           else cloudinaryMessages.push(`Banner image does not exist in Cloudinary: ${newBannerUrl}`);
//         } catch (error) {
//           cloudinaryMessages.push(`Error checking banner image in Cloudinary: ${newBannerUrl}`);
//         }
//       }
//     }

//     // ✅ Preserve existing images if new images are not provided
//     product.images = validNewImages.length > 0 ? validNewImages : product.images;

//     // ✅ Handle `isBannerVisible` toggle without deleting banner data
//     if (request.body.isBannerVisible !== undefined) {
//       product.isBannerVisible = request.body.isBannerVisible;
//     }

//     // ✅ Only update banner title & images if new values are provided
//     if (request.body.isBannerVisible) {
//       if (!request.body.bannerTitleName || request.body.bannerTitleName.trim() === "") {
//         return response.status(400).json({
//           error: true,
//           success: false,
//           message: "Banner is enabled but missing title.",
//         });
//       }
//       if (!Array.isArray(validNewBannerImages) || validNewBannerImages.length === 0) {
//         // If banner images are missing, but existing ones are present, keep them
//         if (product.bannerImages.length > 0) {
//           validNewBannerImages = product.bannerImages;
//         } else {
//           return response.status(400).json({
//             error: true,
//             success: false,
//             message: "Banner is enabled but no valid banner images provided.",
//           });
//         }
//       }
//       product.bannerTitleName = request.body.bannerTitleName;
//       product.bannerImages = validNewBannerImages;
//     }



//     // ✅ Fetch valid RAMs dynamically
//     const validProductRams = await getValidProductRams();
//     const filteredProductRams = (request.body.productRam || [])
//       .filter(ram => validProductRams.includes(ram))
//       .sort((a, b) => parseRamSize(a) - parseRamSize(b));

//     // ✅ Fetch and sort valid weights dynamically
//     const validWeights = await ProductWeightModel.find({});
//     const weightOrder = validWeights.reduce((acc, weight, index) => {
//       acc[weight.name] = index + 1;
//       return acc;
//     }, {});

//     const parseWeightToGrams = weight => (weight.includes('kg') ? parseFloat(weight) * 1000 : parseFloat(weight));
//     const sortedWeights = (request.body.productWeight || [])
//       .filter(weight => weightOrder[weight])
//       .sort((a, b) => parseWeightToGrams(a) - parseWeightToGrams(b));

//     // ✅ Fetch and sort valid sizes dynamically
//     const predefinedSizeOrder = ["S", "M", "L", "XL", "XXL", "XXXL"];
//     const validSizesFromDB = await ProductSizeModel.find({});
//     const validSizeNames = validSizesFromDB.map(size => size.name);
//     const filteredSizes = (request.body.size || []).filter(size => validSizeNames.includes(size));
//     const sortedSizes = filteredSizes.sort((a, b) => predefinedSizeOrder.indexOf(a) - predefinedSizeOrder.indexOf(b));

//     // ✅ Update product in the database
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       productId,
//       {
//         ...request.body,
//         images: product.images,
//         bannerImages: product.bannerImages,
//         productRam: filteredProductRams,
//         productWeight: sortedWeights,
//         size: sortedSizes,
//         isBannerVisible: product.isBannerVisible,
//         bannerTitleName: product.bannerTitleName,
//       },
//       { new: true }
//     ).populate("seller", "sellerName contact"); // Ensure seller remains populated

//     if (!updatedProduct) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Product update failed!",
//       });
//     }

//     return response.status(200).json({
//       message: "Product updated successfully.",
//       success: true,
//       cloudinaryMessages,
//       product: updatedProduct,
//       seller: updatedProduct.seller, // ✅ Include seller details in response
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || "An error occurred during product update.",
//       success: false,
//       error: error.message || error,
//     });
//   }
// }





// // ----------------------------------------------------------------------------------------------------------------------

// // delete all unwanted images from cloudinary
// export async function deleteAllUnWantedImages(req, res) {
//   try {
//     console.log("Fetching all products from DB...");
//     const products = await ProductModel.find();
//     console.log("Products fetched:", products);

//     const linkedImages = new Set();
//     products.forEach((product) => {
//       product.images.forEach((img) => {
//         linkedImages.add(img);
//       });
//     });
//     console.log("Linked images:", linkedImages);

//     console.log("Fetching images from Cloudinary...");
//     const cloudinaryImages = await cloudinary.api.resources({
//       type: "upload",
//       prefix: "ecommerceApp/uploads",
//     });
//     console.log("Cloudinary images fetched:", cloudinaryImages);

//     const imagesToDelete = cloudinaryImages.resources.filter(
//       (img) => !linkedImages.has(img.secure_url)
//     );
//     console.log("Images to delete:", imagesToDelete);

//     for (const img of imagesToDelete) {
//       console.log("Deleting image:", img.public_id);
//       await cloudinary.uploader.destroy(img.public_id);
//     }

//     return res.status(200).json({
//       message: "Unwanted images deleted successfully.",
//     });
//   } catch (error) {
//     console.log("Error:", error);
//     return res.status(500).json({
//       message: error.message || error,
//       error: true,
//       status: false,
//     });
//   }
// }



