// axiosConfig.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
// Import useHistory from React Router






const axiosInstance = axios.create({
  baseURL: `https://ticket-backend-8lil.onrender.com/api/`, 
  
  
  // Adjust base URL as per your backend API
});





axiosInstance.interceptors.request.use (async function (config) {
    const accessToken = Cookies.get('jwt-access');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
     }
    return config;
  },)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('jwt-refresh');
        const response = await axiosInstance.post('token/refresh/', {
          refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        Cookies.set('jwt-access', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        
        console.error('Failed to refresh token', error);
        
        window.location.href = '/login'
        
      }
    }
    return Promise.reject(error);
  },
  
);

export default axiosInstance;
