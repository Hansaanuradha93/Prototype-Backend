import express from "express";
import faqAnswer from "../controllers/faqController.js";

const router = express.Router();

router.post("/answer", faqAnswer);

export default router;
