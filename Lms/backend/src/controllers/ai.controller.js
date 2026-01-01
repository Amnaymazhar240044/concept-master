// Legacy code: Old import and initialization pattern (commented out for reference)
// import { GoogleGenAI } from '@google/genai';
// import { asyncHandler } from '../utils/asyncHandler.js';
// const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Import Google Gemini AI SDK for AI-powered features
import { GoogleGenAI } from '@google/genai';

// Import async handler wrapper for error handling
import { asyncHandler } from '../utils/asyncHandler.js';
import { checkFeatureAccess } from './featureControl.controller.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Google Gemini AI client
// NOTE on Initialization:
// The GoogleGenAI constructor can automatically read GEMINI_API_KEY from environment variables
// However, here we explicitly pass the API key for clarity
// SECURITY WARNING: In production, use environment variables: process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Recommended for production: const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// Controller function for AI content generation
// Protected premium endpoint for Concept Master AI chat feature
// This powers the conversational AI assistant that helps students learn
export const generateContent = asyncHandler(async (req, res) => {
    // Check feature access
    const hasAccess = await checkFeatureAccess('conceptMasterAi', req.user);
    if (!hasAccess) {
        return res.status(403).json({
            message: 'This is a premium feature. Please upgrade to access Concept Master AI.',
            code: 'PREMIUM_REQUIRED'
        });
    }

    // Extract prompt/message from request body
    const { prompt } = req.body;

    // Validate that prompt is provided
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        // LATEST METHOD for Gemini API:
        // Call generateContent directly on the models object
        // passing the model name and contents in the request object
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',  // The current fast and cost-effective model
            contents: prompt,           // User's message/question
        });

        // The result object now contains the response data directly
        // Access the generated text from the 'text' property
        const text = result.text;

        // Return AI-generated response to client
        res.json({ text });
    } catch (error) {
        // Log error for debugging
        console.error('Error generating AI content:', error);

        // Extract error message safely
        const errorMessage = error.message || 'An unknown error occurred.';

        // Return 500 Internal Server Error with error details
        res.status(500).json({
            message: 'Failed to generate content',
            error: errorMessage
        });
    }
});

// Function for AI-powered quiz grading
// NOT an HTTP endpoint - called internally by quiz submission controller
// Grades short-answer quiz questions using Gemini AI for intelligent evaluation
export const gradeQuiz = async (questionsAndAnswers) => {
    // Input format: Array of { question: string, answer: string, question_id: string }
    // This function evaluates student answers and provides detailed feedback

    // Handle empty quiz case
    if (!questionsAndAnswers || questionsAndAnswers.length === 0) {
        // Return empty result with zero marks
        return { total_marks: 0, obtained_marks: 0, questions: [] };
    }

    // Construct detailed prompt for AI grading
    // This prompt instructs the AI to act as an expert educator
    const prompt = `
    You are an expert educator grading a quiz with precision and care.
    I will provide a list of questions and the student's answers.
    
    For each question:
    1. Carefully evaluate if the answer is factually correct and demonstrates understanding
    2. Be fair but rigorous - partial answers should be marked incorrect unless they fully address the question
    3. Provide constructive, educational feedback that helps the student learn
    
    Input (Questions and Student Answers):
    ${JSON.stringify(questionsAndAnswers.map(qa => ({ question: qa.question, answer: qa.answer })), null, 2)}

    You must return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
    {
        "questions": [
            {
                "question": "The complete original question text",
                "student_answer": "The complete student's answer text",
                "status": "correct" OR "incorrect" (only these two values allowed),
                "feedback": "A detailed, constructive explanation. For correct answers, acknowledge what they did well. For incorrect answers, explain what was wrong and what the correct understanding should be. Be professional and encouraging.",
                "marks_awarded": 1 (if correct) or 0 (if incorrect)
            }
        ]
    }
    
    CRITICAL REQUIREMENTS:
    - The output array MUST have the same length and order as the input array
    - Include the FULL question text and student answer in each result
    - Feedback should be 2-4 sentences, educational and constructive
    - No markdown formatting in feedback, use plain text
    - Return ONLY the JSON object, no additional text
    `;

    try {
        // Call Gemini AI to grade the quiz
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',              // Fast model for quiz grading
            contents: prompt,                       // Grading instructions and questions
            config: {
                responseMimeType: 'application/json'  // Force JSON response format
            }
        });

        // Extract text response from AI
        const text = result.text;

        // Parse JSON response from AI
        const data = JSON.parse(text);

        // Calculate total marks and marks obtained
        let obtained_marks = 0;

        // Total marks = number of questions (assuming 1 mark per question)
        const total_marks = questionsAndAnswers.length;

        // Process graded questions and count correct answers
        const gradedQuestions = data.questions.map((q, index) => {
            // Increment obtained marks if question is marked correct
            if (q.status === 'correct') obtained_marks++;

            // Add question_id to match with original question
            return {
                ...q,                                           // All AI-generated fields
                question_id: questionsAndAnswers[index].question_id  // Original question ID
            };
        });

        // Return grading results
        return {
            total_marks,         // Total possible marks
            obtained_marks,      // Marks student earned
            questions: gradedQuestions  // Detailed results for each question
        };

    } catch (error) {
        // Log AI grading error for debugging
        console.error('AI Grading Error:', error);

        // Throw error to be caught by calling controller
        // This allows quiz controller to handle the error appropriately
        throw new Error('Failed to grade quiz with AI');
    }
};