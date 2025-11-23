import express from "express";
import loanTrustSurvey from "../controllers/surveyController.js";

const router = express.Router();

router.post("/loan-trust", loanTrustSurvey);

export default router;
