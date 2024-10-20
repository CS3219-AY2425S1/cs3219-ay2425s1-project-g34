import React from 'react';
import '../../styles/MatchPopup.css';

const FindingMatch = ({ countdown, closePopup }) => {
    return (
      <div className="overlay">
        <dialog open className="dialog-popup">
          <div className="popup-content">
            <h3>Looking for a match... </h3>
            <p>{countdown}s remaining.</p>
            <button onClick={closePopup}>Cancel</button>
          </div>
        </dialog>
      </div>
    );
  };
  
  export default FindingMatch;