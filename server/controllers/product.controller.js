import ProductModel from "../models/product.model.js";
import CategoryModel from './../models/category.model.js';
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});


// -----------------------------------------------------------------------------------------

// ? 01-02-2025

// var imagesArr = [];

// export async function uploadProductImages(request, response) {
//   try {
//     const image = request.files;

//     // Upload the new images to Cloudinary
//     const options = {
//       folder: "ecommerceApp/uploads", // Specify the folder in Cloudinary
//       use_filename: true,
//       unique_filename: false,
//       overwrite: false,
//     };

//     for (let i = 0; i < image?.length; i++) {
//       const img = await cloudinary.uploader.upload(
//         image[i].path,
//         options,
//         function (error, result) {
//           if (error) {
//             console.log(error);
//             return response.status(500).json({ error: "Image upload failed" });
//           }
//           imagesArr.push(result.secure_url);
//           fs.unlinkSync(`uploads/${request.files[i].filename}`);
//         }
//       );
//     }

//     return response.status(200).json({
//       images: imagesArr,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       status: false,
//     });
//   }
// }



// ? Final code


var imagesArr = {}; // Store images per product ID, replace with database storage in production

// Helper function to check if image exists in Cloudinary
async function checkImageExists(imageUrl) {
  try {
    const response = await axios.head(imageUrl); // HEAD request to check image existence
    return response.status === 200; // If status is 200, image exists
  } catch (error) {
    return false; // If request fails, image doesn't exist
  }
}

// Upload product images
export async function uploadProductImages(request, response) {
  try {
    const { productId } = request.body;
    const images = request.files;

    console.log("Received productId:", productId);

    if (!images || images.length === 0) {
      return response.status(400).json({ error: "No images provided" });
    }

    // Initialize imagesArr per product ID (replace with a database in production)
    if (!productId) {
      if (!imagesArr["new"]) imagesArr["new"] = [];
    } else {
      if (!imagesArr[productId]) imagesArr[productId] = [];
    }

    // Upload images and update imagesArr after successful upload
    const uploadedImages = await Promise.all(
      images.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "ecommerceApp/uploads",
            use_filename: true,
            unique_filename: false,
            overwrite: false,
          });

          console.log("Uploaded image URL:", result.secure_url);

          fs.unlinkSync(`uploads/${file.filename}`); // Remove uploaded file from local storage
          return result.secure_url; // Return uploaded image URL
        } catch (error) {
          console.log("Cloudinary upload error:", error);
          return null; // Return null in case of an error
        }
      })
    );

    // Filter out null values (failed uploads)
    const validImages = uploadedImages.filter(Boolean);

    // Update imagesArr after all uploads are completed
    if (productId) {
      imagesArr[productId].push(...validImages);
    } else {
      imagesArr["new"].push(...validImages);
    }

    // Debugging: Check imagesArr before returning response
    console.log("Updated imagesArr:", imagesArr);

    return response.status(200).json({
      images: productId ? imagesArr[productId] : imagesArr["new"],
    });

  } catch (error) {
    console.log("Server Error:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      status: false,
    });
  }
}




// var imagesArr = {}; // Store images per product ID

// // Helper function to check if image exists in Cloudinary
// async function checkImageExists(imageUrl) {
//   try {
//     const response = await axios.head(imageUrl); // HEAD request to check image existence
//     return response.status === 200; // If status is 200, image exists
//   } catch (error) {
//     return false; // If request fails, image doesn't exist
//   }
// }

// // Upload product images
// export async function uploadProductImages(request, response) {
//   try {
//     const { productId } = request.body;
//     const images = request.files;

//     console.log("Received productId:", productId);

//     if (!images || images.length === 0) {
//       return response.status(400).json({ error: "No images provided" });
//     }

//     // Initialize imagesArr per product ID (replace with a database in production)
//     if (!productId) {
//       if (!imagesArr["new"]) imagesArr["new"] = new Set(); // Use Set to prevent duplicates
//     } else {
//       if (!imagesArr[productId]) imagesArr[productId] = new Set(); // Use Set for each product
//     }

//     // Upload images and update imagesArr after successful upload
//     const uploadedImages = await Promise.all(
//       images.map(async (file) => {
//         try {
//           const result = await cloudinary.uploader.upload(file.path, {
//             folder: "ecommerceApp/uploads",
//             use_filename: true,
//             unique_filename: false,
//             overwrite: false,
//           });

//           console.log("Uploaded image URL:", result.secure_url);

//           fs.unlinkSync(`uploads/${file.filename}`); // Remove uploaded file from local storage
//           return result.secure_url; // Return uploaded image URL
//         } catch (error) {
//           console.log("Cloudinary upload error:", error);
//           return null; // Return null in case of an error
//         }
//       })
//     );

//     // Filter out null values (failed uploads)
//     const validImages = uploadedImages.filter(Boolean);

//     // Add the valid images to the imagesArr (Set ensures no duplicates)
//     if (productId) {
//       validImages.forEach((url) => imagesArr[productId].add(url));
//     } else {
//       validImages.forEach((url) => imagesArr["new"].add(url));
//     }

//     // Convert Set to array for response
//     const updatedImages = productId ? Array.from(imagesArr[productId]) : Array.from(imagesArr["new"]);

//     // Debugging: Check imagesArr before returning response
//     console.log("Updated imagesArr:", updatedImages);

//     return response.status(200).json({
//       images: updatedImages, // Send back the updated images array
//     });

//   } catch (error) {
//     console.log("Server Error:", error);
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       status: false,
//     });
//   }
// }



// ----------------------------------------------------------------------------------------------------------------------

// ? 01-02-2025
// export async function createProduct(request, response) {
//   try {
//     const {
//       name,
//       description,
//       brand,
//       price,
//       oldPrice,
//       categoryName,
//       categoryId,
//       subCategoryName,
//       subCategoryId,
//       thirdSubCategoryName,
//       thirdSubCategoryId,
//       category,
//       countInStock,
//       rating,
//       isFeatured,
//       discount,
//       productRam,
//       size,
//       productWeight,
//     } = request.body;


//     // /*

//     // Check if required fields are present
//     if (!name || !description || !brand || !price || !categoryId || !subCategoryId) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Missing required fields. Please provide all necessary product details.",
//       });
//     }

//     // Check if all IDs are present
//     const missingIds = [];
//     if (!categoryId) missingIds.push("categoryId");
//     if (!subCategoryId) missingIds.push("subCategoryId");
//     if (!thirdSubCategoryId) missingIds.push("thirdSubCategoryId");

//     if (missingIds.length > 0) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: `Missing required IDs: ${missingIds.join(", ")}`,
//       });
//     }

//     // Validate numerical values
//     if (
//       isNaN(price) ||
//       isNaN(oldPrice) ||
//       isNaN(countInStock) ||
//       isNaN(discount)
//     ) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Invalid data type: price, oldPrice, countInStock, and discount should be numbers.",
//       });
//     }


//     // Ensure imagesArr is defined and an array
//     if (!Array.isArray(imagesArr) || imagesArr.length === 0) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Images array is missing or empty.",
//       });
//     }

//     // */


//     // Create new product object
//     let product = new ProductModel({
//       name,
//       description,
//       images: imagesArr,
//       brand,
//       price,
//       oldPrice,
//       categoryName,
//       categoryId,
//       subCategoryName,
//       subCategoryId,
//       thirdSubCategoryName,
//       thirdSubCategoryId,
//       category,
//       countInStock,
//       rating,
//       isFeatured,
//       discount,
//       productRam,
//       size,
//       productWeight,
//     });

//     // Save the product to the database
//     product = await product.save();

//     if (!product) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Product creation failed",
//       });
//     }

//     // Clear images array after product creation
//     imagesArr = [];

//     return response.status(200).json({
//       message: "Product created successfully.",
//       success: true,
//       error: false,
//       data: product,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || "Internal Server Error",
//       error: true,
//       success: false,
//     });
//   }
// }

// ? final code
// export async function createProduct(request, response) {
//   try {
//     const {
//       name,
//       description,
//       brand,
//       price,
//       oldPrice,
//       categoryName,
//       categoryId,
//       subCategoryName,
//       subCategoryId,
//       thirdSubCategoryName,
//       thirdSubCategoryId,
//       category,
//       countInStock,
//       rating,
//       isFeatured,
//       discount,
//       productRam,
//       size,
//       productWeight,
//     } = request.body;

//     // Check if required fields are present
//     if (!name || !description || !brand || !price || !categoryId || !subCategoryId) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Missing required fields. Please provide all necessary product details.",
//       });
//     }

//     // Ensure imagesArr is defined and contains images for the given productId or 'new'
//     const imagesForProduct = request.body.productId
//       ? imagesArr[request.body.productId]
//       : imagesArr["new"];

//     if (!imagesForProduct || imagesForProduct.length === 0) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Images array is missing or empty.",
//       });
//     }

//     // Create new product object
//     let product = new ProductModel({
//       name,
//       description,
//       images: imagesForProduct,
//       brand,
//       price,
//       oldPrice,
//       categoryName,
//       categoryId,
//       subCategoryName,
//       subCategoryId,
//       thirdSubCategoryName,
//       thirdSubCategoryId,
//       category,
//       countInStock,
//       rating,
//       isFeatured,
//       discount,
//       productRam,
//       size,
//       productWeight,
//     });

//     // Save the product to the database
//     product = await product.save();

//     if (!product) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Product creation failed",
//       });
//     }

//     // Clear images array after product creation
//     imagesArr = {}; // Reset image array to avoid conflicts with subsequent uploads

//     return response.status(200).json({
//       message: "Product created successfully.",
//       success: true,
//       error: false,
//       data: product,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || "Internal Server Error",
//       error: true,
//       success: false,
//     });
//   }
// }

export async function createProduct(request, response) {
  try {
    const {
      name,
      description,
      brand,
      price,
      oldPrice,
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      thirdSubCategoryName,
      thirdSubCategoryId,
      category,
      countInStock,
      rating,
      isFeatured,
      discount,
      productRam,
      size,
      productWeight,
    } = request.body;

    // Check if required fields are present
    if (!name || !description || !brand || !price || !categoryId || !subCategoryId) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Missing required fields. Please provide all necessary product details.",
      });
    }

    // Ensure imagesArr is defined and contains images for the given productId or 'new'
    const imagesForProduct = request.body.productId
      ? imagesArr[request.body.productId]
      : imagesArr["new"];

    if (!imagesForProduct || imagesForProduct.size === 0) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Images array is missing or empty.",
      });
    }

    // Convert the Set to an array before saving it to the database
    const imagesArray = Array.from(imagesForProduct);

    // Create new product object
    let product = new ProductModel({
      name,
      description,
      images: imagesArray, // Use the converted array of images
      brand,
      price,
      oldPrice,
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      thirdSubCategoryName,
      thirdSubCategoryId,
      category,
      countInStock,
      rating,
      isFeatured,
      discount,
      productRam,
      size,
      productWeight,
    });

    // Save the product to the database
    product = await product.save();

    if (!product) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Product creation failed",
      });
    }

    // Clear images array after product creation to avoid conflicts with subsequent uploads
    if (request.body.productId) {
      imagesArr[request.body.productId] = new Set(); // Reset the images for the specific product
    } else {
      imagesArr["new"] = new Set(); // Reset global "new" set
    }

    return response.status(200).json({
      message: "Product created successfully.",
      success: true,
      error: false,
      data: product,
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

// get all products
// export async function getAllProducts(request, response) {
//   try {
//     const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
//     const perPage = parseInt(request.query.perPage) || 10000;
//     const totalPosts = await ProductModel.countDocuments();
//     const totalPages = Math.ceil(totalPosts / perPage);

//     if (page > totalPages) {
//       return response.status(404).json({
//         message: "Page not found",
//         error: true,
//         success: false,
//       });
//     }

//     const products = await ProductModel.find()
//       .populate("category")
//       .skip((page - 1) * perPage)
//       .limit(perPage)
//       .exec();

//     if (!products || products.length === 0) {
//       return response.status(404).json({
//         message: "No products found",
//         error: true,
//         success: false,
//       });
//     }

//     return response.status(200).json({
//       message: "Products retrieved successfully",
//       error: false,
//       success: true,
//       products: products,
//       totalPages: totalPages,
//       page: page,
//     });
//   } catch (error) {
//     console.error("Error in getting all products: ", error.message || error);
//     return response.status(500).json({
//       message:
//         error.message || "An error occurred during getting all products.",
//       error: true,
//       success: false,
//     });
//   }
// }


export async function getAllProducts(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000; // Use 10 as default limit
    const totalPosts = await ProductModel.countDocuments();

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No products found",
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

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------


// get all products by categoryId
export async function getAllProductsByCategoryId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      categoryId: request.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------

// get all products by categoryName
export async function getAllProductsByCategoryName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      categoryName: request.query.categoryName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// get all products by subCategoryId
export async function getAllProductsBySubCategoryId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      subCategoryId: request.query.subCategoryId,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}






// ----------------------------------------------------------------------------------------------------------------------

// get all products by subCategoryName
export async function getAllProductsBySubCategoryName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      subCategoryName: request.query.subCategoryName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}






// ----------------------------------------------------------------------------------------------------------------------


// get all products by thirdSubCategoryId
export async function getAllProductsByThirdSubCategoryId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      thirdSubCategoryId: request.query.thirdSubCategoryId,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}


// ----------------------------------------------------------------------------------------------------------------------

// get all products by thirdSubCategoryName
export async function getAllProductsByThirdSubCategoryName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Use request.query for URL query parameters
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      thirdSubCategoryName: request.query.thirdSubCategoryName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

// get all products by price
export async function getAllProductsByPrice(request, response) {
  let productList = [];

  if (
    request.query.categoryId !== "" &&
    request.query.categoryId !== undefined
  ) {
    const productListArr = await ProductModel.find({
      categoryId: request.query.categoryId,
    }).populate("category");

    productList = productListArr;
  }

  if (
    request.query.subCategoryId !== "" &&
    request.query.subCategoryId !== undefined
  ) {
    const productListArr = await ProductModel.find({
      subCategoryId: request.query.subCategoryId,
    }).populate("category");

    productList = productListArr;
  }

  if (
    request.query.thirdSubCategoryId !== "" &&
    request.query.thirdSubCategoryId !== undefined
  ) {
    const productListArr = await ProductModel.find({
      thirdSubCategoryId: request.query.thirdSubCategoryId,
    }).populate("category");

    productList = productListArr;
  }

  const filterProducts = await productList.filter((product) => {
    if (
      request.query.minPrice &&
      product.price < parseInt(+request.query.minPrice)
    ) {
      return false;
    }
    if (
      request.query.maxPrice &&
      product.price > parseInt(+request.query.maxPrice)
    ) {
      return false;
    }
    return true;
  });

  return response.status(200).json({
    error: false,
    success: true,
    data: filterProducts,
    totalPages: 0,
    page: 0,
  });
}





// ----------------------------------------------------------------------------------------------------------------------

// get all products by rating
export async function getAllProductsByRating(request, response) {
  try {
    const page = parseInt(request.query.page) || 1; // Parse page from query or default to 1
    const perPage = parseInt(request.query.perPage) || 10000; // Parse perPage from query or default to 10000

    // Build a dynamic query based on provided filters
    const query = {};

    // Add dynamic rating filter if provided
    if (request.query.rating) {
      query.rating = { $gte: parseFloat(request.query.rating) }; // Use $gte for minimum rating
    }

    // Add category filters if provided
    if (request.query.categoryId) {
      query.categoryId = request.query.categoryId;
    }
    if (request.query.subCategoryId) {
      query.subCategoryId = request.query.subCategoryId;
    }
    if (request.query.thirdSubCategoryId) {
      query.thirdSubCategoryId = request.query.thirdSubCategoryId;
    }

    // Count the total number of matching documents for pagination
    const totalPosts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / perPage);

    // Handle case where the requested page exceeds available pages
    if (page > totalPages && totalPosts > 0) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    // Fetch products based on the query and pagination parameters
    const products = await ProductModel.find(query)
      .populate("category") // Populate category details
      .skip((page - 1) * perPage) // Skip records for pagination
      .limit(perPage) // Limit records per page
      .exec();

    // Handle case where no products match the query
    if (!products || products.length === 0) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    // Return the paginated list of products
    return response.status(200).json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error("Error in getting all products: ", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products.",
      error: true,
      success: false,
    });
  }
}



// ----------------------------------------------------------------------------------------------------------------------

// get all products count
export async function getAllProductsCount(request, response) {
  try {
    const productsCount = await ProductModel.countDocuments();

    if (!productsCount) {
      return response.status(404).json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    response.status(200).json({
      message: "Products count retrieved successfully",
      error: false,
      success: true,
      data: productsCount,
    });
  } catch (error) {
    console.error(
      "Error in getting all products count: ",
      error.message || error
    );
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products count.",
      error: true,
      success: false,
    });
  }
}





// ----------------------------------------------------------------------------------------------------------------------

// get all featured products
export async function getAllFeaturedProducts(request, response) {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
    }).populate("category");

    if (!products) {
      return response.status(404).json({
        message: "No featured products found",
        error: true,
        success: false,
      });
    }

    response.status(200).json({
      message: "Featured products retrieved successfully",
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(
      "Error in getting all products count: ",
      error.message || error
    );
    return response.status(500).json({
      message:
        error.message || "An error occurred during getting all products count.",
      error: true,
      success: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------


//? main file code
// delete product
// export async function deleteProduct(request, response) {
//   try {
//     const productId = request.params.id; // Get the product ID from the request parameters

//     // Find the product in the database and populate category field
//     const product = await ProductModel.findById(productId).populate("category");

//     if (!product) {
//       return response.status(404).json({
//         message: "Product not found",
//         success: false,
//       });
//     }

//     const images = product.images;

//     let img = "";
//     for (img of images) {
//       const imgUrl = img;
//       const urlArr = imgUrl.split("/");
//       const image = urlArr[urlArr.length - 1];

//       const imageName = image.split(".")[0];

//       if (imageName) {
//         cloudinary.uploader.destroy(imageName, (error, result) => {});
//       }
//     }

//     // Delete the product from the database
//     const deletedProduct = await ProductModel.findByIdAndDelete(productId);

//     if (!deletedProduct) {
//       return response.status(404).json({
//         message: "Failed to delete product",
//         success: false,
//         error: true,
//       });
//     }

//     return response.status(200).json({
//       message: "Product deleted successfully",
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     console.error("Error in deleting product:", error.message || error);
//     return response.status(500).json({
//       message: error.message || "An error occurred during product deletion.",
//       success: false,
//     });
//   }
// }


// working code
// delete product
// export async function deleteProduct(request, response) {
//   try {
//     const productId = request.params.id; // Get the product ID from the request parameters

//     // Find the product in the database
//     const product = await ProductModel.findById(productId).populate("category");

//     if (!product) {
//       return response.status(404).json({
//         message: "Product not found",
//         success: false,
//       });
//     }

//     const images = product.images; // Assuming `product.images` contains array of objects with `public_id`

//     // Loop through the images and delete them from Cloudinary
//     for (const img of images) {
//       if (img.public_id) {
//         try {
//           await cloudinary.uploader.destroy(img.public_id); // Use public_id to delete
//         } catch (error) {
//           console.error(`Failed to delete image ${img.public_id}:`, error.message);
//         }
//       }
//     }

//     // Delete the product from the database
//     const deletedProduct = await ProductModel.findByIdAndDelete(productId);

//     if (!deletedProduct) {
//       return response.status(404).json({
//         message: "Failed to delete product",
//         success: false,
//         error: true,
//       });
//     }

//     return response.status(200).json({
//       message: "Product deleted successfully",
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     console.error("Error in deleting product:", error.message || error);
//     return response.status(500).json({
//       message: error.message || "An error occurred during product deletion.",
//       success: false,
//     });
//   }
// }


// Helper function to extract public ID from Cloudinary URL
// function extractPublicId(imageUrl) {
//   const regex = /https:\/\/res\.cloudinary\.com\/.*\/(.*?)\.[a-zA-Z0-9]+$/;
//   const match = imageUrl.match(regex);

//   if (match && match[1]) {
//     console.log(`Extracted public ID: ${match[1]}`);  // Log the public ID
//     return match[1];
//   }

//   return null;
// }
function extractPublicId(imageUrl) {
  // Regex to match the Cloudinary URL and extract public ID
  const regex = /https:\/\/res\.cloudinary\.com\/.*\/(ecommerceApp\/uploads\/.*)\.[a-zA-Z0-9]+$/;
  const match = imageUrl.match(regex);

  if (match && match[1]) {
    // Return the full public ID (including folder path)
    return match[1];
  }

  return null;
}



export async function deleteProduct(request, response) {
  try {
    const productId = request.params.id;
    const product = await ProductModel.findById(productId);

    if (!product) {
      return response.status(404).json({
        message: "Product not found.",
        success: false,
        error: true,
      });
    }

    let cloudinaryMessages = [];

    for (let i = 0; i < product.images.length; i++) {
      const imageUrl = product.images[i];
      const publicId = extractPublicId(imageUrl);

      if (!publicId) {
        cloudinaryMessages.push(`Failed to extract public ID for image ${i + 1}.`);
        continue;
      }

      // Add the folder path for Cloudinary deletion
      const fullPublicId = `ecommerceApp/uploads/${publicId}`;
      console.log(`Attempting to delete image with full public ID: ${fullPublicId}`);

      // Delete image from Cloudinary and check the response
      const result = await cloudinary.uploader.destroy(fullPublicId);

      console.log('Cloudinary delete result:', result);  // Log the entire result

      if (result.result === 'ok') {
        cloudinaryMessages.push(`Image ${i + 1} deleted successfully from Cloudinary.`);
      } else {
        cloudinaryMessages.push(`Failed to delete image ${i + 1} from Cloudinary. Error: ${result.error ? result.error.message : 'Unknown error'}`);
      }
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return response.status(400).json({
        message: "Product deletion failed.",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      message: "Product and associated images deleted successfully.",
      success: true,
      error: false,
      cloudinaryMessages: cloudinaryMessages,
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

// delete multiple products
export async function deleteMultipleProduct(request, response) {
  const { ids } = request.body;

  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      message: "Invalid product IDs.",
      success: false,
      error: true,
    });
  }

  try {
    for (let i = 0; i < ids?.length; i++) {
      const product = await ProductModel.findById(ids[i]);

      if (!product) {
        // If the product doesn't exist, continue to the next one
        continue;
      }

      const images = product.images;

      // Loop through each image and delete it from Cloudinary
      for (let img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0];

        if (imageName) {
          // Deleting the image from Cloudinary
          await cloudinary.uploader.destroy(`ecommerceApp/uploads/${imageName}`);
        }
      }
    }

    // After deleting images, delete the products from the database
    await ProductModel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      message: "Product(s) deleted successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong.",
      error: true,
      status: false,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

// get single products
export async function getProduct(request, response) {
  try {
    const product = await ProductModel.findById(request.params.id).populate(
      "category"
    );

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      data: product,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in getting product:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during product retrieval.",
      success: false,
      error: error.message || error,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------

//? regular code
// Controller for removing an image from Cloudinary for product
// export async function removeImageFromCloudinary(request, response) {
//   const imgUrl = request.query.img;

//   const urlArr = imgUrl.split("/");
//   const image = urlArr[urlArr.length - 1];

//   const imageName = image.split(".")[0];

//   if (imageName) {
//     const result = await cloudinary.uploader.destroy(
//       imageName,
//       (error, result) => {}
//     );
//     if (result) {
//       return response.status(200).json({
//         message: "Image removed successfully",
//         success: true,
//         error: false,
//       });
//     }
//   }
// }


// export async function removeImageFromCloudinary(request, response) {
//   try {
//     const imgUrl = request.query.img;

//     // Validate if imgUrl exists and has the correct format
//     if (!imgUrl) {
//       return response.status(400).json({
//         message: "Image URL is required",
//         success: false,
//         error: true,
//       });
//     }

//     // Extract the image name (remove the folder path)
//     const urlArr = imgUrl.split("/");
//     const image = urlArr[urlArr.length - 1]; // 'sample-image.jpg'
//     const imageName = image.split(".")[0]; // 'sample-image'

//     // Folder path to be included in the destroy API call
//     const folderPath = 'ecommerceApp/uploads/';

//     // Ensure the imageName is valid and the URL is correct
//     if (!imageName) {
//       return response.status(400).json({
//         message: "Invalid image URL",
//         success: false,
//         error: true,
//       });
//     }

//     // Call Cloudinary API to destroy the image (including folder path)
//     const result = await cloudinary.uploader.destroy(`${folderPath}${imageName}`);

//     if (result.result === "ok") {
//       return response.status(200).json({
//         message: "Image removed successfully",
//         success: true,
//         error: false,
//       });
//     } else {
//       return response.status(500).json({
//         message: "Failed to remove image from Cloudinary",
//         success: false,
//         error: true,
//       });
//     }
//   } catch (error) {
//     console.error("Error removing image from Cloudinary:", error);
//     return response.status(500).json({
//       message: "Server error",
//       success: false,
//       error: true,
//     });
//   }
// }





// ? Current working code v1.0
// export async function removeImageFromCloudinary(request, response) {
//   try {
//     console.log("Request Query:", request.query); // Log the incoming request query

//     const { imgUrl } = request.query;

//     if (!imgUrl) {
//       return response.status(400).json({
//         message: "Image URL is required",
//         success: false,
//         error: true,
//       });
//     }

//     // Extract folder path and image name
//     const folderPath = "ecommerceApp/uploads/"; // Make sure this matches the folder path in Cloudinary
//     const urlArr = imgUrl.split("/");

//     // Ensure the URL structure is valid
//     if (urlArr.length < 2) {
//       return response.status(400).json({
//         message: "Invalid image URL format",
//         success: false,
//         error: true,
//       });
//     }

//     const image = urlArr[urlArr.length - 1]; // The image file name with version (e.g., "v1737394954/ecommerc.jpg")
//     const imageName = image.split(".")[0]; // Extract the image name without extension
//     const publicId = `${folderPath}${imageName}`; // Build the full public ID

//     console.log("Deleting image with public ID:", publicId);

//     // Attempt to delete the image from Cloudinary
//     const result = await cloudinary.uploader.destroy(publicId);

//     if (result.result === "ok") {
//       return response.status(200).json({
//         message: "Image removed successfully",
//         success: true,
//         error: false,
//       });
//     }

//     return response.status(404).json({
//       message: "Image not found in Cloudinary",
//       success: false,
//       error: true,
//     });
//   } catch (error) {
//     console.error("Error in removeImageFromCloudinary:", error);

//     return response.status(500).json({
//       message: "Failed to remove image",
//       success: false,
//       error: true,
//     });
//   }
// }

// ? Current working code v1.1
// export async function removeImageFromCloudinary(request, response) {
//   try {
//     console.log("Request Query:", request.query); // Log the incoming request query

//     const { imgUrl } = request.query;

//     if (!imgUrl) {
//       return response.status(400).json({
//         message: "Image URL is required",
//         success: false,
//         error: true,
//       });
//     }

//     // Extract folder path and image name
//     const folderPath = "ecommerceApp/uploads/"; // Make sure this matches the folder path in Cloudinary
//     const urlArr = imgUrl.split("/");

//     // Ensure the URL structure is valid
//     if (urlArr.length < 2) {
//       return response.status(400).json({
//         message: "Invalid image URL format",
//         success: false,
//         error: true,
//       });
//     }

//     const image = urlArr[urlArr.length - 1]; // The image file name with version (e.g., "v1737394954/ecommerc.jpg")
//     const imageName = image.split(".")[0]; // Extract the image name without extension
//     const publicId = `${folderPath}${imageName}`; // Build the full public ID

//     console.log("Deleting image with public ID:", publicId);

//     // Attempt to delete the image from Cloudinary
//     const result = await cloudinary.uploader.destroy(publicId);

//     if (result.result === "ok") {
//       return response.status(200).json({
//         message: "Image removed successfully",
//         success: true,
//         error: false,
//       });
//     }

//     return response.status(404).json({
//       message: "Image not found in Cloudinary",
//       success: false,
//       error: true,
//     });
//   } catch (error) {
//     console.error("Error in removeImageFromCloudinary:", error);

//     return response.status(500).json({
//       message: "Failed to remove image",
//       success: false,
//       error: true,
//     });
//   }
// }


// ? 01-02-2025
// export async function removeImageProductFromCloudinary(request, response) {
//   try {
//     console.log("Request Query:", request.query); // Log the incoming request query

//     const { imgUrl, productId } = request.query;  // Expecting both imgUrl and productId in query

//     console.log("img = ", imgUrl, "productId = ", productId); // Log the extracted values

//     if (!imgUrl) {
//       return response.status(400).json({
//         message: "Image URL is required",
//         success: false,
//         error: true,
//       });
//     }

//     // Extract the public ID using the updated extraction function
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
//       // Image deleted from Cloudinary, now remove it from the product document in the database

//       const product = await ProductModel.findById(productId);
//       if (!product) {
//         return response.status(404).json({
//           message: "Product not found",
//           success: false,
//           error: true,
//         });
//       }

//       // Filter out the image from the product's images array
//       const updatedImages = product.images.filter(imageUrl => imageUrl !== imgUrl);

//       // Update the product in the database
//       product.images = updatedImages;
//       await product.save();

//       return response.status(200).json({
//         message: "Image removed successfully from Cloudinary and database",
//         success: true,
//         error: false,
//       });
//     }

//     return response.status(404).json({
//       message: "Image not found in Cloudinary",
//       success: false,
//       error: true,
//     });
//   } catch (error) {
//     console.error("Error in removeImageFromCloudinary:", error);

//     return response.status(500).json({
//       message: "Failed to remove image",
//       success: false,
//       error: true,
//     });
//   }
// }

// export async function removeImageProductFromCloudinary(request, response) {
//   try {
//     console.log("Request Query:", request.query); // Log the incoming request query

//     const { imgUrl, productId } = request.query;  // Expecting both imgUrl and productId in query

//     console.log("img = ", imgUrl, "productId = ", productId); // Log the extracted values

//     if (!imgUrl) {
//       return response.status(400).json({
//         message: "Image URL is required",
//         success: false,
//         error: true,
//       });
//     }

//     // Extract the public ID using the updated extraction function
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
//       // Image deleted from Cloudinary, now remove it from the product document in the database

//       const product = await ProductModel.findById(productId);
//       if (!product) {
//         return response.status(404).json({
//           message: "Product not found",
//           success: false,
//           error: true,
//         });
//       }

//       // Ensure only the image that matches the exact URL is removed
//       const updatedImages = product.images.filter(imageUrl => imageUrl.trim() !== imgUrl.trim());

//       // Update the product in the database
//       product.images = updatedImages;
//       await product.save();

//       return response.status(200).json({
//         message: "Image removed successfully from Cloudinary and database",
//         success: true,
//         error: false,
//       });
//     }

//     return response.status(404).json({
//       message: "Image not found in Cloudinary",
//       success: false,
//       error: true,
//     });
//   } catch (error) {
//     console.error("Error in removeImageFromCloudinary:", error);

//     return response.status(500).json({
//       message: "Failed to remove image",
//       success: false,
//       error: true,
//     });
//   }
// }









// works while update
// Remove image from Cloudinary and update the database
// export async function removeImageProductFromCloudinary(request, response) {
//   try {
//     const { imgUrl, productId } = request.query;  // Expecting both imgUrl and productId in query
//     console.log("Request Query:", request.query);  // Log the incoming request query

//     // Validate input
//     if (!imgUrl || !productId) {
//       return response.status(400).json({
//         message: "Both imgUrl and productId are required",
//         success: false,
//         error: true,
//       });
//     }

//     console.log("img = ", imgUrl, "productId = ", productId); // Log the extracted values

//     // Extract the public ID from the imgUrl
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

//       // Image deleted from Cloudinary, now remove it from the product document in the database
//       const product = await ProductModel.findById(productId);
//       if (!product) {
//         return response.status(404).json({
//           message: "Product not found",
//           success: false,
//           error: true,
//         });
//       }

//       console.log("Before update, product images in DB:", product.images);

//       // Ensure only the image that matches the exact URL is removed
//       const updatedImages = product.images.filter(imageUrl => imageUrl.trim() !== imgUrl.trim());

//       // Check if the image exists in the database before updating
//       if (updatedImages.length === product.images.length) {
//         return response.status(404).json({
//           message: "Image not found in the product database",
//           success: false,
//           error: true,
//         });
//       }

//       console.log("After update, product images in DB:", updatedImages);

//       // Update the product in the database
//       product.images = updatedImages;
//       await product.save();

//       // Also update the imagesArr in-memory (or your state management) to reflect the changes
//       if (imagesArr[productId]) {
//         imagesArr[productId] = imagesArr[productId].filter(url => url.trim() !== imgUrl.trim());
//       }

//       return response.status(200).json({
//         message: "Image removed successfully from Cloudinary and database",
//         success: true,
//         error: false,
//       });
//     }

//     // If the Cloudinary deletion result is not 'ok'
//     return response.status(404).json({
//       message: "Image not found in Cloudinary",
//       success: false,
//       error: true,
//     });
//   } catch (error) {
//     console.error("Error in removeImageFromCloudinary:", error);

//     return response.status(500).json({
//       message: "Failed to remove image",
//       success: false,
//       error: true,
//     });
//   }
// }


// works while creating new product
// Remove image from product or global state
// export async function removeImageProductFromCloudinary(request, response) {
//   try {
//     const { imgUrl, productId } = request.query;

//     // Validate input
//     if (!imgUrl) {
//       return response.status(400).json({ error: "Image URL is required" });
//     }

//     // Check if productId is provided
//     if (productId) {
//       // Ensure imagesArr[productId] is initialized before trying to remove the image
//       if (imagesArr[productId] && imagesArr[productId].length > 0) {
//         const index = imagesArr[productId].indexOf(imgUrl);
//         if (index > -1) {
//           imagesArr[productId].splice(index, 1); // Remove the image URL from the product-specific array
//           console.log(`Image removed from product ${productId}`);
//         } else {
//           return response.status(404).json({ error: "Image URL not found in product images" });
//         }
//       } else {
//         return response.status(404).json({ error: "Product not found or no images to remove" });
//       }
//     } else {
//       // If no productId is provided, remove from global "new" set
//       if (imagesArr["new"] && imagesArr["new"].includes(imgUrl)) {
//         const index = imagesArr["new"].indexOf(imgUrl);
//         imagesArr["new"].splice(index, 1); // Remove the image URL from the global array
//         console.log("Image removed from global set");
//       } else {
//         return response.status(404).json({ error: "Image URL not found in global images" });
//       }
//     }

//     // Handle Cloudinary removal
//     const publicId = extractPublicId(imgUrl);
//     if (publicId) {
//       const result = await cloudinary.uploader.destroy(publicId);
//       if (result.result === "ok") {
//         console.log("Image successfully deleted from Cloudinary.");
//       } else {
//         return response.status(404).json({ error: "Image not found in Cloudinary" });
//       }
//     }

//     return response.status(200).json({
//       message: "Image removed successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.log("Error in removeImageProduct:", error);
//     return response.status(500).json({ message: "Server error", success: false });
//   }
// }


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







// ----------------------------------------------------------------------------------------------------------------------

// export async function updateProduct(request, response) {
//   try {
//     const product = await ProductModel.findByIdAndUpdate(
//       request.params.id,
//       {
//         name: request.body.name,
//         description: request.body.description,
//         images: imagesArr.length > 0 ? imagesArr : undefined, // Only update images if new ones are provided
//         brand: request.body.brand,
//         price: request.body.price,
//         oldPrice: request.body.oldPrice,
//         categoryName: request.body.categoryName,
//         categoryId: request.body.categoryId,
//         subCategoryId: request.body.subCategoryId,
//         thirdSubCategoryId: request.body.thirdSubCategoryId,
//         category: request.body.category,
//         countInStock: request.body.countInStock,
//         rating: request.body.rating,
//         isFeatured: request.body.isFeatured,
//         discount: request.body.discount,
//         productRam: request.body.productRam,
//         size: request.body.size,
//         productWeight: request.body.productWeight,
//       },
//       { new: true } // Return the updated document
//     );

//     if (!product) {
//       return response.status(404).json({
//         error: true,
//         success: false,
//         message: "Product can not be updated!",
//       });
//     }

//     imagesArr = [];

//     return response.status(200).json({
//       message: "Product updated successfully.",
//       success: true,
//       product: product,
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || "An error occurred during product update.",
//       success: false,
//       error: error.message || error,
//     });
//   }
// }







// ? Current working code
// export async function updateProduct(request, response) {
//   try {
//     const productId = request.params.id;
//     const product = await ProductModel.findById(productId);

//     if (!product) {
//       return response.status(404).json({
//         error: true,
//         success: false,
//         message: "Product not found!",
//       });
//     }

//     // Collect Cloudinary messages to track success/failures
//     let cloudinaryMessages = [];

//     // If new images are provided, delete old ones from Cloudinary
//     if (imagesArr.length > 0) {
//       // First, delete old images from Cloudinary
//       for (let i = 0; i < product.images.length; i++) {
//         const oldImageUrl = product.images[i];
//         const publicId = extractPublicId(oldImageUrl);

//         if (publicId) {
//           const result = await cloudinary.uploader.destroy(`ecommerceApp/uploads/${publicId}`);
//           if (result.result === 'ok') {
//             cloudinaryMessages.push(`Successfully deleted old image: ${publicId}`);
//           } else {
//             cloudinaryMessages.push(`Failed to delete old image: ${publicId}`);
//           }
//         }
//       }

//       // After deleting old images, set the new images
//       product.images = imagesArr;
//     } else {
//       // If no new images are provided, keep the old ones
//       cloudinaryMessages.push("No new images provided, keeping the old ones.");
//     }

//     // Update product details
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       productId,
//       {
//         name: request.body.name,
//         description: request.body.description,
//         images: imagesArr.length > 0 ? imagesArr : product.images, // Keep old images if none provided
//         brand: request.body.brand,
//         price: request.body.price,
//         oldPrice: request.body.oldPrice,
//         categoryName: request.body.categoryName,
//         categoryId: request.body.categoryId,
//         subCategoryId: request.body.subCategoryId,
//         thirdSubCategoryId: request.body.thirdSubCategoryId,
//         category: request.body.category,
//         countInStock: request.body.countInStock,
//         rating: request.body.rating,
//         isFeatured: request.body.isFeatured,
//         discount: request.body.discount,
//         productRam: request.body.productRam,
//         size: request.body.size,
//         productWeight: request.body.productWeight,
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedProduct) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Product update failed!",
//       });
//     }

//     // Clear the images array after update
//     imagesArr = [];

//     return response.status(200).json({
//       message: "Product updated successfully.",
//       success: true,
//       cloudinaryMessages: cloudinaryMessages,
//       product: updatedProduct,
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || "An error occurred during product update.",
//       success: false,
//       error: error.message || error,
//     });
//   }
// }

// ? 01-02-2025
// export async function updateProduct(request, response) {
//   try {
//     const productId = request.params.id;
//     const product = await ProductModel.findById(productId);

//     if (!product) {
//       return response.status(404).json({
//         error: true,
//         success: false,
//         message: "Product not found!",
//       });
//     }

//     // Collect Cloudinary messages to track success/failures
//     let cloudinaryMessages = [];

//     // If new images are provided, delete old ones from Cloudinary
//     if (imagesArr.length > 0) {
//       // First, delete old images from Cloudinary
//       for (let i = 0; i < product.images.length; i++) {
//         const oldImageUrl = product.images[i];
//         const publicId = extractPublicId(oldImageUrl);

//         if (publicId) {
//           const result = await cloudinary.uploader.destroy(`ecommerceApp/uploads/${publicId}`);
//           if (result.result === 'ok') {
//             cloudinaryMessages.push(`Successfully deleted old image: ${publicId}`);
//           } else {
//             cloudinaryMessages.push(`Failed to delete old image: ${publicId}`);
//           }
//         }
//       }

//       // After deleting old images, set the new images
//       product.images = imagesArr;
//     } else {
//       // If no new images are provided, keep the old ones
//       cloudinaryMessages.push("No new images provided, keeping the old ones.");
//     }

//     // Update product details
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       productId,
//       {
//         name: request.body.name,
//         description: request.body.description,
//         images: imagesArr.length > 0 ? imagesArr : product.images, // Keep old images if none provided
//         brand: request.body.brand,
//         price: request.body.price,
//         oldPrice: request.body.oldPrice,
//         categoryName: request.body.categoryName,
//         categoryId: request.body.categoryId,
//         subCategoryName: request.body.subCategoryName,
//         subCategoryId: request.body.subCategoryId,
//         thirdSubCategoryName: request.body.thirdSubCategoryName,
//         thirdSubCategoryId: request.body.thirdSubCategoryId,
//         category: request.body.category,
//         countInStock: request.body.countInStock,
//         rating: request.body.rating,
//         isFeatured: request.body.isFeatured,
//         discount: request.body.discount,
//         productRam: request.body.productRam,
//         size: request.body.size,
//         productWeight: request.body.productWeight,
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedProduct) {
//       return response.status(400).json({
//         error: true,
//         success: false,
//         message: "Product update failed!",
//       });
//     }

//     // Clear the images array after update
//     imagesArr = [];

//     return response.status(200).json({
//       message: "Product updated successfully.",
//       success: true,
//       cloudinaryMessages: cloudinaryMessages,
//       product: updatedProduct,
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || "An error occurred during product update.",
//       success: false,
//       error: error.message || error,
//     });
//   }
// }

// export async function updateProduct(request, response) {
//   try {
//     const productId = request.params.id;
//     const product = await ProductModel.findById(productId);

//     if (!product) {
//       return response.status(404).json({
//         error: true,
//         success: false,
//         message: "Product not found!",
//       });
//     }

//     let newImages = request.body.images || []; // Get new images from request body
//     let cloudinaryMessages = [];

//     // Delete old images from Cloudinary if new images are provided
//     if (newImages.length > 0) {
//       for (let oldImageUrl of product.images) {
//         const publicId = extractPublicId(oldImageUrl); // Extract the publicId from the URL
//         if (publicId) {
//           try {
//             const result = await cloudinary.uploader.destroy(publicId);
//             if (result.result === "ok") {
//               cloudinaryMessages.push(`Deleted old image: ${publicId}`);
//             } else {
//               cloudinaryMessages.push(`Failed to delete old image: ${publicId}`);
//             }
//           } catch (error) {
//             cloudinaryMessages.push(`Error deleting image: ${error.message}`);
//           }
//         }
//       }
//       product.images = newImages; // Replace old images with new ones
//     } else {
//       cloudinaryMessages.push("No new images provided, keeping existing images.");
//     }

//     // Update product details
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       productId,
//       {
//         name: request.body.name,
//         description: request.body.description,
//         images: product.images, // Updated images (new or existing)
//         brand: request.body.brand,
//         price: request.body.price,
//         oldPrice: request.body.oldPrice,
//         categoryName: request.body.categoryName,
//         categoryId: request.body.categoryId,
//         subCategoryName: request.body.subCategoryName,
//         subCategoryId: request.body.subCategoryId,
//         thirdSubCategoryName: request.body.thirdSubCategoryName,
//         thirdSubCategoryId: request.body.thirdSubCategoryId,
//         category: request.body.category,
//         countInStock: request.body.countInStock,
//         rating: request.body.rating,
//         isFeatured: request.body.isFeatured,
//         discount: request.body.discount,
//         productRam: request.body.productRam,
//         size: request.body.size,
//         productWeight: request.body.productWeight,
//       },
//       { new: true } // Return the updated document
//     );

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
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || "An error occurred during product update.",
//       success: false,
//       error: error.message || error,
//     });
//   }
// }

export async function updateProduct(request, response) {
  try {
    const productId = request.params.id;
    const product = await ProductModel.findById(productId);

    if (!product) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Product not found!",
      });
    }

    let newImages = request.body.images || []; // Get new images from request body
    let cloudinaryMessages = [];
    let validNewImages = []; // Array to store images that exist in Cloudinary

    // Check if each new image exists in Cloudinary
    for (let newImageUrl of newImages) {
      const publicId = extractPublicId(newImageUrl); // Extract the publicId from the URL
      if (publicId) {
        try {
          const result = await cloudinary.api.resource(publicId);
          if (result) {
            validNewImages.push(newImageUrl); // If image exists in Cloudinary, add it to the valid list
          } else {
            cloudinaryMessages.push(`Image does not exist in Cloudinary: ${newImageUrl}`);
          }
        } catch (error) {
          cloudinaryMessages.push(`Error checking image existence in Cloudinary: ${newImageUrl}`);
        }
      } else {
        cloudinaryMessages.push(`Invalid image URL format: ${newImageUrl}`);
      }
    }

    // Compare old images with new images to determine which ones need to be deleted
    const imagesToDelete = product.images.filter(image => !validNewImages.includes(image));

    // Delete images from Cloudinary that are removed from the new images list
    if (imagesToDelete.length > 0) {
      for (let oldImageUrl of imagesToDelete) {
        const publicId = extractPublicId(oldImageUrl); // Extract the publicId from the URL
        if (publicId) {
          try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result === "ok") {
              cloudinaryMessages.push(`Deleted old image: ${publicId}`);
            } else {
              cloudinaryMessages.push(`Failed to delete old image: ${publicId}`);
            }
          } catch (error) {
            cloudinaryMessages.push(`Error deleting image: ${error.message}`);
          }
        }
      }
    }

    // Update the product's images with the valid new image URLs
    product.images = validNewImages.length > 0 ? validNewImages : product.images;

    // Update the product details in the database
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        name: request.body.name,
        description: request.body.description,
        images: product.images, // Updated images (new or existing)
        brand: request.body.brand,
        price: request.body.price,
        oldPrice: request.body.oldPrice,
        categoryName: request.body.categoryName,
        categoryId: request.body.categoryId,
        subCategoryName: request.body.subCategoryName,
        subCategoryId: request.body.subCategoryId,
        thirdSubCategoryName: request.body.thirdSubCategoryName,
        thirdSubCategoryId: request.body.thirdSubCategoryId,
        category: request.body.category,
        countInStock: request.body.countInStock,
        rating: request.body.rating,
        isFeatured: request.body.isFeatured,
        discount: request.body.discount,
        productRam: request.body.productRam,
        size: request.body.size,
        productWeight: request.body.productWeight,
      },
      { new: true } // Return the updated document
    );

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
