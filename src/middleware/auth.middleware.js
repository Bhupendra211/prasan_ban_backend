import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHandler.js";

export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return errorResponse(res, 401, "Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 401, "Invalid or expired token");
    }
}


export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return errorResponse(res, 403, "You do not have permission to access this resource");
        }
        next();
    };
};