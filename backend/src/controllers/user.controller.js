

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

export { getRecommendedUsers, getMyFriends };