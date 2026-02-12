import axios from "axios"

let currentToken: string | null = null;
let unauthorizedHandler: (() => void) | undefined = undefined;

export function setAuthToken(token: string | null) {
    currentToken = token;
}

export function setUnauthorizedHandler(handler: () => void) {
    unauthorizedHandler = handler
}


if (!import.meta.env.VITE_API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined");
}

export const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL
    }
);

api.interceptors.request.use(config => {

        if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`
        }
        return config;
    }
);

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            if (unauthorizedHandler) {
                unauthorizedHandler();
            }
        }
        return Promise.reject(err);
    }
);
