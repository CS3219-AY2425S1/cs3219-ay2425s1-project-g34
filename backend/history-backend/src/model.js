import mongoose from "mongoose";

const Schema = mongoose.Schema;
const HistoryModelSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  partner: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  datetime: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
    default: '',
  },
  language: {
    type: String,
    required: true,
    default: 'python',
  },
});

export default mongoose.model("history", HistoryModelSchema);
