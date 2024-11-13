import mongoose from "mongoose";

export const DEFAULT_IMAGE = 'DEFAULT';

const Schema = mongoose.Schema;
const UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
    default: DEFAULT_IMAGE,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
  },
  tempEmail: {
    type: String,
    required: false,
  },
  tempPassword: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
    required: false,
  },
  history: {
    type: [String],
    required: true,
    default: [],
  },
});

export default mongoose.model("users", UserModelSchema);
