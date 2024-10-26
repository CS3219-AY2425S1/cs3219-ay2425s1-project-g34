import { Route, Routes } from "react-router-dom";
import './styles/App.css';
import { Home, Login, Profile, Questions, Signup, VerifyEmail, SendVerification } from './pages';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/send-verification" element={<SendVerification />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;
