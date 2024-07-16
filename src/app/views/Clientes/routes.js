import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";
import { Navigate } from "react-router-dom";
import gestoresRoutes from "./Gestores/routes";


const Add = Loadable(lazy(() => import("./Add")));
const Edit = Loadable(lazy(() => import("./Editar")));
const Detalhar = Loadable(lazy(() => import("./Detalhar")));
const List = Loadable(lazy(() => import("./Listar")));
const Pendentes = Loadable(lazy(() => import("./Pendentes")));
const clienteRoutes = [
    { path: "/clientes/add", element: <Add /> },

    {
        path: "/clientes/:clienteId/edit", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <Edit />
        </PrivateRoutes>
    },
    {
        path: "/clientes/list", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <List />
        </PrivateRoutes>
    },
    {
        path: "/clientes/:clienteId/detail", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <Detalhar />
        </PrivateRoutes>
    },
    {
        path: "/clientes/pendentes", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <Pendentes />
        </PrivateRoutes>
    },

    ...gestoresRoutes

];

export default clienteRoutes;