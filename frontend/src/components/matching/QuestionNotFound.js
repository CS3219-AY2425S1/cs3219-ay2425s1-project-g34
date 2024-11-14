import React from 'react';
import '../../styles/MatchPopup.css';

const QuestionNotFound = ({ closePopup }) => {
    return (
      <div className="overlay">
        <dialog open className="dialog-popup">
          <div className="popup-content">
            <h3>No question found</h3>
            <p>There are no questions in the database that match your selected topic and difficulty.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </dialog>
      </div>
    );
  };
  
  export default QuestionNotFound;