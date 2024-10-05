import { useState } from "react";

import GeneralNavbar from "../components/navbar/GeneralNavbar";
import QuestionTable from '../components/questions/QuestionTable';
import AddQuestionButton from '../components/questions/AddQuestionButtons';
import RefreshTableButton from '../components/questions/refreshTableButton';
import useAuth from "../hooks/useAuth";

import '../styles/questions.css';
import 'react-toastify/dist/ReactToastify.css';

const Questions = () => {
    const { priviledge } = useAuth();
    const [refresh, setRefresh] = useState(true);
    const toggle = () => setRefresh(!refresh);

    return (
        <div>
            <GeneralNavbar />
            <div className="questions-container">
                <h1>Questions</h1>
                <p className="description">View all the questions stored in database.</p>
                <div className="question-table-container">
                    <div className="table-buttons">
                        <RefreshTableButton trigger={toggle}/>
                        <div className="admin-button">
                            {priviledge ? <AddQuestionButton /> : null}
                        </div>
                    </div>
                    <QuestionTable mountTrigger={refresh} />
                </div>
            </div>
        </div>
    );
}

export default Questions;