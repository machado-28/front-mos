import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));
// const Edit = Loadable(lazy(() => import("./Editar")));
const Detalhar = Loadable(lazy(() => import("./Detalhar")));
const List = Loadable(lazy(() => import("./Listar")));
const PendenteDelegado = Loadable(lazy(() => import("./delegados/Pendentes")));
const Atraso = Loadable(lazy(() => import("./Atraso")));
const Delegar = Loadable(lazy(() => import("./Delegar")));
const FinalizadosPEndentes = Loadable(lazy(() => import("./delegados/Finalizados")));
const ListarDelegados = Loadable(lazy(() => import("./delegados/Listar")));
const ListarDelegadosAndamento = Loadable(lazy(() => import("./delegados/Andamento")));
const ListForCliente = Loadable(lazy(() => import("./ListForCliente")));

const processoRoutes = [
    {
        path: "/processos/delegados/finalizados", element: <PrivateRoutes auth={authRoles.tecnicoProcesso}>
            <FinalizadosPEndentes />
        </PrivateRoutes>
    },
    {
        path: "/processos/delegados/andamento", element: <PrivateRoutes auth={authRoles.tecnicoProcesso.concat(authRoles.gestorProjecto)}>
            <ListarDelegadosAndamento />
        </PrivateRoutes>
    },

    {
        path: "/processos/delegados", element: <PrivateRoutes auth={authRoles.tecnicoProcesso.concat(authRoles.gestorProjecto)}>
            <ListarDelegados />
        </PrivateRoutes>
    },
    { path: "/processos/add", element: <Add /> },
    // {
    //     path: "/processo/:id/edit", element: <PrivateRoutes auth={authRoles.tecnicoProcesso}>
    //         <Edit />
    //     </PrivateRoutes>
    // },
    { path: "/clientes/:clienteId/projecto/:projectoId/processos/add", element: <Add /> },
    // {
    //     path: "/processo/:id/edit", element: <PrivateRoutes auth={authRoles.tecnicoProcesso}>
    //         <Edit />
    //     </PrivateRoutes>
    // },

    {
        path: "/processos/list", element: <PrivateRoutes auth={authRoles.tecnicoProcesso}>
            <List />
        </PrivateRoutes>

    },


    {
        path: "/cliente/processos/list", element: <PrivateRoutes auth={authRoles.gestorCliente}>
            <ListForCliente />
        </PrivateRoutes>

    },

    {
        path: "/processos/:processoId/detail", element: <PrivateRoutes auth={authRoles.tecnicoProcesso.concat(authRoles.gestorCliente)}>
            <Detalhar />
        </PrivateRoutes>
    },
    {
        path: "/processos/delegados/pendentes", element: <PrivateRoutes auth={authRoles.tecnicoProcesso}>
            <PendenteDelegado />
        </PrivateRoutes>
    },
    {
        path: "/processos/delegados/cancelados", element: <PrivateRoutes auth={authRoles.tecnicoProcesso}>
            <PendenteDelegado />
        </PrivateRoutes>
    },
    {
        path: "/processos/delegados", element: <PrivateRoutes auth={authRoles.tecnicoProcesso}>
            <PendenteDelegado />
        </PrivateRoutes>
    },
    {
        path: "/processos/atraso/", element: <PrivateRoutes auth={authRoles.tecnicoProcesso}>
            <Atraso />
        </PrivateRoutes>
    },
    {
        path: "/processos/delegar/", element: <PrivateRoutes auth={authRoles.gestorCliente}>
            <Delegar />
        </PrivateRoutes>
    },


];

export default processoRoutes;