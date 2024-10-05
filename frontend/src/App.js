import { Route, Routes } from "react-router-dom";
import logo from './styles/logo.svg';
import './styles/App.css';
import { Home, Login, Questions, Signup } from './pages';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;
