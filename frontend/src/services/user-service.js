import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const getUserById = async (userId, token) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  
    return data.data;
  } catch (error) {
    console.error(error);
    return;
  }
  
}

const addUserHistory = async (userId, token, historyId) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/${userId}/history`,
      { historyId },
      {
        headers: {Authorization: `Bearer ${token}`},
        withCredentials: true,
      },
    );
  } catch (error) {
    console.error(error);
  }
}

const userService = { getUserById, addUserHistory };
export default userService;