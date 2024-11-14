import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CollabPopup.css';

const SessionExpiredPopup = ({ continueAlone }) => {
    const navigate = useNavigate();

    const redirectToHome = () => {
        navigate("/home");
    };

    return (
        <div className="overlay">
            <dialog open className="dialog-popup">
                <div className="popup-content">
                    <h3>Session Expired</h3>
                    <p>Your partner didn't confirm in time. Would you like to still continue the session?</p>
                    <button className="confirm-button" onClick={continueAlone}>Continue Session</button>
                    <button className="cancel-button" onClick={redirectToHome}>Go to Home</button>
                </div>
            </dialog>
        </div>
    );
};

export default SessionExpiredPopup;
