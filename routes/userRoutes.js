import express from "express";
import {
  getAllUsers,
  createUser,
  getUserMode,
  updateUserMode,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/mode").get(getUserMode).post(updateUserMode);

export default router;
