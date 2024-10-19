import { isValidObjectId } from "mongoose";
import { DEFAULT_IMAGE } from "../model/user-model.js";
import {
  getImageSignedUrl,
  hashPassword,
  replaceProfileImage,
  validateEmail,
  validatePassword,
} from "./user-controller-utils.js";
import {
  createUser as _createUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  updateUserById as _updateUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
} from "../model/repository.js";

export async function createUser(req, res) {
  try {
    const username =  req.body.username && req.body.username.trim();
    const email = req.body.email && req.body.email.trim();
    const password = req.body.password && req.body.password.trim();

    if (username && email && password) {
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      } else if (!validatePassword(password)) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const existingUser = await _findUserByUsernameOrEmail(username, email);
      if (existingUser && existingUser.username == username) {
        return res.status(409).json({ message: "username already exists" });
      } else if (existingUser && existingUser.email == email) {
        return res.status(409).json({ message: "email already exists" });
      }

      const hashedPassword = hashPassword(password);
      const createdUser = await _createUser(username, email, hashedPassword);

      return res.status(201).json({
        message: `Created new user ${username} successfully`,
        data: await formatFullUserResponse(createdUser),
      });
    } else {
      return res.status(400).json({ message: "username, email and/or password are missing" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when creating new user!" });
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    return res.status(200).json({
      message: `Found user`,
      data: await (req.user.isAdmin || req.user.id === userId 
        ? formatFullUserResponse(user)
        : formatPartialUserResponse(user))
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting user!" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await _findAllUsers();
    return res.status(200).json({
      message: 'Found users',
      data: await Promise.all(users.map(formatFullUserResponse))
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting all users!" });
  }
}

export async function updateUser(req, res) {
  try {
    const username =  req.body.username && req.body.username.trim();
    const email = req.body.email && req.body.email.trim();
    const password = req.body.password && req.body.password.trim();

    if (username || email || password) {
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: `Invalid user ID` });
      } else if (email && !validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      } else if (password && !validatePassword(password)) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      if (username || email) {
        let existingUser = await _findUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "username already exists" });
        }
        existingUser = await _findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "email already exists" });
        }
      }

      const hashedPassword = hashPassword(password);

      const updatedUser = await _updateUserById(userId, username, email, hashedPassword);
      return res.status(200).json({
        message: `Updated data for user ${userId}`,
        data: await formatFullUserResponse(updatedUser),
      });

    } else {
      return res.status(400).json({ message: "No field to update: username and email and password are all missing!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when updating user!" });
  }
}

export async function updateUserProfileImage(req, res) {
  const profileImage = req.file;
  const { toDefault } = req.body;

  if (!profileImage && !toDefault) {
    return res.status(400).json({ message: "New profile image or toDefault field is missing!" });
  }

  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const newImage = toDefault
      ? await replaceProfileImage(user, DEFAULT_IMAGE)
      : await replaceProfileImage(user, profileImage);
    const updatedUser = await _updateUserById(userId, undefined, undefined, undefined, newImage);

    return res.status(200).json({
      message: `Updated data for user ${userId}`,
      data: await formatFullUserResponse(updatedUser),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when updating profile image!" });
  }
}

export async function updateUserPrivilege(req, res) {
  try {
    const { isAdmin } = req.body;

    if (isAdmin !== undefined) {  // isAdmin can have boolean value true or false
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const updatedUser = await _updateUserPrivilegeById(userId, isAdmin === true);
      return res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: await formatFullUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({ message: "isAdmin is missing!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when updating user privilege!" });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    await _deleteUserById(userId);
    return res.status(200).json({ message: `Deleted user ${userId} successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when deleting user!" });
  }
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
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}
