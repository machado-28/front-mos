import {
  AttachMoney,
  Delete,
  Download,
  Edit,
  FileDownload,
  Group,
  Search,
  Store,
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
  Button,
  TablePagination,
  Icon,
  TextField as MuiTextField,
  Grid,
  TextField,
} from "@mui/material";
import { Paragraph } from "app/components/Typography";
import "./style.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "app/hooks/useApi";
import { useEffect } from "react";
import {
  CBadge,
  CButton,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CFormText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner
} from "@coreui/react";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import { ContentBox } from "app/views/dashboard/Analytics";
import StatCards from "app/views/dashboard/shared/StatCards";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { ChartLine } from "./ChartLine";
import StatCardsLine from "app/views/dashboard/shared/StatCardsLine";
import { NotifyError } from "app/utils/toastyNotification";
import { formatDateDifference } from "app/utils/validate";
import paletaCor from "app/utils/paletaCor";

import { TextValidator } from "react-material-ui-form-validator";
import { Solicitacao } from "./util";

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
  fontSize: "1.4rem",
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
export default function Listar() {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const [page, setPage] = useState(0);
  const [OrigemId, setOrigemId] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const goto = useNavigate();

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const api = useApi();

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [filtroStatus, setFiltroStatus] = useState(0);

  function handleFiltroStatus(e) {
    setFiltroStatus((prev) => e);
  }
  const fSize = "0.775rem";
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1)
  }));

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [totalSolicitacao, setTotalSolicitacao] = useState(0);
  const [totalSolicitacaoLocal, setTotalSolicitacaoLocal] = useState(0);
  const [totalSolicitacaoSite, setTotalSolicitacaoSite] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [statusId, setStatusId] = useState(null);
  const [tipoId, setTipoId] = useState(null);
  const [tipoVistoId, setTipoVistoId] = useState(null);
  const [fromSite, setFromSite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleMapa, setVisibleMapa] = useState(false);

  const addAprovarShema = z.object({
    descricao: z.string()
  });
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addAprovarShema),
    shouldFocusError: true,
    progressive: true
  });

  async function actualizarStatus(data) {
    setLoading(prev => !prev)
    data.statusId = statusToUpdateId;
    data.pedidoId = pedidoId
    console.log("DATAFORM", data);
    const c_pedido = new Solicitacao();
    await c_pedido.actualizarStatus(data);
    setLoading(prev => !prev)
    window.location.reload()
  }
  const buscarSolicitacaoSite = async () => {
    setLoading((prev) => !prev);
    await api.listQuery("solicitacoes/site").then((resp) => {
      console.log("solicitacoes", resp);
      if (resp.request?.status === 200) {
        setSolicitacoes(prev => resp?.data?.solicitacoes || []);
      }
      setSolicitacoes(prev => []);
    })
    setLoading((prev) => !prev);
  }
  const buscarTotalSolicitacaoSite = async () => {
    setLoading((prev) => !prev);
    await api.listQuery("solicitacoes/local").then((resp) => {
      console.log("solicitacoes", resp);
      setTotalSolicitacaoSite(prev => resp?.data?.total || 0)
    })
    setLoading((prev) => !prev);
  }
  const buscarSolicitacaoLocal = async () => {
    setLoading((prev) => !prev);
    await api.listQuery("solicitacoes/site").then((resp) => {
      console.log("solicitacoes", resp);
      if (resp.request?.status === 200) {
        setSolicitacoes(prev => resp?.data?.solicitacoes || []);
      }
    })
    setLoading((prev) => !prev);
  }

  const buscarTotalSolicitacaoLocal = async () => {
    setLoading((prev) => !prev);
    await api.listQuery("solicitacoes/local").then((resp) => {
      console.log("solicitacoes", resp);
      setTotalSolicitacaoLocal(prev => resp?.data?.total || 0)
    })
    setLoading((prev) => !prev);
  }

  const buscarTotalSolicitacaoVisto = async ({ vistoId }) => {
    setLoading((prev) => !prev);
    await api.listQuery(`solicitacoes/visto/${vistoId}`).then((resp) => {
      console.log("solicitacoes", resp);
      if (resp.request?.status === 200) {
        setSolicitacoes(prev => resp?.data?.solicitacoes || []);
      }
    });

    setLoading((prev) => !prev);
  }

  async function ListarSolicitacoes() {
    try {
      setLoading((prev) => !prev);
      await api
        .listQuery(`pedidos/?statusId=${statusId}&tipoId=${tipoId}&tipoVistoId=${tipoVistoId}&fromSite=${fromSite}`)
        .then((resp) => {
          console.log("Solicitacoes", resp);
          const solicitacoes = resp?.data?.solicitacoes || [] || [];
          const total = resp?.data?.total || 0;
          console.log(solicitacoes);
          if (resp.request?.status === 200) {
            setSolicitacoes(prev => resp?.data?.solicitacoes || []);
            setTotalSolicitacao(prev => resp?.data?.total)
          }
          setSolicitacoes(prev => []);
        })
        .finally(() => {
          setLoading((prev) => !prev);
        });
    } catch (error) {
      console.log(error);
      NotifyError(error)
    }
  }

  useEffect(() => {
    ListarSolicitacoes();

  }, [totalSolicitacao,]);

  useEffect(() => {
    buscarTotalSolicitacaoLocal();

  }, [totalSolicitacaoLocal,])
  useEffect(() => {
    buscarTotalSolicitacaoSite();
  }, [totalSolicitacaoSite,]);

  async function gerarIndividualPDF(solicitacao) {
    setLoadingDocumento((prev) => !prev);
    await api.documento("solicitacoes/pdf/", solicitacao).finally(() => {
      setLoadingDocumento((prev) => !prev);
    });
  }
  async function gerarInd(solicitacao) {
    setLoadingDocumento((prev) => !prev);
    await api.documento("solicitacoes/pdf/", solicitacao).finally(() => {
      setLoadingDocumento((prev) => !prev);
    });
  }
  const c_solicitacao = new Solicitacao()
  async function buscarEntidade() {
    try {
      await api
        .listQuery(`fazes`)
        .then((resp) => {
          if (resp.request?.status !== 200) {
            return NotifyError("algo deu errado:" + resp.request?.status);
          }
          const entidades = resp?.data?.fazes || [];
          console.log("Entidades", resp);
          setEntidade(entidades);
        })
        .catch((err) => {
          return NotifyError("algo deu errado:" + err);
        });
    } catch (error) {
      return NotifyError("algo deu errado:" + error);
    }
  }
  const buscarSolicitacaoPorTipo = async ({ tipoId }) => {
    setLoading(prev => !prev)
    const c_solicitacao = new Solicitacao()
    await c_solicitacao.buscarSolicitacaoPorTipo({ tipoId }).then((soli) => {
      setSolicitacoes(prev => soli)
    });
    setLoading(prev => !prev)
  }
  const buscarSolicitacaoPorVisto = async ({ vistoId }) => {
    setLoading(prev => !prev)
    const c_solicitacao = new Solicitacao()
    await c_solicitacao.buscarSolicitacaoPorVisto({ vistoId }).then((soli) => {
      setSolicitacoes(prev => soli)
    });
    setLoading(prev => !prev)
  }

  const filteredSolicitacoes = solicitacoes?.filter((solicitacao) =>
    solicitacao?.passaporte.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const styleDropdown = {};
  return (
    <AppButtonRoot>
      <>

        <CModal
          alignment="center"
          visible={visibleMapa}
          onClose={() => setVisibleMapa(false)}
          aria-labelledby="VerticallyCenteredExample"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">Emissão de Mapa de Processos</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit(actualizarStatus)}>
            <CModalBody>
              <div className="d-flex justify-content-center align-items-center " role="group" aria-label="Basic radio toggle button group flex-0">
                <CFormSelect onChange={async (event) => await buscarSolicitacaoPorTipo({ tipoId: event.target.value })} style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }}
                  id="validationServer05" label="Tipo: ">

                  <option value={1}>
                    Turismo
                  </option>
                  <option value={2}>
                    Trabalho
                  </option>
                  <option value={3}>
                    Curta Duração
                  </option>
                  <option value={4}>
                    Fronteira
                  </option>
                </CFormSelect>
                <CFormSelect style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }}
                  id="validationServer06" label="Projecto:">
                  <option>
                    CLOV3
                  </option>
                  <option>
                    SLGC
                  </option>
                  <option>
                    AGOGO
                  </option>
                </CFormSelect>
                <CFormSelect style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }}
                  id="validationServer06" label="Faze">
                  <option>
                    Tradução
                  </option>
                  <option>
                    Transição
                  </option>
                  <option>
                    MIREMPET
                  </option>
                  <option>
                    SME
                  </option>
                </CFormSelect>
                <CFormSelect style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }}
                  id="validationServer06" label="Status">
                  <option>
                    Em andamento
                  </option>
                  <option>
                    Aprovado
                  </option>
                  <option>
                    Recusado
                  </option>
                  <option>
                    Cancelado
                  </option>
                  <option>
                    Finalizado
                  </option>

                </CFormSelect>
              </div>
              <div className="d-flex justify-content-center align-items-center " role="group" aria-label="Basic radio toggle button group flex-0">
                <CFormInput style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }} label={"Desde"} type="date"></CFormInput>
                <CFormInput style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }} label={"Até"} type="date"></CFormInput>
              </div>


            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleMapa(false)}>
                Cancelar
              </CButton>
              {loading ? (
                <CSpinner></CSpinner>
              ) : (
                <CButton type="submit" color="primary">
                  Gerar
                </CButton>
              )}
            </CModalFooter>
          </CForm>
        </CModal>
      </>
      <div className="w-100 d-flex  justify-content-between">
        <Title>LISTA DE PROCESSOS ({totalSolicitacao}) </Title>

        <div role="group" aria-label="Basic radio toggle button group flex-0">
          <StyledButton
            style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "5.45rem", borderRadius: 0 }}
            onClick={async () => { setOrigemId((prev) => 0); await ListarSolicitacoes() }}
            className="m-0"
            variant={OrigemId === 0 ? "contained" : "outlined"}
            color="primary"
          >
            TODAS ({totalSolicitacao})
          </StyledButton>
          <StyledButton
            style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "5.45rem", borderRadius: 0 }}
            onClick={async (e) => { setOrigemId((prev) => 1); setStatusId(prev => null) }}
            className="m-0"
            variant={OrigemId === 1 ? "contained" : "outlined"}
            color="primary"
          >
            TRADUÇÃO({totalSolicitacao})
          </StyledButton>
          <StyledButton
            style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "5.45rem", borderRadius: 0 }}
            onClick={async () => { setOrigemId((prev) => 2); await buscarSolicitacaoSite() }}
            className="m-0"
            variant={OrigemId === 2 ? "contained" : "outlined"}
            color="primary"
          >
            TRANSIÇÃO({totalSolicitacaoLocal})
          </StyledButton>
          <StyledButton
            style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "5.45rem", borderRadius: 0 }}
            onClick={async () => { setOrigemId((prev) => 2); await buscarSolicitacaoSite() }}
            className="m-0"
            variant={OrigemId === 2 ? "contained" : "outlined"}
            color="primary"
          >
            MIREMPET({totalSolicitacaoLocal})
          </StyledButton>
          <StyledButton
            style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "5.45rem", borderRadius: 0 }}
            onClick={async () => { setOrigemId((prev) => 2); await buscarSolicitacaoSite() }}
            className="m-0"
            variant={OrigemId === 2 ? "contained" : "outlined"}
            color="primary"
          >
            SME({totalSolicitacaoLocal})
          </StyledButton>

          <Link
            onClick={() => {
              setVisibleMapa(prev => true)
            }}
          >
            <StyledButton style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "9.45rem", borderRadius: 0 }} variant="outlined" color="info">
              Gerar Mapa (PDF) <Download style={{ fontSize: "0.54rem", }}></Download>
            </StyledButton>
          </Link>
          <div>
          </div>
        </div>
      </div>

      <Box pt={4}>{/* <Campaigns /> */}</Box>

      <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
        <CContainer className="d-flex justify-content-between">
        </CContainer>
        <CardHeader className="d-flex justify-content-center align-items-center">
          <TextField
            style={{ marginLeft: "-13%", fontSize: "0.54rem", scale: "0.67", borderRadius: 0 }}
            label="Pesquisar"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth

          />
          <div className="d-flex justify-content-center align-items-center " role="group" aria-label="Basic radio toggle button group flex-0">
            <CFormSelect onChange={async (event) => await c_solicitacao.buscarSolicitacaoPorStatus({ statusId: event.target.value })} style={{ fontSize: "0.74rem", minWidth: "2.45rem" }}
              id="validationServer05" label=" Projecto:">
              <option>
                GOV
              </option>
              <option value={1}>
                GOVS
              </option>

            </CFormSelect>
            <CFormSelect onChange={async (event) => await buscarSolicitacaoPorTipo({ tipoId: event.target.value })} style={{ fontSize: "0.74rem", minWidth: "2.45rem" }}
              id="validationServer05" label="Tipo:">
              <option value={0}>
                Totos
              </option>
              <option value={1}>
                1ª vez
              </option>
              <option value={2}>
                Prorrogação
              </option>
            </CFormSelect>
            <CFormSelect style={{ fontSize: "0.74rem", minWidth: "2.45rem" }}
              id="validationServer06" label="Visto:">
              <option>
                Fronteira
              </option>
              <option>
                Turismo
              </option>
              <option>
                Trabalho
              </option>
            </CFormSelect>
            <CFormSelect onChange={async (event) => await c_solicitacao.buscarSolicitacaoPorStatus({ statusId: event.target.value })} style={{ fontSize: "0.74rem", minWidth: "2.45rem" }}
              id="validationServer05" label="Status:">
              <option>
                Todos
              </option>
              <option value={1}>
                Aprovado
              </option>
              <option value={2}>
                Recusado
              </option>
              <option value={2}>
                Cancelado
              </option>
            </CFormSelect>
          </div>
        </CardHeader>

        <Box overflow="auto">
          <ProductTable>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} sx={{ px: 3 }}>
                  Nº Pass.
                </TableCell>
                <TableCell colSpan={3} sx={{ px: 2 }}>
                  Cliente
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Via
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Visto
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Status
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  dat.
                </TableCell>
                <TableCell colSpan={1} sx={{ px: 0 }}>
                  Acções
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <CSpinner></CSpinner>
              ) : (
                <>
                  {filteredSolicitacoes
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((solicitacao, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ px: 3 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: "0.60rem" }}>{solicitacao?.passaporte}</Paragraph>
                        </TableCell>

                        <TableCell
                          colSpan={3}
                          align="left"
                          sx={{ px: 2, textTransform: "capitalize" }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Paragraph style={{ fontSize: fSize }}>
                              {solicitacao?.nome}
                            </Paragraph>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: fSize }}>
                            {solicitacao?.profissao}
                          </Paragraph>
                        </TableCell>

                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          <CFormSwitch defaultValue={solicitacao?.activo} onChange={async () => {

                          }} ></CFormSwitch>
                          <CBadge className={solicitacao?.activo === true ? "bg-success" : "bg-danger"}  > {solicitacao?.activo === true ? "Activo" : "Inactivo"} </CBadge>
                        </TableCell>
                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: fSize }}>
                            {formatDateDifference(new Date(solicitacao?.createdAt))}
                          </Paragraph>
                        </TableCell>
                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          <CFormSelect
                            style={{ fontSize: "12px", minWidth: "6.45rem" }}
                            id="validationServer04"
                            onChange={async (e) => {
                              if (e.target.value == 2) {
                                return goto(
                                  `/solicitacoes/editar/${solicitacao?.passaporte}`
                                );
                              }


                              if (e.target.value == 3) {
                                setOpenAprovar((prev) => true);
                              }
                              if (e.target.value == 4) {
                                setOpenRecusar((prev) => !true);
                              }

                              console.log(e.target.value);
                            }}

                            sx={0}
                          >
                            <option>selecione</option>
                            <option value={1}>visualisar</option>
                            <option value={2}>Editar</option>
                            <option value={3}>Aprovar</option>
                            <option value={4}>Recusar</option>
                          </CFormSelect>
                        </TableCell>

                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </ProductTable>
          <TablePagination
            sx={{ px: 2 }}
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={solicitacoes?.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </Box>
        <Box pt={3}></Box>
      </Card>
    </AppButtonRoot>
  );
}
