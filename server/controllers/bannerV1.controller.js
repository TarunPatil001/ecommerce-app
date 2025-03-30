import BannerV1Model from "../models/bannerV1.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { mongoose } from 'mongoose';
import CategoryModel from "../models/category.model.js";

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});



// // Declare imagesArr with let instead of const, so it can be modified
// let imagesArr = [];

// export async function uploadBannerImages(request, response) {
//     try {
//         // Clear the images array at the beginning of the upload process
//         imagesArr = []; // This is fine with 'let'

//         const image = request.files; // Extracted from multer middleware

//         if (!image || image.length === 0) {
//             return response.status(400).json({
//                 message: "No image files uploaded.",
//                 success: false,
//             });
//         }

//         // Upload the new images to Cloudinary
//         const options = {
//             folder: "ecommerceApp/uploads", // Specify the folder in Cloudinary
//             use_filename: true,
//             unique_filename: false,
//             overwrite: false,
//         };

//         // Upload all images
//         for (let i = 0; i < image.length; i++) {
//             try {
//                 // Upload image to Cloudinary
//                 const result = await cloudinary.uploader.upload(image[i].path, options);
//                 imagesArr.push(result.secure_url);

//                 // Delete the local image after uploading it to Cloudinary
//                 await fs.promises.unlink(image[i].path); // Use async unlink for better performance
//             } catch (uploadError) {
//                 console.error("Error uploading image to Cloudinary:", uploadError.message || uploadError);
//                 // Continue uploading other images even if one fails
//             }
//         }

//         return response.status(200).json({
//             images: imagesArr,
//             message: "Images uploaded successfully.",
//             success: true,
//         });
//     } catch (error) {
//         console.error("Error in uploadCategoryImages:", error.message || error);
//         return response.status(500).json({
//             message: error.message || "An error occurred during image upload.",
//             error: true,
//             success: false,
//         });
//     }
// }

// Upload images to Cloudinary
async function uploadImagesToCloudinary(files) {
    try {
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error("Invalid or empty file array received");
        }

        console.log("🚀 Uploading images to Cloudinary");

        const folderPath = `ecommerceApp/bannerV1_images`;
        const uploadOptions = {
            folder: folderPath,
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        const uploadPromises = files.map(async (file) => {
            try {
                console.log(`📤 Uploading file: ${file.originalname}`);
                const result = await cloudinary.uploader.upload(file.path, uploadOptions);

                // Clean up local file after upload
                await fs.promises.unlink(file.path).catch(err => {
                    console.error(`⚠️ Could not delete local file ${file.path}:`, err);
                });

                return result.secure_url;
            } catch (error) {
                console.error(`❌ Failed to upload ${file.originalname}:`, error);
                // Attempt to clean up even if upload failed
                await fs.promises.unlink(file.path).catch(() => { });
                throw error; // Re-throw to be caught by Promise.all
            }
        });

        const uploadedImageUrls = await Promise.all(uploadPromises);
        console.log("✅ Successfully uploaded images:", uploadedImageUrls);
        return uploadedImageUrls;

    } catch (error) {
        console.error("❌ Image upload function error:", error);
        throw error; // Re-throw for handling in the calling function
    }
}


// export async function addBanner(request, response) {
//     try {
//         console.log("📥 Incoming request:", request.body);
//         console.log("📂 Uploaded Files:", request.files);

//         const { bannerTitle, alignInfo, images, parentCategoryId, subCategoryId, thirdSubCategoryId, price } = request.body;

//         // Step 1: If there's a parent category, validate the parentCategoryId and parentCategoryName
//         if (parentCategoryId) {
//             const parentCategory = await CategoryModel.findById(parentCategoryId);

//             // If parent category doesn't exist
//             if (!parentCategory) {
//                 return response.status(400).json({
//                     message: "Parent category does not exist.",
//                     error: true,
//                     success: false,
//                 });
//             }

//             // Step 2: Ensure that the parentCategoryName matches the parentCategoryId
//             if (parentCategory.name !== parentCategoryName) {
//                 return response.status(400).json({
//                     message: "parentCategoryName does not match parentCategoryId.",
//                     error: true,
//                     success: false,
//                 });
//             }
//         } else {
//             // If no parentCategoryId, it's a root category, set parentCategoryName to null
//             request.body.parentCategoryName = null;
//         }

//         const images = request.files?.images || [];  // Use uploaded category images

//         if (!images.length) {
//             return response.status(400).json({ error: "At least one banner image is required." });
//         }

//         // ✅ Upload images to Cloudinary
//         const uploadedImageUrls = await uploadImagesToCloudinary(images);
//         console.log("📸 Uploaded category image URLs:", uploadedImageUrls);

//         if (!uploadedImageUrls.length) {
//             return response.status(500).json({ error: "Banner image upload failed." });
//         }

//         // Step 3: Create a new category document
//         let banner = new BannerV1Model({
//             bannerTitle: request.body.bannerTitle,
//             alignInfo: request.body.alignInfo,
//             images: uploadedImageUrls,
//             parentCategoryId: request.body.parentCategoryId,
//             subCategoryId: request.body.subCategoryId,
//             thirdSubCategoryId: request.body.thirdSubCategoryId,
//             price: request.body.price,
//         });

//         // Step 4: Ensure the category is created
//         if (!banner) {
//             return response.status(500).json({
//                 message: "Banner not created",
//                 error: true,
//                 success: false,
//             });
//         }

//         // Step 5: Save the category to the database
//         banner = await banner.save();

//         // // Clear the images array after saving the category to avoid issues with future requests
//         // imagesArr = []; // Reset the array


//         return response.status(200).json({
//             // Return success response
//             message: "Banner created successfully.",
//             error: false,
//             success: true,
//             data: banner,
//         });

//     } catch (error) {
//         console.error("Error creating banner:", error.message || error);
//         return response.status(500).json({
//             message: error.message || "An error occurred during banner creation.",
//             error: true,
//             success: false,
//         });
//     }
// }


export async function addBanner(request, response) {
    try {
        console.log("📥 Incoming request body:", request.body);
        console.log("📂 Uploaded files:", request.files);

        // Destructure from request.body (not from both request.body and destructuring)
        const {
            bannerTitle,
            alignInfo,
            parentCategoryId,
            subCategoryId,
            thirdSubCategoryId,
            price
        } = request.body;

        // Validate required fields
        if (!bannerTitle || !price) {
            return response.status(400).json({
                message: "Banner title and price are required fields.",
                error: true,
                success: false
            });
        }


        let parentCategory = null;
        let subCategory = null;
        let thirdSubCategory = null;

        // Validate parentCategoryId (if provided)
        if (parentCategoryId) {
            parentCategory = await CategoryModel.findById(parentCategoryId);
            if (!parentCategory) {
                return response.status(400).json({
                    message: "Parent category does not exist.",
                    error: true,
                    success: false
                });
            }

            if (parentCategory.parentCategoryId) {
                return response.status(400).json({
                    message: "Parent category must be a top-level category.",
                    error: true,
                    success: false
                });
            }
        }

        // Validate subCategoryId (if provided)
        if (subCategoryId) {
            if (!parentCategoryId) {
                return response.status(400).json({
                    message: "Parent category ID is required when providing a sub-category ID.",
                    error: true,
                    success: false
                });
            }

            subCategory = await CategoryModel.findById(subCategoryId);
            if (!subCategory) {
                return response.status(400).json({
                    message: "Sub-category does not exist.",
                    error: true,
                    success: false
                });
            }

            if (!subCategory.parentCategoryId || subCategory.parentCategoryId.toString() !== parentCategoryId.toString()) {
                return response.status(400).json({
                    message: "Sub-category does not belong to the specified parent category.",
                    error: true,
                    success: false
                });
            }
        }

        // Validate thirdSubCategoryId (if provided)
        if (thirdSubCategoryId) {
            if (!subCategoryId) {
                return response.status(400).json({
                    message: "Sub-category ID is required when providing a third-level category ID.",
                    error: true,
                    success: false
                });
            }

            thirdSubCategory = await CategoryModel.findById(thirdSubCategoryId);
            if (!thirdSubCategory) {
                return response.status(400).json({
                    message: "Third-level category does not exist.",
                    error: true,
                    success: false
                });
            }

            if (!thirdSubCategory.parentCategoryId || thirdSubCategory.parentCategoryId.toString() !== subCategoryId.toString()) {
                return response.status(400).json({
                    message: "Third-level category does not belong to the specified sub-category.",
                    error: true,
                    success: false
                });
            }
        }

        // Handle image uploads
        const images = request.files?.images || [];

        if (!images.length) {
            return response.status(400).json({
                message: "At least one banner image is required.",
                error: true,
                success: false
            });
        }

        // Upload images to Cloudinary
        const uploadedImageUrls = await uploadImagesToCloudinary(images);
        console.log("📸 Uploaded banner image URLs:", uploadedImageUrls);

        if (!uploadedImageUrls.length) {
            return response.status(500).json({
                message: "Banner image upload failed.",
                error: true,
                success: false
            });
        }

        // Create new banner document
        const banner = new BannerV1Model({
            bannerTitle,
            alignInfo: alignInfo || "", // Default empty string if not provided
            images: uploadedImageUrls,
            parentCategoryId: parentCategoryId || null,
            subCategoryId: subCategoryId || null,
            thirdSubCategoryId: thirdSubCategoryId || null,
            price: parseFloat(price) // Ensure price is stored as number
        });

        // Save the banner to database
        const savedBanner = await banner.save();

        return response.status(201).json({
            message: "Banner created successfully.",
            error: false,
            success: true,
            data: savedBanner,
        });

    } catch (error) {
        console.error("🚨 Error creating banner:", error);
        return response.status(500).json({
            message: error.message || "An unexpected error occurred during banner creation.",
            error: true,
            success: false,
        });
    }
}


export async function getBanners(request, response) {
    try {
        // Fetch all banners from the database
        const banners = await BannerV1Model.find();

        // Check if there are no banners
        if (banners.length === 0) {  // ✅ FIXED: Check if array is empty
            return response.status(404).json({
                message: "No banners found",
                error: true,   // ✅ FIXED: If no banners, this should be `true`
                success: false, // ✅ FIXED: `false` because no data is found
            });
        }

        // Return banners
        return response.status(200).json({
            message: "Banners retrieved successfully",
            error: false,
            success: true,
            data: banners,
        });

    } catch (error) {
        console.error("Error getting banners:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred while retrieving banners.",
            error: true,
            success: false,
        });
    }
}



// get single bannerV1
export async function getBanner(request, response) {
    try {
        const { id } = request.params;
        console.log("Received ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid ObjectId format:", id);
            return response.status(400).json({
                message: "Invalid banner ID format",
                error: true,
                success: false,
            });
        }

        console.log("Fetching banner from DB...");
        const banner = await BannerV1Model.findById(id);

        if (!banner) {
            console.error("Banner not found for ID:", id);
            return response.status(404).json({ message: "Banner not found", error: true, success: false });
        }

        console.log("Banner found:", banner);
        return response.status(200).json({ message: "Banner retrieved successfully", error: false, success: true, data: banner });

    } catch (error) {
        console.error("Error getting banner:", error.stack);
        return response.status(500).json({ message: error.message || "An error occurred.", error: true, success: false });
    }
}


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


// Controller for removing a banner image from Cloudinary and Database
export async function removeBannerImageFromCloudinary(request, response) {
    try {
        const imgUrl = request.query.imgUrl; // Ensure the correct query parameter name is used
        const bannerId = request.query.bannerId; // Optional: If we have a reference ID for DB removal

        if (!imgUrl) {
            return response.status(400).json({
                message: "Image URL is required.",
                error: true,
                success: false,
            });
        }

        console.log("Received Image URL:", imgUrl);

        const publicId = extractPublicId(imgUrl);
        if (!publicId) {
            return response.status(400).json({
                message: "Invalid image URL format.",
                error: true,
                success: false,
            });
        }

        console.log("Extracted Public ID:", publicId);

        // Check if the image exists before attempting deletion
        const exists = await checkImageExists(publicId);
        if (!exists) {
            console.log("Image not found in Cloudinary. Removing from database...");

            // Remove from database if image does not exist in Cloudinary
            await removeImageFromDatabase(imgUrl, bannerId);

            return response.status(404).json({
                message: "Image not found in Cloudinary. Removed from database.",
                error: false, // Not an error, just a cleanup action
                success: true,
            });
        }

        // Delete the image from Cloudinary
        const res = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Response:", res);

        if (res.result !== "ok") {
            return response.status(500).json({
                message: `Error deleting image from Cloudinary: ${res.result}`,
                error: true,
                success: false,
            });
        }

        // Remove image reference from database after successful deletion
        await removeImageFromDatabase(imgUrl, bannerId);

        return response.status(200).json({
            message: "Banner image removed successfully from Cloudinary and database.",
            success: true,
        });
    } catch (error) {
        console.error("Error removing banner image:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred while removing the banner image.",
            error: true,
            success: false,
        });
    }
}

// Function to remove the image reference from the database
const removeImageFromDatabase = async (imgUrl, bannerId) => {
    try {
        // Assuming you have a database connection setup
        const query = bannerId
            ? { bannerId } // Remove using bannerId if available
            : { bannerImageUrl: imgUrl }; // Otherwise, remove using image URL

        await BannerModel.findOneAndUpdate(query, { bannerImageUrl: null });

        console.log("Successfully removed image reference from database:", query);
    } catch (error) {
        console.error("Error removing image from database:", error);
    }
};


export async function deleteBanner(request, response) {
    try {
        const bannerId = request.params.id;
        // Find the banner by ID
        const banner = await BannerV1Model.findById(bannerId);

        if (!banner) {
            return response.status(404).json({
                message: "Banner not found.",
                error: true,
                success: false,
            });
        }

        // Delete product and banner images from Cloudinary
        await deleteCloudinaryImages([...banner.images]);

        // Finally, delete the main category
        await BannerV1Model.findByIdAndDelete(bannerId);

        // // Delete the banner from the database
        // await BannerV1Model.findByIdAndDelete(bannerId);
        console.log(`Banner ${bannerId} and its images deleted successfully.`);
        return response.status(200).json({
            message: "Banner deleted successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error deleting banner:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred while deleting the banner.",
            error: true,
            success: false,
        });
    }
}


// // Update Banner Function
// export async function updateBanner(request, response) {
//     try {
//         const bannerId = request.params.id;

//         // Destructure from request.body (not from both request.body and destructuring)
//         const {
//             bannerTitle,
//             alignInfo,
//             parentCategoryId,
//             subCategoryId,
//             thirdSubCategoryId,
//             price
//         } = request.body;

//         const banner = await BannerV1Model.findById(bannerId);

//         if (!banner) {
//             return response.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "Banner not found!",
//             });
//         }

//         let { images, removedFiles } = request.body;
//         console.log("Incoming request body:", request.body); // Log incoming request body
    
//         // ✅ Ensure `removedFiles` is parsed correctly and only contains valid Cloudinary URLs
//         if (removedFiles && typeof removedFiles === "string") {
//           try {
//             removedFiles = JSON.parse(removedFiles);
//             if (!Array.isArray(removedFiles)) {
//               removedFiles = [];
//             }
//             removedFiles = removedFiles.filter((file) => typeof file === "string" && file.startsWith("https://res.cloudinary.com"));
//           } catch (err) {
//             console.error("Error parsing removedFiles:", err);
//             removedFiles = [];
//           }
//         } else if (!Array.isArray(removedFiles)) {
//           removedFiles = [];
//         }
    
//         console.log("removedFiles after parsing:", removedFiles);
    
//         // ✅ Ensure `images` is parsed correctly
//         try {
//           images = Array.isArray(images) ? images : images ? JSON.parse(images) : banner.images || [];
//         } catch (err) {
//           console.error("Error parsing images:", err);
//           images = banner.images || [];
//         }
    
//         console.log("images after parsing:", images);
    
//         // ✅ Upload new images if provided
//         const newImages = request.files?.newBannerImages ? await uploadImagesToCloudinary(request.files.newBannerImages) : [];
//         console.log("newImages uploaded:", newImages);
    
//         // ✅ Remove only Cloudinary product images
//         await deleteCloudinaryImages(removedFiles);
//         images = images.filter((img) => !removedFiles.includes(img));
//         console.log("images after removal:", images);
    
//         // ✅ Append new images
//         const updatedImages = [...images, ...newImages];
//         console.log("updatedImages:", updatedImages);

        

//         // ✅ Update banner in the database
//         const updatedBanner = await BannerV1Model.findByIdAndUpdate(
//             bannerId,
//             {
//                 ...request.body,
//                 images: updatedImages,
//                 bannerTitle: banner.bannerTitle,
//             },
//             { new: true }
//         );

//         if (!updatedBanner) {
//             return response.status(400).json({
//                 error: true,
//                 success: false,
//                 message: "Banner update failed!",
//             });
//         }

//         return response.status(200).json({
//             message: "Banner updated successfully.",
//             success: true,
//             cloudinaryMessages,
//             banner: updatedBanner,
//         });
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || "An error occurred during banner update.",
//             success: false,
//             error: error.message || error,
//         });
//     }
// }

// Update Banner Function
export async function updateBanner(request, response) {
    try {
        const bannerId = request.params.id;

        // Extract values from request.body
        let {
            bannerTitle,
            alignInfo,
            parentCategoryId,
            subCategoryId,
            thirdSubCategoryId,
            price,
            images,
            removedFiles
        } = request.body;

        // Find the existing banner
        const banner = await BannerV1Model.findById(bannerId);

        if (!banner) {
            return response.status(404).json({
                error: true,
                success: false,
                message: "Banner not found!",
            });
        }

        // ✅ Ensure required fields are present
        if (!parentCategoryId || !subCategoryId || !thirdSubCategoryId) {
            return response.status(400).json({
                message: "Parent category ID, Sub-category ID, and Third-level category ID are required.",
                error: true,
                success: false
            });
        }

        let parentCategory = null;
        let subCategory = null;
        let thirdSubCategory = null;

        // Validate parentCategoryId (if provided)
        if (parentCategoryId) {
            parentCategory = await CategoryModel.findById(parentCategoryId);
            if (!parentCategory) {
                return response.status(400).json({
                    message: "Parent category does not exist.",
                    error: true,
                    success: false
                });
            }

            if (parentCategory.parentCategoryId) {
                return response.status(400).json({
                    message: "Parent category must be a top-level category.",
                    error: true,
                    success: false
                });
            }
        }

        // Validate subCategoryId (if provided)
        if (subCategoryId) {
            if (!parentCategoryId) {
                return response.status(400).json({
                    message: "Parent category ID is required when providing a sub-category ID.",
                    error: true,
                    success: false
                });
            }

            subCategory = await CategoryModel.findById(subCategoryId);
            if (!subCategory) {
                return response.status(400).json({
                    message: "Sub-category does not exist.",
                    error: true,
                    success: false
                });
            }

            if (!subCategory.parentCategoryId || subCategory.parentCategoryId.toString() !== parentCategoryId.toString()) {
                return response.status(400).json({
                    message: "Sub-category does not belong to the specified parent category.",
                    error: true,
                    success: false
                });
            }
        }

        // Validate thirdSubCategoryId (if provided)
        if (thirdSubCategoryId) {
            if (!subCategoryId) {
                return response.status(400).json({
                    message: "Sub-category ID is required when providing a third-level category ID.",
                    error: true,
                    success: false
                });
            }

            thirdSubCategory = await CategoryModel.findById(thirdSubCategoryId);
            if (!thirdSubCategory) {
                return response.status(400).json({
                    message: "Third-level category does not exist.",
                    error: true,
                    success: false
                });
            }

            if (!thirdSubCategory.parentCategoryId || thirdSubCategory.parentCategoryId.toString() !== subCategoryId.toString()) {
                return response.status(400).json({
                    message: "Third-level category does not belong to the specified sub-category.",
                    error: true,
                    success: false
                });
            }
        }

        // ✅ Ensure `removedFiles` is parsed correctly and only contains valid Cloudinary URLs
        if (removedFiles && typeof removedFiles === "string") {
            try {
                removedFiles = JSON.parse(removedFiles);
                if (!Array.isArray(removedFiles)) {
                    removedFiles = [];
                }
                removedFiles = removedFiles.filter(file => typeof file === "string" && file.startsWith("https://res.cloudinary.com"));
            } catch (err) {
                console.error("🚨 Error parsing removedFiles:", err);
                removedFiles = [];
            }
        } else if (!Array.isArray(removedFiles)) {
            removedFiles = [];
        }

        console.log("🗑️ Removed files:", removedFiles);

        // ✅ Ensure `images` is parsed correctly
        try {
            images = Array.isArray(images) ? images : images ? JSON.parse(images) : banner.images || [];
        } catch (err) {
            console.error("🚨 Error parsing images:", err);
            images = banner.images || [];
        }

        console.log("📸 Existing images:", images);

        // ✅ Upload new images if provided
        const newImages = request.files?.newBannerImages ? await uploadImagesToCloudinary(request.files.newBannerImages) : [];
        console.log("📤 New images uploaded:", newImages);

        // ✅ Remove only specified images from Cloudinary
        await deleteCloudinaryImages(removedFiles);
        images = images.filter(img => !removedFiles.includes(img));

        console.log("📸 Images after removal:", images);

        // ✅ Append new images
        const updatedImages = [...images, ...newImages];
        console.log("📸 Final updated images:", updatedImages);

        // ✅ Update banner in the database
        const updatedBanner = await BannerV1Model.findByIdAndUpdate(
            bannerId,
            {
                bannerTitle,
                alignInfo: alignInfo || banner.alignInfo,
                parentCategoryId: parentCategoryId || banner.parentCategoryId,
                subCategoryId: subCategoryId || banner.subCategoryId,
                thirdSubCategoryId: thirdSubCategoryId || banner.thirdSubCategoryId,
                price: price ? parseFloat(price) : banner.price,
                images: updatedImages,
            },
            { new: true }
        );

        if (!updatedBanner) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "Banner update failed!",
            });
        }

        return response.status(200).json({
            message: "✅ Banner updated successfully!",
            success: true,
            banner: updatedBanner,
        });
    } catch (error) {
        console.error("🚨 Error updating banner:", error);
        return response.status(500).json({
            message: error.message || "An error occurred during banner update.",
            success: false,
            error: error.message || error,
        });
    }
}


export async function deleteMultipleBanners(req, res) {
    try {
        const { ids } = req.query;

        if (!ids || ids.length === 0) {
            return res.status(400).json({
                message: "No banner IDs provided.",
                success: false,
                error: true,
            });
        }

        const bannerIds = Array.isArray(ids) ? ids : ids.split(",").map((id) => id.trim());

        if (bannerIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({
                message: "Invalid banner IDs.",
                success: false,
                error: true,
            });
        }

        const banners = await BannerV1Model.find({ _id: { $in: bannerIds } });

        if (!banners.length) {
            return res.status(404).json({
                message: "No banners found with the given IDs.",
                success: false,
                error: true,
            });
        }

        console.log(`Found ${banners.length} banners for deletion.`);

        // Extract and delete images using helper function
        const allImages = banners.flatMap(banner => [...banner.images]);
        await deleteCloudinaryImages(allImages);

        // Delete categories from DB - using categoryIds instead of undefined idArray
        await BannerV1Model.deleteMany({ _id: { $in: bannerIds } });

        console.log("Banners deleted successfully.");

        return res.status(200).json({
            message: "Banners and associated images deleted successfully.",
            success: true,
            error: false,
        });

    } catch (error) {
        console.error("Error deleting banners:", error);
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false,
            error: true,
        });
    }
}
