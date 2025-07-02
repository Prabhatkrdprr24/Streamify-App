import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

const getRecommendedUsers = async (req, res) => {

    try{

        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { isOnboarded: true }, // Only include onboarded users]
                {$id: {$nin: currentUser.friends}} // Exclude friends of the current user
            ]
        });

        res.status(200).json(recommendedUsers);

    }
    catch(error){
        console.error("Error in getRecommendedUsers:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

const getMyFriends = async (req, res) => {

    try{

        const user = await User.findById(req.user.id)
            .select('friends')
            .populate('friends', 'fullName profilePicture nativeLanguage learningLanguage location');

        res.status(200).json(user.friends);

    }
    catch(error){
        console.error("Error in getMyFriends:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

const sendFriendRequest = async (req, res) => {

    try{

        const myId = req.user.id;
        const {id: recipientId} = req.params;

        //prevent sending friend request to self
        if(myId === recipientId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Check if the recipient is already a friend
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if(existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const friendRequest = new FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);

    }
    catch(error){
        console.error("Error in sendFriendRequest:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

export { getRecommendedUsers, getMyFriends, sendFriendRequest };