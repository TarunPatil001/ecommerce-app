import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import mongoose from "mongoose";

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

    const folderPath = `ecommerceApp/category_images`;
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


export async function createCategory(request, response) {
  try {
    console.log("📥 Incoming request:", request.body);
    console.log("📂 Uploaded Files:", request.files);

    const { name, parentCategoryId, parentCategoryName } = request.body;

    // Step 1: If there's a parent category, validate the parentCategoryId and parentCategoryName
    if (parentCategoryId) {
      const parentCategory = await CategoryModel.findById(parentCategoryId);

      // If parent category doesn't exist
      if (!parentCategory) {
        return response.status(400).json({
          message: "Parent category does not exist.",
          error: true,
          success: false,
        });
      }

      // Step 2: Ensure that the parentCategoryName matches the parentCategoryId
      if (parentCategory.name !== parentCategoryName) {
        return response.status(400).json({
          message: "parentCategoryName does not match parentCategoryId.",
          error: true,
          success: false,
        });
      }
    } else {
      // If no parentCategoryId, it's a root category, set parentCategoryName to null
      request.body.parentCategoryName = null;
    }

    const images = request.files?.images || [];  // Use uploaded category images

    if (!images.length) {
      return response.status(400).json({ error: "At least one category image is required." });
    }

    // ✅ Upload images to Cloudinary
    const uploadedImageUrls = await uploadImagesToCloudinary(images);
    console.log("📸 Uploaded category image URLs:", uploadedImageUrls);

    if (!uploadedImageUrls.length) {
      return response.status(500).json({ error: "Product image upload failed." });
    }

    // Step 3: Create a new category document
    let category = new CategoryModel({
      name: name, // Use the destructured 'name' instead of request.body.name
      images: uploadedImageUrls, // Use the global imagesArr
      parentCategoryId: parentCategoryId || null, // Handle the case when there's no parentCategoryId
      parentCategoryName: request.body.parentCategoryName || null, // Ensure parentCategoryName is null if no parentCategoryId
    });

    // Step 4: Ensure the category is created
    if (!category) {
      return response.status(500).json({
        message: "Category not created",
        error: true,
        success: false,
      });
    }

    // Step 5: Save the category to the database
    category = await category.save();

    if (!parentCategoryId) {
      return response.status(200).json({
        // Return success response
        message: "Category created successfully.",
        error: false,
        success: true,
        data: category,
      });
    } else {
      return response.status(200).json({
        // Return success response
        message: "SubCategory created successfully.",
        error: false,
        success: true,
        data: category,
      });
    }
  } catch (error) {
    console.error("Error creating category:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during category creation.",
      error: true,
      success: false,
    });
  }
}

// Get all categories  
export async function getCategories(request, response) {
  try {
    // Fetch all categories from the database
    const categories = await CategoryModel.find();

    // Check if there are no categories
    if (categories.length === 0) {
      return response.status(404).json({
        message: "No categories found",
        error: false,
        success: true,
        data: [], // Return an empty array for categories
      });
    }

    // Create a map to store categories by their _id for easy lookup
    const categoryMap = {};

    // Iterate through all categories to build the category map
    categories.forEach((category) => {
      categoryMap[category._id] = { ...category._doc, children: [] }; // Ensure each category has a 'children' array
    });

    // Prepare an array for root categories (those with no parentCategoryId)
    const rootCategories = [];

    // Iterate again to establish parent-child relationships
    categories.forEach((category) => {
      if (category.parentCategoryId) {
        // If the category has a parent, add it as a child of the parent category
        categoryMap[category.parentCategoryId].children.push(
          categoryMap[category._id]
        );
      } else {
        // If it's a root category, add it to the rootCategories array
        rootCategories.push(categoryMap[category._id]);
      }
    });

    // Return the response with the categories data, properly structured with children
    return response.status(200).json({
      message: "Categories retrieved successfully",
      error: false,
      success: true,
      data: rootCategories, // Return the root categories with their children
    });

  } catch (error) {
    console.error("Error getting categories:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during category retrieval.",
      error: true,
      success: false,
    });
  }
}

// Get category count
export async function getCategoriesCount(request, response) {
  try {
    const categoryCount = await CategoryModel.countDocuments({
      parentCategoryId: undefined, // Only count categories with no parent
    });

    if (!categoryCount) {
      return response.status(500).json({
        message: "No categories found",
        error: true,
        success: false,
        data: categoryCount,
      });
    } else {
      response.send({
        message: "Categories count retrieved successfully",
        error: false,
        success: true,
        data: categoryCount,
      });
    }
  } catch (error) {
    console.error("Error getting category count:", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during category count retrieval.",
      error: true,
      success: false,
    });
  }
}

// Get subcategory count
export async function getSubCategoriesCount(request, response) {
  try {
    // Count documents where parentCategoryId exists
    const subCategoryCount = await CategoryModel.countDocuments({
      parentCategoryId: { $ne: null }, // $ne (not equal) to null
    });

    // Check if there are no subcategories
    if (subCategoryCount === 0) {
      return response.status(404).json({
        message: "No subcategories found",
        error: false,
        success: true,
        data: subCategoryCount,
      });
    }

    return response.status(200).json({
      message: "Subcategory count retrieved successfully",
      error: false,
      success: true,
      data: subCategoryCount,
    });
  } catch (error) {
    console.error("Error getting subcategory count:", error.message || error);
    return response.status(500).json({
      message:
        error.message ||
        "An error occurred during subcategory count retrieval.",
      error: true,
      success: false,
    });
  }
}

// get single category
export async function getCategory(request, response) {
  try {
    const category = await CategoryModel.findById(request.params.id);
    if (!category) {
      return response.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      message: "Category retrieved successfully",
      error: false,
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error getting category:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during category retrieval.",
      error: true,
      success: false,
    });
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


// Controller for deleting a category and its images
export async function deleteCategory(request, response) {
  try {
    const categoryId = request.params.id;
    // Find the category by ID
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return response.status(404).json({
        message: "Category not found.",
        error: true,
        success: false,
      });
    }

    // Delete product and banner images from Cloudinary
    await deleteCloudinaryImages([...category.images]);

    // Finally, delete the main category
    await CategoryModel.findByIdAndDelete(categoryId);

    console.log(`Parent Category ${categoryId} and its images deleted successfully.`);
    return response.status(200).json({
      message: "Category and associated data deleted successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error deleting category:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred while deleting the category.",
      error: true,
      success: false,
    });
  }
}


export async function deleteMultipleCategories(request, response) {
  try {
    // Read the category IDs from the query parameter
    const { ids } = request.query; // Query parameter should be 'ids'

    // Validate the ids query parameter
    if (!ids || ids.length === 0) {
      return response.status(400).json({
        message: "Invalid request. Provide category IDs.",
        success: false,
        error: true,
      });
    }

    // Split the comma-separated ids string into an array and validate ObjectIds
    const categoryIds = Array.isArray(ids) ? ids : ids.split(",").map((id) => id.trim());

    // Validate all IDs are valid MongoDB ObjectIds
    if (categoryIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return response.status(400).json({
        message: "Invalid category ID format.",
        success: false,
        error: true,
      });
    }

    // Fetch the categories that match the given IDs
    const categories = await CategoryModel.find({ _id: { $in: categoryIds } });

    if (categories.length === 0) {
      return response.status(404).json({
        message: "No categories found.",
        success: false,
        error: true,
      });
    }

    console.log(`Found ${categories.length} categories for deletion.`);

    // Extract and delete images using helper function
    const allImages = categories.flatMap(category => [...category.images]);
    await deleteCloudinaryImages(allImages);

    // Delete categories from DB - using categoryIds instead of undefined idArray
    await CategoryModel.deleteMany({ _id: { $in: categoryIds } });

    console.log("Categories deleted successfully.");

    return response.status(200).json({
      message: "Categories and associated images deleted successfully.",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error deleting categories:", error);
    return response.status(500).json({
      message: "An error occurred while deleting categories.",
      success: false,
      error: true,
    });
  }
}


// Update Category
export async function updateCategory(request, response) {
  try {
    const categoryId = request.params.id;
    const { name, parentCategoryId, parentCategoryName, images: imagesRaw, removedFiles: removedFilesRaw } = request.body;

    // Find the category to be updated
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return response.status(404).json({ message: "Category not found.", success: false });
    }

    // ✅ Parse removedFiles correctly
    let removedFiles = [];
    if (typeof removedFilesRaw === "string") {
      try {
        removedFiles = JSON.parse(removedFilesRaw);
        removedFiles = Array.isArray(removedFiles)
          ? removedFiles.filter((file) => typeof file === "string" && file.startsWith("https://res.cloudinary.com"))
          : [];
      } catch {
        removedFiles = [];
      }
    }

    // ✅ Parse images correctly
    let images = category.images || [];
    if (typeof imagesRaw === "string") {
      try {
        images = JSON.parse(imagesRaw);
        if (!Array.isArray(images)) images = category.images || [];
      } catch {
        images = category.images || [];
      }
    }

    // ✅ Upload new images if provided (Parallel Execution)
    const [newImages] = await Promise.all([
      request.files?.newCategoryImages ? uploadImagesToCloudinary(request.files.newCategoryImages) : [],
      deleteCloudinaryImages(removedFiles), // Remove Cloudinary images concurrently
    ]);

    // ✅ Update images list
    images = images.filter((img) => !removedFiles.includes(img));
    const updatedImages = [...images, ...newImages];

    // ✅ Update the category with new data
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        name: name?.trim() || category.name,
        images: updatedImages,
        parentCategoryId: parentCategoryId || category.parentCategoryId,
        parentCategoryName: parentCategoryName || category.parentCategoryName,
      },
      { new: true }
    );

    return response.status(200).json({
      message: "Category updated successfully.",
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return response.status(500).json({
      message: error.message || "An error occurred while updating the category.",
      error: true,
      success: false,
    });
  }
}
