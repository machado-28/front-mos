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
      // {
      //   name: "Relatorio (PDF)",
      //   path: "/projectos/relatorio",
      //   icon: "list"
      // }
    ]
  },
  {
    name: "Beneficiarios",
    icon: "people",
    children: [

      {
        name: "Listar",
        icon: "list",
        path: "tecnicos/list/admin"
      }
    ]
  },
  { label: "GESTÃO DE PROCESSOS", type: "label" },
  {
    name: "Processos ",
    icon: "folderShared",
    children: [

      {
        name: "ver processos",
        path: "/processos/list",
        icon: "list"
      },

    ]
  },
  {
    name: "Processos delegados",
    icon: "task",
    children: [
      {
        name: "listar",
        path: "/processos/delegados",
        icon: "list"
      },
      {
        name: "Em Andamento",
        path: "/processos/delegados/andamento",
        icon: "progress"
      },
      {
        name: "Pendentes",
        path: "/processos/delegados/pendentes",
        icon: "list"
      },
      {
        name: "Finalizados",
        path: "/processos/delegados/finalizados",
        icon: "check"
      },

      // {
      //   name: "Cancelados",
      //   path: "/processos/delegados/cancelados",
      //   icon: "list"
      // },
    ]



  },
  { label: "GESTÃO DE VISTO", type: "label" },
  {
    name: "Controlo de Visto",
    icon: "folderShared",

    children: [
      {
        name: "Vistos Expirados",
        path: "/vistos/query?activo=false",
        icon: "list"
      },
      {
        name: "Vistos Activos",
        path: "/vistos/query?activo=true",
        icon: "check"
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
    name: "Personalização",
    icon: "topic",
    children: [

      {
        name: "visto",
        path: "/vistos/tipo"
      },

      {
        name: "status de processos",
        path: "/vistos/status"
      },
    ]
  },
  // {
  //   name: "Delegação de tarefa",
  //   icon: "topic",
  //   children: [
  //     {
  //       name: "delegar",
  //       path: "/processos/delegar"
  //     },
  //     {
  //       name: "fazes",
  //       children: [

  //         {
  //           name: "listar",
  //           path: "/fazes/tipo/list"
  //         }
  //       ]
  // 
  //     },
  //     {
  //       name: "status",
  //       children: [
  //         {
  //           name: "adicionar",
  //           path: "-fazes/status/add"
  //         },
  //         {
  //           name: "listar",
  //           path: "/fazes/status/list"
  //         }
  //       ]

  //     },

  //   ]
  // }
];

export const AdminProjectoNavigations = AdminNavigations


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
    name: "Gestão de Gestores",
    icon: "people",
    children: [
      {
        name: "ver gestores",
        icon: "list",
        path: "/cliente/gestores"
      },
      {
        name: "Adicionar novo",
        icon: "list",
        path: "/cliente/gestores/add"
      },

    ]
  },
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
        path: "/cliente/processos/list",

        icon: "list"
      },

      {
        name: "Finalizados",
        path: "/processos/delegados/finalizados",
        icon: "check"
      },



    ]
  },
  {
    name: "Visto",
    icon: "topic",
    children: [
      {
        name: "Vistos Expirados",
        path: "/vistos/query?activo=false",
        icon: "stop"
      },
      {
        name: "Vistos Activos",
        path: "/vistos/query?activo=true",
        icon: "check"
      },
    ]
  },

];

export const GestorProjectoNavigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "assessment" },
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
  }, { label: "GESTÃO DE PROCESSOS", type: "label" },
  {
    name: "Processos ",
    icon: "folderShared",
    children: [

      {
        name: "ver processos",
        path: "/processos/list",
        icon: "list"
      },

    ]
  },
  {
    name: "Processos delegados",
    icon: "task",
    children: [
      {
        name: "listar",
        path: "/processos/delegados",
        icon: "list"
      },
      {
        name: "Em Andamento",
        path: "/processos/delegados/andamento",
        icon: "progress"
      },
      {
        name: "Pendentes",
        path: "/processos/delegados/pendentes",
        icon: "list"
      },
      {
        name: "Finalizados",
        path: "/processos/delegados/finalizados",
        icon: "check"
      }]
  },

  {
    name: "Visto",
    icon: "topic",
    children: [
      {
        name: "Vistos Expirados",
        path: "/vistos/query?activo=false",
        icon: "stop"
      },
      {
        name: "Vistos Activos",
        path: "/vistos/query?activo=true",
        icon: "check"
      },
    ]
  },
];


export const GestorProjectoClienteNavigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "Meus Projectos", type: "label" },
  {
    name: "Meus Projectos",
    icon: "workHistory",
    children: [
      {
        name: "Ver projectos",
        path: "/projectos/list",
        icon: "list"
      }
    ]
  },

  { label: "Vistos Emitidos", type: "label" },
  {
    name: "Vistos",
    icon: "folderShared",

    children: [
      {
        name: "Vistos Expirados",
        path: "/vistos/query?activo=false",
        icon: "list"
      },
      {
        name: "Vistos Activos",
        path: "/vistos/query?activo=true",
        icon: "check"
      },
    ]
  }
];


export const TecnicoProcessoNavigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "assessment" },
  // { label: "GESTÃO DE VISTO", type: "label" },
  { label: "gerenciamento de clientes", type: "label" },
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

  { label: "CONTROLO DE PROCESSOS DE VISTOS ", type: "label" },

  {
    name: "Meus Processos",
    icon: "task",
    children: [
      {
        name: "listar",
        path: "/processos/delegados",
        icon: "list"
      },
      {
        name: "Em Andamento",
        path: "/processos/delegados/andamento",
        icon: "progress"
      },
      {
        name: "Pendentes",
        path: "/processos/delegados/pendentes",
        icon: "list"
      },
      {
        name: "Finalizados",
        path: "/processos/delegados/finalizados",
        icon: "check"
      },

    ],
  },
  { label: "GESTÃO DE VISTO", type: "label" },
  {
    name: "Controlo de Visto",
    icon: "folderShared",

    children: [
      {
        name: "Vistos Expirados",
        path: "/vistos/query?activo=false",
        icon: "list"
      },
      {
        name: "Vistos Activos",
        path: "/vistos/query?activo=true",
        icon: "check"
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
  { name: "dashboard", path: "/dashboard/default", icon: "dashboard" },
  { label: "GESTÃO DE FUNCIONÁRIOS", type: "label" },

  {
    name: "Funcionários",
    icon: "person",

    children: [
      {
        name: "Lista de Funcionários",
        path: "/funcionarios"
      },
      {
        name: "Adicionar Novo Funcionário",
        path: "/funcionarios/add"
      },

    ]
  },

  {
    name: "Departamentos",
    icon: "ballot",

    children: [
      {
        name: "Lista de Departamentos",
        path: "/processos/list"
      },
      {
        name: "Adicionar Novo Departamento",
        path: "/processos/list"
      },

    ]
  },

  {
    name: "Cargos",
    icon: "businessCenter",

    children: [
      {
        name: "Lista de Cargos",
        path: "/processos/list"
      },
      {
        name: "Adicionar Novo Cargo",
        path: "/processos/list"
      },

    ]
  },
  {
    name: "Horários e Turnos",
    icon: "alarm",

    children: [
      {
        name: "Lista de Turnos",
        path: "/processos/list"
      },
      {
        name: "Adicionar Novo Turno",
        path: "/processos/list"
      },

    ]
  },
  { label: "Folha de Pagamento", type: "label" },
  {
    name: "Processamento",
    icon: "money",
    children: [
      {
        name: "processar folha",
        path: "/processos/list"
      },
      {
        name: "Histórico de Pagamentos",
        path: "/processos/list"
      },

    ]
  },
  { label: "Gestão de Vagas", type: "label" },
  {
    name: "Recrutamento",
    icon: "work",

    children: [
      {
        name: "Vagas Abertas",
        path: "/processos/list"
      },
      {
        name: "Processos Seletivos",
        path: "/processos/list"
      },
      {
        name: "Candidatos",
        path: "/processos/list"
      },
      {
        name: "Entrevistas",
        path: "/processos/list"
      },
    ]
  },
  { label: "Relatório e análise", type: "label" },
  {
    name: "Relatórios",
    icon: "analyticsOutlined",

    children: [
      {
        name: "Relatórios de Funcionários",
        path: "/processos/list"
      },
      {
        name: "Rel. de Folha de Pagamento",
        path: "/processos/list"
      },
      {
        name: "Relatórios de Desempenho",
        path: "/processos/list"
      },

    ]
  },
];
