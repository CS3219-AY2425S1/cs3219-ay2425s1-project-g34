import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/MatchPopup.css';
import questionService from '../../services/question-service';
import useAuth from '../../hooks/useAuth';


const MatchFound = ({ matchData, closePopup }) => {
    const { cookies } = useAuth();
    const navigate = useNavigate();
    const { matchedUser, difficulty, topic, language, roomId } = matchData;

    useEffect (() => {
      const handleStartSession = async () => {
          closePopup();

        try {
          const question = await questionService.getQuestionByTopicAndDifficulty(topic, difficulty, roomId, cookies);

            if (question) {
              console.log(question.title);
              navigate('/collab', {
                state: {
                  question: question,
                  language: language,
                  matchedUser: matchedUser,
                  roomId: roomId
                }
              });
            } else {
              console.error('Error fetching question');
            }
          } catch (error) {
            console.error('Error fetching question:', error);
          }
      };

      const delayTimer = setTimeout(handleStartSession, 3000); // 3-second delay before redirecting

        // Clear the timer if the component unmounts before redirect
        return () => clearTimeout(delayTimer);
    }, [cookies, difficulty, language, matchedUser, navigate, roomId, topic, closePopup]);

    return (
      <div className="overlay">
        <dialog open className="dialog-popup">
          <div className="popup-content">
            <h3>Match found!</h3>
            <p>Succesful match between {matchedUser.user1} and {matchedUser.user2}!</p>
            <p>Redirecting to your session...</p>
          </div>
        </dialog>
      </div>
    );
  };

export default MatchFound;
