import React from 'react';
import '../../styles/CollabPopup.css';

const QuitConfirmationPopup = ({ confirmQuit, cancelQuit }) => {
    return (
        <div className="overlay">
            <dialog open className="dialog-popup">
                <div className="popup-content">
                    <h3>Are you sure you want to quit?</h3>
                    <button className="confirm-button" onClick={confirmQuit}>Confirm</button>
                    <button className="cancel-button" onClick={cancelQuit}>Cancel</button>
                </div>
            </dialog>
        </div>
    );
};

export default QuitConfirmationPopup;