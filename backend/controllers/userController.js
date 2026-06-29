import asyncHandler from "express-async-handler";
import {
  findUserById,
  listUsers,
  updateUserById,
  deleteUserById
} from "../repositories/userRepository.js";

async function getProfile(req, res, next) {
  try {
    const userId = req.user && (req.user.userId || req.user.id);
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user && (req.user.userId || req.user.id);
    const updated = await updateUserById(userId, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
}

export { getProfile, updateProfile };

export const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsers();
  res.json({ success: true, data: users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserById(req.params.id, req.body);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await deleteUserById(req.params.id);
  res.json({ success: true, message: "User deleted" });
});

export const changeUserRole = asyncHandler(async (req, res) => {
  const user = await updateUserById(req.params.id, { role: req.body.role });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, data: user });
});
