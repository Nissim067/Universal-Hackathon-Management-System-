import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global API errors (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Could trigger a logout action here if needed
      console.warn('Unauthorized access - please log in');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
