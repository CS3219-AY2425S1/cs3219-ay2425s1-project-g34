import { useState } from "react";

import GeneralNavbar from "../components/navbar/GeneralNavbar";
import QuestionTable from '../components/questions/QuestionTable';
import AddQuestionButton from '../components/questions/AddQuestionButtons';
import RefreshTableButton from '../components/questions/refreshTableButton';
import useAuth from "../hooks/useAuth";
import { topics } from '../assets/topics';

import '../styles/questions.css';
import 'react-toastify/dist/ReactToastify.css';

const Questions = () => {
    const { priviledge } = useAuth();
    const [refresh, setRefresh] = useState(true);
    const toggle = () => setRefresh(!refresh);
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [topicFilter, setTopicFilter] = useState('');

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
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
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
                                {priviledge ? <AddQuestionButton /> : null}
                            </div>
                        </div>
                    </div>
                <div className="question-table-container">
                    <QuestionTable mountTrigger={refresh} />
                </div>
            </div>
        </div>
    );
}

export default Questions;