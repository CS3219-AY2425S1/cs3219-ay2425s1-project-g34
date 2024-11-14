import React from 'react';
import '../../styles/CollabPopup.css';

const PartnerQuitPopup = ({ confirmQuit, cancelQuit }) => {
    return (
        <div className="overlay">
            <dialog open className="dialog-popup">
                <div className="popup-content">
                    <h3>Your partner has left the session.</h3>
                    <p>Would you like to quit?</p>
                    <button className="confirm-button" onClick={confirmQuit}>Confirm</button>
                    <button className="cancel-button" onClick={cancelQuit}>Cancel</button>
                </div>
            </dialog>
        </div>
    );
};

export default PartnerQuitPopup;