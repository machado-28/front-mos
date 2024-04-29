import { Delete, Edit, FileDownload, Visibility } from "@mui/icons-material";
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
import "./../../processos/style.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "app/hooks/useApi";
import { useEffect } from "react";
import {
  CButton,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormSelect,
  CRow
} from "@coreui/react";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import { ContentBox } from "app/views/dashboard/Analytics";
import StatCards from "app/views/dashboard/shared/StatCards";
// import { ChartLine } from "../../processos/ChartLine";

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
export default function ListProcesso() {
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
  const [tipoDeVisto, setTipoDeVisto] = useState([]);
  const [entidades, setEntidade] = useState([]);
  const [status, setStatus] = useState([]);

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

  useEffect(() => {
    ListarPedios();
  }, []);

  const styleDropdown = {};
  return (
    <AppButtonRoot>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "M00", path: "/material" }, { name: "Bu8" }]} />
      </Box>
      <Box pt={4}>{/* <Campaigns /> */}</Box>

      <SimpleCard>
        <ContentBox className="analytics h-auto">
          <Grid container>
            <div className="w-100 d-flex align-items-center justify-content-center ">
              <StatCards></StatCards>
            </div>
          </Grid>
        </ContentBox>
      </SimpleCard>
      <Box pt={3}></Box>
      <SimpleCard>
        <div className="w-100 d-flex  justify-content-between">
          <Title>Lista Dos Processos</Title>
          <Link to={"/processos/add"}>
            <StyledButton variant="contained" color="success">
              Criar Novo
            </StyledButton>
          </Link>
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
              style={{ borderRadius: 0 }}
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
                        style={{ fontSize: "12px", minWidth: "6.45rem" }}
                        id="validationServer04"
                        required
                        sx={2}
                      >
                        <option>selecione</option>

                        <option>visualisar</option>
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
        <Box pt={3}></Box>
        {/* <ChartLine></ChartLine> */}
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
