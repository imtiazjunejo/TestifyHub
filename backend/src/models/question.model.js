import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
    {
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test',
            required: true
        },
        questionText: {
            type: String,
            required: true
        },
        options: [{
            type: String
        }],
        correctAnswer: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['MCQ', 'True/False', 'Short Answer'],
            required: true
        },
        marks: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;