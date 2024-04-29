import {
  AttachMoney,
  Delete,
  Edit,
  FileDownload,
  Group,
  Search,
  Share,
  Store,
  VerifiedUser,
  Visibility
} from "@mui/icons-material";
import {
  Box,
  Card,
  Table,
  Select,
  Avatar,
  styled,
  TableRow,
  useTheme,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  Icon,
  Grid
} from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { H3, Paragraph } from "app/components/Typography";
import "./style.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "app/hooks/useApi";
import { useEffect } from "react";
import { z } from "zod";

import {
  CButton,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow
} from "@coreui/react";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import { ContentBox } from "app/views/dashboard/Analytics";
import StatCards from "app/views/dashboard/shared/StatCards";
import { ChartLine } from "../../processos/ChartLine";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Notify, NotifyInfo } from "app/utils/toastyNotification";
import FormularioTrabalho from "../../processos/Local/Formularios/FormularioTrabalho";
import { useRef } from "react";
import DetalheVisto from "./DetalheVisto";
import StatCardsLine from "app/views/dashboard/shared/StatCardsLine";

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
}));
const AppButtonRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  },
  "& .button": { margin: theme.spacing(1) },
  "& .input": { display: "none" }
}));
export default function ListVisto() {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [filtroStatus, setFiltroStatus] = useState(0);

  function handleFiltroStatus(e) {
    setFiltroStatus((prev) => e);
  }

  const [processos, setProcesos] = useState([
    {
      createdAt: new Date(),
      requerente: {
        nome: "Antonio Machado"
      },
      status: {
        nome: "xxxxxx"
      }
    },
    {
      createdAt: new Date(),
      requerente: {
        nome: "Antonio Machado"
      },
      status: {
        nome: "xxxxxx"
      }
    },
    {
      createdAt: new Date(),
      requerente: {
        nome: "Manuel Dias Piedade"
      },
      status: {
        nome: "xxxxxx"
      }
    },
    {
      createdAt: new Date(),
      requerente: {
        nome: "Gonçalves Adão"
      },
      status: {
        nome: "xxxxxx"
      }
    },
    {
      createdAt: new Date(),
      requerente: {
        nome: "Antonio Machado"
      }
    }
  ]);

  const hoje = new Date();
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(hoje.getMonth() - 3);

  const schemaVisto = z.object({
    dataEmissao: z.coerce
      .date()
      .min(tresMesesAtras, "Data não pode ser mais do que 3 meses no passado")
      .max(hoje, "Data não pode estar no futuro"),
    numeroPassaporte: z
      .string()
      .regex(/^([a-zA-Z]{2}\d{7})$/, "Número do passaporte inválido")
      .max(9)
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schemaVisto),
    shouldFocusError: true,
    progressive: true
  });
  const [visible, setVisible] = useState(false);
  const [tipoDeVisto, setTipoDeVisto] = useState([]);
  const [entidades, setEntidade] = useState([]);
  const [status, setStatus] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState("");
  const [processoId, setProcesoId] = useState(0);
  const refSelect = useRef();

  const formatFileSize = (sizeInBytes) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInBytes = file.size;
      // Convertendo bytes para kilobytes
      const fileSizeInKB = fileSizeInBytes / 1024;
      if (fileSizeInKB > 2048) {
        // 2MB em KB
        setError("O arquivo não pode ter mais de 2MB.");
      } else {
        setFileSize(fileSizeInKB);
        setError("");
      }
    }
  };
  let selectedValue = 0;
  function rendeComponent(e) {
    selectedValue = parseInt(e.target.value); // Convertendo o valor para inteiro
    console.log("SELECTED VALUE:", selectedValue);

    // Verificando o valor selecionado e realizando ações com base nisso
    switch (selectedValue) {
      case 1:
        console.log("CLICK FIRST", selectedValue);
        setVisible(!visible); // Alterando a visibilidade
        break;
      // Adicione mais casos para outras opções, se necessário
      case 2:
        Notify("CANCELADO COM SUCESO");
        break;
      case 3:
        NotifyInfo("EM DESENVOLVIMENTO");
        break;
      default:
        console.log("CLICK", selectedValue);
        break;
    }
  }

  function handleClick(id) {
    console.log("PROCESSO RECEBIDOP", id);
    setProcesoId((prev) => id);
    setVisible(!visible);
  }

  async function buscarTipoDeVisto() {
    setTipoDeVisto([
      {
        id: 1,
        nome: "Turismo"
      },
      {
        id: 2,
        nome: "Trabalho"
      }
    ]);
  }

  async function buscarEntidade() {
    setEntidade([
      {
        id: 1,
        nome: "MIREMET",
        status: [
          {
            id: 1,
            nome: "recusado"
          },
          {
            id: 2,
            nome: "recusado"
          }
        ]
      },
      {
        id: 2,
        nome: "SME"
      },
      {
        id: 3,
        nome: "Ss7(Cliente)"
      }
    ]);
  }

  async function buscarStatus() {
    setStatus([]);
  }

  useEffect(() => {
    buscarTipoDeVisto();
  }, []);

  useEffect(() => {
    buscarEntidade();
  }, []);

  useEffect(() => {
    buscarStatus();
  }, []);

  const api = useApi();
  async function ListarPedios() {
    await api.list("processos/status/1").then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setProcesos((prev) => response.data.processos);
      }
    });
  }

  async function registarVisto(data) {
    Notify("registado com sucesso");
  }

  useEffect(() => {
    ListarPedios();
  }, []);
  useEffect(() => {
    if (visible) {
      // Define o valor do CFormSelect como o valor atual selecionado
      refSelect.current.value = 0;
    }
  }, [visible, selectedValue]);
  const styleDropdown = {};
  const cardList = [
    {
      name: "Vistos Emitidos",
      amount: 3050,
      Icon: Group
    },
    {
      name: "Vistos Activos",
      amount: "76",
      Icon: AttachMoney
    },
    {
      name: "Vistos Expirados",
      amount: "76",
      Icon: AttachMoney
    },
    {
      name: "Vistos Cancelados",
      amount: "76",
      Icon: AttachMoney
    }
  ];
  return (
    <AppButtonRoot>
      <CModal
        fullscreen
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="FullscreenExample1"
      >
        <CModalHeader>
          <CModalTitle id="FullscreenExample1">CONTROLE DE VISTO</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <DetalheVisto></DetalheVisto>
        </CModalBody>
      </CModal>

      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "555", path: "/material" }, { name: "Buttons" }]} />
      </Box>
      <Box pt={4}>{/* <Campaigns /> */}</Box>
      <ContentBox className="analytics h-auto">
        <StatCardsLine cardList={cardList}></StatCardsLine>
      </ContentBox>
      <Box pt={3}></Box>
      <SimpleCard>
        <div className="w-100 d-flex  justify-content-between">
          <Title>Controlo de Visto</Title>
          <VerifiedUser></VerifiedUser>
        </div>
      </SimpleCard>
      <Box pt={3}></Box>
      <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
        <CContainer className="d-flex justify-content-between">
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <CDropdown>
              <CDropdownToggle>Entidade</CDropdownToggle>
              <CDropdownMenu container="body">
                <CDropdownItem href="#">Todos</CDropdownItem>
                {entidades?.map((entidade) => (
                  <CDropdownItem href="#">{entidade?.nome}</CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            <CDropdown style={styleDropdown}>
              <CDropdownToggle style={styleDropdown}>Tipo De Visto</CDropdownToggle>
              <CDropdownMenu style={styleDropdown}>
                <CDropdownItem href="#">Todos</CDropdownItem>
                {tipoDeVisto?.map((entidade) => (
                  <CDropdownItem href="#">{entidade?.nome}</CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            <CInputGroup>
              <CInputGroupText>
                {" "}
                <Search></Search>
              </CInputGroupText>
              <CFormInput placeholder="Nº do passaporte, "></CFormInput>
            </CInputGroup>
          </div>
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <StyledButton
              style={{ borderRadius: 0 }}
              onClick={() => handleFiltroStatus(0)}
              className="m-0"
              variant={filtroStatus === 0 ? "contained" : "outlined"}
              color="primary"
            >
              Todos
            </StyledButton>
            <StyledButton
              style={{ borderRadius: 0 }}
              className="m-0"
              onClick={() => handleFiltroStatus(1)}
              variant={filtroStatus === 1 ? "contained" : "outlined"}
              color="primary"
            >
              Submetidos
            </StyledButton>
            <StyledButton
              onClick={() => handleFiltroStatus(2)}
              style={{ borderRadius: 0, border: "none" }}
              className="m-0"
              variant={filtroStatus === 2 ? "contained" : "outlined"}
              color="primary"
            >
              Aprovados
            </StyledButton>{" "}
            <StyledButton
              onClick={() => handleFiltroStatus(3)}
              style={{ borderRadius: 3 }}
              className="m-0"
              variant={filtroStatus === 3 ? "contained" : "outlined"}
              color="primary"
            >
              Recusados
            </StyledButton>
          </div>
        </CContainer>
        <CardHeader>
          <Link to={"/processos/add"}></Link>
        </CardHeader>

        <Box overflow="auto">
          <ProductTable>
            <TableHead>
              <TableRow>
                <TableCell colSpan={4} sx={{ px: 3 }}>
                  Cliente
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Nº Passaporte
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Tipo de Visto
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  submetido em
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Status
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  data
                </TableCell>
                <TableCell colSpan={1} sx={{ px: 0 }}>
                  Acções
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {processos
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((processo, index) => (
                  <TableRow key={index} hover>
                    <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Paragraph>{rowsPerPage - page}</Paragraph>
                        <Paragraph>{processo?.requerente?.nome}</Paragraph>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      <Paragraph>{processo?.requerente?.passaporte}LDAO987LD32345H</Paragraph>
                    </TableCell>
                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      <Paragraph>{processo?.tipoVisto?.nome}Turismo</Paragraph>
                    </TableCell>
                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      <Paragraph>{new Date(processo?.createdAt).toDateString()}</Paragraph>
                    </TableCell>

                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      {processo?.status ? (
                        processo?.status?.id % 2 === 0 ? (
                          <Small bgcolor={bgSecondary}>{processo?.status?.name}submetido</Small>
                        ) : (
                          <Small bgcolor={bgPrimary}> {processo?.status?.name}Aprovado</Small>
                        )
                      ) : (
                        <Small bgcolor={bgError}> {processo?.status?.name} Recusado </Small>
                      )}
                    </TableCell>
                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      <Paragraph>{new Date(processo?.createdAt).toDateString()}</Paragraph>
                    </TableCell>

                    <TableCell>
                      <CFormSelect
                        ref={refSelect}
                        onChange={rendeComponent}
                        aria-describedby="exampleFormControlInputHelpInline"
                      >
                        <option value={0} selected>
                          Selecione
                        </option>
                        {[
                          { id: 1, name: "Visualizar" },
                          { id: 2, name: false ? "Renovar" : "Cancelar" },
                          { id: 3, name: "Gerar PDF" }
                        ].map((estado) => (
                          <option value={estado.id} key={estado.name}>
                            {estado.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </ProductTable>
          <TablePagination
            sx={{ px: 2 }}
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={processos?.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </Box>
      </Card>
    </AppButtonRoot>
  );
}

const processosList = [
  {
    id: 1,
    avatarUrl: "/assets/images/products/headphone-2.jpg",
    name: "Antonio Machado",
    createdAt: new Date().toLocaleDateString(),
    available: 15,
    status: {
      id: 1,
      name: "pendente"
    },
    tipo: {
      id: 1,
      name: "estudante"
    }
  },
  {
    id: 2,
    avatarUrl: "/assets/images/products/headphone-2.jpg",
    name: "Antonio Machado",
    createdAt: new Date().toLocaleDateString(),
    available: 15,
    status: {
      id: 2,
      name: "pendente"
    },
    tipo: {
      id: 2,
      name: "estudante"
    }
  },
  {
    id: 3,
    avatarUrl: "/assets/images/products/headphone-2.jpg",
    name: "Antonio Machado",
    createdAt: new Date().toLocaleDateString(),
    available: 15,
    status: {
      id: 3,
      name: "pendente"
    },
    tipo: {
      id: 3,
      name: "estudante"
    }
  }
];
