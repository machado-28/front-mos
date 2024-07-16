import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));
// const Edit = Loadable(lazy(() => import("./Editar")));
const Detalhar = Loadable(lazy(() => import("./Detalhar")));
const List = Loadable(lazy(() => import("./Listar")));
const Pendentes = Loadable(lazy(() => import("./Pendentes")));

const pedidosRoutes = [
    { path: "/pedidos/add", element: <Add /> },
    // {
    //     path: "/pedidos/:id/edit", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
    //         <Edit />
    //     </PrivateRoutes>
    // },
    {
        path: "/pedidos/list", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <List />
        </PrivateRoutes>
    },
    {
        path: "/pedidos/:id/detail", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <Detalhar />
        </PrivateRoutes>
    },
    {
        path: "/pedidos/pendentes", element: <PrivateRoutes auth={authRoles.gestorVistoSecretaria}>
            <Pendentes />
        </PrivateRoutes>
    },



];

export default pedidosRoutes;