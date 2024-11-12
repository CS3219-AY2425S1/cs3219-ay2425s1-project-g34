import mongoose from "mongoose";
import Question from "../models/question-model.js";
import { uploadImage, deleteImage } from "./question-controller-utils.js";
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

function normalizeTitle(title) {
    return title.toLowerCase().replace(/\s+/g, ' ').trim();
}

function validateQuestionFields(fields) {
    let { title, description, topic, difficulty, examples, leetcode_link, default_code, test_cases } = fields;

    title = title.trim();
    description = description.trim();
    examples.trim();
    difficulty = difficulty.trim();
    leetcode_link = leetcode_link ? leetcode_link.trim() : "";

    // Parse default_code
    if (typeof default_code === 'string') {
        try {
            default_code = JSON.parse(default_code);
        } catch (error) {
            return { valid: false, message: "Default code must be a valid JSON string" };
        }
    }

    // Validate default_code
    if (!default_code || !default_code.python || !default_code.javascript || !default_code.java) {
        return { valid: false, message: "Default code for all languages (python, javascript, java) must be provided" };
    }

    // Parse test_cases
    if (typeof test_cases === 'string') {
        try {
            test_cases = JSON.parse(test_cases);
        } catch (error) {
            return { valid: false, message: "Test cases must be a valid JSON string" };
        }
    }

    // Validate test_cases format (ensure it's an array and has the necessary properties)
    if (test_cases && !Array.isArray(test_cases)) {
        return { valid: false, message: "Test cases must be an array" };
    }
    if (test_cases && test_cases.some(test => !test.input || !test.expected_output)) {
        return { valid: false, message: "Each test case must have input and expected_output" };
    }

    // Check if topic is an array and trim each element (and remove empty strings)
    if (Array.isArray(topic)) {
        topic = topic.map(t => t.trim()).filter(t => t !== '');
    } else if (typeof topic === 'string') {
        topic = [topic.trim()].filter(t => t !== '');
    } else {
        return { valid: false, message: "Topic must be an array of strings or a single string" };
    }

    // Check if all required fields are provided
    if (!title || !description || !topic.length || !difficulty || !test_cases || !default_code) {
        return { valid: false, message: "All fields are required" };
    }

    return { valid: true, data: { title, description, topic, difficulty, examples, leetcode_link, default_code, test_cases } };
}

async function checkExistingQuestion(title) {
    const normalizedTitle = normalizeTitle(title);
    const regex = new RegExp(`^${normalizedTitle.replace(/\s+/g, '\\s*')}$`, 'i');
    return await Question.findOne({ title: { $regex: regex } });
}

async function saveNewQuestion(newQuestion, res) {
    try {
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

async function handleImageUploads(questionId, imageFiles) {
    const uploadedImages = [];
    // Handle image files
    for (const file of imageFiles) {
        const publicUrl = await uploadImage(questionId, file);
        uploadedImages.push(publicUrl);
    }

    return uploadedImages;
}

async function handleImages(images, imageFiles, questionId) {
    let allImages = [];

    if (!imageFiles || imageFiles.length === 0) {
        // If don't have image files, just use image urls
        if (images.length > 0) {
            allImages.push(...images);
        }
    } else {
        // If don't have image urls, just use image files
        if (images.length === 0) {
            const uploadedImages = await handleImageUploads(questionId, imageFiles);
            allImages.push(...uploadedImages);
        } else {
            // If have both image files and image urls, use both
            const uploadedImages = await handleImageUploads(questionId, imageFiles);
            allImages.push(...images, ...uploadedImages);
        }
    }

    return allImages.filter(image => image.trim() !== '');
}

async function deleteOldImages(question, allImages) {
    const oldImages = question.images.filter(image => !allImages.includes(image));
    for (const imageUrl of oldImages) {
        if (imageUrl.includes('storage.googleapis.com')) {
            await deleteImage(imageUrl);
        }
    }
}

// Create a new question
export const createQuestion = [
    upload.array('imageFiles'),
    async (req, res) => {
        const validation = validateQuestionFields(req.body);
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }
        const { title, description, topic, difficulty, examples, leetcode_link, default_code, test_cases } = validation.data;

        const imageFiles = req.files;
        let { images } = req.body;
        images = images ? (Array.isArray(images) ? images : [images]) : [];

        const existingQuestion = await checkExistingQuestion(title);
        if (existingQuestion) {
            return res.status(409).json({ message: "A question with this title already exists" });
        }

        const questionId = new mongoose.Types.ObjectId();
        const allImages = await handleImages(images, imageFiles, questionId);

        const newQuestion = new Question({
            _id: questionId,
            title,
            description,
            topic,
            difficulty,
            examples,
            images: allImages,
            leetcode_link: leetcode_link || "",
            default_code,
            test_cases: test_cases || []
        });

        await saveNewQuestion(newQuestion, res);
    }
];

// Delete a question
export const deleteQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Delete images from Google Cloud Storage
        for (const imageUrl of deletedQuestion.images) {
            if (imageUrl.includes('storage.googleapis.com')) {
                await deleteImage(imageUrl);
            }
        }

        res.status(200).json(deletedQuestion);
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

// Update a question
export const updateQuestion = [
    upload.array('imageFiles'),
    async (req, res) => {
        const { id } = req.params;
        let { images, title, topic, default_code, test_cases } = req.body;
        const imageFiles = req.files;

        try {
            const question = await Question.findById(id);
            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }

            // Filter out empty strings from topic array
            if (Array.isArray(topic)) {
                topic = topic.map(t => t.trim()).filter(t => t !== '');
            } else if (typeof topic === 'string') {
                topic = [topic.trim()].filter(t => t !== '');
            }

            // Parse default_code and test_cases
            default_code = typeof default_code === 'string' ? JSON.parse(default_code) : default_code;
            test_cases = typeof test_cases === 'string' ? JSON.parse(test_cases) : test_cases;

            // Validate updated fields
            const validation = validateQuestionFields({ ...question.toObject(), ...req.body, topic, default_code, test_cases });
            if (!validation.valid) {
                return res.status(400).json({ message: validation.message });
            }

            // Check if title is unique
            if (title) {
                const existingQuestion = await checkExistingQuestion(title);
                if (existingQuestion && existingQuestion.id !== id) {
                    return res.status(409).json({ message: "A question with this title already exists" });
                }
            }

            images = images ? (Array.isArray(images) ? images : [images]) : [];
            const allImages = await handleImages(images, imageFiles, id);
            await deleteOldImages(question, allImages);

            const updatedQuestion = await Question.findByIdAndUpdate(id, { $set: { ...req.body, topic, default_code, test_cases, images: allImages } }, { new: true });
            if (!updatedQuestion) {
                return res.status(404).json({ message: "Question not found" });
            }

            res.status(200).json(updatedQuestion);
        } catch (error) {
            if (error.name === 'CastError') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }
];

// Get all questions (with filters)
export const getAllQuestions = async (req, res) => {
    try {
        const { topic, difficulty } = req.query;
        const filter = {};

        if (topic) {
            filter.topic = { $all: Array.isArray(topic) ? topic : [topic] };
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        const questions = await Question.find(filter);
        res.status(200).json(questions);
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

// Get a question by ID
export const getQuestionById = async (req, res) => {
    const questionId = req.params.id;

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

// Get a question by topic and difficulty
export const getQuestionByTopicAndDifficulty = async (req, res) => {
    const { topic, difficulty, roomId } = req.query;

    try {
        const hash = Array.from(roomId).reduce((acc, char) => acc + char.charCodeAt(0), 0);

        const questionCount = await Question.countDocuments({ topic, difficulty });
        if (questionCount === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        const index = hash % questionCount;
        const question = await Question.find({ topic, difficulty })
            .sort({ _id: 1 })
            .skip(index)
            .limit(1);

        res.status(200).json(question[0]);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
