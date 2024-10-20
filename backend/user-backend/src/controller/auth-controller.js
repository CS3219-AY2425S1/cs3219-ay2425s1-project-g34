import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsernameOrEmail as _findUserByUsernameOrEmail } from "../model/repository.js";
import { formatFullUserResponse } from "./user-controller.js";

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
    const verifiedUser = req.user;
    return res.status(200).json({ message: "Token verified", data: verifiedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
