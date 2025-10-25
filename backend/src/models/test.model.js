import mongoose from 'mongoose';

const testSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        duration: {
            type: Number, // in minutes
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
        totalMarks: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Test = mongoose.model('Test', testSchema);

export default Test;