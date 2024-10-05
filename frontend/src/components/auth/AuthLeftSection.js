import React from 'react';
import '../../styles/AuthLeftSection.css';
import LeftImage from '../../assets/LeftImage.png';

const AuthLeftSection = () => {
    return (
        <div className="left-section">
            <h1>MASTER CODING INTERVIEWS</h1>
            <p>TOGETHER</p>
            <h1>ONE PROBLEM AT A TIME</h1>
            <img src={LeftImage} alt="Illustration" className="left-section-illustration" />
        </div>
    );
};

export default AuthLeftSection;
