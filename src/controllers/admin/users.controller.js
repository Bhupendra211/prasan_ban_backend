import User from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { paginate } from "../../utils/paginate.js";
import { errorResponse, successResponse } from "../../utils/responseHandler.js";

export const getAllUser = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role = "student" } = req.query;

    try {
        const filter = role ? { role } : {};

        const users = await paginate(User, filter, parseInt(page), parseInt(limit));

        if (!users.data.length) {
            return errorResponse(res, 404, "No users found", null);
        }

        return successResponse(res, 200, "Users List Fetched Successfully", users);
    } catch (error) {
        console.log(error.message)
        return errorResponse(res, 500, "Internal Server Error");
    }
})