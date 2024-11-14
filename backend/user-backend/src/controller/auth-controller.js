import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  findUserById as _findUserById,
  findUserByEmail as _findUserByEmail,
  findUserByAllEmails as _findUserByAllEmails,
  updateUserVerifyStatusById as _updateUserVerifyStatusById,
  updateUserEmailById as _updateUserEmailById,
  updateUserPasswordById as _updateUserPasswordById,
  updateUserTempPasswordById as _updateUserTempPasswordById,
  deleteTempEmailById as _deleteTempEmailById,
  deleteTempPasswordById as _deleteTempPasswordById,
} from "../model/repository.js";
import {
  hashPassword,
  formatFullUserResponse,
  sendEmailVerification,
  sendPasswordVerification,
  validatePassword
} from "./controller-utils.js";

export async function handleLogin(req, res) {
  const { username, email, password } = req.body;

  if (!password || !(username || email)) {
    return res.status(400).json({ message: "Missing username/email or password" });
  } else if (username && email) {
    return res.status(400).json({ message: "Use only one of username or email" });
  }

  try {
    const user = await _findUserByUsernameOrEmail(username, email);
    if (!user) { // check if user exist
      return res.status(401).json({ message: "Wrong username/email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) { // check if password matches account password
      return res.status(401).json({ message: "Wrong username/email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Account is not yet verified. Please check your email for verification link."})
    }

    const accessToken = jwt.sign({
      id: user.id,
    }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "User logged in",
      data: { accessToken, ...(await formatFullUserResponse(user)) }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function handleVerifyToken(req, res) {
  try {
    return res.status(200).json({ message: "Token verified", data: req.user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function handleVerifyEmail(req, res) {
  const {id, email} = req;
  try {
    const user = await _findUserById(id);
    if (!user)
      return res.status(404).json({ message: "User does not exist" });
    if (!user.isVerified) // New account
      await _updateUserVerifyStatusById(user.id, true);
    else if (email !== user.email) { // Update email
      if (!user.tempEmail || email !== user.tempEmail) // already used or for wrong email 
        return res.status(403).json({ message: "Invalid token" });

      await _updateUserEmailById(user.id, user.tempEmail);
      await _deleteTempEmailById(user.id);
    }

    return res.status(200).json({ message: "Successfully updated." });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message});
  }
}

export async function handleVerifyPassword(req, res) {
  const {id, password} = req;
  try {
    const user = await _findUserById(id);
    if (!user)
      return res.status(404).json({ message: "User does not exist" });
    if (!user.tempPassword || password !== user.tempPassword) // already used or for wrong password 
      return res.status(403).json({ message: "Invalid token" });

    await _updateUserPasswordById(user.id, user.tempPassword);
    await _deleteTempPasswordById(user.id);

    return res.status(200).json({ message: "Successfully updated." });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message});
  }
}

export async function handleResendVerification(req, res) {
  const {email} = req.body;
  if (!email)
    return res.status(400).json({ message: `Email is missing`});

  const user = await _findUserByAllEmails(email);
  if (!user)
    return res.status(404).json({ message: `User with '${email}' not found` });
  else if (email === user.email && user.isVerified)
    return res.status(200).json({ message: "User is already verified" });
  
  try {
    await sendEmailVerification(user);
    return res.status(200).json({ message: "Verification link sent to email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error when sending email!" });
  }
}

export async function handleForgetPassword(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email or Password field is/are missing" });

  let user = await _findUserByEmail(email); 
  if (!user)
    return res.status(404).json({ message: `User with '${email}' not found` });
  
  try {
    if (!validatePassword(password))
      return res.status(400).json({ message: "Invalid password" })

    const hashedPassword = hashPassword(password);
    user = await _updateUserTempPasswordById(user.id, hashedPassword);

    await sendPasswordVerification(user);
    return res.status(200).json({ message: "Verification link sent to email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error when sending email!" });
  }
}