import express from "express";
import multer from "multer";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
  updateUserProfileImage
} from "../controller/user-controller.js";
import { verifyAccessToken, verifyIsAdmin, verifyIsOwnerOrAdmin } from "../middleware/basic-access-control.js";

// File filter to allow only images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
};
const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter });

const router = express.Router();

// Get all users
router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.patch("/:id/privilege", verifyAccessToken, verifyIsAdmin, updateUserPrivilege);

// Create a new user
router.post("/", createUser);

// Get a user
router.get("/:id", verifyAccessToken, getUser);

// Update a user
router.patch("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, updateUser);

// Update a user image
router.patch("/:id/profileImage", imageUpload.single('profileImage'), verifyAccessToken, verifyIsOwnerOrAdmin, updateUserProfileImage);

// Delete a user
router.delete("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser);

export default router;
