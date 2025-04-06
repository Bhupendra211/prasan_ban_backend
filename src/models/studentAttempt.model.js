import mongoose, { Schema } from "mongoose";

const attemptSchema = new Schema({
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

    answers: [{
        question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selected_option: { type: String, trim: true },
        answer_status: { type: String, enum: ['right', 'wrong'] },
    }],

}, {
    timestamps: true,
});


const StudentAttempt = mongoose.model('student_attempt', attemptSchema);

export default StudentAttempt;