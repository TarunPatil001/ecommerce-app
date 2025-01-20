import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import VerificationEmail from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import UserModel from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

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
    
    if(!email || !otp) {
      return response.status(400).json({
        message: "Please provide both email and OTP.",
        error: true,
        success: false,
      });
    }

    const isCodeValid = user.otp === otp;
    const isNotExpired = user.otpExpires > Date.now();


    if (isCodeValid && isNotExpired) {
      (user.verify_email = true ), (user.otp = null), (user.otpExpires = null);
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

// image upload function
var imagesArr = [];
// Controller to handle user avatar upload and update
export async function userAvatarController(request, response) {
  try {
    const userId = request.userId; // Extracted from auth middleware
    const images = request.files; // Extracted from multer middleware

    // Validate that exactly one image is provided
    if (!images || images.length !== 1) {
      return response.status(400).json({
        message: "Please upload exactly one image file.",
        error: true,
        success: false,
      });
    }

    // Find the user by ID
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return response.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    // Check if the user already has an avatar
    if (user.avatar) {
      const imgUrl = user.avatar;

      // Extract the public_id of the existing avatar from its URL
      const urlArr = imgUrl.split("/");
      const avatarImage = urlArr[urlArr.length - 1];
      const publicId = `ecommerceApp/uploads/${avatarImage.split(".")[0]}`;

      // Remove the existing avatar from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== "ok") {
        return response.status(400).json({
          message: "Failed to remove the existing avatar.",
          error: true,
          success: false,
        });
      }
    }

    // Upload the new avatar to Cloudinary
    const options = {
      folder: "ecommerceApp/uploads", // Specify the folder in Cloudinary
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    // Use the Promise-based API correctly
    const uploadedImage = await cloudinary.uploader.upload(
      images[0].path,
      options
    );

    // Delete the local file after successful upload
    await fs.unlink(images[0].path);

    // Update the user's avatar in the database
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

export async function updateUserDetails(request, response) {
  try {
    // Extract details from the request body
    const { name, email, password, mobile } = request.body;

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
      user: updatedUser,
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
    
    if(!email || !otp) {
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
    const { email, newPassword, confirmPassword } = request.body;

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

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

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
