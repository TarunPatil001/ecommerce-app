import jwt from "jsonwebtoken";
import UserModel from "../models/user.modal.js"; // Ensure UserModel is imported

const generatedRefreshToken = async (userId) => {
  try {
    // Generate the refresh token
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Update the user's document with the new refresh token
    const updateResult = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: token,
    });

    if (!updateResult) {
      throw new Error("Failed to update refresh token in the database.");
    }

    return token;
  } catch (error) {
    console.error("Error generating refresh token:", error.message);
    throw new Error("Unable to generate refresh token.");
  }
};

export default generatedRefreshToken;
