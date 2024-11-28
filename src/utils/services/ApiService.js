import axios from "axios";

export const baseURL = "http://localhost:9000";

export const APIsRoutes = {
    Auth: {
        Register: {
            path: "/auth/register",
        },
        Login: {
            path: "/auth/login",
        },
        GoogleLogin: {
            path: "/auth/google",
        },
        FacebookLogin: {
            path: "/auth/facebook",
        },
        Config: {
            path: "/auth/config",
        }
    },
    Post: {
        Create: {
            path: "/post/create",
        }
    }
}