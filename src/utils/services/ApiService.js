import axios from "axios";

export const baseURL = "http://localhost:9000";

export const APIsRoutes = {
    Auth: {
        Register: {
            path: "/auth/register",
            method: 'POST'
        },
        Login: {
            path: "/auth/login",
            method: "POST"
        },
        GoogleLogin: {
            path: "/auth/google",
            method: "GET"
        },
        FacebookLogin: {
            path: "/auth/facebook",
            method: "GET"
        },
        Config: {
            path: "/auth/config",
            method: "GET"
        }
    }
}

export const callApi = async (
    baseURL = "http://localhost:9000",
    path,
    method,
    data = {},
    params = {},
    isAuth = false
) => {
    const sessionId = isAuth ? localStorage.getItem('sessionId') : null;

    const config = {
        baseURL,
        url: path,
        method,
        data,
        params,
        headers: (isAuth && sessionId) ? { 'session-id': sessionId } : undefined
    }

    return axios(config);
}