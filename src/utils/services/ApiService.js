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
        },
        GetProfile: {
            path: "/post/get-posts-by-username"
        }
    },
    User: {
        Profile: {
            path: "/user/profile"
        },
        ProfileByUsername: {
            path: "/user/profile-by-username"
        },
        FollowUser: {
            path: "/user/follow"
        },
        UnFollowUser: {
            path: "/user/unfollow"
        }
    }
}