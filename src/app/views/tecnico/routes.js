import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));
const AddParaCliente = Loadable(lazy(() => import("./AddPersonalizado")));
// const Edit = Loadable(lazy(() => import("./Editar")));
const Processos = Loadable(lazy(() => import("./../processo/ListarInTecnico")));
const Editar = Loadable(lazy(() => import("./Formularios/editar/FormEditar")));
const List = Loadable(lazy(() => import("./Listar")));
const ListPersonalizado = Loadable(lazy(() => import("./ListarPersonalizado")));


const tecnicoRoutes = [

    { path: "/tecnicos/:tecnicoId/editar", element: <PrivateRoutes auth={authRoles.gestorCliente}> <Editar /></PrivateRoutes> },
    { path: "/tecnicos/add/cliente/:clienteId/", element: <PrivateRoutes auth={authRoles.gestorCliente}> <Add /></PrivateRoutes> },

    {
        path: "/cliente/:clienteId/tecnicos/:tecnicoId/processos", element: <PrivateRoutes auth={authRoles.gestorCliente}>
            <Processos />
        </PrivateRoutes>
    },
    {
        path: "/tecnicos/list/admin", element: <PrivateRoutes auth={authRoles.gestorCliente}>
            <ListPersonalizado />
        </PrivateRoutes>
    },
    {
        path: "/tecnicos/list", element: <PrivateRoutes auth={authRoles.gestorCliente}>
            <List />
        </PrivateRoutes>
    },

];

export default tecnicoRoutes;