import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true }, // store Markdown content
    topic: { type: [String], required: true },
    difficulty: { type: String, required: true },
    default_code: {
        type: {
            python: String,
            javascript: String,
            java: String
        }, 
        required: true
     },
    test_cases: {
        type: [{
            input: String, // JSON array of inputs
            expected_output: String // expected output as string
        }],
        required: true
    },
    examples: { type: String, required: false }, // store Markdown content
    images: { type: [String], required: false },
    leetcode_link: { type: String, required: false }
});

const Question = mongoose.model("Question", questionSchema);

export default Question;