import express from "express";
import userMode from "../controllers/userController.js";

const router = express.Router();

router.post("/mode", userMode);

export default router;
