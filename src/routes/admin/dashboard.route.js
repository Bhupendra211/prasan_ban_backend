import express from 'express';
import { getDashboardData } from '../../controllers/admin/dashboard.controller.js';

const adminDashboard = express.Router();


// Get all Quizzes
adminDashboard.get('/all-quizzes', getDashboardData);

export default adminDashboard;