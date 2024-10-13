import React from 'react';
import AuthNavbar from './AuthNavbar';
import AuthLeftSection from './AuthLeftSection';
import AuthBackground from './AuthBackground';
import '../../styles/AuthLayout.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <AuthNavbar />
      <div className="layout-container">
        <AuthLeftSection />
        <div className="right-content">{children}</div>
      </div>
      <AuthBackground />
      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
