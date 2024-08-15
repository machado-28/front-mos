import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";

const List = Loadable(lazy(() => import("./Listar")));


const AccessLogsRoutes = [
    {
        path: "/logs", element: <PrivateRoutes auth={authRoles.admin}>
            <List />
        </PrivateRoutes>

    },




];

export default AccessLogsRoutes;