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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { H3, Paragraph } from "app/components/Typography";
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
    CFormText,
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
export default function ListarNovo() {
    const { palette } = useTheme();
    const bgError = palette.error.main;
    const bgPrimary = palette.primary.main;
    const bgSecondary = palette.secondary.main;
    const [page, setPage] = useState(0);
    const [statusId, setStatusId] = useState(0);
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

    const [loadCliente, setLoadingCliente] = useState(false);

    const [clientes, setClientes] = useState([]);
    const [totalClientes, setTotalClientes] = useState(0);
    const [totalClientesActivos, setTotalClientesActivos] = useState(0);
    const [totalClientesInactivos, setTotalClientesInactivos] = useState(0);


    const buscarClientesActivos = async () => {
        await api.listQuery("clientes/novos/?status=activo").then((resp) => {
            console.log("CLIENTES", resp);
            setClientes(prev => resp?.data?.clientes);
            setTotalClientesActivos(prev => resp?.data?.total || 0)
        })
    }

    const buscarClientesInaActivos = async () => {
        await api.listQuery("clientes/novos?status=inactivo").then((resp) => {
            console.log("CLIENTES", resp);
            setClientes(prev => resp?.data?.clientes);
            setTotalClientesInactivos(prev => resp?.data?.total)
        })
    }
    async function ListarClientes() {
        try {
            setLoadingCliente((prev) => !prev);
            await api
                .listQuery(`clientes/novos`)
                .then((resp) => {
                    console.log("Clientes", resp);
                    const clientes = resp?.data?.clientes || [];
                    const total = resp?.data?.total || 0;
                    console.log(clientes);
                    setClientes(clientes);
                    setTotalClientes()
                })
                .finally(() => {
                    setLoadingCliente((prev) => !prev);
                });
        } catch (error) {
            console.log(error);
            NotifyError(error)
        }
    }

    useEffect(() => {
        ListarClientes();
        buscarClientesActivos();
        buscarClientesInaActivos();
    }, [totalClientes, totalClientesActivos, totalClientesInactivos]);

    async function gerarPDF() {
        setLoadingDocumento((prev) => !prev);
        await api.documento("gerarPDF/pedidos/list", pedidos).finally(() => {
            setLoadingDocumento((prev) => !prev);
        });
    }
    async function buscarEntidade() {
        try {
            await api
                .listQuery(`fazes`)
                .then((resp) => {
                    if (resp.status !== 200) {
                        return NotifyError("algo deu errado:" + resp.status);
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

    const filteredClientes = clientes?.filter((cliente) =>
        cliente?.passaporte.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const styleDropdown = {};
    return (
        <AppButtonRoot>
            <div className="w-100 d-flex  justify-content-between">
                <Title>LISTA DE NOVOS CLIENTES ({totalClientes||0}) </Title>

                <div role="group" aria-label="Basic radio toggle button group flex-0">

                    <Link to={"/clientes/add"}>
                        <StyledButton variant="outlined" color="success">
                            Criar Novo
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
                <CardHeader>
                    <TextField
                        label="Pesquisar"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                        margin="normal"
                    />
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
                                    Profissão
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    Status
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    dat.registo
                                </TableCell>
                                <TableCell colSpan={1} sx={{ px: 0 }}>
                                    Acções
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loadCliente ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <>
                                    {filteredClientes
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((cliente, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: "0.60rem" }}>{cliente?.passaporte}</Paragraph>
                                                </TableCell>

                                                <TableCell
                                                    colSpan={3}
                                                    align="left"
                                                    sx={{ px: 2, textTransform: "capitalize" }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Paragraph style={{ fontSize: fSize }}>
                                                            {cliente?.nome}
                                                        </Paragraph>
                                                    </Box>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {cliente?.profissao}
                                                    </Paragraph>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <CBadge className={cliente?.activo === true ? "bg-success" : "bg-danger"}  > {cliente?.activo === true ? "Activo" : "Inactivo"} </CBadge>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {formatDateDifference(new Date(cliente?.createdAt))}
                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <CFormSelect
                                                        style={{ fontSize: "12px", minWidth: "6.45rem" }}
                                                        id="validationServer04"
                                                        onChange={(e) => {
                                                            if (e.target.value == 1) {
                                                                return goto(
                                                                    `/clientes/detalhe/${cliente?.id}?_statusId=${cliente?.statusActualId}&_fazeId=${processo?.fazeActualId}`
                                                                );
                                                            }

                                                            if (e.target.value == 3) {
                                                                setOpenRecusar((prev) => true);
                                                            }
                                                            if (e.target.value == 2) {
                                                                setOpenAprovar((prev) => true);
                                                            }
                                                            console.log(e.target.value);
                                                        }}
                                                        sx={0}

                                                    >
                                                        <option>selecione</option>
                                                        <option value={1}>visualisar</option>
                                                        <option value={2}>Editar</option>
                                                        <option value={3}>{cliente?.activo === true ? "Desactivar" : "Activar"}</option>
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
                        count={clientes?.length}
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
