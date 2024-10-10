import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const useAuth = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [priviledge, setPriviledge] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:3001/auth/verify-token",
          { 
            headers: {
              Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
          }
        );
        if (response.status === 200) {
          const { data } = response.data;
          setUsername(data.username);
          setPriviledge(data.isAdmin);
          setUserId(data.id);
          setEmail(data.email);
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        removeCookie("token");
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  return { username, priviledge, userId, email, cookies, removeCookie };
};

export default useAuth;
