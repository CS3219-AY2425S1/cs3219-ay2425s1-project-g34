import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import '.././styles/App.css';
import GeneralNavbar from "../components/navbar/GeneralNavbar";
import useAuth from "../hooks/useAuth";
import StartSession from "../components/home/StartSession";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const navigate = useNavigate();
  const { username, cookies, removeCookie } = useAuth();

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };

  return (
    <>
      <div className="home_page">
        <GeneralNavbar />
        <div 
          className="home_container"
          style={{maxWidth: '1200px', margin: 'auto'}}>
          <h1>Welcome back, <span style={{color: '#8576FF'}}>{username}</span>!</h1>
          <StartSession />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;