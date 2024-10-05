import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AuthLayout from "../components/auth/AuthLayout";
import '../styles/AuthForm.css';

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([]);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
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
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const { message, data } = response.data;
        const { accessToken } = data;

        setCookie("token", accessToken, { path: "/", maxAge: 86400 });

        handleSuccess(message);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
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
      email: "",
      password: "",
    });
  };

  return (
    <AuthLayout>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
            
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
          </div>
          <div className="form-group">
            <button type="submit" className="login-button">Login</button>
          </div>
          <div className="signup-link">
            <span>Don't have an account? <Link to="/signup">Sign up here</Link></span>
          </div>
        </form>
    </AuthLayout>
  );
};

export default Login;
