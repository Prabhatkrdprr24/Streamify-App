import express from 'express';
import { login, signup, logout } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { onboard } from '../controllers/auth.controller.js'; 

const authRoute = express.Router();

authRoute.post('/login', login);
authRoute.post('/signup', signup);
authRoute.post('/logout', logout);

authRoute.post("/onboarding", protectRoute, onboard);

//check if user is logged in
authRoute.get('/me', protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default authRoute;