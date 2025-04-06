import express from 'express';
import { loginManager, registerManager } from '../controllers/auth.controller.js';
const authRoutes = express.Router();

authRoutes.post('/register', registerManager);
authRoutes.post('/login', loginManager);

export default authRoutes;