import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true }, // store Markdown content so can render images / links
    topic: { type: [String], required: true },
    difficulty: { type: String, required: true },
    input: { type: mongoose.Schema.Types.Mixed, required: true }, // must check type when using
    expected_output: { type: mongoose.Schema.Types.Mixed, required: true }, // must check type when using
    images: { type: [String], required: false },
    leetcode_link: { type: String, required: false }
});

const Question = mongoose.model("Question", questionSchema);

export default Question;