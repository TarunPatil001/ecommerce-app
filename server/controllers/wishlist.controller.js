import WishlistModel from "../models/wishlist.model.js";

export const addToWishlistController = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
    } = request.body;

    const item = await WishlistModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (item) {
      return response.status(400).json({
        message: "Item already in cart!",
      });
    }

    const wishlist = new WishlistModel({
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
      userId,
    });

    const save = await wishlist.save();

    return response.status(200).json({
        message: "Product added to wishlist!",
        error: false,
        success: true,
        data: save,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const removeFromWishlistController = async (request, response) => {
  try {

    const wishlistItem = await WishlistModel.findById(request.params.id);
    
    if (!wishlistItem) {
        return response.status(404).json({
          message: "The item with this id was not found",
          error: true,
          success: false,
        });
      }

      const deletedItem = await WishlistModel.findByIdAndDelete(request.params.id);

      if (!deletedItem) {
        return response.status(404).json({
          message: "The item is not deleted",
          error: true,
          success: false,
        });
      }

      return response.status(200).json({
          message: "The item removed from wishlist!",
          error: false,
          success: true,
          data: deletedItem,
      });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getWishlistController = async (request, response) => {
    try {
        const userId = request.userId;
        const wishlistItems = await WishlistModel.find({
            userId: userId,
        });

        return response.status(200).json({
            error: false,
            success: true,
            data: wishlistItems,
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
          });
    }
}
