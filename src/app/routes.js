import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

import materialRoutes from "app/views/material-kit/MaterialRoutes";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));
// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const GVisto = Loadable(lazy(() => import("app/views/dashboard/GVisto")));

const AddPedido = Loadable(lazy(() => import("app/views/admin/processos/Local/SubmeterProcesso")));
// const ListPedidoPendentes = Loadable(
//   lazy(() => import("app/views/admin/processos/ListprocessosPendentes"))
// );
const DetalharPedido = Loadable(lazy(() => import("app/views/admin/processos/DetalharPedido")));

const DetalharVisto = Loadable(lazy(() => import("app/views/admin/visto/controlo/DetalheVisto")));


const ListarDocumento = Loadable(lazy(() => import("app/views/admin/documento/ListarDocumentos")));

const ListProcesso = Loadable(lazy(() => import("app/views/admin/processos/ListPedidos")));

const SubmeterProcesso = Loadable(
  lazy(() => import("app/views/admin/processos/Local/SubmeterProcesso"))
);

const EditarProcesso = Loadable(lazy(() => import("app/views/admin/processos/EditarProcesso")));

const ListarProcessoSME = Loadable(
  lazy(() => import("app/views/admin/processos/SME/ListProcessoSME"))
);

const ListarProcessoMIREMPET = Loadable(
  lazy(() => import("app/views/admin/processos/MIREMPET/ListarProcessoMIREMPET"))
);
const ListarProcessoConcluido = Loadable(
  lazy(() => import("app/views/admin/processos/EmitirVisto"))
);

const ListarVistoEmitidos = Loadable(
  lazy(() => import("app/views/admin/vistos/ListarVistoEmitidos"))
);
const ListarVistoExpirados = Loadable(
  lazy(() => import("app/views/admin/vistos/ListarVistoExpirados"))
);

const AddTipoVisto = Loadable(
  lazy(() => import("app/views/admin/vistos/tipoDeVisto/AddTipodeVisto"))
);
const ListTipoVisto = Loadable(
  lazy(() => import("app/views/admin//vistos/tipoDeVisto/ListTipoDeVisto"))
);
const ListVisto = Loadable(lazy(() => import("app/views/admin/visto/controlo/ListVisto")));
const EditTipoVisto = Loadable(
  lazy(() => import("app/views/admin/vistos/tipoDeVisto/EditTipodeVisto"))
);

const ListTipoDocumento = Loadable(
  lazy(() => import("app/views/admin/documento/tipoDeDocumento/ListTipoDocumento"))
);
const AddTipoDocumento = Loadable(
  lazy(() => import("app/views/admin/documento/tipoDeDocumento/AddTipodeDocumento"))
);
const EditTipoDocumento = Loadable(
  lazy(() => import("app/views/admin/documento/tipoDeDocumento/EditTipodeDocumento"))
);

const ListDepartamento = Loadable(
  lazy(() => import("app/views/admin/departamentos/ListDepartamento"))
);
const AddDepartamento = Loadable(
  lazy(() => import("app/views/admin/departamentos/AddDepartamento"))
);
const EditDepartamento = Loadable(
  lazy(() => import("app/views/admin/departamentos/EditDepartamento"))
);

const ListCargo = Loadable(lazy(() => import("app/views/admin/departamentos/cargos/ListCargo")));
const AddCargo = Loadable(lazy(() => import("app/views/admin/departamentos/cargos/AddCargo")));
const EditCargo = Loadable(lazy(() => import("app/views/admin/departamentos/cargos/EditCargo")));

const AddStatusProcesso = Loadable(
  lazy(() => import("app/views/admin/processos/statusProcessamento/AddStatusProcesso"))
);
const ListStatusProcesso = Loadable(
  lazy(() => import("app/views/admin/processos/statusProcessamento/ListStatusProcessamento"))
);
const EditStatusProcesso = Loadable(
  lazy(() => import("app/views/admin/processos/statusProcessamento/EditStatusProcesso"))
);

const AddFuncionario = Loadable(lazy(() => import("app/views/admin/Funcionario/AddFuncionario")));
const ListFuncionario = Loadable(lazy(() => import("app/views/admin/Funcionario/ListFuncionario")));

const DetalharFuncionario = Loadable(
  lazy(() => import("app/views/admin/Funcionario/DetalharFuncionario"))
);

const ListFolha = Loadable(lazy(() => import("app/views/admin/salario/ListFolha")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      {
        path: "/dashboard/default",
        element: <GVisto />,
        auth: authRoles.admin
      },
      {
        path: "/visto/detalhe/:numero",
        element: <DetalharVisto />,
        auth: authRoles.admin
      },
      // e-chart route
      {
        path: "/charts/echarts",
        element: <AppEchart />,
        auth: authRoles.editor
      },

      //admin routes
      { path: "/processos/registar", element: <AddPedido /> },

      {
        path: "/processos/:id/documentos",
        element: <ListarDocumento></ListarDocumento>
      },
      { path: "/processo/detalhe/:id?", element: <DetalharPedido /> },
      { path: "/processo/:numero/edit", element: <EditarProcesso /> },
      { path: "/pedidos/add", element: <SubmeterProcesso /> },

      { path: "/processos/sme/", element: <ListarProcessoSME /> },
      { path: "/processos/mirempet/", element: <ListarProcessoMIREMPET /> },
      { path: "/processos/concluidos/", element: <ListarProcessoConcluido /> },

      { path: "/vistos/expirados", element: <ListarVistoExpirados /> },
      { path: "/vistos/emitidos", element: <ListarVistoEmitidos /> },

      { path: "/documento/tipo/add", element: <AddTipoDocumento /> },
      { path: "/documento/tipo/list", element: <ListTipoDocumento /> },
      { path: "/documento/tipo/edit/:id", element: <EditTipoDocumento /> },

      { path: "/processo/status/add", element: <AddStatusProcesso /> },
      { path: "/processos/list", element: <ListProcesso /> },
      { path: "/processo/status/edit/:id", element: <EditStatusProcesso /> },

      { path: "/vistos/tipo/add", element: <AddTipoVisto /> },
      { path: "/vistos", element: <ListVisto /> },
      { path: "/vistos/tipo/list", element: <ListTipoVisto /> },
      { path: "/vistos/tipo/edit/:id", element: <EditTipoVisto /> },

      { path: "/departamento/add", element: <AddDepartamento /> },
      { path: "/departamento/list", element: <ListDepartamento /> },
      { path: "/departamento/edit/:id", element: <EditDepartamento /> },

      { path: "/departamento/cargo/add", element: <AddCargo /> },
      { path: "/departamento/cargo/list", element: <ListCargo /> },
      { path: "/departamento/cargo/edit/:id", element: <EditCargo /> },

      { path: "/funcionario/add", element: <AddFuncionario /> },
      { path: "/funcionario/list", element: <ListFuncionario /> },
      { path: "/funcionario/detalhe/:id", element: <DetalharFuncionario /> },
      { path: "/pagamentos/list", element: <ListFolha /> }
    ]
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="dashboard/default" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
