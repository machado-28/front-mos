import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));
// const Edit = Loadable(lazy(() => import("./Editar")));
const Detalhar = Loadable(lazy(() => import("./Detalhar")));
const List = Loadable(lazy(() => import("./Listar")));
const Pendentes = Loadable(lazy(() => import("./Pendentes")));

const processoRoutes = [
    { path: "/processos/add", element: <Add /> },
    // {
    //     path: "/processo/:id/edit", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
    //         <Edit />
    //     </PrivateRoutes>
    // },
    { path: "/clientes/:clienteId/processos/add", element: <Add /> },
    // {
    //     path: "/processo/:id/edit", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
    //         <Edit />
    //     </PrivateRoutes>
    // },

    {
        path: "/processos/list", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <List />
        </PrivateRoutes>

    },

    {
        path: "/processos/:processoId/detail", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <Detalhar />
        </PrivateRoutes>
    },
    {
        path: "/processos/pendentes", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <Pendentes />
        </PrivateRoutes>
    },



];

export default processoRoutes;