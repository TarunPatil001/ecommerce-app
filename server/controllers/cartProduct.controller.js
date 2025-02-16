import CartProductModel from "../models/cartProduct.model.js";


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

export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId; // middleware
    const { productTitle, image, sellerDetails, rating, price, oldPrice, quantity, discount, subTotal, subTotalOldPrice, productId, countInStock } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Provide productId!",
        error: true,
        success: false,
      });
    }

    if (!sellerDetails || !sellerDetails.sellerId || !sellerDetails.sellerName) {
      return response.status(400).json({
        message: "Provide seller details!",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkItemCart) {
      return response.status(400).json({
        message: "Item already in cart!",
      });
    }

    const cartItem = new CartProductModel({
      productTitle, 
      image, 
      rating, 
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

    const cartItems = await CartProductModel.find({
      userId: userId,
    });

    return response.status(200).json({
      data: cartItems,
      message: "Cart item retrieved successfully",
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

export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { id, qty, subTotal, subTotalOldPrice } = request.body; 

    if (!id || !qty) { 
      return response.status(400).json({
        message: "Provide id and qty",
      });
    }

    const updatedCartItem = await CartProductModel.findByIdAndUpdate(
      id,
      { $set: { quantity: qty, subTotal: subTotal, subTotalOldPrice: subTotalOldPrice } },
      { new: true } 
    );

    if (!updatedCartItem) {
      return response.status(404).json({
        message: "Cart item not found",
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
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export const deleteCartItemQtyController = async (request, response) => {
    try {
        
        const userId = request.userId;
        const { id } = request.params;

        if (!id) {
            return response.status(400).json({
              message: "Provide id",
              error: true,
              success: false,
            });
          }

          const deleteCartItem = await CartProductModel.deleteOne({
              _id: id,
              userId: userId,
          });

          if (deleteCartItem.deletedCount === 0) {
            return response.status(404).json({
                message: "The product in the cart is not found",
                error: true,
                success: false,
            });
          }

          return response.status(200).json({
            message: "Item removed",
            error: false,
            success: true,
            data: deleteCartItem,
          });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
          });
    }
}