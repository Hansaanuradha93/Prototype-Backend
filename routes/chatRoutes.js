import express from "express";
import {
  getAllMessages,
  getMessagesByEmail,
  createMessage,
  updateMessagesByID,
} from "../controllers/chatController.js";

const router = express.Router();

router.route("/").get(getAllMessages).post(createMessage);
router.route("/").post(createMessage);

router.route("/:id").get(getMessagesByEmail).patch(updateMessagesByID);

// router
//   .route('/:id')
//   .get(getMessagesByEmail)
//   .post(protect, updateUser)
//   .delete(protect, restrictTo('admin', 'lead-guide'), deleteUser);

export default router;
