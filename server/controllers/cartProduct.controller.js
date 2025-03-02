import CartProductModel from "../models/cartProduct.model.js";
import ProductModel from './../models/product.model.js';
import mongoose from 'mongoose';


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

//     // Ensure the quantity does not exceed 10
//     if (quantity > 10) {
//       return response.status(400).json({
//         message: "You can purchase a maximum of 10 units per product in one attempt.",
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

//     // Find if there is an item with the same productId and selectedOptions
//     const checkItemCart = await CartProductModel.findOne({
//       userId: userId,
//       productId: productId,
//       selectedOptions: { $eq: selectedOptions } // Compare selectedOptions
//     });

//     if (checkItemCart) {
//       // If the same selectedOptions exist in cart, show a message
//       return response.status(400).json({
//         message: "This product with the same selected options is already in your cart.",
//         success: false,
//       });
//     }

//     // Otherwise, create a new cart item
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

    // Ensure the quantity does not exceed 10
    if (quantity > 10) {
      return response.status(400).json({
        message: "You can purchase a maximum of 10 units per product in one attempt.",
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

    // Check if product has availableOptions
    const isProductWithOptions = availableOptions && availableOptions.length > 0;

    // If the product has no options, we skip the selected options validation
    if (isProductWithOptions) {
      const { productWeight, size, productRam } = selectedOptions;

      // Ensure that at least one option is selected (size, weight, or RAM)
      if (!productWeight && !size && !productRam) {
        return response.status(400).json({
          message: "Please select at least one option (size, weight, or RAM).",
          error: true,
          success: false,
        });
      }
    }

    // Find the product in the database
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

    // Check if the same product with the same selected options is already in the cart
    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
      selectedOptions: { $eq: selectedOptions }, // Compare selectedOptions
    });

    if (checkItemCart) {
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


// export const updateCartItemController = async (request, response) => {
//   try {
//     const userId = request.userId;
//     const { id, productId, qty, subTotal = null, subTotalOldPrice = null, selectedOptions } = request.body;

//     // Check if the user is authenticated
//     if (!userId) {
//       return response.status(401).json({
//         message: "Unauthorized! Please log in to update the cart.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if id and qty are provided
//     if (!id) {
//       return response.status(400).json({
//         message: "Provide id to update the cart item.",
//         error: true,
//         success: false,
//       });
//     }


//     let quantity = qty;

//     // If qty is not provided, use the existing quantity
//     if (qty === undefined) {
//       const cartItem = await CartProductModel.findById(id);
//       if (!cartItem) {
//         return response.status(404).json({
//           message: "Cart item not found.",
//           error: true,
//           success: false,
//         });
//       }
//       quantity = cartItem.quantity;
//     }


//     // Ensure quantity is within valid range (1 to 10)
//     if (quantity <= 0 || isNaN(quantity)) {
//       return response.status(400).json({
//         message: "Invalid quantity! Must be a positive number.",
//         error: true,
//         success: false,
//       });
//     }

//     if (quantity > 10) {
//       return response.status(400).json({
//         message: "You can purchase a maximum of 10 units per product.",
//         error: true,
//         success: false,
//       });
//     }


//     // Check if subTotal and subTotalOldPrice are valid numbers
//     if (subTotal !== null && isNaN(subTotal)) {
//       return response.status(400).json({
//         message: "Invalid subTotal value.",
//         error: true,
//         success: false,
//       });
//     }

//     if (subTotalOldPrice !== null && isNaN(subTotalOldPrice)) {
//       return response.status(400).json({
//         message: "Invalid subTotalOldPrice value.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if selectedOptions is valid
//     if (selectedOptions && (typeof selectedOptions !== "object" || Array.isArray(selectedOptions))) {
//       return response.status(400).json({
//         message: "Invalid selectedOptions format. It must be an object.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if the cart item already exists with the same productId and selectedOptions
//     const existingCartItem = await CartProductModel.findOne({
//       userId: userId,
//       productId: productId,
//       selectedOptions: { $eq: selectedOptions }, // Match the selectedOptions
//     });

//     if (existingCartItem && existingCartItem._id.toString() !== id) {
//       // Merge the quantities, subTotal, and subTotalOldPrice
//       const updatedQuantity = existingCartItem.quantity + quantity; // Add the quantity from the current item

//       const updatedSubTotal = (existingCartItem.subTotal || 0) + (subTotal || 0);
//       const updatedSubTotalOldPrice = (existingCartItem.subTotalOldPrice || 0) + (subTotalOldPrice || 0);

//       // Update the existing cart item with merged data
//       await CartProductModel.findByIdAndUpdate(existingCartItem._id, {
//         $set: {
//           quantity: updatedQuantity,
//           subTotal: updatedSubTotal,
//           subTotalOldPrice: updatedSubTotalOldPrice,
//         },
//       });

//       // Delete the current cart item after merging
//       await CartProductModel.findByIdAndDelete(id);

//       return response.status(200).json({
//         message: "Cart updated successfully by merging the items.",
//         error: false,
//         success: true,
//       });
//     }

//     // If no existing item is found, update the cart item as usual
//     const cartItem = await CartProductModel.findById(id);
//     if (!cartItem) {
//       return response.status(404).json({
//         message: "Cart item not found.",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if requested quantity exceeds available stock
//     if (quantity > cartItem.countInStock) {
//       return response.status(400).json({
//         message: `Only ${cartItem.countInStock} items are available in stock.`,
//         error: true,
//         success: false,
//       });
//     }


//     // Prepare update data for the current item
//     const updateData = {
//       quantity: quantity,
//       subTotal: subTotal,
//       subTotalOldPrice: subTotalOldPrice,
//     };

//     // Add selectedOptions to update if provided
//     if (selectedOptions) {
//       updateData.selectedOptions = selectedOptions;
//     }

//     // Update the cart item with the new data
//     const updatedCartItem = await CartProductModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });

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
//     console.error("Unexpected error occurred:", error);
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
    const { id, productId, qty, subTotal = null, subTotalOldPrice = null, selectedOptions } = request.body;

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
        message: "Provide id to update the cart item.",
        error: true,
        success: false,
      });
    }

    let quantity = qty;

    // If qty is not provided, use the existing quantity
    if (qty === undefined) {
      const cartItem = await CartProductModel.findById(id);
      if (!cartItem) {
        return response.status(404).json({
          message: "Cart item not found.",
          error: true,
          success: false,
        });
      }
      quantity = cartItem.quantity;
    }

    // Ensure quantity is within valid range (1 to 10)
    if (quantity <= 0 || isNaN(quantity)) {
      return response.status(400).json({
        message: "Invalid quantity! Must be a positive number.",
        error: true,
        success: false,
      });
    }

    if (quantity > 10) {
      return response.status(400).json({
        message: "We're sorry! Only 10 unit(s) allowed in each order",
        error: true,
        success: false,
      });
    }

    // Check if subTotal and subTotalOldPrice are valid numbers
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

    // Check if selectedOptions is valid
    if (selectedOptions && (typeof selectedOptions !== "object" || Array.isArray(selectedOptions))) {
      return response.status(400).json({
        message: "Invalid selectedOptions format. It must be an object.",
        error: true,
        success: false,
      });
    }

    // Check if the cart item already exists with the same productId and selectedOptions
    const existingCartItem = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
      selectedOptions: { $eq: selectedOptions }, // Match the selectedOptions
    });

    if (existingCartItem && existingCartItem._id.toString() !== id) {
      // Merge the quantities, but restrict to max 10
      const updatedQuantity = Math.min(existingCartItem.quantity + quantity, 10);

      const updatedSubTotal = (existingCartItem.subTotal || 0) + (subTotal || 0);
      const updatedSubTotalOldPrice = (existingCartItem.subTotalOldPrice || 0) + (subTotalOldPrice || 0);

      // Update the existing cart item with merged data
      await CartProductModel.findByIdAndUpdate(existingCartItem._id, {
        $set: {
          quantity: updatedQuantity,
          subTotal: updatedSubTotal,
          subTotalOldPrice: updatedSubTotalOldPrice,
        },
      });

      // Delete the current cart item after merging
      await CartProductModel.findByIdAndDelete(id);

      return response.status(200).json({
        message: "Cart updated successfully by merging the items.",
        error: false,
        success: true,
      });
    }

    // If no existing item is found, update the cart item as usual
    const cartItem = await CartProductModel.findById(id);
    if (!cartItem) {
      return response.status(404).json({
        message: "Cart item not found.",
        error: true,
        success: false,
      });
    }

    // Check if requested quantity exceeds available stock
    if (quantity > cartItem.countInStock) {
      return response.status(400).json({
        message: `Only ${cartItem.countInStock} items are available in stock.`,
        error: true,
        success: false,
      });
    }

    // Prepare update data for the current item
    const updateData = {
      quantity: quantity,
      subTotal: subTotal,
      subTotalOldPrice: subTotalOldPrice,
    };

    // Add selectedOptions to update if provided
    if (selectedOptions) {
      updateData.selectedOptions = selectedOptions;
    }

    // Update the cart item with the new data
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
    console.error("Unexpected error occurred:", error);
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


export const emptyCartController = async (request, response) => {
  try {
    const userId = request.params.id;

    await CartProductModel.deleteMany({ userId: userId });
    return response.status(200).json({
      message: "Cart has been emptied successfully.",
      error: false,
      success: true,
    });

  } catch (error) {

  }
}