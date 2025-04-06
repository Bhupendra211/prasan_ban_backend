import mongoose, { Schema } from "mongoose";
// import Quiz from "./quiz.model";

const questionSchema = new Schema({
    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    question: {
        type: String,
        required: true,
        trim: true
    },

    option1: {
        type: String,
        required: true,
        trim: true
    },

    option2: {
        type: String,
        required: true,
        trim: true
    },

    option3: {
        type: String,
        trim: true
    },

    option4: {
        type: String,
        trim: true
    },

    answer: {
        type: String,
        required: true,
        trim: true,
    },

    number: {
        type: Number,
        required: true,
        trim: true,
    },

}, {
    timestamps: true,
});


const Question = mongoose.model('Question', questionSchema);

export default Question;
