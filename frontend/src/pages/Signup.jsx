import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { validateEmail, validatePassword, validateUsername } from "../services/user-service";
import AuthLayout from "../components/auth/AuthLayout";
import '../styles/AuthForm.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { username, email, password, confirmPassword } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
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

    const validationChecks = [ // wrap all validation checks here
      () => validateUsername(username),
      () => validateEmail(email),
      () => validatePassword(password, confirmPassword),
    ];
    const res = validationChecks.reduce((prev, check) => prev || check() , "");
    if (res) {
      handleError(res);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/users/signup/get-otp",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        handleSuccess(`
          ${response.data.message}
          Check your email for account verification link.
        `);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        handleError(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        handleError(error.response.data.message);
      } else {
        handleError("An unexpected error occurred. Please try again.");
      }
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  
  return (
    <AuthLayout>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
              required
            />
          </div>
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
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm your password"
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="signup-button">Sign Up</button>
          </div>
          <div className="login-link">
            <span>Already have an account? <Link to="/login">Login here</Link></span>
          </div>
        </form>
    </AuthLayout>
  );
};

export default SignUp;
