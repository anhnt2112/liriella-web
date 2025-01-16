import FacebookLogo from "../assets/png/facebook.png";
import GoogleLogo from "../assets/png/google.png";
import { APIsRoutes } from "./services/ApiService";

export const AuthStateEnum = {
    Blank: "",
    LogIn: "log-in",
    SignUp: "sign-up",
    ForgotPassword: "forgot-password",
    ForgotPasswordOptions: "forgot-password-options",
    AnswerQuestion: "answer-question",
    UseGoogleAccount: "use-google-account",
    NewPassword: "new-password"
}

export const unauthFormStates = {
    "log-in": {
        form: {
            field: [
                {
                    id: "username",
                    label: "Username",
                    type: "text",
                },
                {
                    id: "password",
                    label: "Password",
                    type: "password",
                },
            ],
            button: {
                text: "Log in",
                action: APIsRoutes.Auth.Login,
                callback: (response) => localStorage.setItem("session-id", response.data.sessionId),
            },
            explainText: [],
            extra: [
                {
                    label: "Log in with Facebook",
                    icon: FacebookLogo,
                    href: "/auth/facebook"
                },
                {
                    label: "Log in with Google",
                    icon: GoogleLogo,
                    href: "/auth/google"
                },
                {
                    label: "Forgot password",
                    path: "forgot-password"
                }
            ],
        },
        formExtra: {
            label: "Don't have an account?",
            extraLabel: "Sign up",
            path: "sign-up",
        },
    },
    "sign-up": {
        form: {
            field: [
                {
                    id: "username",
                    label: "Username",
                    type: "text",
                },
                {
                    id: "password",
                    label: "Password",
                    type: "password",
                },
                {
                    id: "confirm",
                    label: "Confirm",
                    type: "password",
                },
                {
                    id: "fullName",
                    label: "Full Name",
                    type: "text",
                }
            ],
            button: {
                text: "Sign up",
                action: APIsRoutes.Auth.Register,
                callback: (response) => localStorage.setItem("session-id", response.data.sessionId),
            },
            explainText: [
                "People who use our service may have uploaded your contact infomation to Libriella.",
                "By signing up, you agree to our Terms and Privacy Policy."
            ],
        },
        formExtra: {
            label: "Have an account?",
            extraLabel: "Log in",
            path: "log-in",
        },
    },
    "forgot-password": {
        form: {
            field: [
                {
                    id: "username",
                    label: "Username",
                    type: "text",
                }
            ],
            button: {
                text: "Next",
            },
        },
        formExtra: {
            label: "",
            extraLabel: "Back to log in",
            path: "log-in"
        }
    },
    "forgot-password-options": {
        form: {
            field: [
                {
                    label: "Answer question",
                    path: "answer-question",
                    type: "link",
                },
                {
                    label: "Use linked google account",
                    path: "use-google-account",
                    type: "link",
                }
            ],
            button: {
                text: "Back",
                path: "forgot-password",
            },
        },
        formExtra: {
            label: "",
            extraLabel: "Back to log in",
            path: "log-in"
        }
    },
    "answer-question": {
        form: {
            field: [
                {
                    label: "Your answer",
                    type: "text",
                    id: "code",
                }
            ],
            button: {
                text: "Next",
            },
        },
        formExtra: {
            label: "",
            extraLabel: "Back to log in",
            path: "log-in"
        }
    },
    "use-google-account": {
        form: {
            field: [
                {
                    label: "Code",
                    type: "text",
                    description: "Enter code"
                }
            ],
            button: {
                text: "Next",
            },
        },
        formExtra: {
            label: "",
            extraLabel: "Back to log in",
            path: "log-in"
        }
    },
    "new-password": {
        form: {
            field: [
                {
                    id: "password",
                    label: "New password",
                    type: "password",
                },
                {
                    id: "confirm",
                    label: "Confirm",
                    type: "password",
                }
            ],
            button: {
                text: "Next",
            },
        },
        formExtra: {
            label: "",
            extraLabel: "Back to log in",
            path: "log-in"
        }
    },
};