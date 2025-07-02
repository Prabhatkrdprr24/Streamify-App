import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommendedUsers, getMyFriends } from '../controllers/user.controller.js';
import { sendFriendRequest } from '../controllers/user.controller.js';
import { acceptFriendRequest } from '../controllers/user.controller.js';
import { getFriendRequests } from '../controllers/user.controller.js';
import { getOutgoingFriendReqs } from '../controllers/user.controller.js';

const userRoutes = express.Router();

//apply auth middleware to all routes
userRoutes.use(protectRoute);

userRoutes.get('/', getRecommendedUsers);
userRoutes.get('/friends', getMyFriends);

userRoutes.post("/friend-request/:id", sendFriendRequest);
userRoutes.put("/friend-request/:id/accept", acceptFriendRequest);

userRoutes.get('/friend-requests', getFriendRequests);
userRoutes.get('/outgoing-friend-requests', getOutgoingFriendReqs);

export default userRoutes;