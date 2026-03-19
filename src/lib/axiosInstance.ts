import axios, {
  // AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  // type AxiosRequestConfig,
  // type AxiosResponse,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for automatic token injection
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not a token refresh request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/api/v1/auth/refresh-token", {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Repeat original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// interface FailedRequest {
//   resolve: (value?: unknown) => void;
//   reject: (error: unknown) => void;
// }

// let isRefreshing = false;
// let requestQueue: FailedRequest[] = [];

// const processQueue = (error: unknown, response?: AxiosResponse | null) => {
//   requestQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(response);
//     }
//   });
//   requestQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes("/api/v1/auth/refresh-token")
//     ) {
//       originalRequest._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           const res = await axios.post(
//             "/api/v1/auth/refresh-token",
//             {},
//             {
//               withCredentials: true,
//             }
//           );

//           isRefreshing = false;
//           processQueue(null, res);

//           return axiosInstance(originalRequest);
//         } catch (refreshError) {
//           isRefreshing = false;
//           processQueue(refreshError);
//           window.location.href = "/login";
//           return Promise.reject(refreshError);
//         }
//       }

//       return new Promise((resolve, reject) => {
//         requestQueue.push({
//           resolve: () => resolve(axiosInstance(originalRequest)),
//           reject: (err: unknown) => reject(err),
//         });
//       });
//     }// Е

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
