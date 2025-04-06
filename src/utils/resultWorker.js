import { Worker } from "bullmq";
import StudentAttempt from "../models/studentAttempt.model.js";
import Quiz from "../models/quiz.model.js";
import Result from "../models/result.model.js";
import { client } from "../config/redis.js";
import dbConnection from "./dbConnection.js";
import CodeAttempt from "../models/codeAttempt.model.js";
import Problem from "../models/problem.model.js";

const resultWorker = new Worker(
  "resultQueue",
  async (job) => {
    try {
      await dbConnection();
      const { quiz_id } = job.data;

      console.log("I am into the result worker for quiz:", quiz_id);

      // Fetch quiz details
      const quiz = await Quiz.findById(quiz_id);
      if (!quiz) {
        console.error(`Quiz not found for ID: ${quiz_id}`);
        throw new Error("Quiz not found!");
      }

      const marks = quiz.per_question_marks || 0;
      const negative = quiz.negative_marks || 0;

      // Fetch all code attempts for this quiz
      const codeAttempts = await CodeAttempt.find().lean();

      // Group code attempts by student_id for quick lookup
      const codeAttemptsByStudent = {};
      codeAttempts.forEach((attempt) => {
        const studentId = attempt.student_id.toString();
        if (!codeAttemptsByStudent[studentId]) {
          codeAttemptsByStudent[studentId] = [];
        }
        codeAttemptsByStudent[studentId].push(attempt);
      });

      // Fetch all student attempts for the quiz
      const cursor = StudentAttempt.find({ quiz_id }).cursor();
      let bulkOperations = [];

      for await (const attempt of cursor) {
        let score = 0;
        let correct = 0;
        let total_attempts = 0;

        // Process student attempt answers
        attempt.answers.forEach((answer) => {
          if (answer.answer_status === "right") {
            score += marks;
            correct++;
          } else {
            score -= negative;
          }
          total_attempts++;
        });

        // Fetch all code attempts for this student
        const studentCodeAttempts =
          codeAttemptsByStudent[attempt.student_id.toString()] || [];

        // Process code attempts for this student
        for (const codeAttempt of studentCodeAttempts) {
          // Fetch problem details (fixing incorrect `find` usage)
          const problem = await Problem.findById(codeAttempt.problem_id);

          // Ensure coding marks have valid values
          const codingMarks = problem?.marks || 0;
          const codingNegativeMarks = problem?.negative_marks || 0;

          codeAttempt.answers.forEach((answer) => {
            if (answer.answer_status === "right") {
              score += codingMarks;
            } else {
              score -= codingNegativeMarks;
            }
          });
        }

        // Ensure `score` is a valid number before database write
        score = isNaN(score) ? 0 : score;

        bulkOperations.push({
          updateOne: {
            filter: {
              student_id: attempt.student_id,
              quiz_id: attempt.quiz_id,
            },
            update: {
              $set: {
                total_score: score,
                total_correct: correct,
                total_attempt: total_attempts,
              },
            },
            upsert: true, // Insert if not exists, update if exists
          },
        });

        console.log("bulkOperations:", bulkOperations);

        if (bulkOperations.length >= 100) {
          await Result.bulkWrite(bulkOperations);
          bulkOperations.length = 0;
        }
      }

      if (bulkOperations.length > 0) {
        await Result.bulkWrite(bulkOperations);
      }

      console.log(`Results processed for quiz ${quiz_id}`);
    } catch (error) {
      console.error("Error in result processing:", error);
    }
  },
  {
    connection: client,
    concurrency: 2,
  }
);

// **Listen for completed jobs**
resultWorker.on("completed", async (job, result) => {
  console.log(`🎉 Job ${job.id} completed:`, result);
  // Notify via WebSockets, store completion status, or trigger another API
});

// **Listen for failed jobs**
resultWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

console.log("Result worker started...");
export default resultWorker;
