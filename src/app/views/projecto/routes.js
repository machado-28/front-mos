import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));
const AddParaCliente = Loadable(lazy(() => import("./AddPersonalizado")));
const Edit = Loadable(lazy(() => import("./Edit")));
const Detalhar = Loadable(lazy(() => import("./Detalhar")));
const List = Loadable(lazy(() => import("./Listar")));
const ListPersonalizado = Loadable(lazy(() => import("./ListarPersonalizado")));
const Detail = Loadable(lazy(() => import("./Detalhar")));
const Relatorio = Loadable(lazy(() => import("./Relatorio")));


const projectoRoutes = [
    { path: "/clientes/:clienteId/projectos/add", element: <Add /> },
    { path: "/clientes/:clienteId/projectos/:projectoId/detalhar", element: <Detail /> },
    { path: "/projectos/add", element: <AddParaCliente /> },
    { path: "/projectos/relatorio", element: <Relatorio /> },

    {
        path: "/projectos/list", element: <PrivateRoutes auth={authRoles.gestorCliente}>
            <List />
        </PrivateRoutes>
    },

    {
        path: "/projectos/:projectoId/editar/:clienteId", element: <PrivateRoutes auth={authRoles.cliente}>
            <Edit />
        </PrivateRoutes>
    },
    {
        path: "/projectos/:id/detail", element: <PrivateRoutes auth={authRoles.gestorVisto}>
            <Detail />
        </PrivateRoutes>
    },
    {
        path: "clientes/:clienteId/projectos/list", element: <PrivateRoutes auth={authRoles.gestorCliente}>
            <ListPersonalizado />
        </PrivateRoutes>
    },

];

export default projectoRoutes;