import {
    CBadge,
    CButton,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CFormSelect,
    CFormSwitch,
    CFormTextarea,
    CInputGroup,
    CInputGroupText,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CSpinner
} from "@coreui/react";
import {
    Download,
    FolderCopySharp,
    PlusOne,
    Print,
    Search,
    TroubleshootOutlined
} from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    styled,
    useTheme
} from "@mui/material";
import { Paragraph } from "app/components/Typography";
import { useApi } from "app/hooks/useApi";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./style.css";
// import { ChartLine } from "./ChartLine";
import { NotifyError } from "app/utils/toastyNotification";
import { formatDateDifference } from "app/utils/validate";

import { Solicitacao } from "./util";
import { StatusBadge, VistoBadge } from "./function";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Add from "@mui/icons-material/Add";

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

    const addAprovarShema = z.object({

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

    const { passaporte: clientId = 1 } = useParams()
    // let clientId=1
    const [loading, setLoading] = useState(false);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [totalSolicitacao, setTotalSolicitacao] = useState(0);
    const [totalSolicitacaoLocal, setTotalSolicitacaoLocal] = useState(0);
    const [totalSolicitacaoSite, setTotalSolicitacaoSite] = useState(0);
    const [visibleMapa, setVisibleMapa] = useState(false);

    const [statusId, setStatusId] = useState(null);
    const [tipoId, setTipoId] = useState(null);
    const [tipoVistoId, setTipoVistoId] = useState(null);
    const [fromSite, setFromSite] = useState(null);
    const [visibleAprovar, setVisibleAprovar] = useState(false);

    const [statusToUpdateId, setUpdateStatusId] = useState(null);
    const [pedidoId, setPedido] = useState(null);
    const [descricao, setDescricao] = useState("");

    const buscarTotalSolicitacaoSite = async () => {
        setLoading((prev) => !prev);
        await api.listQuery(`pedidos?fromSite=${true}`).then((resp) => {
            console.log("pedidos", resp);
            setTotalSolicitacaoSite(prev => resp?.data?.total || 0)
        })
        setLoading((prev) => !prev);
    }

    const buscarTotalSolicitacaoLocal = async () => {
        setLoading((prev) => !prev);
        await api.listQuery(`pedidos?fromSite=${false || null}`).then((resp) => {
            console.log("pedidos", resp);
            setTotalSolicitacaoLocal(prev => resp?.data?.total || 0)
        })
        setLoading((prev) => !prev);
    }

    const buscarTotalSolicitacaoVisto = async ({ vistoId }) => {
        setLoading((prev) => !prev);
        await api.listQuery(`pedidos?tipoVistoId=${vistoId}`).then((resp) => {
            console.log("pedidos", resp);
            if (resp.request?.status === 200) {
                setSolicitacoes(prev => resp?.data?.pedidos || []);
            }
        });

        setLoading((prev) => !prev);
    }

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

    async function ListarSolicitacoes() {
        try {
            setLoading((prev) => !prev);
            await api
                .listQuery(`pedidos?statusId=${statusId}&tipoId=${tipoId}&tipoVistoId=${tipoVistoId}&fromSite=${fromSite}`)
                .then((resp) => {
                    console.log("pedidos", resp);
                    const solicitacoes = resp?.data?.pedidos || [] || [];
                    const total = resp?.data?.total || 0;
                    console.log(solicitacoes);
                    if (resp.request?.status === 200) {
                        setSolicitacoes(prev => resp?.data?.pedidos || []);
                        setTotalSolicitacao(prev => resp?.data?.total)
                    }

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
        await api.documento("pedidos/pdf/", solicitacao).finally(() => {
            setLoadingDocumento((prev) => !prev);
        });
    }
    async function gerarInd(solicitacao) {
        setLoadingDocumento((prev) => !prev);
        await api.documento("pedidos/pdf/", solicitacao).finally(() => {
            setLoadingDocumento((prev) => !prev);
        });
    }
    console.log("ERRO FORM", errors);
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
        setLoading(prev => !prev);
    }

    const gerarMapa = async () => {
        setLoading(prev => true)
        await api.add("pdf").then(res => {
            setLoading(prev => false);
            console.log(res);
        }).catch((err) => {
            console.log(err);
            setLoading(prev => false);
        });
    }
    const filteredSolicitacoes = solicitacoes?.filter((solicitacao) =>
        solicitacao?.requerente?.nome.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    console.log("PEDIDOS", solicitacoes);
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
                        <CModalTitle id="VerticallyCenteredExample">Emissão de Mapa de Solicitações</CModalTitle>
                    </CModalHeader>
                    <CForm onSubmit={handleSubmit(gerarMapa)}>
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

                                <CFormSelect size="sm"
                                    id="validationServer06" label="Status:">
                                    <option>
                                        Aprovados
                                    </option>
                                    <option>
                                        Cancelados
                                    </option>
                                    <option>
                                        Recusados
                                    </option>
                                    <option>
                                        Finalizado
                                    </option>
                                </CFormSelect>
                            </div>
                            <div className="d-flex justify-content-center align-items-center " role="group" aria-label="Basic radio toggle button group flex-0">
                                <CFormInput size="sm" label={"Desde"} type="date"></CFormInput>
                                <CFormInput size="sm" label={"Até"} type="date"></CFormInput>
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
            <>

                <CModal
                    alignment="center"
                    visible={visibleAprovar}
                    onClose={() => setVisibleAprovar(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">Aprovação de Solicitação</CModalTitle>
                    </CModalHeader>
                    <CForm onSubmit={handleSubmit(actualizarStatus)}>
                        <CModalBody>
                            <CFormTextarea {...register("descricao")}
                                text={
                                    <>{errors?.descricao && <p className="text-error">{errors?.descricao?.message}</p>}</>
                                }
                            ></CFormTextarea>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisibleAprovar(false)}>
                                Cancelar
                            </CButton>
                            {loading ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <CButton type="submit" color="primary">
                                    Enviar
                                </CButton>
                            )}
                        </CModalFooter>
                    </CForm>
                </CModal>
            </>

            <div className="w-100 d-flex  justify-content-between">
                <strong>Lista de Processos ({totalSolicitacao})  <FolderCopySharp></FolderCopySharp></strong>
                <div>
                    <Link
                        onClick={() => {
                            setVisibleMapa(prev => true)
                        }}
                    >
                        Mapa <Print></Print>
                    </Link>

                    <Link to={`/cliente/${clientId}/tecnico/2/processo/add`}>
                        <StyledButton className="d-flex align-content-center" style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "6.45rem", borderRadius: 0 }} variant="outlined" color="success">
                            Criar Novo <Add></Add>
                        </StyledButton>
                    </Link>
                </div>

            </div>

            <Box pt={4}>{/* <Campaigns /> */}</Box>

            <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
                <CContainer className="d-flex justify-content-between">
                </CContainer>
                <CardHeader className="d-flex justify-content-center align-items-center">
                    <CInputGroup size="sm">
                        <CInputGroupText size="sm">
                            <Search size="sm"></Search>
                        </CInputGroupText>
                        <CFormInput
                            type="text"
                            size="sm"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Buscar..."
                        />
                    </CInputGroup>
                    <div className="d-flex w-100   "  >


                        <CFormSelect size="sm"
                            id="validationServer06" label="Tipo:">
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

                        <CFormInput size="sm" type="date"></CFormInput>
                        <CFormSelect
                            size="sm"
                            id="validationServer05" label="Faze">
                            <option>
                                MIREX
                            </option>
                            <option value={1}>
                                MIREMPET
                            </option>
                            <option value={2}>
                                SME
                            </option>
                        </CFormSelect>
                        <CFormSelect
                            size="sm"
                            id="validationServer05" label="Status">
                            <option>
                                Tradução
                            </option>
                            <option value={1}>
                                Cancelado
                            </option>
                            <option value={2}>
                                Finalizado
                            </option>
                            <option value={2}>
                                Pendente
                            </option>
                        </CFormSelect>
                    </div>


                </CardHeader>

                <Box overflow="auto">
                    <ProductTable>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} sx={{ px: 3 }}>
                                    Cód.
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 2 }}>
                                    Nome
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Função
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 2 }}>
                                    Cargo
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 2 }}>
                                    Visto
                                </TableCell>

                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    dat.Mob
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    dat.entrega
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
                                                    <Paragraph style={{ fontSize: "0.60rem" }}>{solicitacao?.numero}</Paragraph>
                                                </TableCell>

                                                <TableCell
                                                    colSpan={3}
                                                    align="left"
                                                    sx={{ px: 2, textTransform: "capitalize" }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Paragraph style={{ fontSize: fSize }}>
                                                            {solicitacao?.requerente?.nome}
                                                        </Paragraph>
                                                    </Box>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {solicitacao?.requerente?.profissao}
                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {solicitacao?.tipo?.nome}
                                                    </Paragraph>
                                                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>

                                                    </TableCell>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        Turismo
                                                    </Paragraph>
                                                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>

                                                    </TableCell>
                                                </TableCell>


                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {formatDateDifference(new Date(solicitacao?.createdAt))}
                                                    </Paragraph>
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
                                                                    `/cliente/:clienetId/processo/:id/editar`
                                                                );
                                                            }
                                                            if (e.target.value == 1) {
                                                                return goto(
                                                                    `/cliente/2/processo/2/detalhar`
                                                                );
                                                            }

                                                            if (e.target.value == 3) {
                                                                console.log("SOLICI ID", solicitacao?.id);
                                                                setPedido(prev => solicitacao?.id);
                                                                setUpdateStatusId(prev => 3);
                                                                setVisibleAprovar((prev) => true);

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
