import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import materialRoutes from "app/views/material-kit/MaterialRoutes";
import PrivateRoute from "./auth/privateRoutes";
import ControlDash from "./auth/ControlDashboard";
import NonAuth from "./auth/NonAuth";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));

// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));


const AddTipoVisto = Loadable(
  lazy(() => import("app/views/admin/visto/tipoDeVisto/Add"))
);

const ListTipoVisto = Loadable(
  lazy(() => import("app/views/admin//visto/tipoDeVisto/List"))
);

const EditTipoVisto = Loadable(
  lazy(() => import("app/views/admin/visto/tipoDeVisto/Edit"))
);

// PAGINA DE PEDIDOS
const SolicitacoesAdd = Loadable(lazy(() => import("app/views/Pedidos/Add")));
const SolicitacoesNovas = Loadable(lazy(() => import("app/views/Pedidos/Novas")));
const Solicitacoes = Loadable(lazy(() => import("app/views/Pedidos")));
const SolicitacoesPendentes = Loadable(lazy(() => import("app/views/Pedidos/Pendentes")));
const SolicitacoesCanceladas = Loadable(lazy(() => import("app/views/Pedidos/Canceladas")));
const SolicitacoesAprovadas = Loadable(lazy(() => import("app/views/Pedidos/Aprovadas")));
const SolicitacoesRecusadas = Loadable(lazy(() => import("app/views/Pedidos/Recusadas")));

// PAGINA DE PROCESSO
const ProcessoAddAdmin = Loadable(lazy(() => import("app/views/admin/processo/Add")));
const ProcessoNovas = Loadable(lazy(() => import("app/views/admin/processo/Novas")));
const Processo = Loadable(lazy(() => import("app/views/admin/processo/index")));
const ProcessoPendentes = Loadable(lazy(() => import("app/views/admin/processo/Pendentes")));
const ProcessoCanceladas = Loadable(lazy(() => import("app/views/admin/processo/Canceladas")));
const ProcessoDetalhar = Loadable(lazy(() => import("app/views/admin/processo/Detalhar")));
const ProcessoEditar = Loadable(lazy(() => import("app/views/admin/projecto/Edit")));

// PAGINA DE CLIENTE
const ProjectoAdd = Loadable(lazy(() => import("app/views/admin/projecto/Edit")));
const ProjectoAdd2 = Loadable(lazy(() => import("app/views/admin/projecto/AddPersonalizado")));
const Projecto = Loadable(lazy(() => import("app/views/admin/projecto/Listar")));
const ProjectoDetalhar = Loadable(lazy(() => import("app/views/admin/projecto/Detalhar")));
const ProjectoEditar = Loadable(lazy(() => import("app/views/Clientes/Editar")));
// const ProjectoNovos = Loadable(lazy(() => import("app/views/admin/Projectos/ListarNovo")));

// PAGINA DE CLIENTE
const ClientesAdd = Loadable(lazy(() => import("app/views/Clientes/Add")));
const ClientesListar = Loadable(lazy(() => import("app/views/Clientes/Listar")));
const ClientesDetalhar = Loadable(lazy(() => import("app/views/Clientes/Detalhar")));
const ClientesListarNovo = Loadable(lazy(() => import("app/views/Clientes/ListarNovo")));
const ClientesEditar = Loadable(lazy(() => import("app/views/Clientes/Editar")));


// PAGINA DE CLIENTE
const GestorAdd = Loadable(lazy(() => import("app/views/Clientes/Gestores/Add")));
const GestorListar = Loadable(lazy(() => import("app/views/Clientes/Gestores/Listar")));
const GestorDetalhar = Loadable(lazy(() => import("app/views/Clientes/Gestores/Detalhar")));
const GestorEditar = Loadable(lazy(() => import("app/views/Clientes/Gestores/Editar")));


// PAGINA DE TÉCNICOS
const TecnicoAdd = Loadable(lazy(() => import("app/views/admin/Beneficiarios/Add")));
const TecnicoDetalhar = Loadable(lazy(() => import("app/views/admin/Beneficiarios/Detalhar")));


// PAGINA DE USUÁRIOS
const UsuariosAdd = Loadable(lazy(() => import("app/views/admin/usuario/Add")));
const UsuariosListar = Loadable(lazy(() => import("app/views/admin/usuario/Listar")));
const UsuariosDetalhar = Loadable(lazy(() => import("app/views/admin/usuario/Detalhar")));
const UsuariosListarNovo = Loadable(lazy(() => import("app/views/admin/usuario/ListarNovo")));
const UsuariosEditar = Loadable(lazy(() => import("app/views/admin/usuario/Editar")));



const ListTipoDocumento = Loadable(
  lazy(() => import("app/views/documento/tipoDeDocumento/ListTipoDocumento"))
);
const AddTipoDocumento = Loadable(
  lazy(() => import("app/views/documento/tipoDeDocumento/AddTipodeDocumento"))
);
const EditTipoDocumento = Loadable(
  lazy(() => import("app/views/documento/tipoDeDocumento/EditTipodeDocumento"))
);

const ListDepartamento = Loadable(
  lazy(() => import("app/views/departamento/ListDepartamento"))
);
const AddDepartamento = Loadable(
  lazy(() => import("app/views/departamento/AddDepartamento"))
);
const EditDepartamento = Loadable(
  lazy(() => import("app/views/departamento/EditDepartamento"))
);

const ListCargo = Loadable(lazy(() => import("app/views/departamento/cargos/ListCargo")));
const AddCargo = Loadable(lazy(() => import("app/views/departamento/cargos/AddCargo")));
const EditCargo = Loadable(lazy(() => import("app/views/departamento/cargos/EditCargo")));

const AddStatusProcesso = Loadable(
  lazy(() => import("app/views/admin/processos/statusProcessamento/AddStatusProcesso"))
);
const ListStatusProcesso = Loadable(
  lazy(() => import("app/views/admin/processos/statusProcessamento/ListStatusProcessamento"))
);
const EditStatusProcesso = Loadable(
  lazy(() => import("app/views/admin/processos/statusProcessamento/EditStatusProcesso"))
);

const AddFuncionario = Loadable(lazy(() => import("app/views/Funcionario/AddFuncionario")));
const ListFuncionario = Loadable(lazy(() => import("app/views/Funcionario/ListFuncionario")));

const DetalharFuncionario = Loadable(
  lazy(() => import("app/views/Funcionario/DetalharFuncionario"))
);

const ListFolha = Loadable(lazy(() => import("app/views/salario/ListFolha")));
// const PrivateRoute = Loadable(lazy(() => import("app/auth/privateRoutes")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      // dashboard route
      {
        path: "/dashboard/default",
        element: <ControlDash></ControlDash>
      },
      {
        path: "/visto/detalhe/:numero",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <DetalharVisto />
          </PrivateRoute>
        )
      },
      {
        path: "/visto/detalhe/:numero",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <DetalharVisto />
          </PrivateRoute>
        )
      },
      // e-chart route
      {
        path: "/charts/echarts",
        element: <AppEchart />,
        auth: authRoles.secretaria
      },
      {
        path: "/cliente/:clientId/gestor/add",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <GestorAdd />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:clientId/gestor/:id/editar",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <GestorEditar />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:clientId/gestor/list",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <GestorListar />,
          </PrivateRoute>
        )
      },
      {
        path: "/gestores/list",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <GestorListar />,
          </PrivateRoute>
        )
      },
      {
        path: "/gestores/:gestorId/detalhe",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <GestorListar />,
          </PrivateRoute>
        )
      },


      {
        path: "/cliente/:clientId/gestor/:id/detalhe",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <GestorDetalhar />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:clientId/tecnicos/add",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <TecnicoAdd />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:clientId/tecnicos/:tecnicoId/detalhar",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <TecnicoDetalhar />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:id/projecto/add",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProjectoAdd />,
          </PrivateRoute>
        )
      },
      {
        path: "/projectos/add",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProjectoAdd2 />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:clientId/projecto/:projectoId/detalhe",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProjectoDetalhar />,
          </PrivateRoute>
        )
      },

      {
        path: "/projectos/listar",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <Projecto />,
          </PrivateRoute>
        )
      },
      {
        path: "/projectos/novos",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <></>
          </PrivateRoute>
        )
      },
      {
        path: "/solicitacoes-visto/novas",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <SolicitacoesNovas />,
          </PrivateRoute>
        )
      },
      {
        path: "/solicitacoes/add",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <SolicitacoesAdd />,
          </PrivateRoute>
        )
      },

      {
        path: "/solicitacoes-visto/listar",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <Solicitacoes />,
          </PrivateRoute>
        )
      },
      {
        path: "/solicitacoes-visto/pendente",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <SolicitacoesPendentes />,
          </PrivateRoute>
        )
      },

      {
        path: "/solicitacoes-visto/recusadas",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <SolicitacoesRecusadas />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:clienetId/processo/:id/detalhar/",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProcessoDetalhar />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:clienetId/processo/:id/editar/",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProcessoEditar />,
          </PrivateRoute>
        )
      },
      {
        path: "/cliente/:clienetId/tecnico/:tecnicoId/processo/add/",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProcessoAdd />,
          </PrivateRoute>
        )
      },

      {
        path: "/solicitacoes-visto/canceladas",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <SolicitacoesCanceladas />,
          </PrivateRoute>
        )
      },
      {
        path: "/solicitacoes-visto/aprovadas",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <SolicitacoesAprovadas
            />,
          </PrivateRoute>
        )
      },


      {
        path: "/processos/novas",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProcessoNovas />,
          </PrivateRoute>
        )
      },
      {
        path: "/Processos/add",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProcessoAdd />,
          </PrivateRoute>
        )
      },
      {
        path: "/processos/listar",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <Processo />,
          </PrivateRoute>
        )
      },
      {
        path: "/processos/pendente",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProcessoPendentes />,
          </PrivateRoute>
        )
      },
      {
        path: "/processos/recusadas",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProcessoRecusadas />,
          </PrivateRoute>
        )
      },
      {
        path: "/processos/canceladas",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ProcessoCanceladas />,
          </PrivateRoute>
        )
      },

      {
        path: "/vistos/expirados",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ListarVistoExpirados />
          </PrivateRoute>
        )
      },

      {
        path: "/vistos/activos",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ListarVistoEmitidos />
          </PrivateRoute>
        )
      },

      { path: "/documento/tipo/add", element: <AddTipoDocumento /> },
      { path: "/documento/tipo/list", element: <ListTipoDocumento /> },
      { path: "/documento/tipo/edit/:id", element: <EditTipoDocumento /> },

      { path: "/processo/status/add", element: <AddStatusProcesso /> },
      { path: "/processos/list", element: <ListProcesso /> },
      { path: "/processo/status/edit/:id", element: <EditStatusProcesso /> },

      { path: "/vistos/tipo/add", element: <AddTipoVisto /> },
      {
        path: "/vistos",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ListVisto />
          </PrivateRoute>
        )
      },
      {
        path: "/clientes/detalhe/:passaporte",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ClientesDetalhar />
          </PrivateRoute>
        )
      },
      {
        path: "/clientes/editar/:passaporte",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ClientesEditar />
          </PrivateRoute>
        )
      },
      {
        path: "/clientes/listar",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ClientesListar />
          </PrivateRoute>
        )
      },
      {
        path: "/clientes/add",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ClientesAdd />
          </PrivateRoute>
        )
      },
      {
        path: "/clientes/pendentes",
        element: (
          <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
            <ClientesListarNovo />
          </PrivateRoute>
        )
      },
      {
        path: "/usuarios/add",
        element: (
          <PrivateRoute auth={authRoles.admin}>
            <UsuariosAdd />
          </PrivateRoute>
        )
      },
      {
        path: "/usuarios/list",
        element: (
          <PrivateRoute auth={authRoles.admin}>
            <UsuariosListar />
          </PrivateRoute>
        )
      },
      {
        path: "/usuarios/edit/:id",
        element: (
          <PrivateRoute auth={authRoles.admin}>
            <UsuariosListar />
          </PrivateRoute>
        )
      },
      { path: "/vistos/tipo/list", element: <ListTipoVisto /> },
      { path: "/vistos/tipo/add", element: <ListTipoVisto /> },
      { path: "/vistos/tipo/:id/editar", element: <EditTipoVisto /> },
      { path: "/vistos/add", element: <AddVisto /> },

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
  {
    path: "/session/signin",
    element: (
      <NonAuth>
        <JwtLogin />
      </NonAuth>
    )
  },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="dashboard/default" /> },
  { path: "*", element: <NotFound /> }
];


const pro = [

  {
    path: "/projectos/listar",
    element: (
      <PrivateRoute auth={authRoles.gestorVistoSecretaria}>
        <Projecto />,
      </PrivateRoute>
    )
  },
]
routes.push(pro)
export default routes;
