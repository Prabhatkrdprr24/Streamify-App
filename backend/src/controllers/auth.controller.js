import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try{

        if(!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists, please use a different one'});
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePicture: randomAvatar
        });


        try{

            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePicture || "",
            });
            console.log(`Stream user upserted successfully for user: ${newUser.fullName}`);

        }
        catch(error){
            console.log("Error in upserting Stream user:", error);
        }

        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict' // Helps prevent CSRF attacks
        });

        res.status(201).json({success: true, user: newUser});

    }
    catch(error){
        console.log("Error in signup controller:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const login = async (req, res) => {
    try{
        
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid Email or Password'});
        }

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict' // Helps prevent CSRF attacks
        });

        res.status(200).json({success: true, user});

    }
    catch(error){

        console.log("Error in login controller:", error);
        res.status(500).json({ message: 'Internal server error' });

    }
}


const logout =  async (req, res) => {

    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: 'Logged out successfully' });

}

const onboard = async (req, res) => {

    try{

        const userId = req.user._id;

        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({ 
                message: 'All fields are required',
                missingFields: [
                    !fullName && 'fullName',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage',
                    !location && 'location'
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {new: true});

        if(!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        try{

            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePicture || "",
            });
            console.log(`Stream user upserted successfully for user: ${updatedUser.fullName}`);

        }
        catch(error){
            console.log("Error in upserting Stream user during onboarding:", error);
        }

        res.status(200).json({ success: true, user: updatedUser });

    }
    catch(error){
        console.log("Error in onboarding controller:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}


export { login, signup, logout, onboard };