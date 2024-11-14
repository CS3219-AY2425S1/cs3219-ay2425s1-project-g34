import axios from 'axios';
import userService from './user-service';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3004";

const formatDatetime = datetime => {
  const [date, time] = datetime.split(':');
  const hours = time.slice(0,2);
  const minutes = time.slice(2);
  return `${date}, ${hours}:${minutes}`
}

const _parseDatetime = datetime => {
  const [day, month, yearAndTime] = datetime.split('/');
  const [year, time] = yearAndTime.split(':');
  const hours = time.slice(0,2);
  const minutes = time.slice(2);
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
}

const sortByLatestDate = history => history.sort((x, y) => {
  const date_x = _parseDatetime(x.datetime);
  const date_y = _parseDatetime(y.datetime);
  return date_y - date_x;
});

const updateUserHistory = async (userId, token, historyData) => {
  // historyData: {roomId, question, user, partner, status, datetime, solution}
  try {
    const res = await axios.post(`${BASE_URL}/single/`,
      {...historyData},
      {withCredentials: true}
    );
  
    if (res.status !== 200) {
      console.log('Unable to save session to history', res.message);
      return;
    }

    console.log(res.data.data);
    console.log(res.data.data._id);
    await userService.addUserHistory(userId, token, res.data.data._id); // add history id to user's data

  } catch (error) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.message)
      console.log('unexpected error on the backend: ', error.response.data.message);
    return;
  }
}

const historyService = { sortByLatestDate, formatDatetime, updateUserHistory };

export default historyService;