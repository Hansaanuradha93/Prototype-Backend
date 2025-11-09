import express from "express";
import loanApproval from "../controllers/loanController.js";

const router = express.Router();

router.post("/approval", loanApproval);

export default router;
