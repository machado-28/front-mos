import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));
const AddParaCliente = Loadable(lazy(() => import("./AddPersonalizado")));
// const Edit = Loadable(lazy(() => import("./Editar")));
const Detalhar = Loadable(lazy(() => import("./Detalhar")));
const List = Loadable(lazy(() => import("./Listar")));
const ListPersonalizado = Loadable(lazy(() => import("./ListarPersonalizado")));


const gestoresRoutes = [
    {
        path: "/clientes/:clienteId/gestores/add", element: <PrivateRoutes auth={authRoles.cliente}>
            <Add></Add>
        </PrivateRoutes>
    },
    {
        path: "/cliente/gestores/add", element: <PrivateRoutes auth={authRoles.cliente}>
            <Add></Add>
        </PrivateRoutes>
    },
    {
        path: "/cliente/gestores", element: <PrivateRoutes auth={authRoles.cliente}>
            <List></List>
        </PrivateRoutes>
    },

    {
        path: "/clientes/:clienteId/gestores/:gestorId/detalhar", element: <PrivateRoutes auth={authRoles.cliente}>
            <Detalhar></Detalhar>
        </PrivateRoutes>
    },

];

export default gestoresRoutes;