import axios from "axios";
import * as environmets from "../config/environments";

export const apiBackEnd = axios.create({
  baseURL: environmets.APP_BACKEND,
});

apiBackEnd.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiBackEnd.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await apiBackEnd.post("/auth/refresh", {
          refreshToken,
        });

        const newToken = response.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiBackEnd(error.config);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
