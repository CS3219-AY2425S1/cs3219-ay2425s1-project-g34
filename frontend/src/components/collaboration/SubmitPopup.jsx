import React from 'react';
import '../../styles/CollabPopup.css';

const SubmitPopup = ({ confirmQuit, cancelQuit }) => {
    return (
        <div className="overlay">
            <dialog open className="dialog-popup">
                <div className="popup-content">
                    <h3>Submit code?</h3>
                    <p>The session will end once you submit your code.</p>
                    <button className="confirm-button" onClick={confirmQuit}>Confirm</button>
                    <button className="cancel-button" onClick={cancelQuit}>Cancel</button>
                </div>
            </dialog>
        </div>
    );
};

export default SubmitPopup;