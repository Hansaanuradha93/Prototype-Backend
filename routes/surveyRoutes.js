import express from "express";
import { createSurvey, getAllSurveys } from "../controllers/surveyController.js";

const router = express.Router();

router.route("/").get(getAllSurveys).post(createSurvey);

export default router;
