import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log(API_URL);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors without logging out
axiosInstance.interceptors.response.use(
  (response) => response, // No change to successful responses
  (error) => {
    // Just log the error without redirecting to login or logging the user out
    if (error.response?.status === 401) {
      // Commenting out the automatic logout and redirection to login
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // window.location.href = '/login';

      console.warn(
        "Unauthorized error (401) occurred. The user will not be logged out."
      );
      // You can handle token expiration or other cases here if necessary
    }

    // Handle other errors without logging out
    if (error.response?.status === 500) {
      console.error(
        "Server error (500) occurred. The user will not be logged out."
      );
    }

    // You can add more specific error handling here for other status codes like 403, 404, etc.

    // Returning the error so that the calling function can handle it if necessary
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (userData) => axiosInstance.post("/auth/register", userData),
};

// Transaction API
export const transactionAPI = {
  getTransactions: (params = {}) =>
    axiosInstance.get("/transactions", { params }),
  getSchoolTransactions: (schoolId, params = {}) =>
    axiosInstance.get(`/transactions/school/${schoolId}`, { params }),
  getTransactionStatus: (customOrderId) =>
    axiosInstance.get(`/transaction-status/${customOrderId}`),
};

// Payment API
export const paymentAPI = {
  createPayment: (paymentData) =>
    axiosInstance.post("/create-payment", paymentData),
};

export default axiosInstance;
