import express from "express";
import getLoanApprovalDecision from "../controllers/loanController.js";

const router = express.Router();

router.post("/approval", getLoanApprovalDecision);

export default router;
