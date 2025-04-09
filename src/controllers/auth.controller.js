import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import { validateFields } from "../utils/validateFields.js";

export const registerManager = asyncHandler(async (req, res) => {

    try {
        const requiredFields = ["name", "username", "number", "password"];
        const errorMessage = validateFields(requiredFields, req.body);
        if (errorMessage) {
            return errorResponse(res, 400, errorMessage);
        }

        const { name, username, number, password } = req.body;

        const checkUsername = await User.findOne({ username: username });

        if (checkUsername) {
            return errorResponse(res, 400, 'Email Already Exists!');
        }

        const manager = new User({ name, username, number, password });
        await manager.save();

        return successResponse(res, 201, "You are register successfully");
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, 500, 'Internal Server Error');
    }
});




export const loginManager = asyncHandler(async (req, res) => {
    try {
        const requiredFields = ["username", "password"];
        const errorMessage = validateFields(requiredFields, req.body);
        if (errorMessage) {
            return errorResponse(res, 400, errorMessage);
        }

        const { username, password } = req.body;

        const user = await User.findOne({ username: username });
        if (!user) {
            return errorResponse(res, 400, "Invalid Credentials! Username not found");
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return errorResponse(res, 400, "Invalid Credentials! Wrong Password");
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, dob: user.dob, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const data = {
            "statusResponse": "200",
            "status": "success",
            "id": user._id,
            "name": user.name,
            "email": user.email,
            "username": user.username,
            "dob": user.dob,
            "role": user.role,
            "token": token
        }


        return successResponse(res, 201, "User Logged In Successfully", data);
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, 500, "Internal Server Error");
    }
})