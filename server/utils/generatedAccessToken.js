import jwt from "jsonwebtoken";

const generatedAccessToken = async (userId) => {
  try {
    // Generate the access token
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_ACCESS_TOKEN, // Ensure this key is set in your environment variables
      { expiresIn: "5h" } // Token expiration time
    );
    return token;
  } catch (error) {
    console.error("Error generating access token:", error.message);
    throw new Error("Unable to generate access token.");
  }
};

export default generatedAccessToken;
