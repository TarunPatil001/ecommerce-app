
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


export async function addBlog(request, response) {
    try {
        console.log("📥 Incoming request body:", request.body);
        console.log("📂 Uploaded files:", request.files);

        const {
            title,
            description
        } = request.body;

        // Validate required fields
        const missingFields = [];
        if (!title) missingFields.push("Banner title");
        if (!description) missingFields.push("Description");

        if (missingFields.length > 0) {
            return response.status(400).json({
                message: `${missingFields.join(" and ")} ${missingFields.length > 1 ? "are" : "is"} required.`,
                error: true,
                success: false
            });
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


        // Step 3: Create a new category document
        let blog = new BlogModel({
            images: uploadedImageUrls,
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

        // Delete product and banner images from Cloudinary
        await deleteCloudinaryImages([...blog.images]);

        // Finally, delete the main category
        await BlogModel.findByIdAndDelete(blogId);

        console.log(`Blog ${blogId} and its images deleted successfully.`);
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
// export async function updateBlog(request, response) {
//     try {
//         const blogId = request.params.id;

//         let {
//             title,
//             description,
//             images,
//             removedFiles,
//         } = request.body;

//         const blog = await BlogModel.findById(blogId);

//         if (!blog) {
//             return response.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "Blog not found!",
//             });
//         }

//         // ✅ Ensure `removedFiles` and `removedBannerFiles` are parsed correctly and only contain valid Cloudinary URLs
//         if (removedFiles && typeof removedFiles === "string") {
//             try {
//                 removedFiles = JSON.parse(removedFiles);
//                 if (!Array.isArray(removedFiles)) {
//                     removedFiles = [];
//                 }
//                 removedFiles = removedFiles.filter((file) => typeof file === "string" && file.startsWith("https://res.cloudinary.com"));
//             } catch (err) {
//                 console.error("Error parsing removedFiles: ", err);
//                 removedFiles = [];
//             }
//         } else if (!Array.isArray(removedFiles)) {
//             removedFiles = [];
//         }

//         console.log("removedFiles after parsing: ", removedFiles); // Log the parsed removed files

//         // ✅ Ensure `images` and `bannerImages` are parsed correctly
//         try {
//             images = Array.isArray(images) ? images : images ? JSON.parse(images) : blog.images || [];
//         } catch (err) {
//             console.error("Error parsing images", err);
//             images = product.images || [];
//         }

//         console.log("images after parsing: ", images); // Log the parsed images

//         // ✅ Upload new images if provided
//         const newImages = request.files?.newBlogImages ? await uploadImagesToCloudinary(request.files.newProductImages) : [];
//         console.log("newImages uploaded: ", newImages); // Log new images uploaded

//         // ✅ Remove only Cloudinary product images
//         await deleteCloudinaryImages(removedFiles);
//         images = images.filter((img) => !removedFiles.includes(img));

//         console.log("images after removal: ", images); // Log images after removal of Cloudinary images

//         // ✅ Append new images and banners in the pattern you provided
//         const updatedImages = [...images, ...newImages];
//         console.log("updatedImages: ", updatedImages); // Log the updated images

//         // ✅ Update blog in the database
//         const updatedBlog = await BlogModel.findByIdAndUpdate(
//             blogId,
//             {
//                 images: updatedImages,
//                 title: blog.title,
//                 description: blog.description,
//             },
//             { new: true }
//         );

//         if (!updatedBlog) {
//             return response.status(400).json({
//                 error: true,
//                 success: false,
//                 message: "Blog update failed!",
//             });
//         }

//         return response.status(200).json({
//             message: "Blog updated successfully.",
//             success: true,
//             blog: updatedBlog,
//         });
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || "An error occurred during blog update.",
//             success: false,
//             error: error.message || error,
//         });
//     }
// }
// Update Blog Function
export async function updateBlog(request, response) {
    try {
        const blogId = request.params.id;
        let { title, description, images, removedFiles } = request.body;

        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return response.status(404).json({
                error: true,
                success: false,
                message: "Blog not found!",
            });
        }

        // ✅ Parse `removedFiles` safely
        if (typeof removedFiles === "string") {
            try {
                removedFiles = JSON.parse(removedFiles);
                removedFiles = Array.isArray(removedFiles) ? removedFiles.filter((file) => typeof file === "string" && file.startsWith("https://res.cloudinary.com")) : [];
            } catch (err) {
                console.error("Error parsing removedFiles:", err);
                removedFiles = [];
            }
        } else if (!Array.isArray(removedFiles)) {
            removedFiles = [];
        }

        console.log("removedFiles after parsing:", removedFiles);

        // ✅ Parse `images` safely
        try {
            images = Array.isArray(images) ? images : images ? JSON.parse(images) : blog.images || [];
        } catch (err) {
            console.error("Error parsing images:", err);
            images = blog.images || [];
        }

        console.log("images after parsing:", images);

        // ✅ Upload new images if provided
        const newImages = request.files?.newBlogImages ? await uploadImagesToCloudinary(request.files.newBlogImages) : [];
        console.log("newImages uploaded:", newImages);

        // ✅ Remove Cloudinary images
        await deleteCloudinaryImages(removedFiles);
        images = images.filter((img) => !removedFiles.includes(img));

        console.log("images after removal:", images);

        // ✅ Append new images
        const updatedImages = [...images, ...newImages];
        console.log("updatedImages:", updatedImages);

        // ✅ Update the blog in the database
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            blogId,
            { title, description, images: updatedImages },
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
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        return response.status(500).json({
            message: "An error occurred during blog update.",
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

        // Extract and delete images using helper function
        const allImages = blog.flatMap(blogs => [...blogs.images]);
        await deleteCloudinaryImages(allImages);

        // Delete products from DB
        await BlogModel.deleteMany({ _id: { $in: idArray } });

        console.log("Blog deleted successfully.");

        return res.status(200).json({
            message: "Blog and associated images deleted successfully.",
            success: true,
            error: false,
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