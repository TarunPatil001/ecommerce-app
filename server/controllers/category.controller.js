import CategoryModel from "../models/category.modal.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});


var imagesArr = [];
export async function uploadCategoryImages(request, response) {
  try {
    imagesArr = [];
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
        console.error(
          "Error uploading image to Cloudinary:",
          uploadError.message || uploadError
        );
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

export async function createCategory(request, response) {
  try {
    // Create a new category document
    let category = new CategoryModel({
      name: request.body.name,
      images: imagesArr,
      parentCategoryId: request.body.parentCategoryId,
      parentCategoryName: request.body.parentCategoryName,
    });

    if (!category) {
      return response.status(500).json({
        message: "Category not created",
        error: true,
        success: false,
      });
    }

    // Save the category to the database
    category = await category.save();
    imagesArr = []; // Reset the images array for the next request

    return response.status(200).json({
      message: "Category created successfully.",
      error: false,
      success: true,
      category: category,
    });
  } catch (error) {
    console.error("Error creating category:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during category creation.",
      error: true,
      success: false,
    });
  }
}

// get all categories
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
        categoryCount: categoryCount,
      });
    } else {
      response.send({
        message: "Categories count retrieved successfully",
        error: false,
        success: true,
        categoryCount: categoryCount,
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
        subCategoryCount,
      });
    }

    return response.status(200).json({
      message: "Subcategory count retrieved successfully",
      error: false,
      success: true,
      subCategoryCount,
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
      category,
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

// Controller for removing an image from Cloudinary
export async function removeCategoryImageFromCloudinary(request, response) {
  try {
    const imgUrl = request.query.img;

    if (!imgUrl) {
      return response.status(400).json({
        message: "Image URL is required.",
        error: true,
        success: false,
      });
    }

    const urlArr = imgUrl.split("/");
    const imageName = urlArr[urlArr.length - 1].split(".")[0];
    const publicId = `ecommerceApp/uploads/${imageName}`;

    if (imageName) {
      const res = await cloudinary.uploader.destroy(publicId);

      if (res.result !== "ok") {
        return response.status(500).json({
          message: "An error occurred during image removal.",
          error: true,
          success: false,
        });
      }

      return response.status(200).json({
        message: "Image removed successfully.",
        success: true,
      });
    } else {
      return response.status(400).json({
        message: "Invalid image name.",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    console.error("Error removing image:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred while removing the image.",
      error: true,
      success: false,
    });
  }
}

// delete category
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

    const categoryImages = Array.isArray(category.images)
      ? category.images
      : [];

    // Delete images associated with the category from Cloudinary
    const imageDeletePromises = categoryImages.map((imgUrl) => {
      const urlArr = imgUrl.split("/");
      const imageName = urlArr[urlArr.length - 1].split(".")[0];
      const publicId = `ecommerceApp/uploads/${imageName}`;
      return cloudinary.uploader.destroy(publicId);
    });

    // Wait for all image deletions to complete
    await Promise.all(imageDeletePromises);

    // Function to recursively delete subcategories
    const deleteSubcategories = async (parentCategoryId) => {
      const subCategories = await CategoryModel.find({ parentCategoryId });

      for (const subCategory of subCategories) {
        // Recursively delete subcategories
        await deleteSubcategories(subCategory._id);

        const subCategoryImages = Array.isArray(subCategory.images)
          ? subCategory.images
          : [];
        const subImageDeletePromises = subCategoryImages.map((imgUrl) => {
          const urlArr = imgUrl.split("/");
          const imageName = urlArr[urlArr.length - 1].split(".")[0];
          const publicId = `ecommerceApp/uploads/${imageName}`;
          return cloudinary.uploader.destroy(publicId);
        });

        // Wait for all subcategory image deletions to complete
        await Promise.all(subImageDeletePromises);
        // Delete the subcategory from the database
        await CategoryModel.findByIdAndDelete(subCategory._id);
      }
    };

    // Delete subcategories associated with the main category
    await deleteSubcategories(categoryId);

    // Finally, delete the main category
    await CategoryModel.findByIdAndDelete(categoryId);

    return response.status(200).json({
      message: "Category and associated data deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting category:", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred while deleting the category.",
      error: true,
      success: false,
    });
  }
}

// update Category
export async function updateCategory(request, response) {
  try {
    const categoryId = request.params.id;
    const categoryData = request.body; // New data coming from the request body

    // Find the category to be updated
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return response.status(404).json({
        message: "Category not found.",
        success: false,
      });
    }

    // If the category has images, delete the old ones from Cloudinary
    if (category.images && category.images.length > 0) {
      const imageDeletePromises = category.images.map((imgUrl) => {
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

    // Update the category with new data (including new images if available)
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        name: categoryData.name || category.name,
        images: imagesArr.length > 0 ? imagesArr : category.images, // Only update images if new ones are uploaded
        parentCategoryId:
          categoryData.parentCategoryId || category.parentCategoryId,
        parentCategoryName:
          categoryData.parentCategoryName || category.parentCategoryName,
      },
      { new: true } // Return the updated document
    );

    return response.status(200).json({
      message: "Category updated successfully.",
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error in updateCategory:", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred while updating the category.",
      error: true,
      success: false,
    });
  }
}
