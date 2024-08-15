import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";

const ListCustom = Loadable(lazy(() => import("./ListarCustom")));
const Tipo = Loadable(lazy(() => import("./Tipo")));
const Status = Loadable(lazy(() => import("./Status")));


const VistosRoutes = [
    {
        path: "/vistos/query", element: <PrivateRoutes auth={authRoles.gestorCliente}>
            <ListCustom />
        </PrivateRoutes>

    },
    {
        path: "/vistos/tipo", element: <PrivateRoutes auth={authRoles.cliente}>
            <Tipo />
        </PrivateRoutes>

    },
    {
        path: "/vistos/status", element: <PrivateRoutes auth={authRoles.cliente}>
            <Status />
        </PrivateRoutes>

    },





];

export default VistosRoutes;