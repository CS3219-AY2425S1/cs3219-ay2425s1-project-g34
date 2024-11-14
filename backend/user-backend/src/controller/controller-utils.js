import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
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

export async function formatPartialUserResponse(user) {
  return {
    username: user.username,
    profileImage: await getImageSignedUrl(user),
    createdAt: user.createdAt,
  };
}

export async function formatFullUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profileImage: await getImageSignedUrl(user),
    history: user.history,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

export async function replaceProfileImage(user, newImage) {
  if (user.profileImage !== DEFAULT_IMAGE) {
    await bucket.file(`${user.id}.${user.profileImage}`).delete();
  }

  if (newImage === DEFAULT_IMAGE) {
    return DEFAULT_IMAGE;
  }

  const { mimetype, buffer } = newImage;
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

export function validateEmail(email) {
  const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return re.test(email);
}

export function validatePassword(password) {
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])[\w@$!%*#?&.+-=]{8,20}$/;
  return re.test(password);
}

async function sendEmail(email, subject, body) {
  const sender = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.PEERPREP_EMAIL,
      pass: process.env.PEERPREP_PASSWORD
    }
  });

  const options = {
    from: process.env.PEERPREP_EMAIL,
    to: email,
    subject: subject,
    html: body,
  };

  await sender.sendMail(options);
}

export async function sendEmailVerification(user) {
  const email = user.tempEmail || user.email;

  const token = generateEmailVerificationToken(user.id, email);
  const verification_path = `/verify-email?token=${token}`;
  const verification_link = `${process.env.FRONTEND_URL}${verification_path}`;

  const subject = '[PeerPrep] Email verification';
  const body = `
      <p>
        Click on this <a href=${verification_link}>link</a> to verify your email address.
        The link will expire in 1 hour.
      </p>
    `;

  await sendEmail(email, subject, body);
}

export async function sendPasswordVerification(user) {
  const email = user.email;
  const password = user.tempPassword;

  const token = generatePasswordVerificationToken(user.id, password);
  const verification_path = `/change-password?token=${token}`;
  const verification_link = `${process.env.FRONTEND_URL}${verification_path}`;

  const subject = '[PeerPrep] Confirmation of Password Change';
  const body = `
      <p>
        You've recently requested to change password.
        Click <a href=${verification_link}>here</a> to confirm the change.
        <br/>
        The link will expire in 15 minutes.
      </p>
    `;

  await sendEmail(email, subject, body);
}

function generateEmailVerificationToken(userId, userEmail) {
  const payload = {
    id: userId,
    email: userEmail,
  };

  return jwt.sign(
    payload,
    process.env.JWT_EMAIL_VERIFICATION,
    { expiresIn: '1h'} // expires in 1 hour
  );
}

function generatePasswordVerificationToken(userId, password) {
  const payload = {
    id: userId,
    password,
  };

  return jwt.sign(
    payload,
    process.env.JWT_PASSWORD_VERIFICATION,
    { expiresIn: '15m'} // expires in 15 min
  );
}