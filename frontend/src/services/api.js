import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
}

// Transaction API
export const transactionAPI = {
  getTransactions: (params = {}) => axiosInstance.get('/transactions', { params }),
  getSchoolTransactions: (schoolId, params = {}) => 
    axiosInstance.get(`/transactions/school/${schoolId}`, { params }),
  getTransactionStatus: (customOrderId) => 
    axiosInstance.get(`/transaction-status/${customOrderId}`),
}

// Payment API
export const paymentAPI = {
  createPayment: (paymentData) => axiosInstance.post('/create-payment', paymentData),
}

export default axiosInstance