import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

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
    } = request.body;

    // if (
    //   !address_line1 ||
    //   !city ||
    //   !state ||
    //   !pincode ||
    //   !country ||
    //   !mobile ||
    //   !userId
    // ) {
    //   return response.status(400).json({
    //     message: "Please provide all the fields",
    //     error: true,
    //     success: false,
    //   });
    // }

    const address = new AddressModel({
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId,
    });

    const savedAddress = await address.save();

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      { $push: { address_details: savedAddress._id } }
    );

    return response.status(200).json({
      message: "Address added successfully",
      error: false,
      success: true,
      data: savedAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAddressController = async (request, response) => {
  try {
    const address = await AddressModel.find({ userId: request?.query?.userId });

    if (!address) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }else{

      const updateUser = await UserModel.updateOne(
        { _id: request?.query?.userId },
        {
          $push: {
            address: address?._id,
          },
        }
      );
      
      return response.status(200).json({
        message: "Address found successfully",
        error: false,
        success: true,
        data: address,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
