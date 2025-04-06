import Quiz from "../../models/quiz.model.js";
import Result from "../../models/result.model.js";
import User from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { paginate } from "../../utils/paginate.js";
import { errorResponse, successResponse } from "../../utils/responseHandler.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  try {
    const users = await User.countDocuments({ role: "student" });
    const quizzes = await Quiz.countDocuments();

    const data = {
      total_users: users,
      total_quiz: quizzes,
    };

    return successResponse(res, 200, "Results Fetched Successfully", data);
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, 500, "Internal Server Error");
  }
});
