import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));

const gestoresRoutes = [
    {
        path: "clientes/:clienteId/gestores/add", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <Add></Add>
        </PrivateRoutes>
    },

];

export default gestoresRoutes;