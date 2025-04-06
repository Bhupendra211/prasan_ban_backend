import mongoose, { Schema } from "mongoose";


const instructionSchema = new Schema({

    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        require: true,
    },
    instruction_text: {
        type: String,
        required: true,
        trim: true,
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    },

});

export const instruction = mongoose.model('instruction', instructionSchema);