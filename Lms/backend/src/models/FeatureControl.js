import mongoose from 'mongoose';

const featureControlSchema = new mongoose.Schema({
    featureName: {
        type: String,
        required: true,
        unique: true,
        enum: ['notes', 'quizzes', 'shortAnswerQuiz', 'conceptMasterAi']
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const FeatureControl = mongoose.model('FeatureControl', featureControlSchema);
