import AddressModel from "./../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
    try {

        const { address_line1, city, state, pincode, country, mobile, status, userId, selected } = request.body;

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

        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

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


        const address = new AddressModel({
            address_line1, city, state, pincode, country, mobile, status, userId, selected
        });

        const savedAddress = await address.save();

        const updateUser = await UserModel.updateOne({ _id: userId }, { $push: { address_details: savedAddress._id } });

        return response.status(200).json({
            message: "Address added successfully",
            error: false,
            success: true,
            data: savedAddress
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

        } else {
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
