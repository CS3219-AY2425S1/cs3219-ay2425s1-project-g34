import express from "express";
import { createQuestion, deleteQuestion, updateQuestion, getAllQuestions, getQuestionById } from "../controllers/question-controller.js";
import { verifyAccessToken, verifyAdmin } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/", verifyAccessToken, verifyAdmin, createQuestion);
router.delete("/:id", verifyAccessToken, verifyAdmin, deleteQuestion);
router.put("/:id", verifyAccessToken, verifyAdmin, updateQuestion);
router.get("/", verifyAccessToken, getAllQuestions);
router.get("/:id", verifyAccessToken, getQuestionById);

export default router;