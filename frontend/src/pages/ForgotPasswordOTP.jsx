import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AuthLayout from "../components/auth/AuthLayout";
import '../styles/AuthForm.css';

const ForgotPasswordOTP = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const email = location.state?.email; // Retrieve email from state passed from signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/auth/forget-password/confirm-otp`,
        {
          email,
          otp,
        }
      );
      if (response.status === 200) {
        toast.success("Password reset successful!");
        setTimeout(() => {
          navigate("/login");  // Redirect to login after successful confirmation
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm OTP.");
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await axios.post(
        `${apiUrl}/auth/forget-password/resend-otp`,
        {
          email,
        }
      );
      if (response.status === 200) {
        toast.success("OTP has been resent to your email.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };
  return (
    <AuthLayout>
      <h2>Forgot Password</h2>
      <p>A password change confirmation email is sent to your email address.</p>
      <form onSubmit={handleSubmit} className="email-confirmation-form">
        <div className="form-group">
          <label htmlFor="otp">Verification Code:</label>
          <input
            type="text"
            name="otp"
            value={otp}
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button
            type="button"
            className="resend-button"
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend Verification Code"}
          </button>
        </div>
        <div className="form-group">
          <button type="submit" className="confirm-button">
            Confirm
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordOTP;
