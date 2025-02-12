
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { mongoose } from 'mongoose';
import BlogModel from "../models/blog.model.js";

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});



// Declare imagesArr with let instead of const, so it can be modified
let imagesArr = [];

export async function uploadBlogImages(request, response) {
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
        console.error("Error in uploadBlogImages:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred during image upload.",
            error: true,
            success: false,
        });
    }
}


export async function addBlog(request, response) {
    try {

        // Step 3: Create a new category document
        let blog = new BlogModel({
            images: imagesArr,
            title: request.body.title,
            description: request.body.description,
        });

        // Step 4: Ensure the category is created
        if (!blog) {
            return response.status(500).json({
                message: "Blog not created",
                error: true,
                success: false,
            });
        }

        // Step 5: Save the category to the database
        blog = await blog.save();

        // Clear the images array after saving the category to avoid issues with future requests
        imagesArr = []; // Reset the array


        return response.status(200).json({
            // Return success response
            message: "Blog created successfully.",
            error: false,
            success: true,
            data: blog,
        });

    } catch (error) {
        console.error("Error creating blog:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred during blog creation.",
            error: true,
            success: false,
        });
    }
}


// Get all blogs  
export async function getBlogs(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000; // Default perPage limit

        // Calculate total blogs count
        const totalBlogs = await BlogModel.countDocuments();
        const totalPages = Math.ceil(totalBlogs / perPage);

        // Fetch paginated blogs from the database
        const blogs = await BlogModel.find()
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (blogs.length === 0) {
            return response.status(404).json({
                message: "No blogs found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Blogs retrieved successfully",
            error: false,
            success: true,
            data: blogs,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                perPage: perPage,
                totalBlogs: totalBlogs,
            },
        });

    } catch (error) {
        console.error("Error fetching blogs:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred while retrieving blogs.",
            error: true,
            success: false,
        });
    }
}



// get single bannerV1
export async function getBlog(request, response) {
    try {
        const { id } = request.params;
        console.log("Received ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid ObjectId format:", id);
            return response.status(400).json({
                message: "Invalid blog ID format",
                error: true,
                success: false,
            });
        }

        console.log("Fetching blog from DB...");
        const blog = await BlogModel.findById(id);

        if (!blog) {
            console.error("Blog not found for ID:", id);
            return response.status(404).json({ message: "Blog not found", error: true, success: false });
        }

        console.log("Blog found:", blog);
        return response.status(200).json({ message: "Blog retrieved successfully", error: false, success: true, data: blog });

    } catch (error) {
        console.error("Error getting blog:", error.stack);
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

// Controller for removing a blog image from Cloudinary and Database
export async function removeBlogImageFromCloudinary(request, response) {
    try {
        const imgUrl = request.query.imgUrl; // Ensure the correct query parameter name is used
        const blogId = request.query.blogId; // Optional: If we have a reference ID for DB removal

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
            await removeImageFromDatabase(imgUrl, blogId);

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
        await removeImageFromDatabase(imgUrl, blogId);

        return response.status(200).json({
            message: "Blog image removed successfully from cloudinary and database.",
            success: true,
        });

    } catch (error) {
        console.error("Error removing blog image:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred while removing the blog image.",
            error: true,
            success: false,
        });
    }
}


// Function to remove the image reference from the database
const removeImageFromDatabase = async (imgUrl, blogId) => {
    try {
        // Assuming you have a database connection setup
        const query = blogId
            ? { blogId } // Remove using blogId if available
            : { blogImageUrl: imgUrl }; // Otherwise, remove using image URL

        await BlogModel.findOneAndUpdate(query, { blogImageUrl: null });

        console.log("Successfully removed image reference from database:", query);
    } catch (error) {
        console.error("Error removing image from database:", error);
    }
};


export async function deleteBlog(request, response) {
    try {
        const blogId = request.params.id;

        // Find the blog by ID
        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return response.status(404).json({
                message: "Blog not found.",
                error: true,
                success: false,
            });
        }

        // Extract images from the blog
        const blogImages = Array.isArray(blog.images) ? blog.images : [];

        // Delete images associated with the blog from Cloudinary
        for (const imgUrl of blogImages) {
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

        // Delete the blog from the database
        await BlogModel.findByIdAndDelete(blogId);

        return response.status(200).json({
            message: "Blog deleted successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error deleting blog:", error.message || error);
        return response.status(500).json({
            message: error.message || "An error occurred while deleting the blog.",
            error: true,
            success: false,
        });
    }
}


// Update Blog Function
export async function updateBlog(request, response) {
    try {
        const blogId = request.params.id;
        const blog = await BlogModel.findById(blogId);

        if (!blog) {
            return response.status(404).json({
                error: true,
                success: false,
                message: "Blog not found!",
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
        blog.images = validNewImages.length > 0 ? validNewImages : blog.images;

        // ✅ Only update blog title & images if new values are provided
        if (request.body.title) {
            blog.title = request.body.title;
        }

        // ✅ Update blog in the database
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            blogId,
            {
                ...request.body,
                images: blog.images,
                title: blog.title,
            },
            { new: true }
        );

        if (!updatedBlog) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "Blog update failed!",
            });
        }

        return response.status(200).json({
            message: "Blog updated successfully.",
            success: true,
            cloudinaryMessages,
            blog: updatedBlog,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "An error occurred during blog update.",
            success: false,
            error: error.message || error,
        });
    }
}



export async function deleteMultipleBlog(req, res) {
    try {
      const { ids } = req.query;
  
      if (!ids || ids.length === 0) {
        return res.status(400).json({
          message: "No blog IDs provided.",
          success: false,
          error: true,
        });
      }
  
      const idArray = Array.isArray(ids) ? ids : ids.split(",").map((id) => id.trim());
  
      if (idArray.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({
          message: "Invalid blog IDs.",
          success: false,
          error: true,
        });
      }
  
      const blog = await BlogModel.find({ _id: { $in: idArray } });
  
      if (!blog.length) {
        return res.status(404).json({
          message: "No blog found with the given IDs.",
          success: false,
          error: true,
        });
      }
  
      console.log(`Found ${blog.length} blog for deletion.`);
  
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
  
      // Process image deletion for all blog
      const deletionPromises = blog.map(async (blog) => {
        const blogImageMessages = await deleteImages(blog.images, "Blog");
        return blogImageMessages;
      });
  
      const cloudinaryMessages = (await Promise.all(deletionPromises)).flat();
  
      // Delete blog from DB
      await BlogModel.deleteMany({ _id: { $in: idArray } });
  
      console.log("Blog deleted successfully.");
  
      return res.status(200).json({
        message: "Blog and associated images deleted successfully.",
        success: true,
        error: false,
        cloudinaryMessages,
      });
  
    } catch (error) {
      console.error("Error deleting blog:", error);
      return res.status(500).json({
        message: "Internal Server Error.",
        success: false,
        error: true,
      });
    }
  }