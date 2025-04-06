import express from 'express';
import { addQuestion, createQuiz, deleteQuestion, getAllQuestions, getAllQuiz, updateQuestion, updateQuiz, deleteQuiz, getQuizById } from '../../controllers/admin/quiz.controller.js';
import { getAllUser } from '../../controllers/admin/users.controller.js';
import { errorResponse } from '../../utils/responseHandler.js';
import { addCodingProblem, deleteCodingProblemById, deleteTestCase, getAllProblems, getProblemById, saveProblem, updateProblemById } from '../../controllers/admin/codingProblem.controller.js';
import { generateResult, getAllResults } from '../../controllers/admin/result.controller.js';

const adminQuiz = express.Router();

// ************************User Related Routes************************************
adminQuiz.get('/all-users', getAllUser);


// **************************Quiz&Question Routes*************************************
// Create Quiz
adminQuiz.post('/create-quiz', createQuiz);
// Get all Quizzes
adminQuiz.get('/all-quizzes', getAllQuiz);

// Get Quiz By Id
adminQuiz.get('/get-quiz', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});

adminQuiz.get('/get-quiz/:id', getQuizById);

// Update Quiz
adminQuiz.post('/update-quiz', (req, res) => {
    return errorResponse(res, 400, "Bad Request, ID parameter is required.", "ID parameter is required.");
});
adminQuiz.post('/update-quiz/:id', updateQuiz);
// Delete Quiz
adminQuiz.post('/delete-quiz', (req, res) => {
    return errorResponse(res, 400, "Bad Request, ID parameter is required.", "ID parameter is required.");
});
adminQuiz.post('/delete-quiz/:id', deleteQuiz);

// Add New Question
adminQuiz.post('/add-question', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});
adminQuiz.post('/add-question/:id', addQuestion);

// Get All Questions By Quiz Id
adminQuiz.get('/get-question', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});
adminQuiz.get('/get-question/:id', getAllQuestions);

// Update Question By Question Id
adminQuiz.put('/update-question', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});
adminQuiz.put("/update-question/:id", updateQuestion);

// Delete Question By Question Id
adminQuiz.delete('/delete-question', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});
adminQuiz.delete("/delete-question/:id", deleteQuestion);

// ************************Coding Problem Routes************************************
adminQuiz.post('/add-problem', addCodingProblem);
adminQuiz.get('/all-problems', getAllProblems);
adminQuiz.get('/problem/:id', getProblemById);
adminQuiz.post('/update-problem/:id', updateProblemById);
adminQuiz.delete('/delete-problem/:problemId/testcase/:testCaseId', deleteTestCase);
adminQuiz.delete('/delete-problem/:problemId', deleteCodingProblemById);
adminQuiz.get('/results', getAllResults);
adminQuiz.post('/generate-result/:quiz_id', generateResult);

export default adminQuiz;