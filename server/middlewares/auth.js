import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
  try {
    const token =
      request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return response
        .status(401)
        .json({ msg: "Access denied. No token provided." });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decode) {
      return response
        .status(401)
        .json({
          msg: "Access denied. Invalid token.",
          error: true,
          success: false,
        });
    }

    request.userId = decode.id;
    next();
    
  } catch (error) {
    return response.status(500).json({
      msg: "You have not login", // error.message || error,
      error: true,
      success: false,
    });
  }
};
export default auth;
