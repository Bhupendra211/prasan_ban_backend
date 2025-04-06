import mongoose, { Schema } from "mongoose";


const quizSchema = new Schema({

    quiz_name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
        required: false,
    },

    total_marks: {
        type: Number,
        required: true,
        trim: true,
    },

    per_question_marks: {
        type: Number,
        required: true,
        trim: true,
    },

    negative_marks: {
        type: Number,
        required: true,
        trim: true,
    },

    total_question: {
        type: Number,
        required: true,
        trim: true,
    },

    duration: {
        type: Date,
        required: true,
        trim: true,
    },

    quiz_date: {
        type: Date,
        require: true,
        trim: true,
    },

    quiz_time: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value); // Validates HH:MM format
            },
            message: "Invalid time format! Use HH:MM (24-hour format).",
        },
    },
}, {
    timestamps: true
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;