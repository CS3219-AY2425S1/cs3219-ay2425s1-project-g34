import { Route, Routes } from "react-router-dom";
import './styles/App.css';
import { Home, Login, Profile, History, Questions, Signup, Collab, ForgotPassword, ForgotPasswordOTP, VerifyEmail, SendVerification } from './pages';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordOTP />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/send-verification" element={<SendVerification />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/collab" element={<Collab />} />
      </Routes>
    </div>
  );
}

export default App;
