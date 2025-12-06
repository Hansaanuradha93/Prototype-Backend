import express from "express";
import answerFAQ from "../controllers/faqController.js";

const router = express.Router();

router.post("/answer", answerFAQ);

export default router;
