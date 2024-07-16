import {
    CAvatar,
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
    CRow,
    CSpinner
} from "@coreui/react";
import {
    Download,
    FolderCopySharp,
    Image,
    Person,
    PlusOne,
    Search,
    TroubleshootOutlined
} from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    Switch,
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

import { Cliente } from "./util";
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
    const clienteClass = new Cliente()

    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState([]);

    const { palette } = useTheme();
    const bgError = palette.error.main;
    const bgPrimary = palette.primary.main;
    const bgSecondary = palette.secondary.main;
    const [page, setPage] = useState(0);
    const [OrigemId, setOrigemId] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [visibleAprovar, setVisibleAprovar] = useState(false);
    const [LoadingAprovar, setLoadingAprovar] = useState(false);
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

    const { passaporte: clientId = 1 } = useParams()
    // let clientId=1

    async function actualizarStatus(data) {
        setLoading(prev => !prev)
        data.statusId = statusToUpdateId;
        data.pedidoId = pedidoId
        console.log("DATAFORM", data);
        const c_pedido = new Cliente();
        await c_pedido.actualizarStatus(data);
        setLoading(prev => !prev)
        window.location.reload()
    }

    async function ListarClientes() {
        try {
            setLoading((prev) => true);
            const data = await clienteClass.buscarClientes()
            console.log("MEUS CLIENTES", data);
            setClientes(data)

        } catch (error) {
            console.log(error);
            NotifyError(error)
        }
        finally {
            setLoading((prev) => false);
        }
    }

    useEffect(() => {
        ListarClientes();

    }, []);



    const filteredClientes = clientes?.filter((cliente) =>
        cliente?.nome.toLowerCase().includes(searchTerm?.toLowerCase())
    );


    const styleDropdown = {};
    return (
        <AppButtonRoot>
            <>
                <CModal
                    alignment="center"
                    visible={visibleAprovar}
                    onClose={() => setVisibleAprovar(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">Cliente status</CModalTitle>
                    </CModalHeader>
                    <CForm onSubmit={handleSubmit(actualizarStatus)}>
                        <CModalBody>
                            <CRow>
                                <CInputGroup>
                                    <Switch name="activo"></Switch>
                                </CInputGroup>

                            </CRow>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisibleAprovar(false)}>
                                Cancelar
                            </CButton>
                            {LoadingAprovar ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <CButton type="submit" color="primary">
                                    Actualizar
                                </CButton>
                            )}
                        </CModalFooter>
                    </CForm>
                </CModal>
            </>

            <div className="w-100 d-flex  justify-content-between">
                <strong>Clientes   ({clientes?.length})   <Person></Person> </strong>
                <div>
                    <Link
                        onClick={() => {
                            setVisibleMapa(prev => true)
                        }}
                    >

                    </Link>

                    <Link to={"/clientes/add"}>
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
                            id="validationServer05"  >
                            <option selected>
                                Ordenar por
                            </option>

                            <option value={1}>
                                Data de Criação
                            </option>
                            <option value={2}>
                                nome
                            </option>

                        </CFormSelect>
                        <CFormSelect size="sm"
                            id="validationServer05"  >
                            <option selected>
                                Orientação
                            </option>

                            <option value={1}>
                                Ascendente
                            </option>
                            <option value={2}>
                                Decrescente
                            </option>

                        </CFormSelect>
                        <CFormInput size="sm" type="date"></CFormInput>
                    </div>

                </CardHeader>

                <Box overflow="auto">
                    <ProductTable>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} sx={{ px: 3 }}>
                                    Id.
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Nome
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Empresa
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 0 }}>
                                    Email
                                </TableCell>

                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    Tel.1
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    Tel.2
                                </TableCell>

                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    Status
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    Dat. registo
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
                                    {filteredClientes
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((cliente, index) => (
                                            <TableRow key={index} hover>

                                                <TableCell sx={{ px: 3 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: "0.60rem" }}>{cliente?.id}</Paragraph>
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
                                                <TableCell
                                                    colSpan={3}
                                                    align="left"
                                                    sx={{ px: 2, textTransform: "capitalize" }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Paragraph style={{ fontSize: fSize }}>
                                                            {cliente?.nomeEmpresa}
                                                        </Paragraph>
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    colSpan={3}
                                                    align="left"
                                                    sx={{ px: 2, textTransform: "capitalize" }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Paragraph style={{ fontSize: fSize }}>
                                                            {cliente?.email}
                                                        </Paragraph>
                                                    </Box>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {cliente?.telefone1}
                                                    </Paragraph>

                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {cliente?.telefone2}
                                                    </Paragraph>

                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>

                                                        <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-danger text-black"}> {cliente?.activo == true ? "activo" : "inactivo"}</CBadge>
                                                    </Paragraph>

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
                                                        onChange={async (e) => {
                                                            if (e.target.value == 1) {
                                                                return goto(
                                                                    `/clientes/${clientId}/detail`
                                                                );
                                                            }
                                                            if (e.target.value == 2) {
                                                                return goto(
                                                                    `/clientes/${cliente?.id}/editar`
                                                                );
                                                            }

                                                            if (e.target.value == 3) {


                                                                setVisibleAprovar(prev => true);


                                                            }



                                                        }}

                                                        sx={0}
                                                    >
                                                        <option>selecione</option>
                                                        <option value={1}>visualisar</option>
                                                        <option value={2}>Editar</option>
                                                        <option value={3}>aprovar/recusar</option>


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
