import axios from "axios";

const BASE_URL = "http://localhost:8000/api/requests";

export const sendRequest = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/send`, data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getReceivedRequests = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/received/${userId}`);
    return res.data;
  } catch (error) {
    return [];
  }
};