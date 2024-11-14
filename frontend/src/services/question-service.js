import axios from 'axios';
import QuestionNotFoundError from '../errors/QuestionNotFoundError';

const BASE_URL = process.env.REACT_APP_QUESTION_API_URL || 'http://localhost:4000/api/questions';

// Reformat and log error
const reformatError = (action, error) => {
    error.message = error.response
        ? `${action} ${error.response.data.message}`
        : error.request
        ? `${action} Unable to connect to the network`
        : `AxiosError (${error.message})`;
    
    console.error(action, error);
    return error;
}

// Create question
const createQuestion = async (cookies, formData) => {
    try {
        const response = await axios.post(BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw reformatError('Error creating question:', error);
    }
}

// Update question
const updateQuestion = async (id, cookies, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw reformatError('Error updating question:', error);
    }
}

// Delete question
const deleteQuestion = async (id, cookies) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw reformatError('Error deleting question:', error);
    }
}

// Get question by id
const getQuestionById = async (id, cookies) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw reformatError('Error getting question:', error);
    }
};

// Get question by topic and difficulty
const getQuestionByTopicAndDifficulty = async (topic, difficulty, roomId, cookies) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            },
            params: { topic, difficulty, roomId },
            withCredentials: true
        });
        if (!response.data) {
            throw new QuestionNotFoundError();
        }
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new QuestionNotFoundError();
        }
        throw reformatError('Error getting question by topic and difficulty:', error);
    }
};

// Filter questions by specific category (topic / difficulty)
const filterQuestions = async (topicFilter, difficultyFilter, cookies) => {
    try {
        let query = [];
        if (topicFilter) query.push(`topic=${topicFilter}`);
        if (difficultyFilter) query.push(`difficulty=${difficultyFilter}`);
        const queryString = query.length ? `?${query.join('&')}` : '';
        const response = await axios.get(`${BASE_URL}${queryString}`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error filtering questions:', error);
        throw reformatError('Error filtering questions:', error);
    }
};

// Get all questions
const getAllQuestions = async (cookies) => {
    try {
        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw reformatError('Error getting all questions:', error);
    }
};

const questionService = { createQuestion, updateQuestion, deleteQuestion, getQuestionById, getQuestionByTopicAndDifficulty, filterQuestions, getAllQuestions };

export default questionService;