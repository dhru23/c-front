import axios from 'axios';

const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });

export const sendMessage = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/message/', body);
    return data;
  } catch (error) {
    console.error('Error in sendMessage API:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchMessages = async (id) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).get(`/api/message/${id}`);
    return data;
  } catch (error) {
    console.error('Error in fetchMessages API:', error.response?.data || error.message);
    throw error;
  }
};