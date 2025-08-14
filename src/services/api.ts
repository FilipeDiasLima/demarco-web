import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios, { AxiosError } from "axios";

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

type RegisterInterceptTokenManagerProps = {
  signOut: () => void;
};

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (
    props: RegisterInterceptTokenManagerProps
  ) => () => void;
};

const TOKEN_KEY = "@demarco.token";

let isRefreshing = false;
let failedQueue: Array<PromiseType> = [];

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
}) as APIInstanceProps;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.registerInterceptTokenManager = ({
  signOut,
}: RegisterInterceptTokenManagerProps) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const errorData = error.response.data as { message?: string };
        if (errorData?.message === "jwt expired") {
          const oldToken = getToken();

          if (!oldToken) {
            signOut();
            return Promise.reject(error);
          }

          const originalRequest = error.config!;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  resolve(api(originalRequest));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          return new Promise((resolve, reject) => {
            api
              .post("/user/refresh-token", {
                oldToken,
              })
              .then((response: AxiosResponse) => {
                const { token } = response.data;

                setToken(token);

                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }

                failedQueue.forEach((request) => request.onSuccess(token));

                resolve(api(originalRequest));
              })
              .catch((error: AxiosError) => {
                failedQueue.forEach((request) => request.onFailure(error));

                removeToken();
                signOut();

                reject(error);
              })
              .finally(() => {
                isRefreshing = false;
                failedQueue = [];
              });
          });
        }

        removeToken();
        signOut();
      }

      if (error.response && error.response.data) {
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
