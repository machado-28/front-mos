export const AdminNavigations = [
  { name: "Admin Dashboard", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "gerenciamento geral", type: "label" },
  {
    name: "Clientes",
    icon: "contacts",
    path: "/clientes",
    children: [
      {
        name: "Listar",
        icon: "receiptLong",
        path: "/clientes/list"
      },

      {
        name: "novo",
        path: "clientes/add",
        icon: "add",
      },
      // {
      //   name: "pendentes",
      //   path: "/clientes/pendentes",
      //   icon: "pending",
      // },



    ]
  },

  {
    name: "Projectos",
    icon: "workHistory",
    children: [
      {
        name: "novo",
        path: "/projectos/add",
        icon: "add"
      },
      {
        name: "Listar",
        path: "/projectos/list",
        icon: "list"
      },
      {
        name: "Relatorio (PDF)",
        path: "/projectos/relatorio",
        icon: "list"
      }
    ]
  },
  {
    name: "Técnicos",
    icon: "people",
    children: [

      {
        name: "Listar",
        icon: "list",
        path: "tecnicos/list/admin"
      }
    ]
  },
  {
    name: "Processos",
    icon: "folderShared",

    children: [

      {
        name: "listar",
        path: "/processos/list",
        icon: "list"
      },
      {
        name: "Pendentes",
        path: "/processos/pendentes",
        icon: "list"
      },


    ]
  },
  // { label: "Pedidos", type: "label" },
  // {
  //   name: "Solicitações",
  //   icon: "archive",
  //   children: [
  //     {
  //       name: "pendentes",
  //       path: "/pedidos/pendentes",
  //       icon: "pending",
  //     },

  //   ]
  // },


  //   name: "VISTO",
  //   icon: "topic",
  //   path: "/processos/controlo",
  //   children: [
  //     {
  //       name: "Controlo",
  //       path: "/vistos/"
  //     },
  //     // {
  //     //   name: "Activos/emitidos",
  //     //   path: "/vistos/expirados"
  //     // },
  //     // {
  //     //   name: "Expirados",
  //     //   path: "/vistos/expirados"
  //     // }
  //   ]
  // },


  // { label: "GESTÃO DE RECURSOS HUMANOS", type: "label" },
  // {
  //   name: "FUNCIONARIOS",
  //   icon: "topic",
  //   path: "/processos/controlo",
  //   children: [
  //     {
  //       name: "ADICIONAR",
  //       path: "/vistos/"
  //     },
  //     {
  //       name: "LISTAR",
  //       path: "/vistos/expirados"
  //     }
  //   ]
  // },
  // {
  //   name: "GESTÃO DE FALTAS",
  //   icon: "topic",
  //   path: "/processos/controlo",
  //   children: [
  //     {
  //       name: "MARCAR",
  //       path: "/vistos/"
  //     },
  //     {
  //       name: "LISTAR",
  //       path: "/vistos/expirados"
  //     }
  //   ]
  // },
  // { label: "PROCESSAMENTO DE SALÁRIO", type: "label" },
  // {
  //   name: "PAGAMENTOS",
  //   icon: "topic",
  //   path: "/processos/controlo",
  //   children: [
  //     {
  //       name: "RELATÓRIOS",
  //       path: "/vistos/"
  //     },
  //     {
  //       name: "FOLHA DE SALARIO",
  //       path: "/vistos/expirados"
  //     }
  //   ]
  // },
  { label: "Perfil de utilizador", type: "label" },
  {
    name: "usuarios",
    icon: "groupAdd",
    path: "/usuarios/list",
    children: [
      {
        name: "adicionar",
        path: "/usuarios/add"
      },
      {
        name: "listar",
        path: "/usuarios/list"
      },
    ],
  },
  { label: "configurações & privacidade ", type: "label" },
  {
    name: "registo de actividade",
    icon: "groupAdd",
    path: "/usuarios/list",
    children: [

      {
        name: "logs",
        path: "/logs"
      },
    ],
  },
  {
    name: "Visto",
    icon: "topic",
    children: [
      {
        name: "Tipo",
        children: [
          {
            name: "ADICIONAR",
            path: "/vistos/tipo/add"
          },
          {
            name: "LISTAR",
            path: "/vistos/tipo/list"
          }
        ]

      },

    ]
  },
  {
    name: "Delegação de tarefa",
    icon: "topic",
    children: [
      {
        name: "fazes",
        children: [
          {
            name: "adicionar",
            path: "/fazes/add"
          },
          {
            name: "listar",
            path: "/fazes/tipo/list"
          }
        ]

      },
      {
        name: "status",
        children: [
          {
            name: "adicionar",
            path: "-fazes/status/add"
          },
          {
            name: "listar",
            path: "/fazes/status/list"
          }
        ]

      },

    ]
  }
];

export const AdminProjectoNavigations = [
  { name: "Admin de Projecto Dashboard", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "gerenciamento geral", type: "label" },
  {
    name: "Clientes",
    icon: "contacts",
    path: "/clientes",
    children: [
      {
        name: "Listar",
        icon: "receiptLong",
        path: "/clientes/list"
      },

      {
        name: "novo",
        path: "clientes/add",
        icon: "add",
      },
      {
        name: "pendentes",
        path: "/clientes/pendentes",
        icon: "pending",
      },



    ]
  },

  {
    name: "Projectos",
    icon: "workHistory",
    children: [
      {
        name: "novo",
        path: "/projectos/add",
        icon: "add"
      },
      {
        name: "Listar",
        path: "/projectos/list",
        icon: "list"
      }
    ]
  },
  {
    name: "Técnicos",
    icon: "people",
    children: [
      {
        name: "Novos",
        path: "/tecnicos/add",
        icon: "add"
      },
      {
        name: "Listar",
        icon: "list",
        path: "tecnicos/list"
      }
    ]
  },
  {
    name: "Processos",
    icon: "folderShared",

    children: [

      {
        name: "listar",
        path: "/processos/list",
        icon: "list"
      },

      {
        name: "em atraso",
        path: "/processos/list",
        icon: "clock"
      },

    ]
  },

  { label: "configurações & privacidade ", type: "label" },
  {
    name: "registo de actividade",
    icon: "groupAdd",
    path: "/usuarios/list",
    children: [

      {
        name: "logs",
        path: "/logs"
      },
    ],
  },
  {
    name: "Visto",
    icon: "topic",
    children: [
      {
        name: "Tipo",
        children: [
          {
            name: "ADICIONAR",
            path: "/vistos/tipo/add"
          },
          {
            name: "LISTAR",
            path: "/vistos/tipo/list"
          }
        ]

      },

    ]
  },
  {
    name: "Fazes de processos",
    icon: "topic",
    children: [
      {
        name: "fazes",
        children: [
          {
            name: "adicionar",
            path: "/fazes/add"
          },
          {
            name: "listar",
            path: "/fazes/tipo/list"
          }
        ]

      },
      {
        name: "status",
        children: [
          {
            name: "adicionar",
            path: "-fazes/status/add"
          },
          {
            name: "listar",
            path: "/fazes/status/list"
          }
        ]

      },

    ]
  }
];


export const VisualizadorNavigations = [
  { name: "Admin de Projecto Dashboard", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "gerenciamento geral", type: "label" },
  {
    name: "Clientes",
    icon: "contacts",
    path: "/clientes",
    children: [
      {
        name: "Listar",
        icon: "receiptLong",
        path: "/clientes/list"
      },


      {
        name: "pendentes",
        path: "/clientes/pendentes",
        icon: "pending",
      },
    ]
  },

  {
    name: "Projectos",
    icon: "workHistory",
    children: [

      {
        name: "Listar",
        path: "/projectos/list",
        icon: "list"
      }
    ]
  },
  {
    name: "Técnicos",
    icon: "people",
    children: [

      {
        name: "Listar",
        icon: "list",
        path: "tecnicos/list"
      }
    ]
  },
  {
    name: "Processos",
    icon: "folderShared",

    children: [

      {
        name: "listar",
        path: "/processos/list",
        icon: "list"
      },

      {
        name: "em atraso",
        path: "/processos/list",
        icon: "clock"
      },

    ]
  },
  { label: "Pedidos", type: "label" },
  {
    name: "Solicitações",
    icon: "archive",
    children: [
      {
        name: "pendentes",
        path: "/pedidos/pendentes",
        icon: "pending",
      },

    ]
  },


];


export const ClienteNavigations = [
  { name: "Dashboard-cliente", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "gerenciamento geral", type: "label" },

  {
    name: "Meus Projectos",
    icon: "workHistory",
    children: [

      {
        name: "ver projectos",
        path: "/projectos/list",
        icon: "list"
      }
    ]
  },
  {
    name: "Técnicos",
    icon: "people",
    children: [
      {
        name: "ver tecnicos",
        icon: "list",
        path: "tecnicos/list"
      }
    ]
  },
  {
    name: "Processos",
    icon: "folderShared",

    children: [
      {
        name: "ver processos",
        path: "/processos/list",
        icon: "list"
      },
      {
        name: "em atraso",
        path: "/processos/list",
        icon: "clock"
      },
      {
        name: "ver finalizados",
        path: "/processos/list",
        icon: "clock"
      },

    ]
  },
  {
    name: "Visto",
    icon: "topic",
    children: [
      {
        name: "Tipo",
        children: [

          {
            name: "listar",
            path: "/vistos/tipo/list"
          }
        ]

      },

    ]
  },

];

export const GestorProjectoNavigations = [
  { name: "Admin de Projecto Dashboard", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "Meus Projectos", type: "label" },
  {
    name: "Meus Projectos",
    icon: "workHistory",
    children: [
      {
        name: "ver projectos",
        path: "/projectos/list",
        icon: "list"
      }
    ]
  },
];


export const GestorProjectoExternoNavigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "Meus Projectos", type: "label" },
  {
    name: "Meus Projectos",
    icon: "workHistory",
    children: [
      {
        name: "Lver projectos",
        path: "/projectos/list",
        icon: "list"
      }
    ]
  },
];


export const TecnicoProcessoNavigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "gerenciamento geral", type: "label" },
  {
    name: "Clientes",
    icon: "contacts",
    path: "/clientes",
    children: [
      {
        name: "Listar",
        icon: "receiptLong",
        path: "/clientes/list"
      },
    ]
  },

  {
    name: "Projectos",
    icon: "workHistory",
    children: [
      {
        name: "Todos projectos",
        path: "/projectos/list",
        icon: "list"
      },
    ]
  },
  {
    name: "Técnicos/beneficiarios",
    icon: "people",
    children: [
      {
        name: "registar um",
        path: "/tecnicos/add",
        icon: "add"
      },
      {
        name: "ver beneficiários ",
        icon: "list",
        path: "tecnicos/list"
      }
    ]
  },
  {
    name: "Processos",
    icon: "folderShared",

    children: [
      {
        name: "adicionar",
        path: "/fazes/add"
      },
      {
        name: "ver processos",
        path: "/processos/list",
        icon: "list"
      },


      {
        name: "em atraso",
        path: "/processos/list",
        icon: "clock"
      },

    ]
  },
  {
    name: "Meus Processos",
    icon: "folderShared",

    children: [
      {
        name: "Em andamento",
        path: "/processos/list",
        icon: "list"
      },

      {
        name: "Finalizados",
        path: "/processos/list",
        icon: "list"
      },


      {
        name: "Em atraso",
        path: "/processos/list",
        icon: "clock"
      },

    ]
  },
  {
    name: "Visto",
    icon: "folderShared",

    children: [
      {
        name: "registar",
        path: "/fazes/add"
      },
      {
        name: "ver vistos",
        path: "/processos/list",
        icon: "list"
      },

    ]
  },
];

export const GestorVistoNavigations = [
  { name: "GESTOR  DE VISTO", path: "/dashboard/default", icon: "user" },
  { label: "GESTÃO DE VISTO", type: "label" },

  {
    name: "Processos",
    icon: "folder",

    children: [
      {
        name: "Lista de Processos",
        path: "/processos/list"
      },
      {
        name: "Secretaria",
        path: "/processos/secretaria"
      },
      {
        name: "MIREMPET",
        path: "/processos/mirempet"
      },
      {
        name: "SME",
        path: "/processos/sme"
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
        path: "/vistos/activos"
      },
      {
        name: "Expirados",
        path: "/vistos/expirados"
      }
    ]
  }
];


export const SecretariaNavigations = [
  { name: "SECRETARIA", path: "/dashboard/default", icon: "dashboard" },
  { label: "GESTÃO DE VISTO", type: "label" },

  {
    name: "Processos ",
    icon: "folder",

    children: [
      {
        name: "Lista de Processos",
        path: "/processos/list"
      },
      {
        name: "Secretaria",
        path: "/processos/secretaria"
      },
      {
        name: "MIREMPET",
        path: "/processos/mirempet"
      },
      {
        name: "SME",
        path: "/processos/sme"
      }
    ]
  },
  {
    name: "Visto",
    icon: "topic",
    path: "/processos/controlo",
    children: [
      {
        name: "Activos/emitidos",
        path: "/vistos/expirados"
      },
      {
        name: "Expirados",
        path: "/vistos/expirados"
      }
    ]
  }
];

export const RhNavigations = [
  { name: "RECURSOS HUMANOS", path: "/dashboard/default", icon: "dashboard" },
  { label: "GESTÃO DE VISTO", type: "label" },

  {
    name: "Processos ",
    icon: "folder",

    children: [
      {
        name: "Lista de Processos",
        path: "/processos/list"
      },
      { label: "GESTÃO DE RCUROS HUMANOS", type: "label" },
      {
        name: "FUNCIONARIOS",
        icon: "security",
        children: [
          { name: "Cadastramento", iconText: "SI", path: "/funcionario/add" },
          { name: "Listagem", iconText: "SI", path: "/funcionario/list" }
        ]
      },
      {
        name: "TIPO DE DOCUMENTO ",
        icon: "security",
        children: [
          { name: "Adicionar", iconText: "SI", path: "/documento/tipo/funcionario/add" },
          { name: "Listar", iconText: "SI", path: "/documento/tipo/funcionario/add" }
        ]
      },
      {
        name: "FALTA & ATRASO",
        icon: "security",
        children: [
          { name: "Cadastramento", iconText: "SI", path: "/funcionario/add" },
          { name: "Listagem", iconText: "SI", path: "/funcionario/add" }
        ]
      },
      {
        name: "CONTRATOS",
        icon: "security",
        children: [{ name: "Listagem", iconText: "SI", path: "/funcionario/add" }]
      },
      { label: "GESTÃO FINACEIRA", type: "label" },
      {
        name: "FOLHA DE SALÁRIO",
        icon: "security",
        children: [
          { name: "Visualizar", iconText: "SI", path: "/pagamentos/list" },
          { name: "Gráfico ", iconText: "SI", path: "/funcionario/grafico" }
        ]
      },
      { label: "GESTÃO ADMINISTRATIVA", type: "label" },
      {
        name: "DEPARTAMENTOS",
        icon: "security",
        children: [
          { name: "Cadastramento", iconText: "SI", path: "/departamento/add" },
          { name: "Listagem", iconText: "SI", path: "/departamento/list" }
        ]
      },
      {
        name: "CARGOS",
        icon: "security",
        children: [
          { name: "Cadastramento", iconText: "SI", path: "/departamento/cargo/add" },
          { name: "Listagem", iconText: "SI", path: "/departamento/cargo/list" }
        ]
      }
    ]
  }
];
