import mongoose, { Schema } from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expected: { type: String, required: true },
});

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    negative_marks: {
      type: Number,
      required: true,
    },
    testCases: { type: [testCaseSchema], required: true },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
