import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:8000/api"
      : import.meta.env.VITE_API_URL
      ,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  console.log(accessToken)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/reset-token")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 || error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/reset-token");
        const newAccessToken = res.data.access_token;

        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;