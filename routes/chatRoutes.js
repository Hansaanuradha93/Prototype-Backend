import express from "express";
import { getMessagesByEmail } from "../controllers/messageController.js";

const router = express.Router();

router.get("/messages", getMessagesByEmail);

export default router;
