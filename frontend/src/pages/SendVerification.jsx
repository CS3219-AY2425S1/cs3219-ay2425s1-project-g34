import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { validateEmail } from "../services/user-service";
import AuthLayout from "../components/auth/AuthLayout";
import '../styles/AuthForm.css';

const SendVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleOnChange = (e) => {
    const {value} = e.target;
    setEmail(value);
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
      autoClose: 6000
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = validateEmail(email);
    if (res) {
      handleError(res);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/resend-verification",
        { email: email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        handleSuccess(response.data.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        handleError(response.data.message);
      }

    } catch(error) {
      if (error.response && error.response.data && error.response.data.message) {
        handleError(error.response.data.message);
      } else {
        handleError("An unexpected error occurred. Please try again.");
      }
      console.log(error);
    }
  }
  return <AuthLayout>
    <h2>Resend Email Verification</h2>
    <form onSubmit={handleSubmit} className="email-form">
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Enter your email"
          onChange={handleOnChange}
          required
        />
      </div>
      <div className="form-group">
        <button type="submit" className="send-button">Send</button>
      </div>
    </form>
  </AuthLayout>
}

export default SendVerification;