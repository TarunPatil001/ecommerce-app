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

var imagesArr = [];
export async function uploadProductImages(request, response) {
  try {
    imagesArr = [];
    const image = request.files;

    // Upload the new images to Cloudinary
    const options = {
      folder: "ecommerceApp/uploads", // Specify the folder in Cloudinary
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < image?.length; i++) {
      const img = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`);
        }
      );
    }

    return response.status(200).json({
      images: imagesArr,
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

export async function createProduct(request, response) {
  try {
    // Create new product object
    let product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      images: imagesArr,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,
      categoryName: request.body.categoryName,
      categoryId: request.body.categoryId,
      subCategoryName: request.body.subCategoryName,
      subCategoryId: request.body.subCategoryId,
      thirdSubCategoryName: request.body.thirdSubCategoryName,
      thirdSubCategoryId: request.body.thirdSubCategoryId,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      productRam: request.body.productRam,
      size: request.body.size,
      productWeight: request.body.productWeight,
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

    // Clear images array after product creation
    imagesArr = [];

    return response.status(200).json({
      message: "Product created successfully.",
      success: true,
      error: false,
      product: product,
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

// get all products
export async function getAllProducts(request, response) {
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

    const products = await ProductModel.find()
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
      products: products,
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
      products: products,
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
      products: products,
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
      products: products,
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
      products: products,
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
      products: products,
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
      products: products,
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
    products: filterProducts,
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
      products: products,
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
      productsCount: productsCount,
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
      products: products,
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
function extractPublicId(imageUrl) {
  const regex = /https:\/\/res\.cloudinary\.com\/.*\/(.*?)\.[a-zA-Z0-9]+$/;
  const match = imageUrl.match(regex);

  if (match && match[1]) {
    console.log(`Extracted public ID: ${match[1]}`);  // Log the public ID
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
      product: product,
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

export async function removeImageFromCloudinary(request, response) {
  try {
    console.log("Request Query:", request.query); // Log the incoming request query

    const { imgUrl } = request.query;

    if (!imgUrl) {
      return response.status(400).json({
        message: "Image URL is required",
        success: false,
        error: true,
      });
    }

    // Extract folder path and image name
    const folderPath = "ecommerceApp/uploads/"; // Make sure this matches the folder path in Cloudinary
    const urlArr = imgUrl.split("/");

    // Ensure the URL structure is valid
    if (urlArr.length < 2) {
      return response.status(400).json({
        message: "Invalid image URL format",
        success: false,
        error: true,
      });
    }

    const image = urlArr[urlArr.length - 1]; // The image file name with version (e.g., "v1737394954/ecommerc.jpg")
    const imageName = image.split(".")[0]; // Extract the image name without extension
    const publicId = `${folderPath}${imageName}`; // Build the full public ID

    console.log("Deleting image with public ID:", publicId);

    // Attempt to delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return response.status(200).json({
        message: "Image removed successfully",
        success: true,
        error: false,
      });
    }

    return response.status(404).json({
      message: "Image not found in Cloudinary",
      success: false,
      error: true,
    });
  } catch (error) {
    console.error("Error in removeImageFromCloudinary:", error);

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

    // Collect Cloudinary messages to track success/failures
    let cloudinaryMessages = [];

    // If new images are provided, delete old ones from Cloudinary
    if (imagesArr.length > 0) {
      // First, delete old images from Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        const oldImageUrl = product.images[i];
        const publicId = extractPublicId(oldImageUrl);

        if (publicId) {
          const result = await cloudinary.uploader.destroy(`ecommerceApp/uploads/${publicId}`);
          if (result.result === 'ok') {
            cloudinaryMessages.push(`Successfully deleted old image: ${publicId}`);
          } else {
            cloudinaryMessages.push(`Failed to delete old image: ${publicId}`);
          }
        }
      }

      // After deleting old images, set the new images
      product.images = imagesArr;
    } else {
      // If no new images are provided, keep the old ones
      cloudinaryMessages.push("No new images provided, keeping the old ones.");
    }

    // Update product details
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        name: request.body.name,
        description: request.body.description,
        images: imagesArr.length > 0 ? imagesArr : product.images, // Keep old images if none provided
        brand: request.body.brand,
        price: request.body.price,
        oldPrice: request.body.oldPrice,
        categoryName: request.body.categoryName,
        categoryId: request.body.categoryId,
        subCategoryId: request.body.subCategoryId,
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

    // Clear the images array after update
    imagesArr = [];

    return response.status(200).json({
      message: "Product updated successfully.",
      success: true,
      cloudinaryMessages: cloudinaryMessages,
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
