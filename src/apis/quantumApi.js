import axios from 'axios';

export const fetchQuantumKey = async () => {
  try {
    const response = await axios.get('http://<your-server-ip>:8000/quantum-key');
    return response.data.key;
  } catch (error) {
    console.error('Error fetching quantum key:', error);
  }
};
