import UnauthLayout from "../components/layout/UnauthLayout";
import Page404 from "../pages/Page404";
import PageUnauth from "../pages/PageUnauth";
import { AuthStateEnum } from "../utils/unauth";
import { ProtectedUnAuth } from "./protected";

const unauthRoutes = [
    {
        path: "/",
        element: (
            <ProtectedUnAuth>
                <UnauthLayout />
            </ProtectedUnAuth>
        ),
        children: [
            ...Object.values(AuthStateEnum).slice(1).map(path => {
                return {
                    path,
                    element: <PageUnauth />,
                };
            }),
            {
                path: "*",
                element: <Page404 />
            }
        ]
    }
];

export default unauthRoutes;