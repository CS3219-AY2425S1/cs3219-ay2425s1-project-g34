import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AuthLayout from "../components/auth/AuthLayout";
import '../styles/AuthForm.css';

const SignupOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const email = location.state?.email; // Retrieve email from state passed from signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/users/signup/confirm-otp",
        {
          email,
          otp,
        }
      );
      if (response.status === 201) {
        toast.success("Email confirmed, account created!");
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
        "http://localhost:3001/users/resend-otp",
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
      <h2>Confirm your account</h2>
      <p>A sign-up confirmation email is sent to your email address.</p>
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

export default SignupOTP;
