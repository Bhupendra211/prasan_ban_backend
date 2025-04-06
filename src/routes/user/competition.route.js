import express from "express";
import { getQuestions, submitQuiz, getAllQuiz } from "../../controllers/user/competition.controller.js";
import { saveProblem } from "../../controllers/admin/codingProblem.controller.js";

const competitionRoutesManager = express.Router();

competitionRoutesManager.get('/all-quiz', getAllQuiz);
competitionRoutesManager.get('/question/:id', getQuestions);
competitionRoutesManager.post('/submit-quiz', submitQuiz);
competitionRoutesManager.post('/submit-problem',saveProblem);
 // Add result processing to resultQueue (Ensuring it matches resultWorker queue name)
//  await resultQueue.add("processResults", { quiz_id },{delay:10000});




export default competitionRoutesManager;
