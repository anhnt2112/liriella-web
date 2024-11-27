import AuthLayout from "../components/layout/AuthLayout";
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
                path: "aaa",
                element: <div>aaa</div>
            }
        ]
    }
];

export default authRoutes;