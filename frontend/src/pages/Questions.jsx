import React, { useEffect, useState } from "react";

import GeneralNavbar from "../components/navbar/GeneralNavbar";
import QuestionTable from '../components/questions/QuestionTable';
import AddQuestionButton from '../components/questions/AddQuestionButtons';
import RefreshTableButton from '../components/questions/refreshTableButton';
import useAuth from "../hooks/useAuth";
import { topics } from '../assets/topics';
import questionService from '../services/question-service';
import ErrorMessage from '../components/questions/ErrorMessageDialog'

import '../styles/questions.css';
import 'react-toastify/dist/ReactToastify.css';

const Questions = () => {
    const { privilege, cookies } = useAuth();
    const [refresh, setRefresh] = useState(true);
    const toggle = () => setRefresh(!refresh);
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [topicFilter, setTopicFilter] = useState('');
    const [questions, setQuestions] = useState([]);
    const [errorOpen, setErrorOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    useEffect(() => {
        const fetchFilteredQuestions = async () => {
            try {
                const response = await questionService.filterQuestions(topicFilter, difficultyFilter, cookies);
                setQuestions(response);
            } catch (error) {
                setErrorMessage(error.message); // Set error message
                setErrorOpen(true); // Open error dialog
            }
        }
        fetchFilteredQuestions();
    }, [refresh, topicFilter, difficultyFilter]);

    const handleErrorClose = () => {
        setErrorOpen(false); // Close the error dialog
      };

    return (
        <div>
            <GeneralNavbar />
            <div className="questions-container">
                <h1>Questions</h1>
                <p className="description">View all the questions stored in database.</p>
                    {/* Filter options */}
                    <div className="filters">
                        <select onChange={(e) => setDifficultyFilter(e.target.value)}>
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>

                        <select onChange={(e) => setTopicFilter(e.target.value)}>
                            <option value="">All Topics</option>
                            {topics.map((topic, index) => (
                                <option key={index} value={topic}>{topic}</option>
                            ))}
                        </select>
                        <div className="table-buttons">
                            <RefreshTableButton trigger={toggle}/>
                            <div className="admin-button">
                                {privilege ? <AddQuestionButton /> : null}
                            </div>
                        </div>
                    </div>
                <div className="question-table-container">
                    <QuestionTable questions={questions} />
                </div>
                <ErrorMessage
                    open={errorOpen}
                    handleClose={handleErrorClose}
                    errorMessage={errorMessage}
                />
            </div>
        </div>
    );
}

export default Questions;