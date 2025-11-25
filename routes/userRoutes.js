import express from "express";
import {
  getAllUsers,
  createUser,
  getUserMode,
  updateUserMode,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);

router.get("/mode", getUserMode);
router.post("/mode", updateUserMode);

export default router;
