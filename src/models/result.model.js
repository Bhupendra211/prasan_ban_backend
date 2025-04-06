import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },

    total_score: {
        type: Number,
        required: true,
        default: 0,
    },

    total_correct: {
        type: Number,
        required: true,
        default: 0,
    },

    total_attempt: {
        type: Number,
        required: true,
        default: 0,
    },

}, {
    timestamps: true
});


const Result = mongoose.model('result', resultSchema);

export default Result;