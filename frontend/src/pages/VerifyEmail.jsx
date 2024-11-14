import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import VerifiyingLogo from '../assets/Verifiying.gif';
import VerifiedCheckgLogo from '../assets/VerifiedCheck.png';
import VerifiedFailLogo from '../assets/VerifiedFail.png';
import AuthLayout from "../components/auth/AuthLayout";
import '../styles/AuthForm.css';

const VerifyEmail = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
  const navigate = useNavigate();
  const [result, setResult] = useState(undefined);
  const [statusMessage, setStatusMessage] = useState('Verifying account...');

  useEffect(() => { // send token to backend on page load
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    axios.post(
      `${apiUrl}/auth/verify-email`,
      null,
      { 
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }

    ).then(res => {
      if (res.status === 200) {
        setResult(true);
        setStatusMessage(`Email successfully verified! Returning to login page...`);
        setTimeout(() => navigate("/login"), 3000);
      }

    }).catch(error => {
      let failureMessage;
      setResult(false);
      if (error.response && error.response.status === 401) {
        failureMessage = 'The token has expired, please request for a new link.';
      } else if (error.response && error.response.status === 403) {
        failureMessage = 'Invalid token provided, please check that the link is not broken.';
      } else {
        failureMessage = 'Something went wrong, please try again later.'
      }
      setStatusMessage(`Account verification failed. ${failureMessage}`);
      console.log(error);
    });
  }, []);

  return <AuthLayout>
    <img className='verify-image' width='320' height='320'
      src={result === undefined ? VerifiyingLogo : (result ? VerifiedCheckgLogo : VerifiedFailLogo)}
      alt={result === undefined ? 'Verifiying...' : (result ? 'Verified' : 'Verification Failed')}
    />
    <h2>{statusMessage}</h2>
    <div className="extra-links">
      <span>Need a new verification link? <Link to="/login">Click here</Link></span>
    </div>
  </AuthLayout>;
}

export default VerifyEmail;