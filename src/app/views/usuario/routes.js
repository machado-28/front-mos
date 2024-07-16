import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));
// const Edit = Loadable(lazy(() => import("./Editar")));
const Detalhar = Loadable(lazy(() => import("./Detalhar")));
const List = Loadable(lazy(() => import("./Listar")));


const usuariosRoutes = [
    { path: "/usuarios/add", element: <PrivateRoutes auth={authRoles.administradorProjecto}> <Add /></PrivateRoutes> },


    {
        path: "/usuarios/list", element: <PrivateRoutes auth={authRoles.administradorProjecto}>
            <List />
        </PrivateRoutes>
    },

];

export default usuariosRoutes;