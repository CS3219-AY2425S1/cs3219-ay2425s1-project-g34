import UserModel from "./user-model.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await connect(mongoDBUri);
}

export async function createUser(username, email, password) {
  return new UserModel({ username, email, password }).save();
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email });
}

export async function findUserById(userId) {
  return UserModel.findById(userId);
}

export async function findUserByUsername(username) {
  return UserModel.findOne({ username });
}

export async function findUserByUsernameOrEmail(username, email) {
  return UserModel.findOne({
    $or: [
      { username },
      { email },
    ],
  });
}

export async function findUserByUsernameOrAllEmails(username, email) {
  return UserModel.findOne({
    $or: [
      { username },
      { email },
      { tempEmail: email },
    ],
  });
}

export async function findUserByAllEmails(email) {
  return UserModel.findOne({
    $or: [
      { email },
      { tempEmail: email },
    ]
  });
}

export async function findAllUsers() {
  return UserModel.find();
}

// ======================= UPDATES ================================ //

export async function updateUserById(userId, updatedValues) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $set: updatedValues },
    { new: true },  // return the updated user
  );
}

export async function updateUserEmailById(userId, email) {
  return await updateUserById(userId, { email });
}

export async function updateUserPasswordById(userId, password) {
  return await updateUserById(userId, { password });
}

export async function updateUserImageById(userId, profileImage) {
  return await updateUserById(userId, { profileImage });
}

export async function updateUserPrivilegeById(userId, isAdmin) {
  return await updateUserById(userId, { isAdmin });
}

export async function updateUserVerifyStatusById(userId, isVerified) {
  return await updateUserById(userId, { isVerified });
}

export async function updateUserTempPasswordById(userId, tempPassword) {
  return await updateUserById(userId, { tempPassword });
}

// =======================  ADDS   ================================ //

export async function addHistoryById(userId, historyId) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { history: historyId }},
    { new: true },  // return the updated user
  );
}

// ======================= DELETES ================================ //

export async function deleteUserById(userId) {
  return UserModel.findByIdAndDelete(userId);
}

export async function deleteTempEmailById(userId) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $unset: {tempEmail: ''} },
    { new: true },  // return the updated user
  ); 
}

export async function deleteTempPasswordById(userId) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $unset: {tempPassword: ''} },
    { new: true },  // return the updated user
  ); 
}

export async function deleteHistoryById(userId, historyId) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $pull: { history: historyId }},
    { new: true },  // return the updated user
  );
}