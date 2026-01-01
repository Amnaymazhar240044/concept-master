import { FeatureControl } from '../models/FeatureControl.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Initialize default features if they don't exist
export const initializeFeatures = async () => {
    const features = [
        { featureName: 'notes', label: 'Notes' },
        { featureName: 'quizzes', label: 'Quizzes' },
        { featureName: 'shortAnswerQuiz', label: 'Short Answer Quiz' },

        { featureName: 'conceptMasterAi', label: 'Concept Master AI' }
    ];

    for (const feature of features) {
        const exists = await FeatureControl.findOne({ featureName: feature.featureName });
        if (!exists) {
            await FeatureControl.create(feature);
            console.log(`Initialized feature: ${feature.label}`);
        }
    }
};

export const getFeatureSettings = asyncHandler(async (req, res) => {
    const settings = await FeatureControl.find({});
    // Filter out deprecated aiTutor feature
    const filteredSettings = settings.filter(s => s.featureName !== 'aiTutor');
    return res.status(200).json(
        new ApiResponse(200, filteredSettings, "Feature settings fetched successfully")
    );
});

export const updateFeatureSetting = asyncHandler(async (req, res) => {
    const { featureName, isPremium } = req.body;

    if (!featureName) {
        throw new ApiError(400, "Feature name is required");
    }

    const feature = await FeatureControl.findOneAndUpdate(
        { featureName },
        { isPremium },
        { new: true }
    );

    if (!feature) {
        throw new ApiError(404, "Feature not found");
    }

    return res.status(200).json(
        new ApiResponse(200, feature, "Feature setting updated successfully")
    );
});

export const checkFeatureAccess = async (featureName, user) => {
    // Admins always have access
    if (user && user.role === 'admin') {
        console.log(`Access granted for admin: ${featureName}`);
        return true;
    }

    const feature = await FeatureControl.findOne({ featureName });

    if (!feature) {
        // If feature control doesn't exist, assume it's free or handle as error
        console.log(`Feature control not found for ${featureName}, defaulting to FREE`);
        return true;
    }

    console.log(`Check Access: ${featureName} | IsPremium: ${feature.isPremium} | UserPremium: ${user?.isPremium}`);

    if (!feature.isPremium) {
        return true; // Feature is free
    }

    // Feature is premium, check if user is premium
    return !!(user && user.isPremium);
};
