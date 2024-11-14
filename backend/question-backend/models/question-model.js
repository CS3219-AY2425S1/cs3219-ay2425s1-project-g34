import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true }, // store Markdown content
    topic: { type: [String], required: true },
    difficulty: { type: String, required: true },
    function_name: { type: String, required: true },
    default_code: {
        python: { type: String, required: true },
        javascript: { type: String, required: true },
        java: { type: String, required: true }
    },
    test_cases: [
        {
            _id: false, // Prevent Mongoose from adding an _id field to each subdocument
            input: { type: String, required: true },
            expected_output: { type: String, required: true }
        }
    ],
    examples: { type: String, required: false }, // store Markdown content
    images: { type: [String], required: false },
    leetcode_link: { type: String, required: false }
});

const Question = mongoose.model("Question", questionSchema);

export default Question;