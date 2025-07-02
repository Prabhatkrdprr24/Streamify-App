import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';

const chatRoutes = express.Router();

chatRoutes.get('/', protectRoute, getStreamToken);

export default chatRoutes;