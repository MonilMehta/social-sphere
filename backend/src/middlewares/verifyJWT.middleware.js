import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.headers["authorization"]?.split(" ")[1] || req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Access token is required" });
    }
    
    console.log(token);
    const response = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const theUser = await User.findById(response._id).select(
      "-password -refreshToken"
    );
    
    if (!theUser) {
      return res.status(401).json({ error: "Invalid access token" });
    }
    
    req.user = theUser;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Access token expired", 
        code: "TOKEN_EXPIRED" 
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        error: "Invalid access token", 
        code: "INVALID_TOKEN" 
      });
    } else {
      return res.status(500).json({ 
        error: "Internal server error during authentication" 
      });
    }
  }
};
export { verifyJWT };
