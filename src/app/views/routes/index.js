import PrivateRoutes from "app/auth/privateRoutes";
import { lazy } from "react";
import clienteRoutes from "../Clientes/routes";
import ControlDash from "app/auth/R";
import processoRoutes from "../processo/routes";
import projectoRoutes from "../projecto/routes";
import tecnicoRoutes from "../tecnico/routes";
import pedidosRoutes from "../pedidos/routes";
import { Navigate } from "react-router-dom";
import usuariosRoutes from "../usuario/routes";
import VistosRoutes from "../visas/routes";
import AccessLogsRoutes from "../logs/routes";
import funcionariosRoutes from "../funcionarios/routes";

const cliente = JSON.parse(localStorage.getItem("user"));
const adminRoutes = [
    {
        path: "/dashboard/default",
        element: <ControlDash></ControlDash>
    },

    ...clienteRoutes,
    ...processoRoutes,
    ...projectoRoutes,
    ...tecnicoRoutes,
    ...pedidosRoutes,
    ...usuariosRoutes,
    ...VistosRoutes,
    ...AccessLogsRoutes,
    ...funcionariosRoutes,
];


export default adminRoutes;