import React, { useState, useEffect } from 'react';
import '../../styles/CollabPopup.css';
import SessionExpiredPopup from './SessionExpiredPopup';
import { useNavigate } from 'react-router-dom';

const TimeUpPopup = ({ continueSession, quitSession, continueAlone, isSoloSession }) => {
    const [countdown, setCountdown] = useState(10); // 10-second countdown
    const [waitingForPartner, setWaitingForPartner] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

    useEffect(() => {
        let interval;
        if (!waitingForPartner && countdown > 0) {
            interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        } else if (countdown === 0 && !waitingForPartner) {
            setShowTimeoutMessage(true); // Show the message
            setTimeout(() => quitSession(), 3000); // Delay before navigating
        }
        return () => clearInterval(interval);
    }, [waitingForPartner, countdown, quitSession]);

    const handleContinueSession = () => {
        setWaitingForPartner(true);
        setCountdown(10);
        continueSession();
    };

    useEffect(() => {
        let interval;
        if (waitingForPartner && countdown > 0) {
            interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        } else if (waitingForPartner && countdown === 0) {
            setSessionExpired(true); // Show session expired popup
        }
        return () => clearInterval(interval);
    }, [waitingForPartner, countdown]);

    const navigate = useNavigate();

    const redirectToHome = () => {
        navigate("/home");
    };

    if (sessionExpired) return <SessionExpiredPopup continueAlone={continueAlone}/>;


    return (
        <div className="overlay">
            <dialog open className="dialog-popup">
                <div className="popup-content">
                    <h3>Time's Up!</h3>
                    {showTimeoutMessage ? (
                        <p>You did not make a decision in time. Redirecting to home...</p>
                    ) : isSoloSession ? (
                        <>
                            <p>The collaboration session has ended. Would you like to extend the session?</p>
                            <button className="confirm-button" onClick={continueAlone}>Continue Session</button>
                            <button className="cancel-button" onClick={redirectToHome}>Go to Home</button>
                        </>
                    ) : (
                        <>
                            {waitingForPartner ? (
                                <>
                                    <p>Waiting for your partner to confirm... ({countdown} seconds left)</p>
                                    {countdown <= 0 && <p>Session will end if the partner does not confirm.</p>}
                                </>
                            ) : (
                                <>
                                    <p>The collaboration session has ended. Would you like to extend the session?</p>
                                    <p>{countdown} seconds left to decide.</p>
                                    <button className="confirm-button" onClick={handleContinueSession}>Continue Session</button>
                                    <button className="cancel-button" onClick={quitSession}>Quit Session</button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default TimeUpPopup;