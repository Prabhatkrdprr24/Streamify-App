import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectRoute = async (req, res, next) => {

    try{

        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({ message: 'Unauthorized access, token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decoded){
            return res.status(401).json({ message: 'Unauthorized access, invalid token' });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if(!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next()

    }
    catch(error){
        console.error("Error in protectRoute middleware:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

export { protectRoute };