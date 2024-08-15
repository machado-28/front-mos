import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react"
import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";


const Add = Loadable(lazy(() => import("./Add")));
// const Edit = Loadable(lazy(() => import("./Edit")));
const List = Loadable(lazy(() => import("./Listar")));
const Detail = Loadable(lazy(() => import("./Detalhar")));

const funcionariosRoutes = [
    {
        path: "/funcionarios",
        element:
            <PrivateRoutes
                auth={authRoles.rh}>
                <List />
            </PrivateRoutes>
    },

    {
        path: "/funcionarios/:funcionarioId",
        element:
            <PrivateRoutes
                auth={authRoles.rh}>
                <Detail />
            </PrivateRoutes>
    },
    {
        path: "/funcionarios/add",
        element:
            <PrivateRoutes
                auth={authRoles.rh}><Add />
            </PrivateRoutes>
    },
    // {
    //     path: "/funcionarios/:funcionarioId/editar",
    //     element:
    //         <PrivateRoutes
    //             auth={<Edit />}>

    //         </PrivateRoutes>
    // },

];

export default funcionariosRoutes;