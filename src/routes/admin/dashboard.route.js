import express from 'express';
import { getDashboardData } from '../../controllers/admin/dashboard.controller.js';

const adminDashboard = express.Router();


// Get all Quizzes
adminDashboard.get('/all-data', getDashboardData);

export default adminDashboard;