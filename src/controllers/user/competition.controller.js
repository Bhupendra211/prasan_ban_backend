import { asyncHandler } from "../../utils/asyncHandler.js";
import { client } from "../../config/redis.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import Question from "../../models/questions.model.js";
import Quiz from "../../models/quiz.model.js";
import { validateFields } from "../../utils/validateFields.js";
import StudentAttempt from "../../models/studentAttempt.model.js";
import Result from "../../models/result.model.js";
import quizQueue from "../../utils/queueManager.js";

export const getQuestions = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findOne({ _id: id })
      .select(["total_question", "duration"])
      .lean();
    const totalQuestions = quiz?.total_question || 0;
    const duration = quiz?.duration || 0;

    if (totalQuestions === 0 || duration === 0) {
      return errorResponse(res, 404, "No Questions Found", null);
    }

    const questionsCacheKey = `quiz_questions_${id}`;

    let questions = await client.get(questionsCacheKey);

    if (!questions) {
      questions = await Question.find({ quiz_id: id }).lean();

      if (questions.length === 0) {
        return errorResponse(res, 404, "No Questions Found", null);
      }
      console.log("questionsCacheKey: ", questions);
      await client.set(
        questionsCacheKey,
        JSON.stringify(questions),
        "EX",
        60 * 60 * 3
      );
    } else {
      questions = JSON.parse(questions);
    }

    const data = {
      statusResponse: "200",
      status: "success",
      total_questions: totalQuestions,
      duration: duration,
      question: questions,
    };

    return successResponse(res, 200, "Question Fetched Successfully", data);
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, 500, "Internal Server Error", null);
  }
});

// Get all quizzes
export const getAllQuiz = asyncHandler(async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    if (!quizzes.length) {
        return errorResponse(res, 404, "No quizzes found", null);
    }

    return successResponse(res, 200, "Quizzes fetched successfully", quizzes);
  } catch (error) {
    return errorResponse(
      res,
      500,
      `Internal Server Error ${error}`,
      error.message
    );
  }
});

export const submitQuiz = asyncHandler(async (req, res) => {
  try {
    const requiredFields = ["user_id", "quiz_id", "answers"];
    const errorMessage = validateFields(requiredFields, req.body);
    if (errorMessage) {
      return errorResponse(res, 400, errorMessage);
    }

    const answers = req.body.answers;

    // Check if answers is an object and not empty
    if (typeof answers !== "object" || Object.keys(answers).length === 0) {
      return errorResponse(res, 400, "Answers must be a non-empty object.");
    }

    // Loop through the answers object
    for (const [question_id, answer] of Object.entries(answers)) {
      if (
        !answer.question_id ||
        !answer.selected_option ||
        !answer.answer_status
      ) {
        return errorResponse(
          res,
          400,
          "Each answer must contain question_id, selected_option, and answer_status."
        );
      }

      if (!["right", "wrong"].includes(answer.answer_status)) {
        return errorResponse(
          res,
          400,
          "answer_status must be either 'right' or 'wrong'."
        );
      }

      if (answer.question_id !== question_id) {
        return errorResponse(
          res,
          400,
          "question_id in answer must match the key."
        );
      }
    }

    const { user_id, quiz_id } = req.body;

    console.log(user_id, quiz_id, answers);

    await quizQueue.add("processQuizSubmission", {
      student_id: user_id,
      quiz_id,
      answers,
    });

    return successResponse(
      res,
      202,
      "Quiz submitted successfully! Processing in background."
    );
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, 500, "Internal Server Error");
  }
});
