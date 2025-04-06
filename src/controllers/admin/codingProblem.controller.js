import Problem from "../../models/problem.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { paginate } from "../../utils/paginate.js";
import { errorResponse, successResponse } from "../../utils/responseHandler.js";
import { validateFields } from "../../utils/validateFields.js";
import { client } from "../../config/redis.js";
import CodeAttempt from "../../models/codeAttempt.model.js";

// Create add new Coding Problem
export const addCodingProblem = asyncHandler(async (req, res) => {
  try {
    const requiredFields = [
      "title",
      "description",
      "marks",
      "negative_marks",
      "testCases",
    ];
    const errorMessage = validateFields(requiredFields, req.body);
    if (errorMessage) {
      return errorResponse(res, 400, errorMessage);
    }

    const { title, description, marks, negative_marks, testCases } = req.body;

    const manager = new Problem({
      title,
      description,
      marks,
      negative_marks,
      testCases,
    });
    await manager.save();


    await client.del("problems");

    return successResponse(
      res,
      201,
      "Coding Problem Created Successfully.",
      Problem
    );
  } catch (error) {
    console.log(error)
    return errorResponse(res, 500, error.message);
  }
});

// API to get problems
export const getAllProblems = asyncHandler(async (req, res) => {
  try {

    const cachedProblems = await client.get("problems");
    if (cachedProblems) {
      const parsedData = JSON.parse(cachedData);

      // Optional: implement pagination here if needed on cached data
      return successResponse(res, 200, "Fetched from cache", {
        total: parsedData.length,
        page: 1,
        totalPages: 1,
        data: parsedData,
      });
    }


    const { page = 1, limit = 10 } = req.query;

    const problems = await paginate(Problem, {}, parseInt(page), parseInt(limit));

    if (!problems.data.length) {
      return errorResponse(res, 404, "No Questions Found", null);
    }

    const all = await Problem.find({});
    await client.set("problems", JSON.stringify(all), "EX", 60 * 60 * 3);

    return successResponse(res, 200, "Questions fetched successfully", problems);
  } catch (error) {
    return errorResponse(res, 500, "Internal Server Error", error.message);
  }
});

// Get problem By Id
export const getProblemById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;


    const problem = await Problem.findById(id);
    if (!problem) {
      return errorResponse(res, 404, "Problem not found", null);
    }

    return successResponse(res, 200, "Problem fetched successfully", problem);
  } catch (error) {
    return errorResponse(res, 500, "Internal Server Error", error.message);
  }
});

// Update problem by Id
export const updateProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    marks,
    negative_marks,
    testCases, // expects array of { input, expected }
  } = req.body;

  try {
    // Logging for debug
    console.log("Updating Problem ID:", id);
    console.log("Payload:", req.body);

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          marks,
          negative_marks,
          testCases,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return errorResponse(res, 404, "Problem not found", null);
    }

    
    let allProblems = await Problem.find();
    await client.set("problems", JSON.stringify(allProblems), "EX", 60 * 60 * 3);

    return successResponse(res, 200, "Problem updated successfully", updatedProblem);
  } catch (error) {
    console.error("Update Error:", error);
    return errorResponse(res, 500, "Internal Server Error", error.message);
  }
});

// Delete Coding problem Testcase by Id
export const deleteTestCase = asyncHandler(async (req, res) => {
  try {
    const { problemId, testCaseId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) return errorResponse(res, 404, "Problem not found", null);

    problem.testCases = problem.testCases.filter(
      (testCase) => testCase._id.toString() !== testCaseId
    );
    await problem.save();

    let allProblems = await Problem.find();
    await client.set("problems", JSON.stringify(allProblems), "EX", 60 * 60 * 3);

    return successResponse(res, 200, "Test case deleted successfully", null);
  } catch (error) {
    console.log(error)
    return errorResponse(res, 500, "Internal Server Error", error.message);
  }
});

// Delete Coding problem Testcase by Id
export const deleteCodingProblemById = asyncHandler(async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findByIdAndDelete(problemId);
    if (!problem) return errorResponse(res, 404, "Problem not found", null);
    const allProblems = await Problem.find({});
    await client.set("problems", JSON.stringify(allProblems), "EX", 60 * 60 * 3);

    return successResponse(res, 200, "Test case deleted successfully", null);
  } catch (error) {
    return errorResponse(res, 500, "Internal Server Error", error.message);
  }
});




// Save the data of the Coding Problem
export const saveProblem = asyncHandler(async (req, res) => {
  try {
    const requiredFields = ["problem_id", "student_id", "code", "status"];
    const errorMessage = validateFields(requiredFields, req.body);
    if (errorMessage) {
      return errorResponse(res, 400, errorMessage);
    }

    const { problem_id, student_id, code, status } = req.body;

    let existingAttempt = await CodeAttempt.findOne({ student_id, problem_id });

    if (existingAttempt) {
      console.log("Updating existing record...");

      // Ensure answers array exists
      if (existingAttempt.answers.length > 0) {
        existingAttempt.answers[0].code = code;
        existingAttempt.answers[0].answer_status = status;
      } else {
        // If answers array is empty, push a new object
        existingAttempt.answers.push({ code, answer_status: status });
      }
      // Mark the array as modified for Mongoose
      existingAttempt.markModified("answers");

      await existingAttempt.save();

      return successResponse(res, 200, "Code Solution Updated Successfully");
    } else {
      console.log("Creating new record...");

      // Create new attempt
      await CodeAttempt.create({
        student_id,
        problem_id,
        answers: [{ code, answer_status: status }], // Ensure answers is an array
      });

      return successResponse(res, 201, "Code Solution Saved Successfully");
    }
  } catch (error) {
    console.error("Error Saving Problem:", error);
    return res
      .status(500)
      .json({ error: "Database Error", details: error.message });
  }
});
