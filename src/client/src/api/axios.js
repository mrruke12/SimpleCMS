import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location.href = '/auth';
    } else if (error.response.status === 403) {
        window.location.href = '/'
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api