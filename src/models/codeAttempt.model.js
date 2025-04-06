import mongoose, { Schema } from "mongoose";

const attemptSchema = new Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    problem_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
    },

    answers: [{
        code: { type: String },
        answer_status: { type: String, enum: ['right', 'wrong'] },
    }],


}, {
    timestamps: true,
});


const CodeAttempt = mongoose.model('Code_Attempt', attemptSchema);

export default CodeAttempt;