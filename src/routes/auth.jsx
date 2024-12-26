import AuthLayout from "../components/layout/AuthLayout";
import PageExplore from "../pages/PageExplore";
import PageHome from "../pages/PageHome";
import PageMessage from "../pages/PageMessage";
import PageProfile from "../pages/PageProfile";
import { ProtectedAuth } from "./protected";

const authRoutes = [
    {
        path: "/",
        element: (
            <ProtectedAuth>
                <AuthLayout />
            </ProtectedAuth>
        ),
        children: [
            {
                path: "home",
                element: <PageHome />
            },
            {
                path: "explore",
                element: <PageExplore />
            },
            {
                path: "message",
                element: <PageMessage />
            },
            {
                path: "message/:conversationId",
                element: <PageMessage />
            },
            {
                path: "profile",
                element: <PageProfile />
            },
            {
                path: "profile/:username",
                element: <PageProfile />
            }
        ]
    }
];

export default authRoutes;