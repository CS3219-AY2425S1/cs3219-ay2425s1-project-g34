import React, { useState, useEffect } from 'react';
import '../../styles/start-session.css';
import { topics } from "../../assets/topics";
import MatchPopup from "./MatchPopup";

const StartSession = ({ username }) => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Python');
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleFindMatch = async () => {
    // Send a POST request to the backend to find a match
    const matchData = { username, difficulty, topic, language };

    try {
      const response = await fetch('http://localhost:3002/api/find-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Match request sent:', result);

        const eventSource = new EventSource(`http://localhost:3002/api/match-status/${username}`);
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.status === 'matched') {
                    console.log(`Matched with ${data.matchedWith}`);
                    setShowPopup(true);  // Show match found popup
                } else if (data.status === 'timeout') {
                    console.log('Timeout:', data.message);
                    setShowPopup(false);  // Close popup after timeout
                }
                eventSource.close();  // Stop listening after getting a response
            };
      } else {
        console.error('Error finding match');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    let timer;
    if (showPopup && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000); // Decrease countdown every second
    }

    if (countdown === 0) {
      setShowPopup(false); // Automatically close dialog when countdown is 0
    }

    return () => clearInterval(timer);
  }, [showPopup, countdown]);

  return (
    <div className="start-session-container">
      <div className="session-header">
        <h2>Start a Session</h2>
      </div>
      <div className="session-form">
        <p>
          To begin a session, choose your preferred difficulty, topic, and programming language. <br />
          If someone in the queue has the same preference as you, you will be matched. <br />
          (Note: you will be timed out after 30s if there are no matches) Happy coding :)
        </p>
        <div className="form-group">
          <label>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="form-group">
          <label>Topic</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((topic, index) => (
                <option key={index} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Java">Java</option>
          </select>
        </div>
        <button onClick={handleFindMatch}>Find a Match</button>
      </div>

      {/* Render the MatchPopup component */}
      <MatchPopup countdown={countdown} showPopup={showPopup} closePopup={closePopup} />
    </div>
  );
};

export default StartSession;
