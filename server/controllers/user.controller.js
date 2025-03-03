import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import VerificationEmail from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import UserModel from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import ReviewModel from "../models/reviews.model.js";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

export async function registerUserController(request, response) {
  try {
    let user;

    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide name, email, password",
        error: true,
        success: false,
      });
    }

    user = await UserModel.findOne({ email: email });

    if (user) {
      return response.json({
        message: "User already registered with this email",
        error: true,
        success: false,
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = new UserModel({
      email: email,
      password: hashedPassword,
      name: name,
      otp: verifyCode,
      otpExpires: Date.now() + 300000, // 5 minutes
    });

    await user.save();

    // Log email value to confirm it's correct
    console.log("Email address to send verification:", email);

    // Send verification email
    const emailSent = await sendEmailFun(
      email,
      "Email verification code: " + verifyCode,
      "",
      VerificationEmail(name, verifyCode)
    );

    if (!emailSent) {
      return response.status(500).json({
        message: "Failed to send verification email",
        error: true,
        success: false,
      });
    }

    // Create a JWT token for verification purposes
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    return response.status(200).json({
      success: true,
      error: false,
      message: "User registered successfully! Please verify your email.",
      token: token, // optional: include this if needed for verification
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function authWithGoogle(request, response) {
  const { name, email, password, avatar, mobile, role } = request.body;

  try {
    let user = await UserModel.findOne({ email: email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await UserModel.create({
        name: name,
        mobile: mobile,
        email: email,
        password: "null",
        avatar: avatar,
        role: role,
        verify_email: true,
        signUpWithGoogle: true,
      });
    }

    // Generate access and refresh tokens
    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    // Update the user's last login date
    await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
    });

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Set cookies for access and refresh tokens
    response.cookie("accessToken", accessToken, cookieOptions);
    response.cookie("refreshToken", refreshToken, cookieOptions);

    // Send the success response
    return response.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function resendOtpController(request, response) {
  try {
    const { email } = request.body;

    if (!email) {
      return response.status(400).json({
        message: "Please provide your email address.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(404).json({
        message: "User not found with this email.",
        error: true,
        success: false,
      });
    }

    // Check if the email is already verified
    if (user.verify_email === true) {
      return response.status(400).json({
        message: "Email already verified. OTP cannot be resent.",
        error: true,
        success: false,
      });
    }

    // Check if OTP has expired
    const currentTime = Date.now();
    if (user.otpExpires && currentTime < user.otpExpires) {
      return response.status(400).json({
        message:
          "OTP has not yet expired. Please wait before requesting a new OTP.",
        error: true,
        success: false,
      });
    }

    // Generate a new OTP if the previous one has expired
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP and expiration time (extend for another 5 minutes)
    user.otp = verifyCode;
    user.otpExpires = currentTime + 300000; // 5 minutes

    await user.save();

    // Send verification email with the new OTP
    const emailSent = await sendEmailFun(
      email,
      "Email verification code: " + verifyCode,
      "",
      VerificationEmail(user.name, verifyCode)
    );

    if (!emailSent) {
      return response.status(500).json({
        message: "Failed to resend verification email",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: `OTP resent to ${user.email}`,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { email, otp } = request.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (!email) {
      return response.status(400).json({
        message: "Please provide email",
        error: true,
        success: false,
      });
    }

    if (!otp) {
      return response.status(400).json({
        message: "Enter OTP send to your email",
        error: true,
        success: false,
      });
    }

    if (!email || !otp) {
      return response.status(400).json({
        message: "Please provide both email and OTP.",
        error: true,
        success: false,
      });
    }

    const isCodeValid = user.otp === otp;
    const isNotExpired = user.otpExpires > Date.now();

    if (isCodeValid && isNotExpired) {
      (user.verify_email = true), (user.otp = null), (user.otpExpires = null);
      await user.save();
      return response.status(200).json({
        message: "Email verified successfully",
        error: false,
        success: true,
      });
    } else if (!isCodeValid) {
      return response.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    } else {
      return response.status(400).json({
        message: "OTP has expired",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginUserController(request, response) {
  try {
    const { email, password } = request.body;

    // Find the user by email
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    if (!user.verify_email) {
      return response.status(400).json({
        message:
          "Your email is not verified yet, please verify your email first",
        error: true,
        success: false,
      });
    }

    // Check if the user's status is active
    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact admin",
        error: true,
        success: false,
      });
    }

    // Verify the password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(400).json({
        message: "Invalid password",
        error: true,
        success: false,
      });
    }

    // Generate access and refresh tokens
    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    // Update the user's last login date
    await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
    });

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Set cookies for access and refresh tokens
    response.cookie("accessToken", accessToken, cookieOptions);
    response.cookie("refreshToken", refreshToken, cookieOptions);

    // Send the success response
    return response.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

export async function logoutController(request, response) {
  try {
    const userId = request.userId; // Extracted from auth middleware

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Clear the cookies for tokens
    response.clearCookie("accessToken", cookieOptions);
    response.clearCookie("refreshToken", cookieOptions);

    // Remove the refresh token from the database
    await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    // Send the success response
    return response.json({
      message: "Logout Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// --------------------------------------------------------------------------------------
// Utility function to extract the public ID from the Cloudinary URL
// function extractPublicId(imageUrl) {
//   // Regex to match the Cloudinary URL and extract public ID
//   const regex = /https:\/\/response\.cloudinary\.com\/.*\/(ecommerceApp\/uploads\/.*)\.[a-zA-Z0-9]+$/;
//   const match = imageUrl.match(regex);

//   if (match && match[1]) {
//     // Return the full public ID (including folder path)
//     return match[1];
//   }

//   return null;
// }


export async function userAvatarController(request, response) {
  try {
    const userId = request.userId;  // Get the user ID from the auth middleware
    const images = request.files;   // Get uploaded files

    // Validate that exactly one image is uploaded
    if (!images || images.length !== 1) {
      return response.status(400).json({
        message: "Please upload exactly one image file.",
        error: true,
        success: false,
      });
    }

    // Validate the file type
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const uploadedImageType = images[0].mimetype;
    if (!validImageTypes.includes(uploadedImageType)) {
      return response.status(400).json({
        message: "Invalid file type. Only JPG, JPEG, PNG, or WEBP files are allowed.",
        error: true,
        success: false,
      });
    }

    // Validate file size (max 5MB for example)
    const maxSize = 5 * 1024 * 1024;  // 5MB
    const uploadedImageSize = images[0].size;
    if (uploadedImageSize > maxSize) {
      return response.status(400).json({
        message: "File is too large. Maximum allowed size is 5MB.",
        error: true,
        success: false,
      });
    }

    // Find the user and update the avatar
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return response.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    // Remove the existing avatar if there is one
    if (user.avatar) {
      const publicId = extractPublicId(user.avatar); // Extract public ID from URL

      if (publicId) {
        console.log("Attempting to delete avatar with publicId:", publicId);

        // Remove old avatar from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Delete Result:", result); // Log result

        if (result.result !== 'ok') {
          // If Cloudinary deletion fails, update the database to remove the avatar
          console.error("Failed to delete avatar from Cloudinary, removing it from database.");
          user.avatar = null;  // Remove the avatar from the database
          await user.save();  // Save the changes
          return response.status(500).json({
            message: "Failed to remove the existing avatar from Cloudinary. Avatar removed from database.",
            error: true,
            success: false,
          });
        }
      } else {
        console.error("Invalid avatar URL format. Unable to extract public ID.");
        user.avatar = null;  // If extraction fails, remove the avatar from the database
        await user.save();
        return response.status(400).json({
          message: "Invalid avatar URL format. Avatar removed from database.",
          error: true,
          success: false,
        });
      }
    }

    // Upload new avatar to Cloudinary
    const options = {
      folder: "ecommerceApp/uploads",
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    const uploadedImage = await cloudinary.uploader.upload(images[0].path, options);

    // Delete local file after successful upload to Cloudinary
    if (uploadedImage.secure_url) {
      await fs.unlink(images[0].path);  // Delete local file
    }

    // Update the user's avatar URL in the database
    user.avatar = uploadedImage.secure_url;
    await user.save();

    return response.status(200).json({
      _id: userId,
      avatar: user.avatar,
      message: "Avatar updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error in userAvatarController:", error.message || error);
    return response.status(500).json({
      message: error.message || "An error occurred during avatar upload.",
      error: true,
      success: false,
    });
  }
}


// Controller for removing an image from Cloudinary
export async function removeImageFromCloudinary(request, response) {
  try {
    const imgUrl = request.query.img;

    // Validate that the image URL is provided
    if (!imgUrl) {
      return response.status(400).json({
        message: "Image URL is required.",
        error: true,
        success: false,
      });
    }

    // Extract the public_id from the Cloudinary image URL
    const urlArr = imgUrl.split("/");
    const imageName = urlArr[urlArr.length - 1].split(".")[0];
    const publicId = `ecommerceApp/uploads/${imageName}`;

    // Remove the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    // Check the result of the deletion
    if (result.result === "ok") {
      // Extract the user ID from the request (you may need to pass it as part of the request)
      const userId = request.userId; // Assuming this is passed in the request

      // Find the user and remove the avatar from the database
      const user = await UserModel.findOne({ _id: userId });

      if (!user) {
        return response.status(404).json({
          message: "User not found.",
          error: true,
          success: false,
        });
      }

      // Remove the avatar URL from the database
      user.avatar = "";
      await user.save();

      return response.status(200).json({
        message: "Image removed successfully from Cloudinary and database.",
        success: true,
      });
    } else {
      return response.status(400).json({
        message:
          "Failed to remove image from Cloudinary. Please verify the URL or the public ID.",
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

// --------------------------------------------------------------------------------------

export async function updateUserDetails(request, response) {
  try {
    // Extract details from the request body
    const { name, email, password, mobile, sellerName } = request.body;

    const userId = request.userId; // Assuming this is passed in the request

    if (!userId) {
      return response.status(400).json({
        message: "User ID is required.",
        error: true,
        success: false,
      });
    }

    // Find the user by ID
    const userExist = await UserModel.findById(userId);

    if (!userExist) {
      return response.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    let verifyCode = "";
    let hashedPassword = userExist.password; // Default to the current password

    // Check if email is being updated
    if (email && email !== userExist.email) {
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Hash the new password if provided
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }

    // Update user details
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name: name || userExist.name,
        email: email || userExist.email,
        password: hashedPassword,
        mobile: mobile || userExist.mobile,
        sellerName: sellerName || userExist.sellerName,
        verify_email:
          email && email !== userExist.email ? false : userExist.verify_email,
        otp: verifyCode || null,
        otpExpires: verifyCode ? Date.now() + 300000 : userExist.otpExpires,
      },
      { new: true }
    );

    // Send verification email if the email was updated
    if (verifyCode) {
      await sendEmailFun(
        email, // Pass the email as a string
        `Email verification code: ${verifyCode}`,
        "", // Optional text content
        VerificationEmail(name || userExist.name, verifyCode) // Pass the HTML template
      );
    }

    return response.status(200).json({
      message: "User updated successfully.",
      error: false,
      success: true,
      user: {
        name: updatedUser.name,
        _id: updatedUser._id,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        sellerName: updatedUser.sellerName,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error updating user details:", error.message || error);
    return response.status(500).json({
      message:
        error.message || "An error occurred while updating the user details.",
      error: true,
      success: false,
    });
  }
}

export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body;

    // Validate email input
    if (!email) {
      return response.status(400).json({
        message: "Email is required.",
        error: true,
        success: false,
      });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    // Check if OTP has expired
    const currentTime = Date.now();
    if (user.otpExpires && currentTime < user.otpExpires) {
      return response.status(400).json({
        message:
          "OTP has not yet expired. Please wait before requesting a new OTP.",
        error: true,
        success: false,
      });
    }

    // Generate a new OTP if the previous one has expired
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP and expiration time (extend for another 5 minutes)
    user.otp = verifyCode;
    user.otpExpires = currentTime + 300000; // 5 minutes

    await user.save();

    // Send the verification email
    await sendEmailFun(
      email,
      `Email verification code: ${verifyCode}`,
      "", // Optional text content
      VerificationEmail(user.name, verifyCode) // Pass the HTML template
    );

    return response.json({
      message: "Please reset your password.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    return response.status(500).json({
      message: "An error occurred while processing the request.",
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(request, response) {
  try {
    // Extract details from the request body
    const { email, otp, password } = request.body; // Extract OTP here

    // Find the user by email
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    if (!email) {
      return response.status(400).json({
        message: "Please provide email",
        error: true,
        success: false,
      });
    }

    if (!otp) {
      return response.status(400).json({
        message: "Enter OTP send to your email",
        error: true,
        success: false,
      });
    }

    if (!email || !otp) {
      return response.status(400).json({
        message: "Please provide both email and OTP.",
        error: true,
        success: false,
      });
    }

    if (otp !== user.otp) {
      return response.status(400).json({
        message: "Invalid OTP.",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    if (user.otpExpires < currentTime) {
      return response.status(400).json({
        message: "OTP has expired.",
        error: true,
        success: false,
      });
    }

    // Clear OTP and OTP expiry
    user.verify_email = true;
    user.otp = "";
    user.otpExpires = "";

    const updatedUser = await user.save(); // Ensure the user is saved after changes

    return response.status(200).json({
      message: "OTP verified successfully!",
      error: false,
      success: true,
      user: updatedUser, // Return the updated user
    });
  } catch (error) {
    // Log the error and send response
    console.error(error);
    return response.status(500).json({
      message: "An error occurred while verifying OTP.",
      error: true,
      success: false,
    });
  }
}

export async function resetPassword(request, response) {
  try {
    // Extract data from the request body
    const { email, oldPassword, newPassword, confirmPassword } = request.body;

    // Validate the input
    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "Please provide email, new password, and reset token.",
        error: true,
        success: false,
      });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    if (user?.signUpWithGoogle === false) {
      // If the user is logged in (authToken exists), verify the old password
      if (user.refresh_token && user.refresh_token.trim() !== "") {
        if (!oldPassword) {
          return response.status(400).json({
            message: "Please enter the old password.",
            error: true,
            success: false,
          });
        }

        // Verify the password
        const isPasswordValid = await bcryptjs.compare(
          oldPassword,
          user.password
        );
        if (!isPasswordValid) {
          return response.status(400).json({
            message: "Invalid old password.",
            error: true,
            success: false,
          });
        }
      }
    }

    // validate and Verify the newPassword and confirmPassword
    if (!newPassword) {
      return response.status(400).json({
        message: "Please enter the new password.",
        error: true,
        success: false,
      });
    } else if (!confirmPassword) {
      return response.status(400).json({
        message: "Please enter the confirm password.",
        error: true,
        success: false,
      });
    } else if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "Passwords do not match.",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(confirmPassword, salt);

    user.password = hashedPassword;
    user.signUpWithGoogle = false;
    await user.save();

    return response.status(200).json({
      message: "Password reset successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "An error occurred while resetting the password.",
      error: true,
      success: false,
    });
  }
}

export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies.refreshToken ||
      request?.header?.authorization?.split(" ")[1]; // Bearer token

    if (!refreshToken) {
      return response.status(401).json({
        message: "Unauthorized. Please login to get a refresh token.",
        error: true,
        success: false,
      });
    }

    // Verify the refresh token
    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    const userId = verifyToken?._id;
    const newAccessToken = await generatedAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.cookie("accessToken", newAccessToken, cookiesOption);

    return response.status(200).json({
      message: "New Access token successfully.",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(401).json({
      message: "Token is expired or invalid.",
      error: true,
      success: false,
    });
  }
}

// get user login details
export async function userDetails(request, response) {
  try {
    // Ensure user data exists in the request object
    const userId = request.userId;

    if (!userId) {
      return response.status(400).json({
        message: "User ID not provided in request.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId).select("-password -refresh_token").populate('address_details');

    // Check if the user was found
    if (!user) {
      return response.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "User details successfully retrieved.",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    // Log the detailed error
    console.error("Error getting user details:", error);

    // Provide a more specific error response
    return response.status(500).json({
      message: "An error occurred while getting user details.",
      error: true,
      success: false,
      details: error.message, // Include error details for better debugging
    });
  }
}


// get all users excluding logged-in user
export async function getAllUsers(request, response) {
  try {
    // if (!request.userId) {
    //   return response.status(401).json({
    //     message: "Unauthorized request.",
    //     error: true,
    //     success: false,
    //   });
    // }

    // const users = await UserModel.find({ _id: { $ne: request.userId } })
    //   .select("-password -refresh_token");
    const users = await UserModel.find();

    if (!users.length) {
      return response.status(404).json({
        message: "No users found.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Users retrieved successfully.",
      error: false,
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return response.status(500).json({
      message: "An error occurred while retrieving users.",
      error: true,
      success: false,
      details: error.message,
    });
  }
}




// ----------------------------------------------------------------------------------------------------------------------------

// Add Review Details
export async function addReview(request, response) {
  try {
    const { image, userName, review, rating, userId, productId } = request.body;

    // Validate required fields
    if (!userId || !productId || !review || !rating) {
      return response.status(400).json({
        message: "All fields are required.",
        error: true,
        success: false,
      });
    }

    // Ensure rating is at least 1
    const validRating = Math.max(1, rating);

    const userReview = new ReviewModel({
      image,
      userName,
      review,
      rating: validRating, // Ensures rating is at least 1
      userId,
      productId,
    });

    await userReview.save();

    return response.status(201).json({
      message: "Review added successfully.",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("Error adding review:", error);
    return response.status(500).json({
      message: "An error occurred while adding the review.",
      error: true,
      success: false,
    });
  }
}


// get review details
export async function getReview(request, response) {
  try {
    const { productId } = request.query; // Extract productId from query params
    if (!productId) {
      return response.status(400).json({
        message: "Product ID is required.",
        error: true,
        success: false,
      });
    }

    const reviews = await ReviewModel.find({ productId }); // Fetch all reviews for the product
    console.log(reviews);

    if (!reviews.length) {
      return response.status(404).json({
        message: "Be the first to review this product.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Reviews retrieved successfully.",
      error: false,
      success: true,
      data: reviews,
    });

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return response.status(500).json({
      message: "An error occurred while fetching reviews.",
      error: true,
      success: false,
    });
  }
}


// get all reviews for a specific user
export async function getAllReviews(request, response) {
  try {

    const reviews = await ReviewModel.find();

    if (!reviews.length) {
      return response.status(404).json({
        message: "No reviews found for this user.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "User reviews retrieved successfully.",
      error: false,
      success: true,
      data: reviews,
    });

  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return response.status(500).json({
      message: "An error occurred while fetching user reviews.",
      error: true,
      success: false,
      details: error.message,
    });
  }
}



// Function to extract Public ID from Cloudinary URL
function extractPublicId(imageUrl) {
  const regex = /https:\/\/res\.cloudinary\.com\/.*\/(ecommerceApp\/uploads\/.*)\.[a-zA-Z0-9]+$/;
  const match = imageUrl.match(regex);
  return match ? match[1] : null;
}

// Function to delete images from Cloudinary
async function deleteImages(images) {
  if (!images || images.length === 0) return [];

  return Promise.allSettled(
    images.map(async (imageUrl, index) => {
      const publicId = extractPublicId(imageUrl);
      if (!publicId) return `Failed to extract Public ID for image ${index + 1}.`;

      console.log(`Deleting Image: ${publicId}`);
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === "ok"
          ? `Image ${index + 1} deleted successfully.`
          : `Failed to delete image ${index + 1}: ${result.error?.message || "Unknown error"}`;
      } catch (error) {
        return `Error deleting image ${index + 1}: ${error.message}`;
      }
    })
  );
}

// Controller to delete multiple users (Using req.query)
export async function deleteMultipleUsers(req, res) {
  try {
    const { ids } = req.query;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        message: "User IDs are required.",
        success: false,
        error: true,
      });
    }

    // Convert `ids` to an array (handles single and multiple values)
    const userIds = Array.isArray(ids) ? ids : ids.split(",").map((id) => id.trim());

    // Validate MongoDB ObjectId format
    if (userIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        message: "Invalid user IDs.",
        success: false,
        error: true,
      });
    }

    // Find users by IDs
    const users = await UserModel.find({ _id: { $in: userIds } });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found with the given IDs.",
        success: false,
        error: true,
      });
    }

    console.log(`Found ${users.length} users for deletion.`);

    // Delete avatars from Cloudinary
    const avatarUrls = users.map((user) => user.avatar).filter(Boolean);
    const cloudinaryResults = await deleteImages(avatarUrls);

    // Delete users from database
    await UserModel.deleteMany({ _id: { $in: userIds } });

    console.log("Users and their avatars deleted successfully.");

    return res.status(200).json({
      message: "Users and associated avatars deleted successfully.",
      success: true,
      error: false,
      cloudinaryResults,
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false,
      error: true,
    });
  }
}


// export async function deleteMultipleUsers(request, response) {
//   console.log("Incoming Request Query:", request.query);

//   try {
//     const { ids } = request.query;

//     if (!ids || ids.length === 0) {
//       return response.status(400).json({
//         message: "No user IDs provided.",
//         success: false,
//         error: true,
//       });
//     }

//     const idArray = Array.isArray(ids) ? ids : ids.split(",").map((id) => id.trim());

//     if (idArray.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
//       return response.status(400).json({
//         message: "Invalid user IDs.",
//         success: false,
//         error: true,
//       });
//     }

//     const users = await UserModel.find({ _id: { $in: idArray } });

//     if (users.length === 0) {
//       return response.status(404).json({
//         message: "No users found with the given IDs.",
//         success: false,
//         error: true,
//       });
//     }

//     console.log("⚡ Deleting avatars from Cloudinary...");
//     const failedAvatars = [];

//     for (const user of users) {
//       if (!user.avatar) continue; // Skip users with no avatar

//       const cloudinaryPublicId = extractPublicId(user.avatar);
//       if (!cloudinaryPublicId) {
//         console.error(`Invalid Cloudinary URL for user ${user._id}: ${user.avatar}`);
//         failedAvatars.push(user._id);
//         continue;
//       }

//       try {
//         await cloudinary.v2.uploader.destroy(cloudinaryPublicId);
//         console.log(`Avatar deleted for user ${user._id}`);
//       } catch (error) {
//         failedAvatars.push(user._id);
//         console.error(`Failed to delete avatar for user ${user._id}:`, error.message);
//       }
//     }

//     if (failedAvatars.length > 0) {
//       return response.status(400).json({
//         message: "Some avatars failed to delete. User deletion stopped.",
//         success: false,
//         error: true,
//         failedAvatars,
//       });
//     }

//     console.log("Deleting users from the database...");
//     const deleteResult = await UserModel.deleteMany({ _id: { $in: idArray } });

//     return response.status(200).json({
//       message: "Users and avatars deleted successfully.",
//       success: true,
//       error: false,
//       deleteResult,
//     });

//   } catch (error) {
//     console.error("Error in deleteMultipleUsers:", error.message);
//     if (!response.headersSent) {
//       return response.status(500).json({
//         message: "Internal Server Error.",
//         success: false,
//         error: true,
//         details: error.message,
//       });
//     }
//   }
// }