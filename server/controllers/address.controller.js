import mongoose from "mongoose";
import AddressModel from "./../models/address.model.js";
import UserModel from "../models/user.model.js";


// -----------------------------------------------------------------------------------------------------------------------------
// 1. Create a new address of current login user.
export const addAddressController = async (request, response) => {
  try {
    const {
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId,
      selected = false, // Default value for selected is false
    } = request.body;

    // Normalize 'status' to Boolean
    const normalizedStatus = status === true || status === "true" ? true : false;
    const normalizedSelected = normalizedStatus ? true : false;

    // Validate required fields
    if (!userId) {
      return response.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    if (!pincode || !country) {
      return response.status(400).json({
        message: "Pincode and Country are required",
        error: true,
        success: false,
      });
    }

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // If the status is true, set all other addresses' status to false
    if (normalizedStatus) {
      await AddressModel.updateMany(
        { userId, status: true }, // Find all addresses with status: true for the user
        { $set: { status: false, selected: false } } // Set their status and selected to false
      );
    }

    // Check if the address already exists
    const existingAddress = await AddressModel.findOne({
      userId,
      address_line1,
      city,
      state,
      pincode,
      country,
    });

    if (existingAddress) {
      return response.status(409).json({
        message: "Address already exists",
        error: true,
        success: false,
      });
    }

    // Create the new address
    const address = new AddressModel({
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      status: normalizedStatus, // Use the normalized 'status'
      userId,
      selected: normalizedSelected, // 'selected' is set based on 'status'
    });

    // Save the address to the database
    const savedAddress = await address.save();

    // Update the user's address details array
    await UserModel.updateOne(
      { _id: userId },
      { $push: { address_details: savedAddress._id } }
    );

    // Return the response with the saved address
    return response.status(200).json({
      message: "Address added successfully",
      error: false,
      success: true,
      data: savedAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};


// --------------------------------------------------------------------------------------------------------------------------


// fetches all related address
export const getAddressController = async (request, response) => {
  try {
      const userId = request?.query?.userId;

      // Validate userId presence
      if (!userId) {
          return response.status(400).json({
              message: "User ID is required",
              error: true,
              success: false,
          });
      }

      // Convert userId to ObjectId if it's a valid string
      let validUserId = userId;
      if (typeof userId === "string" && mongoose.Types.ObjectId.isValid(userId)) {
          validUserId = new mongoose.Types.ObjectId(userId); // Corrected: Use 'new' to instantiate ObjectId
      }

      // Validate the format of the userId (either string or ObjectId)
      if (!mongoose.Types.ObjectId.isValid(validUserId)) {
          return response.status(400).json({
              message: "Invalid User ID format",
              error: true,
              success: false,
          });
      }

      // Find addresses associated with the user
      const addresses = await AddressModel.find({ userId: validUserId });

      // Check if addresses exist
      if (!addresses || addresses.length === 0) {
          return response.status(404).json({
              message: "No addresses found for the given user ID",
              error: true,
              success: false,
          });
      }

      // Link addresses to the user in UserModel if not already linked
      const addressIds = addresses.map((address) => address._id);
      const userUpdateResult = await UserModel.updateOne(
          { _id: validUserId },
          { $addToSet: { address: { $each: addressIds } } } // Use $addToSet to prevent duplicates
      );

      // Return success response
      return response.status(200).json({
          message: "Addresses retrieved and linked successfully",
          error: false,
          success: true,
          data: addresses,
          userUpdateResult, // Optional: Include details of the update operation
      });
  } catch (error) {
      console.error("Error in getAddressController:", error);
      return response.status(500).json({
          message: error.message || "Internal server error",
          error: true,
          success: false,
      });
  }
};


// -----------------------------------------------------------------------------------------------------------------------------


// fetch single address
export const getSingleAddressController = async (request, response) => {
  try {
      const { userId, _id: addressId } = request.query; // Destructure query parameters

      // Validate userId presence
      if (!userId) {
          return response.status(400).json({
              message: "User ID is required",
              error: true,
              success: false,
          });
      }

      // Validate addressId presence if we're searching for a specific address
      if (!addressId) {
          return response.status(400).json({
              message: "Address ID is required",
              error: true,
              success: false,
          });
      }

      // Convert userId to ObjectId if it's a valid string
      let validUserId = userId;
      if (typeof userId === "string" && mongoose.Types.ObjectId.isValid(userId)) {
          validUserId = new mongoose.Types.ObjectId(userId); // Corrected: Use 'new' to instantiate ObjectId
      }

      // Validate the format of the userId (either string or ObjectId)
      if (!mongoose.Types.ObjectId.isValid(validUserId)) {
          return response.status(400).json({
              message: "Invalid User ID format",
              error: true,
              success: false,
          });
      }

      // Convert addressId to ObjectId if it's a valid string
      let validAddressId = addressId;
      if (typeof addressId === "string" && mongoose.Types.ObjectId.isValid(addressId)) {
          validAddressId = new mongoose.Types.ObjectId(addressId);
      }

      // Validate the format of the addressId
      if (!mongoose.Types.ObjectId.isValid(validAddressId)) {
          return response.status(400).json({
              message: "Invalid Address ID format",
              error: true,
              success: false,
          });
      }

      // Find the specific address associated with the user and addressId
      const address = await AddressModel.findOne({
          userId: validUserId,
          _id: validAddressId
      });

      // Check if address exists
      if (!address) {
          return response.status(404).json({
              message: "Address not found for the given user ID and address ID",
              error: true,
              success: false,
          });
      }

      // Return success response with the single address
      return response.status(200).json({
          message: "Address retrieved successfully",
          error: false,
          success: true,
          data: address, // Return the single address object
      });
  } catch (error) {
      console.error("Error in getAddressController:", error);
      return response.status(500).json({
          message: error.message || "Internal server error",
          error: true,
          success: false,
      });
  }
};


// ---------------------------------------------------------------------------------------------------------------------------


// Function to delete an existing address
export const deleteAddressController = async (request, response) => {
  try {
    const { userId, addressId } = request.body;

    // Validate userId and addressId presence
    if (!userId || !addressId) {
      return response.status(400).json({
        message: "User ID and Address ID are required",
        error: true,
        success: false,
      });
    }

    // Convert userId to ObjectId if it's a valid string
    let validUserId = userId;
    if (typeof userId === "string" && mongoose.Types.ObjectId.isValid(userId)) {
      validUserId = new mongoose.Types.ObjectId(userId);
    }

    // Validate the format of the userId (either string or ObjectId)
    if (!mongoose.Types.ObjectId.isValid(validUserId)) {
      return response.status(400).json({
        message: "Invalid User ID format",
        error: true,
        success: false,
      });
    }

    // Find the user by ID
    const user = await UserModel.findById(validUserId);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Find the address by ID
    const address = await AddressModel.findById(addressId);
    if (!address) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }

    // Ensure the address belongs to the specified user
    if (address.userId.toString() !== validUserId.toString()) {
      return response.status(400).json({
        message: "This address does not belong to the user",
        error: true,
        success: false,
      });
    }

    // Delete the address from AddressModel
    await AddressModel.findByIdAndDelete(addressId);

    // Remove the address from the user's address list in UserModel
    await UserModel.updateOne(
      { _id: validUserId },
      { $pull: { address_details: addressId } }
    );

    return response.status(200).json({
      message: "Address deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error in deleteAddressController:", error);
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};


// -----------------------------------------------------------------------------------------------------------------------------

// function to update selected address.
export const updateAddressController = async (request, response) => {
  try {
    const {
      addressId,
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId,
      selected,
    } = request.body;

    // Validate userId presence
    if (!userId) {
      return response.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    // Validate addressId presence
    if (!addressId) {
      return response.status(400).json({
        message: "Address ID is required",
        error: true,
        success: false,
      });
    }

    // Validate pincode and country presence
    if (!pincode || !country) {
      return response.status(400).json({
        message: "Pincode and Country are required",
        error: true,
        success: false,
      });
    }

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Find the address to be updated
    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }

    // Normalize 'status' to Boolean if provided, otherwise keep the existing value
    const normalizedStatus = status !== undefined ? (status === true || status === "true" ? true : false) : address.status;

    // If 'status' is false or empty, set 'selected' to false
    const normalizedSelected = (normalizedStatus === true) ? true : false;

    // Update the address with the provided details
    address.address_line1 = address_line1 || address.address_line1;
    address.city = city || address.city;
    address.state = state || address.state;
    address.pincode = pincode || address.pincode;
    address.country = country || address.country;
    address.mobile = mobile || address.mobile;
    address.status = normalizedStatus; // Update 'status' only when provided
    address.selected = normalizedSelected; // Set 'selected' based on 'status'

    // Save the updated address
    const updatedAddress = await address.save();

    // Return the success response with the updated address
    return response.status(200).json({
      message: "Address updated successfully",
      error: false,
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error in updateAddressController:", error);
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};


// ---------------------------------------------------------------------------------------------------------------------------


export const selectAddressController = async (request, response) => {
  try {
    const { addressId, userId, selected } = request.body;

    // Validate userId and addressId presence
    if (!userId) {
      return response.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    if (!addressId) {
      return response.status(400).json({
        message: "Address ID is required",
        error: true,
        success: false,
      });
    }

    // Validate selected presence
    if (selected === undefined) {
      return response.status(400).json({
        message: "Selected status is required",
        error: true,
        success: false,
      });
    }

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Find the address to be updated
    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }

    // If selected is true, unselect all other addresses and set their status to false
    if (selected) {
      // Unselect all other addresses and set their status to false
      await AddressModel.updateMany(
        { userId, selected: true, _id: { $ne: addressId } },
        { $set: { selected: false, status: false } }
      );

      // Set the current address as selected and set its status to true
      address.selected = true;
      address.status = true;
    } else {
      // If selected is false, ensure no address is left selected
      await AddressModel.updateMany(
        { userId, selected: true },
        { $set: { selected: false, status: false } }
      );

      // Set current address as not selected and its status to false
      address.selected = false;
      address.status = false;
    }

    // Save the updated address
    const updatedAddress = await address.save();

    // Return the success response with the updated address
    return response.status(200).json({
      message: "Address selection status updated successfully",
      error: false,
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error in selectAddressController:", error);
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};
