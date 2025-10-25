import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test',
            required: true
        },
        answers: [{
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question'
            },
            answer: String,
            isCorrect: {
                type: Boolean,
                default: null
            }
        }],
        score: {
            type: Number,
            default: 0
        },
        totalMarks: {
            type: Number,
            default: 0
        },
        percentage: {
            type: Number,
            default: 0
        },
        timeTaken: {
            type: Number, // in minutes
            default: 0
        },
        status: {
            type: String,
            enum: ['Completed', 'Incomplete'],
            default: 'Incomplete'
        }
    },
    { timestamps: true }
);

const Result = mongoose.model('Result', resultSchema);

export default Result;