import CartProductModel from "../models/cartProduct.model.js";
import ProductModel from './../models/product.model.js';
import mongoose from 'mongoose';


// export const addToCartItemController = async (request, response) => {
//   try {
//     const userId = request.userId; // middleware
//     const { productTitle, image, seller, rating, price, quantity, subTotal, productId, countInStock } = request.body;

//     if (!productId) {
//       return response.status(404).json({
//         message: "Provide productId!",
//         error: true,
//         success: false,
//       });
//     }

//     const checkItemCart = await CartProductModel.findOne({
//       userId: userId,
//       productId: productId,
//     });

//     if (checkItemCart) {
//       return response.status(400).json({
//         message: "Item already in cart!",
//       });
//     }

//     const cartItem = new CartProductModel({
//       productTitle: productTitle, 
//       image: image, 
//       rating: rating, 
//       price: price, 
//       quantity: quantity, 
//       subTotal: subTotal, 
//       countInStock: countInStock,
//       userId: userId,
//       productId: productId,
//     });

//     const save = await cartItem.save();

//     // const updateCartUser = await UserModel.updateOne(
//     //   { _id: userId },
//     //   {
//     //     $push: {
//     //       shopping_cart: productId,
//     //     },
//     //   }
//     // );

//     return response.status(200).json({
//       data: save,
//       message: "Item added to cart!",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

// export const getCartItemController = async (request, response) => {
//   try {
//     const userId = request.userId;

//     const cartItems = await CartProductModel.find({
//       userId: userId,
//     });

//     return response.status(200).json({
//       data: cartItems,
//       message: "Cart item retrieved successfully",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

// export const updateCartItemQtyController = async (request, response) => {
//   try {
//     const userId = request.userId;
//     const { id, qty, subTotal } = request.body; // ✅ Changed _id to id

//     if (!id || !qty) { // ✅ Corrected the validation
//       return response.status(400).json({
//         message: "Provide id and qty",
//       });
//     }

//     const updateCartItem = await CartProductModel.updateOne(
//       {
//         _id: id, // ✅ Use 'id' (not _id)
//         userId: userId,
//       },
//       {
//         quantity: qty,
//         subTotal: subTotal,
//       }
//     );

//     return response.status(200).json({
//       message: "Cart updated successfully",
//       error: false,
//       success: true,
//       data: updateCartItem,
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };


// export const deleteCartItemQtyController = async (request, response) => {
//     try {

//         const userId = request.userId;
//         const { id } = request.params;

//         if (!id) {
//             return response.status(400).json({
//               message: "Provide id",
//               error: true,
//               success: false,
//             });
//           }

//           const deleteCartItem = await CartProductModel.deleteOne(
//             {
//               _id: id,
//               userId: userId,
//             }
//           );

//           if(!deleteCartItem){
//             return response.status(404).json({
//                 message: "The product in the cart is not found",
//                 error: true,
//                 success: false,
//               });
//           }

//           // const user = await UserModel.findOne({
//           //   _id: userId,
//           // })

//           // const cartItems = user?.shopping_cart;

//           // const updatedUserCart = [...cartItems.slice(0, cartItems.indexOf(productId)), ...cartItems.slice(cartItems.indexOf(productId) + 1)];

//           // user.shopping_cart = updatedUserCart;
//           // await user.save();

//           return response.status(200).json({
//             message: "Item remove",
//             error: false,
//             success: true,
//             data: deleteCartItem,
//           });

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false,
//           });
//     }
// }
// ============================================
// export const addToCartItemController = async (request, response) => {
//   try {
//     const userId = request.userId; // middleware
//     const { 
//       productTitle, 
//       image, 
//       sellerDetails, 
//       rating, 
//       brand,
//       availableOptions,
//       selectedOptions,
//       price, 
//       oldPrice, 
//       quantity, 
//       discount, 
//       subTotal, 
//       subTotalOldPrice, 
//       productId, 
//       countInStock 
//     } = request.body;

//     if (!productId) {
//       return response.status(400).json({
//         message: "Provide productId!",
//         error: true,
//         success: false,
//       });
//     }

//     if (!sellerDetails || !sellerDetails.sellerId || !sellerDetails.sellerName) {
//       return response.status(400).json({
//         message: "Provide valid seller details!",
//         error: true,
//         success: false,
//       });
//     }

//     if (!quantity || quantity <= 0 || isNaN(quantity)) {
//       return response.status(400).json({
//         message: "Invalid quantity! Must be a positive number.",
//         error: true,
//         success: false,
//       });
//     }

//     if (!countInStock || isNaN(countInStock) || countInStock < 0) {
//       return response.status(400).json({
//         message: "Invalid stock count.",
//         error: true,
//         success: false,
//       });
//     }

//     const product = await ProductModel.findById(productId);
//     if (!product) {
//       return response.status(404).json({
//         message: "Product not found.",
//         error: true,
//         success: false,
//       });
//     }

//     if (quantity > countInStock) {
//       return response.status(400).json({
//         message: `Only ${countInStock} items are available for ${productTitle}.`,
//         error: true,
//         success: false,
//       });
//     }

//     const checkItemCart = await CartProductModel.findOne({
//       userId: userId,
//       productId: productId,
//     });

//     if (checkItemCart) {
//       checkItemCart.quantity += quantity;
//       await checkItemCart.save();
//       return response.status(200).json({
//         message: "Item quantity updated in cart!",
//         success: true,
//       });
//     }

//     const cartItem = new CartProductModel({
//       productTitle, 
//       image, 
//       rating, 
//       brand,
//       availableOptions,
//       selectedOptions,
//       price, 
//       oldPrice,
//       quantity,
//       discount,
//       subTotal,
//       subTotalOldPrice,
//       countInStock,
//       userId,
//       productId,
//       sellerDetails, 
//     });

//     const save = await cartItem.save();

//     return response.status(200).json({
//       data: save,
//       message: "Item added to cart!",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };
// ----------------------------------
// export const addToCartItemController = async (request, response) => {
//   try {
//     const userId = request.userId; // middleware
//     const { 
//       productTitle, 
//       image, 
//       sellerDetails, 
//       rating, 
//       brand,
//       availableOptions,  // Options defined for the product (e.g., size, RAM)
//       selectedOptions,   // User-selected options
//       price, 
//       oldPrice, 
//       quantity, 
//       discount, 
//       subTotal, 
//       subTotalOldPrice, 
//       productId, 
//       countInStock 
//     } = request.body;

//     if (!productId) {
//       return response.status(400).json({
//         message: "Provide productId!",
//         error: true,
//         success: false,
//       });
//     }

//     if (!sellerDetails || !sellerDetails.sellerId || !sellerDetails.sellerName) {
//       return response.status(400).json({
//         message: "Provide valid seller details!",
//         error: true,
//         success: false,
//       });
//     }

//     if (!quantity || quantity <= 0 || isNaN(quantity)) {
//       return response.status(400).json({
//         message: "Invalid quantity! Must be a positive number.",
//         error: true,
//         success: false,
//       });
//     }

//     if (!countInStock || isNaN(countInStock) || countInStock < 0) {
//       return response.status(400).json({
//         message: "Invalid stock count.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if at least one option is selected (size, weight, or RAM)
//     const { productWeight, size, productRam } = selectedOptions;
//     if (!productWeight && !size && !productRam) {
//       return response.status(400).json({
//         message: "Please select at least one option (size, weight, or RAM).",
//         error: true,
//         success: false,
//       });
//     }

//     const product = await ProductModel.findById(productId);
//     if (!product) {
//       return response.status(404).json({
//         message: "Product not found.",
//         error: true,
//         success: false,
//       });
//     }

//     if (quantity > countInStock) {
//       return response.status(400).json({
//         message: `Only ${countInStock} items are available for ${productTitle}.`,
//         error: true,
//         success: false,
//       });
//     }

//     const checkItemCart = await CartProductModel.findOne({
//       userId: userId,
//       productId: productId,
//     });

//     if (checkItemCart) {
//       checkItemCart.quantity += quantity;
//       await checkItemCart.save();
//       return response.status(200).json({
//         message: "Item quantity updated in cart!",
//         success: true,
//       });
//     }

//     const cartItem = new CartProductModel({
//       productTitle, 
//       image, 
//       rating, 
//       brand,
//       availableOptions,
//       selectedOptions,
//       price, 
//       oldPrice,
//       quantity,
//       discount,
//       subTotal,
//       subTotalOldPrice,
//       countInStock,
//       userId,
//       productId,
//       sellerDetails, 
//     });

//     const save = await cartItem.save();

//     return response.status(200).json({
//       data: save,
//       message: "Item added to cart!",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };
// ----------------------------------
export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId; // middleware
    const { 
      productTitle, 
      image, 
      sellerDetails, 
      rating, 
      brand,
      availableOptions,  // Options defined for the product (e.g., size, RAM)
      selectedOptions,   // User-selected options
      price, 
      oldPrice, 
      quantity, 
      discount, 
      subTotal, 
      subTotalOldPrice, 
      productId, 
      countInStock 
    } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Provide productId!",
        error: true,
        success: false,
      });
    }

    if (!sellerDetails || !sellerDetails.sellerId || !sellerDetails.sellerName) {
      return response.status(400).json({
        message: "Provide valid seller details!",
        error: true,
        success: false,
      });
    }

    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      return response.status(400).json({
        message: "Invalid quantity! Must be a positive number.",
        error: true,
        success: false,
      });
    }

    if (!countInStock || isNaN(countInStock) || countInStock < 0) {
      return response.status(400).json({
        message: "Invalid stock count.",
        error: true,
        success: false,
      });
    }

    // // Check if at least one option is selected (size, weight, or RAM)
    // const { productWeight, size, productRam } = selectedOptions;
    // if (!productWeight && !size && !productRam) {
    //   return response.status(400).json({
    //     message: "Please select at least one option (size, weight, or RAM).",
    //     error: true,
    //     success: false,
    //   });
    // }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: "Product not found.",
        error: true,
        success: false,
      });
    }

    if (quantity > countInStock) {
      return response.status(400).json({
        message: `Only ${countInStock} items are available for ${productTitle}.`,
        error: true,
        success: false,
      });
    }

    // Find if there is an item with the same productId and selectedOptions
    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
      selectedOptions: { $eq: selectedOptions } // Compare selectedOptions
    });

    if (checkItemCart) {
      // If the same selectedOptions exist in cart, show a message
      return response.status(400).json({
        message: "This product with the same selected options is already in your cart.",
        success: false,
      });
    }

    // Otherwise, create a new cart item
    const cartItem = new CartProductModel({
      productTitle, 
      image, 
      rating, 
      brand,
      availableOptions,
      selectedOptions,
      price, 
      oldPrice,
      quantity,
      discount,
      subTotal,
      subTotalOldPrice,
      countInStock,
      userId,
      productId,
      sellerDetails, 
    });

    const save = await cartItem.save();

    return response.status(200).json({
      data: save,
      message: "Item added to cart!",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};




export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId;

    // Check if userId is valid
    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized! Please log in to view your cart.",
        error: true,
        success: false,
      });
    }

    const cartItems = await CartProductModel.find({ userId: userId });

    // Check if there are no cart items for the user
    if (cartItems.length === 0) {
      return response.status(200).json({
        data: [],
        message: "Your cart is empty.",
        error: false,
        success: true,
      });
    }

    return response.status(200).json({
      data: cartItems,
      message: "Cart item retrieved successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to retrieve cart items. Please try again later.",
      error: true,
      success: false,
    });
  }
};


// export const updateCartItemQtyController = async (request, response) => {
//   try {
//     const userId = request.userId;
//     const { id, qty, subTotal, subTotalOldPrice, selectedOptions } = request.body;

//     // Check if the user is authenticated
//     if (!userId) {
//       return response.status(401).json({
//         message: "Unauthorized! Please log in to update the cart.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if id and qty are provided
//     if (!id || !qty) {
//       return response.status(400).json({
//         message: "Provide both id and qty to update the cart item.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if qty is valid
//     if (qty <= 0 || isNaN(qty)) {
//       return response.status(400).json({
//         message: "Invalid quantity. Quantity must be a positive number.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if subTotal and subTotalOldPrice are valid numbers
//     if (isNaN(subTotal) || isNaN(subTotalOldPrice)) {
//       return response.status(400).json({
//         message: "Invalid subTotal or subTotalOldPrice value.",
//         error: true,
//         success: false,
//       });
//     }

//     // Fetch the cart item to check available stock
//     const cartItem = await CartProductModel.findById(id);
//     if (!cartItem) {
//       return response.status(404).json({
//         message: "Cart item not found.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if requested quantity exceeds available stock
//     if (qty > cartItem.countInStock) {
//       return response.status(400).json({
//         message: `Only ${cartItem.countInStock} items are available in stock.`,
//         error: true,
//         success: false,
//       });
//     }

//     // Update the cart item
//     const updatedCartItem = await CartProductModel.findByIdAndUpdate(
//       id,
//       { $set: { quantity: qty, subTotal: subTotal, subTotalOldPrice: subTotalOldPrice } },
//       { new: true }
//     );

//     if (!updatedCartItem) {
//       return response.status(500).json({
//         message: "Failed to update the cart item. Please try again later.",
//         error: true,
//         success: false,
//       });
//     }

//     return response.status(200).json({
//       message: "Cart updated successfully",
//       error: false,
//       success: true,
//       data: updatedCartItem,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: "An unexpected error occurred. Please try again later.",
//       error: true,
//       success: false,
//     });
//   }
// };

export const updateCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { id, qty = 1, subTotal = null, subTotalOldPrice = null, selectedOptions } = request.body;

    // Check if the user is authenticated
    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized! Please log in to update the cart.",
        error: true,
        success: false,
      });
    }

    // Check if id is provided
    if (!id) {
      return response.status(400).json({
        message: "Provide item id to update the cart.",
        error: true,
        success: false,
      });
    }

    // Check if qty is valid (always validate qty, even if it's optional)
    if (qty <= 0 || isNaN(qty)) {
      return response.status(400).json({
        message: "Invalid quantity. Quantity must be a positive number.",
        error: true,
        success: false,
      });
    }

    // Check if subTotal and subTotalOldPrice are valid numbers, only if they are provided
    if (subTotal !== null && isNaN(subTotal)) {
      return response.status(400).json({
        message: "Invalid subTotal value.",
        error: true,
        success: false,
      });
    }

    if (subTotalOldPrice !== null && isNaN(subTotalOldPrice)) {
      return response.status(400).json({
        message: "Invalid subTotalOldPrice value.",
        error: true,
        success: false,
      });
    }

    // Validate selectedOptions dynamically (if provided)
    if (selectedOptions) {
      if (typeof selectedOptions !== "object" || Array.isArray(selectedOptions)) {
        return response.status(400).json({
          message: "Invalid selectedOptions format. It must be an object.",
          error: true,
          success: false,
        });
      }

      for (const key in selectedOptions) {
        if (typeof selectedOptions[key] !== "string") {
          return response.status(400).json({
            message: `Invalid value for ${key}. It must be a string.`,
            error: true,
            success: false,
          });
        }
      }
    }

    // Fetch the cart item to check available stock
    const cartItem = await CartProductModel.findById(id);
    if (!cartItem) {
      return response.status(404).json({
        message: "Cart item not found.",
        error: true,
        success: false,
      });
    }

    // Check if requested quantity exceeds available stock
    if (qty > cartItem.countInStock) {
      return response.status(400).json({
        message: `Only ${cartItem.countInStock} items are available in stock.`,
        error: true,
        success: false,
      });
    }

    // Prepare update data
    const updateData = {
      quantity: qty,
    };

    // Add subTotal and subTotalOldPrice to update only if provided
    if (subTotal !== null) updateData.subTotal = subTotal;
    if (subTotalOldPrice !== null) updateData.subTotalOldPrice = subTotalOldPrice;

    // Add selectedOptions to update only if provided
    if (selectedOptions) {
      updateData.selectedOptions = selectedOptions;
    }

    // Update the cart item
    const updatedCartItem = await CartProductModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!updatedCartItem) {
      return response.status(500).json({
        message: "Failed to update the cart item. Please try again later.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Cart updated successfully",
      error: false,
      success: true,
      data: updatedCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
      error: true,
      success: false,
    });
  }
};




export const deleteCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { id } = request.params;

    // Ensure the user is authenticated
    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized! Please log in to delete items from the cart.",
        error: true,
        success: false,
      });
    }

    // Ensure id is provided and in valid format
    if (!id) {
      return response.status(400).json({
        message: "Provide cart item id to delete.",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid cart item id format.",
        error: true,
        success: false,
      });
    }

    // Attempt to delete the cart item
    const deleteCartItem = await CartProductModel.deleteOne({
      _id: id,
      userId: userId,
    });

    if (deleteCartItem.deletedCount === 0) {
      return response.status(404).json({
        message: "The product in the cart is not found.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Item removed from cart successfully.",
      error: false,
      success: true,
      data: deleteCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
      error: true,
      success: false,
    });
  }
};
