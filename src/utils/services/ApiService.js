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
            path: "/post/get-posts-by-user-id"
        },
        Preview: {
            path: "/post/preview"
        },
        GetByPostId: {
            path: "/post/get-post-by-id"
        },
        Following: {
            path: "/post/following"
        },
        Explore: {
            path: "/post/explore"
        },
        Search: {
            path: "/post/search"
        },
        CreateNote: {
            path: '/post/note'
        },
        GetNote: {
            path: '/post/note',
        },
        GetNotes: {
            path: '/post/notes'
        }
    },
    User: {
        Profile: {
            path: "/user/profile"
        },
        ProfileByUsername: {
            path: "/user/profile-by-username"
        },
        ProfileByUserID: {
            path: "/user/profile-by-user-id"
        },
        FollowUser: {
            path: "/user/follow"
        },
        UnFollowUser: {
            path: "/user/unfollow"
        },
        Connections: {
            path: "/user/connections"
        },
        UpdateAvatar: {
            path: "/user/update-avatar"
        },
        RemoveAvatar: {
            path: "/user/remove-avatar"
        },
        Search: {
            path: "/user/search"
        },
        Explore: {
            path: "/user/explore"
        },
        UpdateUser: {
            path: "/user/profile"
        }
    },
    Conversation: {
        Post: {
            path: "/conversations"
        },
        Get: {
            path: "/conversations"
        }
    },
    Message: {
        GetByConversationId: {
            path: "/messages"
        },
        Post: {
            path: "/messages"
        }
    },
    Comment: {
        Like: {
            path: '/comment/like',
        },
        Comment: {
            path: '/comment/comment',
        },
        Unlike: {
            path: '/comment/unlike',
        },
        HasLikedPost: {
            path: '/comment/hasLikedPost'
        }
    },
    Notification: {
        Get: {
            path: '/notification'
        }
    }
}