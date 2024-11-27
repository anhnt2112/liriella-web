import axios from "axios";

export const baseURL = "http://localhost:9000";

const GET_METHOD = 'get';
const POST_METHOD = 'post';

export const APIsRoutes = {
    Auth: {
        Register: {
            path: "/auth/register",
            method: POST_METHOD
        },
        Login: {
            path: "/auth/login",
            method: POST_METHOD
        },
        GoogleLogin: {
            path: "/auth/google",
            method: GET_METHOD 
        },
        FacebookLogin: {
            path: "/auth/facebook",
            method: GET_METHOD 
        },
        Config: {
            path: "/auth/config",
            method: GET_METHOD 
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

    if (method === GET_METHOD) {
        return axios.get(baseURL+path, { headers: (isAuth && sessionId) ? { 'session-id': sessionId } : undefined });
    }

    if (method === POST_METHOD) {
        return axios.post(baseURL+path, data, { headers: (isAuth && sessionId) ? { 'session-id': sessionId } : undefined });
    }

    return axios(config);
}