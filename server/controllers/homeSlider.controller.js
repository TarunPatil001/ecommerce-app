import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { mongoose } from 'mongoose';
import HomeSliderModel from "../models/homeSlider.model.js";

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});



// let imagesArr = [];

// export async function uploadHomeSlideImages(request, response) {
//     try {
//         // Reset images array to ensure it's fresh for each upload
//         imagesArr = [];

//         const images = request.files; // Extract images from multer

//         if (!images || images.length === 0) {
//             return response.status(400).json({
//                 message: "No image files uploaded.",
//                 success: false,
//             });
//         }

//         const options = {
//             folder: "ecommerceApp/uploads", // Specify Cloudinary folder
//             use_filename: true,
//             unique_filename: false,
//             overwrite: false,
//         };

//         // Process each image
//         for (let i = 0; i < images.length; i++) {
//             try {
//                 // Upload image to Cloudinary
//                 const result = await cloudinary.uploader.upload(images[i].path, options);
//                 imagesArr.push(result.secure_url);

//                 // Delete local image after successful upload
//                 await fs.promises.unlink(images[i].path);
//             } catch (uploadError) {
//                 console.error("Error uploading image to Cloudinary:", uploadError.message || uploadError);
//                 // Skip the failed upload but continue with the others
//             }
//         }

//         return response.status(200).json({
//             images: imagesArr,
//             message: "Images uploaded successfully.",
//             success: true,
//         });
//     } catch (error) {
//         console.error("Error in uploadHomeSlideImages:", error.message || error);
//         return response.status(500).json({
//             message: error.message || "An error occurred during image upload.",
//             error: true,
//             success: false,
//         });
//     }
// }

// =====================================================================
// Upload images to Cloudinary
async function uploadImagesToCloudinary(files) {
    try {
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error("Invalid or empty file array received");
        }

        console.log("🚀 Uploading images to Cloudinary");

        const folderPath = `ecommerceApp/homeSlides_images`;
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

export async function addHomeSlide(request, response) {
    try {
        console.log("📂 Request files:", request.files);
        console.log("📝 Request body:", request.body);

        // Validate input
        if (!request.files?.images || request.files.images.length === 0) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "At least one homeSlide image is required."
            });
        }

        // Upload images to Cloudinary
        const uploadedImageUrls = await uploadImagesToCloudinary(request.files.images);

        // Create new home slide document
        const homeSlideBanner = new HomeSliderModel({
            images: uploadedImageUrls,
            homeSlideId: request.body.homeSlideId || null,
        });

        // Save to database
        const savedBanner = await homeSlideBanner.save();

        if (!savedBanner) {
            throw new Error("Failed to save home slide to database");
        }

        return response.status(201).json({
            message: "Home Slide created successfully",
            error: false,
            success: true,
            data: savedBanner
        });

    } catch (error) {
        console.error("❌ Error in addHomeSlide:", error);
        return response.status(500).json({
            message: error.message || "Failed to create home slide",
            error: true,
            success: false
        });
    }
}



// Get all homeSlide  
export async function getHomeSlide(request, response) {
    try {
        const homeSlides = await HomeSliderModel.find();

        if (!homeSlides || homeSlides.length === 0) {
            return response.status(404).json({
                message: "No Home Slide Banners found.",
                error: false,
                success: true,
                data: [],
            });
        }

        return response.status(200).json({
            message: "Home Slides retrieved successfully.",
            error: false,
            success: true,
            data: homeSlides, // Return fetched slides
        });

    } catch (error) {
        console.error("Error getting home slides:", error.message || error);
        return response.status(500).json({
            message: "An error occurred during home slide retrieval.",
            error: true,
            success: false,
        });
    }
}


export async function getHomeSlideByID(request, response) {
    try {
        const homeSlide = await HomeSliderModel.findById(request.params.id);  // Use findById to fetch by ID

        if (!homeSlide) {
            return response.status(404).json({
                message: "Home Slide not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Home Slide retrieved successfully",
            error: false,
            success: true,
            data: homeSlide,  // Return the fetched slide (single object)
        });

    } catch (error) {
        console.error("Error getting home slide:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred during home slide retrieval.",
            error: true,
            success: false,
        });
    }
}


// Helper function to extract publicId from image URL
// const extractPublicId = (imgUrl) => {
//     try {
//         const urlArr = imgUrl.split("/");
//         const imageName = urlArr[urlArr.length - 1].split(".")[0];
//         return `ecommerceApp/uploads/${imageName}`; // Assuming this is the base format for your Cloudinary public ID
//     } catch (error) {
//         console.error("Error extracting public ID:", error);
//         return null;
//     }
// };
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

// Function to check if an image exists in Cloudinary
// const checkImageExists = async (publicId) => {
//     try {
//         await cloudinary.api.resource(publicId);
//         return true; // Image exists
//     } catch (error) {
//         console.error("Error checking image existence:", error.message || error);
//         return false; // Image not found
//     }
// };

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






// Controller for removing an image from Cloudinary
export async function removeHomeSlideImageFromCloudinary(request, response) {
    try {
        const imgUrl = request.query.img;
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

        // Check if image exists in Cloudinary
        const exists = await checkImageExists(publicId);
        if (!exists) {
            return response.status(404).json({
                message: "Image not found in Cloudinary.",
                error: true,
                success: false,
            });
        }

        // Delete image from Cloudinary
        const response = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Response:", response);

        if (response.result !== "ok") {
            return response.status(500).json({
                message: `Error deleting image from Cloudinary: ${response.result}`,
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Image removed successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error removing image:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred while removing the image.",
            error: true,
            success: false,
        });
    }
}





// Controller to delete a Home Slide
export async function deleteHomeSlide(request, response) {
    try {
        const homeSlideId = request.params.id;
        // Find the home slide by ID
        const homeSlide = await HomeSliderModel.findById(homeSlideId);

        if (!homeSlide) {
            return response.status(404).json({
                message: "Home Slide not found.",
                error: true,
                success: false,
            });
        }

        // Delete homeSlide and banner images from Cloudinary
        await deleteCloudinaryImages([...homeSlide.images]);

        // Delete the homeSlide from the database
        await HomeSliderModel.findByIdAndDelete(homeSlideId);

        console.log(`HomeSlide ${homeSlideId} and its images deleted successfully.`);

        return response.status(200).json({
            message: "HomeSlide and associated images deleted successfully.",
            success: true,
            error: false,
        });

    } catch (error) {
        console.error("Error deleting home slide:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred while deleting the home slide.",
            error: true,
            success: false,
        });
    }
}



export async function deleteMultipleHomeSlides(request, response) {
    try {
        // Read the slide IDs from the query parameter
        const { ids } = request.query; // Query parameter should be 'ids'

        // Validate the ids query parameter
        if (!ids || !ids.trim()) {
            return response.status(400).json({
                message: "Invalid request. Provide slide IDs.",
                success: false
            });
        }

        // Split the comma-separated ids string into an array
        const slideIds = ids.split(',');

        // Fetch the slides that match the given IDs
        const slides = await HomeSliderModel.find({ _id: { $in: slideIds } });

        if (slides.length === 0) {
            return response.status(404).json({
                message: "No Home Slides found.",
                success: false
            });
        }

        console.log(`Found ${slides.length} slides for deletion.`); // Log number of slides found

        // Extract and delete images using helper function
        const allImages = slides.flatMap(slides => [...slides.images]);
        await deleteCloudinaryImages(allImages);

        // Delete slides from the database
        await HomeSliderModel.deleteMany({ _id: { $in: slideIds } });

        return response.status(200).json({
            message: "Selected Home Slides deleted successfully.",
            success: true,
        });

    } catch (error) {
        console.error("Error deleting Home Slides:", error);
        return response.status(500).json({
            message: "An error occurred while deleting Home Slides.",
            success: false
        });
    }
}


// // Update HomeSlide
// export async function updateHomeSlide(request, response) {
//     try {
//         // const { id } = request.params;
//         // const { removedImages = [] } = request.body;

//         const homeSlideId = request.params.id;
//         const homeSlide = await ProductModel.findById(homeSlideId);

//         if (!homeSlide) {
//             return response.status(404).json({ error: true, success: false, message: "HomeSlide not found" });
//         }

//         let { images, removedFiles } = request.body;

//         console.log("Incoming request body:", request.body); // Log incoming request body

//         // ✅ Ensure `removedFiles` is parsed correctly and only contain valid Cloudinary URLs
//         if (removedFiles && typeof removedFiles === "string") {
//             try {
//                 removedFiles = JSON.parse(removedFiles);
//                 if (!Array.isArray(removedFiles)) {
//                     removedFiles = [];
//                 }
//                 removedFiles = removedFiles.filter((file) => typeof file === "string" && file.startsWith("https://res.cloudinary.com"));
//             } catch (err) {
//                 console.error("Error parsing removedFiles:", err);
//                 removedFiles = [];
//             }
//         } else if (!Array.isArray(removedFiles)) {
//             removedFiles = [];
//         }


//         console.log("removedFiles after parsing:", removedFiles); // Log the parsed removed files

//         // ✅ Ensure `images` and `bannerImages` are parsed correctly
//         try {
//             images = Array.isArray(images) ? images : images ? JSON.parse(images) : homeSlide.images || [];
//         } catch (err) {
//             console.error("Error parsing images or bannerImages:", err);
//             images = homeSlide.images || [];
//         }

//         console.log("images after parsing:", images); // Log the parsed images

//         // ✅ Upload new images if provided
//         const newImages = request.files?.newHomeSlideImages ? await uploadImagesToCloudinary(request.files.newHomeSlideImages) : [];

//         console.log("newImages uploaded:", newImages); // Log new images uploaded

//         // ✅ Remove only Cloudinary product images
//         await deleteCloudinaryImages(removedFiles);
//         images = images.filter((img) => !removedFiles.includes(img));

//         console.log("images after removal:", images); // Log images after removal of Cloudinary images

//         // ✅ Append new images and banners in the pattern you provided
//         const updatedImages = [...images, ...newImages];

//         console.log("updatedImages:", updatedImages); // Log the updated images

//         // Update database
//         const updatedSlide = await HomeSliderModel.findByIdAndUpdate(
//             homeSlideId,
//             {images: updatedImages },
//             { new: true }
//         );

//         if (!updatedSlide) {
//             return response.status(400).json({ error: true, success: false, message: "HomeSlide failed to update!" });
//           }

//         res.status(200).json({
//             message: "HomeSlide updated successfully",
//             success: true,
//             error: false,
//             data: updatedSlide
//         });
//     } catch (error) {
//         console.error('Update error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message || 'Update failed'
//         });
//     }
// };

// Update HomeSlide
export async function updateHomeSlide(request, response) {
    try {
        const homeSlideId = request.params.id;
        const homeSlide = await HomeSliderModel.findById(homeSlideId);

        if (!homeSlide) {
            return response.status(404).json({ error: true, success: false, message: "HomeSlide not found" });
        }

        let { images, removedFiles } = request.body;

        console.log("Incoming request body:", request.body); // Log incoming request body

        // ✅ Ensure `removedFiles` is parsed correctly and only contain valid Cloudinary URLs
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

        console.log("removedFiles after parsing:", removedFiles); // Log the parsed removed files

        // ✅ Ensure `images` is parsed correctly
        try {
            images = Array.isArray(images) ? images : images ? JSON.parse(images) : homeSlide.images || [];
        } catch (err) {
            console.error("Error parsing images:", err);
            images = homeSlide.images || [];
        }

        console.log("images after parsing:", images); // Log the parsed images

        // ✅ Upload new images if provided
        const newImages = request.files?.newHomeSlideImages ? await uploadImagesToCloudinary(request.files.newHomeSlideImages) : [];

        console.log("newImages uploaded:", newImages); // Log new images uploaded

        // ✅ Remove only Cloudinary product images
        await deleteCloudinaryImages(removedFiles);
        images = images.filter((img) => !removedFiles.includes(img));

        console.log("images after removal:", images); // Log images after removal of Cloudinary images

        // ✅ Append new images
        const updatedImages = [...images, ...newImages];

        console.log("updatedImages:", updatedImages); // Log the updated images

        // Update database
        const updatedSlide = await HomeSliderModel.findByIdAndUpdate(
            homeSlideId,
            { images: updatedImages },
            { new: true }
        );

        if (!updatedSlide) {
            return response.status(400).json({ error: true, success: false, message: "HomeSlide failed to update!" });
        }

        return response.status(200).json({
            message: "HomeSlide updated successfully",
            success: true,
            error: false,
            data: updatedSlide
        });
    } catch (error) {
        console.error('Update error:', error);
        return response.status(500).json({
            success: false,
            message: error.message || 'Update failed'
        });
    }
};