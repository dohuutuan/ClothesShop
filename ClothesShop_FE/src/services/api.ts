/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { refreshTokenApi } from "./authService";
import { queryClient } from "../main";



const api = axios.create({
  baseURL: "/api"
});
// attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và là lỗi hết hạn
    if (
      error.response &&
      error.response.status === 401 &&
      error.response?.headers["token-expired"] == "true" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Chờ refresh xong rồi retry lại
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshTokenApi();
        localStorage.setItem("accessToken", res.accessToken);
        processQueue(null, res);

        originalRequest.headers.Authorization = "Bearer " + res.accessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Nếu refresh thất bại → logout
        localStorage.removeItem("accessToken");
        queryClient.removeQueries({ queryKey: ["profile"] });
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Các lỗi khác
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      localStorage.removeItem("accessToken");
      queryClient.removeQueries({ queryKey: ["profile"] });
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
export default api;
