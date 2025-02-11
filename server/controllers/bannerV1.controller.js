import BannerV1Model from "../models/bannerV1.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { mongoose } from 'mongoose';

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});



// Declare imagesArr with let instead of const, so it can be modified
let imagesArr = [];

export async function uploadBannerImages(request, response) {
    try {
        // Clear the images array at the beginning of the upload process
        imagesArr = []; // This is fine with 'let'

        const image = request.files; // Extracted from multer middleware

        if (!image || image.length === 0) {
            return response.status(400).json({
                message: "No image files uploaded.",
                success: false,
            });
        }

        // Upload the new images to Cloudinary
        const options = {
            folder: "ecommerceApp/uploads", // Specify the folder in Cloudinary
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        // Upload all images
        for (let i = 0; i < image.length; i++) {
            try {
                // Upload image to Cloudinary
                const result = await cloudinary.uploader.upload(image[i].path, options);
                imagesArr.push(result.secure_url);

                // Delete the local image after uploading it to Cloudinary
                await fs.promises.unlink(image[i].path); // Use async unlink for better performance
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError.message || uploadError);
                // Continue uploading other images even if one fails
            }
        }

        return response.status(200).json({
            images: imagesArr,
            message: "Images uploaded successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error in uploadCategoryImages:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred during image upload.",
            error: true,
            success: false,
        });
    }
}


export async function addBanner(request, response) {
    try {
        
        // Step 3: Create a new category document
        let banner = new BannerV1Model({
            bannerTitle: request.body.bannerTitle,
            alignInfo: request.body.alignInfo,
            images: imagesArr,
            parentCategoryId: request.body.parentCategoryId,
            subCategoryId: request.body.subCategoryId,
            thirdSubCategoryId: request.body.thirdSubCategoryId,
            price: request.body.price,
        });

        // Step 4: Ensure the category is created
        if (!banner) {
            return response.status(500).json({
                message: "Banner not created",
                error: true,
                success: false,
            });
        }

        // Step 5: Save the category to the database
        banner = await banner.save();

        // Clear the images array after saving the category to avoid issues with future requests
        imagesArr = []; // Reset the array


        return response.status(200).json({
            // Return success response
            message: "Banner created successfully.",
            error: false,
            success: true,
            data: banner,
        });

    } catch (error) {
        console.error("Error creating banner:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred during banner creation.",
            error: true,
            success: false,
        });
    }
}


// Get all banners  
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


const extractPublicId = (imgUrl) => {
    try {
        const urlArr = imgUrl.split("/");
        const imageName = urlArr[urlArr.length - 1].split(".")[0]; // Extract file name without extension
        return `ecommerceApp/uploads/${imageName}`; // Ensure this format matches Cloudinary's folder structure
    } catch (error) {
        console.error("Error extracting public ID:", error);
        return null;
    }
};

// Function to check if an image exists in Cloudinary
const checkImageExists = async (publicId) => {
    try {
        await cloudinary.api.resource(publicId);
        return true; // Image exists
    } catch (error) {
        return false; // Image not found
    }
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

        // Extract images from the banner
        const bannerImages = Array.isArray(banner.images) ? banner.images : [];

        // Delete images associated with the banner from Cloudinary
        for (const imgUrl of bannerImages) {
            const publicId = extractPublicId(imgUrl);
            if (publicId) {
                try {
                    const exists = await checkImageExists(publicId);
                    if (exists) {
                        await cloudinary.uploader.destroy(publicId);
                    } else {
                        console.warn(`Image ${publicId} not found in Cloudinary.`);
                    }
                } catch (error) {
                    console.warn(`Failed to delete image ${publicId} from Cloudinary:`, error.message || error);
                }
            }
        }

        // Delete the banner from the database
        await BannerV1Model.findByIdAndDelete(bannerId);

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


// Update Banner Function
export async function updateBanner(request, response) {
    try {
        const bannerId = request.params.id;
        const banner = await BannerV1Model.findById(bannerId);

        if (!banner) {
            return response.status(404).json({
                error: true,
                success: false,
                message: "Banner not found!",
            });
        }

        let newImages = request.body.images || [];
        let cloudinaryMessages = [];
        let validNewImages = [];

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

        // ✅ Preserve existing images if new images are not provided
        banner.images = validNewImages.length > 0 ? validNewImages : banner.images;

        // ✅ Only update banner title & images if new values are provided
        if (request.body.bannerTitle) {
            banner.bannerTitle = request.body.bannerTitle;
        }

        // ✅ Update banner in the database
        const updatedBanner = await BannerV1Model.findByIdAndUpdate(
            bannerId,
            {
                ...request.body,
                images: banner.images,
                bannerTitle: banner.bannerTitle,
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
            message: "Banner updated successfully.",
            success: true,
            cloudinaryMessages,
            banner: updatedBanner,
        });
    } catch (error) {
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

    const idArray = Array.isArray(ids) ? ids : ids.split(",").map((id) => id.trim());

    if (idArray.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        message: "Invalid banner IDs.",
        success: false,
        error: true,
      });
    }

    const banners = await BannerV1Model.find({ _id: { $in: idArray } });

    if (!banners.length) {
      return res.status(404).json({
        message: "No banners found with the given IDs.",
        success: false,
        error: true,
      });
    }

    console.log(`Found ${banners.length} banners for deletion.`);

    // Function to delete images from Cloudinary
    async function deleteImages(images, type) {
      if (!images || images.length === 0) return [];

      return Promise.allSettled(
        images.map(async (imageUrl, index) => {
          const publicId = extractPublicId(imageUrl);
          if (!publicId) return `Failed to extract public ID for ${type} image ${index + 1}.`;

          console.log(`Deleting ${type} image: ${publicId}`);

          try {
            const exists = await checkImageExists(publicId);
            if (exists) {
              const result = await cloudinary.uploader.destroy(publicId);
              return result.result === "ok"
                ? `${type} Image ${index + 1} deleted successfully.`
                : `Failed to delete ${type} image ${index + 1}: ${result.error?.message || "Unknown error"}`;
            } else {
              return `Image ${publicId} not found in Cloudinary.`;
            }
          } catch (error) {
            return `Error deleting ${type} image ${index + 1}: ${error.message}`;
          }
        })
      );
    }

    // Process image deletion for all banners
    const deletionPromises = banners.map(async (banner) => {
      const bannerImageMessages = await deleteImages(banner.images, "Banner");
      return bannerImageMessages;
    });

    const cloudinaryMessages = (await Promise.all(deletionPromises)).flat();

    // Delete banners from DB
    await BannerV1Model.deleteMany({ _id: { $in: idArray } });

    console.log("Banners deleted successfully.");

    return res.status(200).json({
      message: "Banners and associated images deleted successfully.",
      success: true,
      error: false,
      cloudinaryMessages,
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
