import axios from "axios"

const api = axios.create({
  baseURL: "",
  withCredentials: true, // Crucial for Express session cookie auth
})

// Request interceptor to attach token or handle request logging
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle global errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, we can handle session expiry or logout triggers
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized request.")
    }
    return Promise.reject(error)
  }
)

export default api
