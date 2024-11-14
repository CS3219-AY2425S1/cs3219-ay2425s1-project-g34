import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { validatePassword } from "../services/user-service";
import AuthLayout from "../components/auth/AuthLayout";
import '../styles/AuthForm.css';

const ForgotPassword = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
	const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { email, password, confirmPassword } = inputValue;

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
    const res = validatePassword(password, confirmPassword);
		if (res) {
			handleError(res);
			return;
		}
		try {
			const response = await axios.post(
				`${apiUrl}/auth/forget-password`,
				{
					email,
          password,
				},
				{ withCredentials: true }
			);
			if (response.status === 200) {
				handleSuccess("OTP has been sent to your email.");
				setTimeout(() => {
					navigate("/forgot-password/otp", { state: { email } });
				}, 2500);
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
			email: "",
			password: "",
			confirmPassword: "",
		});
	};

  return (
    <AuthLayout>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="form-group">
          <label>Email:</label>
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
          <label>New Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your new password"
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm your new password"
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="next-button">
            Next
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
