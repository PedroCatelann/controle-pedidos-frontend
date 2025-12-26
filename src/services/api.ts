import axios from "axios";
import * as environments from "../config/environments";

export const apiBackEnd = axios.create({
  baseURL: environments.APP_BACKEND,
});

// =====================
// REQUEST INTERCEPTOR
// =====================
apiBackEnd.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================
// RESPONSE INTERCEPTOR
// =====================
apiBackEnd.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // evita loop infinito
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const username = localStorage.getItem("username");

        if (!refreshToken || !username) {
          throw new Error("Missing refresh data");
        }

        const response = await apiBackEnd.put(`/auth/refresh`, null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const newAccessToken = response.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiBackEnd(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
