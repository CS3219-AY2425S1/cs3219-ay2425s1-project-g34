import React from 'react';
import '../../styles/MatchPopup.css';

const MatchNotFound = ({ closePopup }) => {
    return (
      <div className="overlay">
        <dialog open className="dialog-popup">
          <div className="popup-content">
            <h3>Match finding is unsuccessful</h3>
            <p>please try again later.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </dialog>
      </div>
    );
  };
  
  export default MatchNotFound;