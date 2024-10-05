import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/questions';

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

// Filter questions by specific category (topic / difficulty)
const filterQuestions = async (category, filter) => {
    try {
        const response = await axios.get(`${BASE_URL}?${category}=${filter}`);
        return response.data;
    } catch (error) {
        console.error('Error filtering questions:', error);
        throw reformatError('Error filteirng questions:', error);
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

export default { createQuestion, updateQuestion, deleteQuestion, getQuestionById, filterQuestions, getAllQuestions };
