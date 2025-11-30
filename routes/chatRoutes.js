import express from "express";
import {
  getAllMessages,
  getMessagesByEmail,
  createMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.route("/").get(getAllMessages).post(createMessage);
router.post("/", createMessage);

router.get("/:email", getMessagesByEmail);

// router
//   .route('/:id')
//   .get(getMessagesByEmail)
//   .post(protect, updateUser)
//   .delete(protect, restrictTo('admin', 'lead-guide'), deleteUser);

export default router;
