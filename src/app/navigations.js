export const navigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "dashboard" },
  { label: "GESTÃO DE VISTO", type: "label" },

  {
    name: "Processos",
    icon: "folder",

    children: [
      {
        name: "Processos",
        path: "/processos/list"
      },
      {
        name: "MIREMPET",
        path: "/processos/mirempet"
      },
      {
        name: "SME",
        path: "/processos/sme"
      },
      {
        name: "Concluídos",
        path: "/processos/concluidos"
      },
      {
        name: "Processos em atraso",
        path: "/processos/atrasados"
      }
    ]
  },
  {
    name: "Controlo de Visto",
    icon: "topic",
    path: "/processos/controlo",
    children: [
      {
        name: "Controlo",
        path: "/vistos/"
      },
      {
        name: "Activos/emitidos",
        path: "/vistos/expirados"
      },
      {
        name: "Expirados",
        path: "/vistos/expirados"
      }
    ]
  },

  { label: "Definições do sistema", type: "label" },
  {
    name: "Definições",
    icon: "settings",
    path: "/processos/controlo"
  }
  // {
  //   name: "PEDIDOS (site)",
  //   icon: "security",
  //   children: [
  //     { name: "Listar", iconText: "SI", path: "/processos/site/listar" },
  //     { name: "Recusdos", iconText: "SI", path: "/processos/site/recusados" },
  //   ]
  // },
  // {
  //   name: "CONTROLO DE VISTO",
  //   icon: "security",
  //   children: [
  //     { name: "Vistos Expirados", iconText: "SI", path: "/vistos/expirados" },
  //     { name: "Vistos Emitidos", iconText: "SI", path: "/vistos/emitidos" },
  //   ]
  // },
  // {
  //   name: "TIPO DE VISTO",
  //   icon: "security",
  //   children: [
  //     { name: "Listar", iconText: "SI", path: "/visto/tipo/list" },
  //     { name: "Adicionar", iconText: "SI", path: "/visto/tipo/add" },
  //   ]
  // },
  // {
  //   name: "STA. PROCESSOS",
  //   icon: "security",
  //   children: [
  //     { name: "Adicionar", iconText: "SI", path: "/processo/status/add" },
  //     { name: "Listar", iconText: "SI", path: "/processo/status/list" },

  //   ]
  // },
  // {
  //   name: "STATUS",
  //   icon: "security",
  //   children: [
  //     { name: "Adicionar", iconText: "SI", path: "/processo/status/add" },
  //     { name: "Listar", iconText: "SI", path: "/processo/status/list" },

  //   ]
  // },

  // { label: "GESTÃO DE RCUROS HUMANOS", type: "label" },
  // {
  //   name: "FUNCIONARIOS",
  //   icon: "security",
  //   children: [
  //     { name: "Cadastramento", iconText: "SI", path: "/funcionario/add" },
  //     { name: "Listagem", iconText: "SI", path: "/funcionario/list" },
  //   ]
  // },
  // {
  //   name: "TIPO DE DOCUMENTO ",
  //   icon: "security",
  //   children: [
  //     { name: "Adicionar", iconText: "SI", path: "/documento/tipo/funcionario/add" },
  //     { name: "Listar", iconText: "SI", path: "/documento/tipo/funcionario/add" },
  //   ]
  // },
  // {
  //   name: "FALTA & ATRASO",
  //   icon: "security",
  //   children: [
  //     { name: "Cadastramento", iconText: "SI", path: "/funcionario/add" },
  //     { name: "Listagem", iconText: "SI", path: "/funcionario/add" },
  //   ]
  // },
  // {
  //   name: "CONTRATOS",
  //   icon: "security",
  //   children: [
  //     { name: "Listagem", iconText: "SI", path: "/funcionario/add" },
  //   ]
  // },
  // { label: "GESTÃO FINACEIRA", type: "label" },
  // {
  //   name: "FOLHA DE SALÁRIO",
  //   icon: "security",
  //   children: [
  //     { name: "Visualizar", iconText: "SI", path: "/pagamentos/list" },
  //     { name: "Gráfico ", iconText: "SI", path: "/funcionario/grafico" },
  //   ]
  // },
  // { label: "GESTÃO ADMINISTRATIVA", type: "label" },
  // {
  //   name: "DEPARTAMENTOS",
  //   icon: "security",
  //   children: [
  //     { name: "Cadastramento", iconText: "SI", path: "/departamento/add" },
  //     { name: "Listagem", iconText: "SI", path: "/departamento/list" },
  //   ]
  // },
  // {
  //   name: "CARGOS",
  //   icon: "security",
  //   children: [
  //     { name: "Cadastramento", iconText: "SI", path: "/departamento/cargo/add" },
  //     { name: "Listagem", iconText: "SI", path: "/departamento/cargo/list" },
  //   ]
  // },

  // { label: "PAGES", type: "label" },
  // {
  //   name: "Session/Auth",
  //   icon: "security",
  //   children: [
  //     { name: "Sign in", iconText: "SI", path: "/session/signin" },
  //     { name: "Sign up", iconText: "SU", path: "/session/signup" },
  //     { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
  //     { name: "Error", iconText: "404", path: "/session/404" }
  //   ]
  // },
  // { label: "Components", type: "label" },
  // {
  //   name: "Components",
  //   icon: "favorite",
  //   badge: { value: "30+", color: "secondary" },
  //   children: [
  //     { name: "Auto Complete", path: "/material/autocomplete", iconText: "A" },
  //     { name: "Buttons", path: "/material/buttons", iconText: "B" },
  //     { name: "Checkbox", path: "/material/checkbox", iconText: "C" },
  //     { name: "Dialog", path: "/material/dialog", iconText: "D" },
  //     { name: "Expansion Panel", path: "/material/expansion-panel", iconText: "E" },
  //     { name: "Form", path: "/material/form", iconText: "F" },
  //     { name: "Icons", path: "/material/icons", iconText: "I" },
  //     { name: "Menu", path: "/material/menu", iconText: "M" },
  //     { name: "Progress", path: "/material/progress", iconText: "P" },
  //     { name: "Radio", path: "/material/radio", iconText: "R" },
  //     { name: "Switch", path: "/material/switch", iconText: "S" },
  //     { name: "Slider", path: "/material/slider", iconText: "S" },
  //     { name: "Snackbar", path: "/material/snackbar", iconText: "S" },
  //     { name: "Table", path: "/material/table", iconText: "T" }
  //   ]
  // },
  // {
  //   name: "Charts",
  //   icon: "trending_up",
  //   children: [{ name: "Echarts", path: "/charts/echarts", iconText: "E" }]
  // },
  // {
  //   name: "Documentation",
  //   icon: "launch",
  //   type: "extLink",
  //   path: "http://demos.ui-lib.com/matx-react-doc/"
  // }
];
