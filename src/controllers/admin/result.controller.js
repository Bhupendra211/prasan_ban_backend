import { client } from "../../config/redis.js";
import Result from "../../models/result.model.js";
import User from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { paginate } from "../../utils/paginate.js";
import { errorResponse, successResponse } from "../../utils/responseHandler.js";
import resultQueue from "../../utils/resultManager.js";

export const getAllResults = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const results = await Result.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "student_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" }, // Flatten array
      {
        $lookup: {
          from: "quizzes",
          localField: "quiz_id",
          foreignField: "_id",
          as: "quiz",
        },
      },
      { $unwind: "$quiz" }, // Flatten array
      {
        $project: {
          _id: 1,
          total_score: 1,
          total_correct: 1,
          total_attempt: 1,
          "student.name": 1,
          "student.username": 1,
          "student.dob": 1,
          "student.role": 1,
          "quiz.title": 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);

    if (!results.length) {
      return errorResponse(res, 404, "No results found", null);
    }

    return successResponse(res, 200, "Results Fetched Successfully", results);
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, 500, "Internal Server Error");
  }
});

export const generateResult = asyncHandler(async (req, res) => {
  try {
    const { quiz_id } = req.params;

    if (!quiz_id) {
      return res.status(400).json({
        success: false,
        message: "quiz_id is required.",
      });
    }

    console.log(`📢 Adding result processing job for quiz ${quiz_id}...`);

    // Add job to the worker queue
    await resultQueue.add("processResult", { quiz_id });

    return res.status(202).json({
      success: true,
      message: "Result processing started. Please wait...",
    });
  } catch (error) {
    console.error("Error in generating result:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export const getResultStatus = asyncHandler(async (req, res) => {
    try {
      const { quiz_id } = req.params;
      if (!quiz_id) {
        return res.status(400).json({ success: false, message: "quiz_id is required." });
      }
  
      const result = await Result.findOne({ quiz_id });
  
      if (!result || result.status !== "completed") {
        return res.status(200).json({ success: false, message: "Result not yet ready." });
      }
  
      return res.status(200).json({
        success: true,
        message: "Result is ready.",
        data: result,
      });
    } catch (error) {
      console.error("Error checking result status:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
