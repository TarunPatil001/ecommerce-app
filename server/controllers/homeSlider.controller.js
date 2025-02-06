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



let imagesArr = [];

export async function uploadHomeSlideImages(request, response) {
    try {
        // Reset images array to ensure it's fresh for each upload
        imagesArr = [];

        const images = request.files; // Extract images from multer

        if (!images || images.length === 0) {
            return response.status(400).json({
                message: "No image files uploaded.",
                success: false,
            });
        }

        const options = {
            folder: "ecommerceApp/uploads", // Specify Cloudinary folder
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        // Process each image
        for (let i = 0; i < images.length; i++) {
            try {
                // Upload image to Cloudinary
                const result = await cloudinary.uploader.upload(images[i].path, options);
                imagesArr.push(result.secure_url);

                // Delete local image after successful upload
                await fs.promises.unlink(images[i].path);
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError.message || uploadError);
                // Skip the failed upload but continue with the others
            }
        }

        return response.status(200).json({
            images: imagesArr,
            message: "Images uploaded successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error in uploadHomeSlideImages:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred during image upload.",
            error: true,
            success: false,
        });
    }
}



export async function addHomeSlide(request, response) {
    try {
        const { homeSlideId } = request.body;

        // Step 1: If homeSlideId is provided, validate if it exists
        if (homeSlideId) {
            const existingHomeSlide = await HomeSliderModel.findById(homeSlideId);

            // If home slide doesn't exist
            if (!existingHomeSlide) {
                return response.status(400).json({
                    message: "Home Slide does not exist.",
                    error: true,
                    success: false,
                });
            }

            // Step 2: Create the home slide banner (sub-home-slide)
            let homeSlideBanner = new HomeSliderModel({
                images: imagesArr, // Use the global imagesArr with uploaded images
                homeSlideId: homeSlideId || null, // Parent homeSlideId if applicable
            });

            // Step 3: Ensure the home slide banner is created
            if (!homeSlideBanner) {
                return response.status(500).json({
                    message: "Failed to create Home Slide Banner.",
                    error: true,
                    success: false,
                });
            }

            // Step 4: Save the home slide banner to the database
            homeSlideBanner = await homeSlideBanner.save();

            // Clear the images array after saving to avoid issues with future requests
            imagesArr = []; // Reset the array to prevent reuse in other requests

            return response.status(200).json({
                message: "Home Slide Banner created successfully.",
                error: false,
                success: true,
                data: homeSlideBanner,
            });
        } else {
            // Step 5: If no homeSlideId is provided, create a root home slide
            let homeSlideBanner = new HomeSliderModel({
                images: imagesArr, // Use the global imagesArr with uploaded images
                homeSlideId: null, // No parent homeSlideId for root
            });

            // Step 6: Save the home slide banner to the database
            homeSlideBanner = await homeSlideBanner.save();

            // Clear the images array after saving to avoid issues with future requests
            imagesArr = []; // Reset the array to prevent reuse in other requests

            return response.status(200).json({
                message: "Home Slide created successfully.",
                error: false,
                success: true,
                data: homeSlideBanner,
            });
        }
    } catch (error) {
        console.error("Error creating homeSlide:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred during homeSlide creation.",
            error: true,
            success: false,
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
const extractPublicId = (imgUrl) => {
    try {
        const urlArr = imgUrl.split("/");
        const imageName = urlArr[urlArr.length - 1].split(".")[0];
        return `ecommerceApp/uploads/${imageName}`;
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
        const res = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Response:", res);

        if (res.result !== "ok") {
            return response.status(500).json({
                message: `Error deleting image from Cloudinary: ${res.result}`,
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

        const slideImages = Array.isArray(homeSlide.images) ? homeSlide.images : [];

        // Delete images from Cloudinary in parallel
        await Promise.all(slideImages.map(async (imgUrl) => {
            const publicId = extractPublicId(imgUrl);
            if (publicId) {
                const exists = await checkImageExists(publicId);
                if (exists) {
                    await cloudinary.uploader.destroy(publicId);
                } else {
                    console.warn(`Image ${publicId} not found in Cloudinary.`);
                }
            }
        }));

        // Delete the home slide from the database
        await HomeSliderModel.findByIdAndDelete(homeSlideId);

        return response.status(200).json({
            message: "Home Slide deleted successfully.",
            success: true,
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

        // Delete images from Cloudinary
        const deletePromises = slides.flatMap((slide) => {
            if (!slide.images || slide.images.length === 0) {
                console.warn(`No images found for slide with ID: ${slide._id}`);
                return [];
            }

            // For each image in the slide, delete it from Cloudinary
            return slide.images.map(async (imgUrl) => {
                try {
                    const publicId = imgUrl.split("/").pop().split(".")[0];
                    console.log(`Deleting image with public ID: ${publicId}`);
                    await cloudinary.uploader.destroy(`ecommerceApp/uploads/${publicId}`);
                } catch (err) {
                    console.error("Error deleting image from Cloudinary:", err);
                }
            });
        });

        // Wait for all image deletion promises to complete
        await Promise.all(deletePromises);

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




// Update HomeSlide
export async function updateHomeSlide(request, response) {
    try {
        const homeSlideId = request.params.id;
        const homeSlideData = request.body;

        // Find the HomeSlide by ID
        const homeSlide = await HomeSliderModel.findById(homeSlideId);

        if (!homeSlide) {
            return response.status(404).json({
                message: "Home Slide not found.",
                success: false
            });

        }


        // If the homeSlide has images, delete the old ones from Cloudinary
        if (homeSlide.images && homeSlide.images.length > 0) {
            const imageDeletePromises = homeSlide.images.map((imgUrl) => {
                const urlArr = imgUrl.split("/");
                const imageName = urlArr[urlArr.length - 1].split(".")[0];
                const publicId = `ecommerceApp/uploads/${imageName}`;
                return cloudinary.uploader.destroy(publicId); // Remove image from Cloudinary
            });

            await Promise.all(imageDeletePromises);
        }

        // Now proceed to upload new images if provided
        const image = request.files; // Assuming images are coming through the request files (Multer)
        if (image && image.length > 0) {
            // Upload new images to Cloudinary
            const options = {
                folder: "ecommerceApp/uploads", // Specify the folder in Cloudinary
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            for (let i = 0; i < image.length; i++) {
                const result = await cloudinary.uploader.upload(image[i].path, options);
                imagesArr.push(result.secure_url); // Save the uploaded image URL
                await fs.promises.unlink(image[i].path); // Delete the image from local storage after upload
            }
        }


        // Update the HomeSlide in DB
        const updatedHomeSlide = await HomeSliderModel.findByIdAndUpdate(
            homeSlideId,
            { 
                images: imagesArr.length > 0 ? imagesArr : homeSlide.images, 
            },
            { new: true }
        );

        return response.status(200).json({
            message: "Home Slide updated successfully.",
            success: true,
            data: updatedHomeSlide,
        });

    } catch (error) {
        console.error("Error updating Home Slide:", error);
        return response.status(500).json({ message: "An error occurred.", success: false });
    }
}
