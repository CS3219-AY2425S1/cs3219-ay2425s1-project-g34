import bcrypt from "bcrypt";
import "dotenv/config";
import { Storage } from "@google-cloud/storage";
import { DEFAULT_IMAGE } from "../model/user-model.js";

const storage = new Storage({projectId: process.env.IMAGE_PROJECT_ID});
const bucket = storage.bucket(process.env.IMAGE_BUCKET);

export async function handleExistingUser(username, email) {
  const existingUser = await _findUserByUsernameOrEmail(username, email);
  if (existingUser) {
    return res.status(409).json({ message: "username or email already exists" });
  }
}

export function hashPassword(password) {
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  return password;
}

export async function replaceProfileImage(user, newImage) {
  if (user.profileImage !== DEFAULT_IMAGE) {
    await bucket.file(`${user.id}.${user.profileImage}`).delete();
  }

  if (newImage === DEFAULT_IMAGE) {
    return DEFAULT_IMAGE;
  }

  const newImageExtension = mimetype.split("/").pop();
  const newImageName = `${user.id}.${newImageExtension}`;

  const blob = bucket.file(newImageName);
  const options = {
    metadata: { contentType: mimetype },
    resumable: false
  };
  await blob.save(buffer, options);

  return newImageExtension;
}

export async function getImageSignedUrl(user) {
  const signedUrlOptions = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 3600000, // TTL 60 minutes
  };

  if (user.profileImage === DEFAULT_IMAGE) {
    return '';
  }

  const fileName = `${user.id}.${user.profileImage}`;
  const [url] = await bucket.file(fileName).getSignedUrl(signedUrlOptions);
  return url;
}
