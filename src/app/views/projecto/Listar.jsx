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
    AppRegistration,
    Download,
    FileOpen,
    Folder,
    FolderCopySharp,
    Person,
    PlusOne,
    Search,
    TroubleshootOutlined
} from "@mui/icons-material";
import {
    Avatar,
    Badge,
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

import { Projecto } from "./util";
import { StatusBadge, VistoBadge } from "./function";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Add from "@mui/icons-material/Add";
import useAuth from "app/hooks/useAuth";
import { ClockIcon } from "@mui/x-date-pickers";


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

    let { clienteId } = useParams();
    const { user } = useAuth();
    const { gestorId } = useParams();
    let gestorInternoId = undefined;
    let gestorExternoId = undefined;

    if (user.clienteId) {
        clienteId = user?.clienteId
        gestorExternoId = gestorId;

    }
    else {
        gestorInternoId = gestorId;
        gestorExternoId = gestorId;
    }


    // let clienteId=1
    const [loading, setLoading] = useState(false);
    const [projectos, setProjectos] = useState([]);
    const [order, setOrder] = useState("DESC");
    const [orderBy, setOrderBy] = useState("nome");
    const [date, setDate] = useState();


    const projecto = new Projecto();
    async function buscarProjectos() {
        let proj = await projecto.buscar({ clienteId, order, orderBy, date, gestorExternoId, gestorInternoId });
        setProjectos(prev => proj)
    }

    const filteredprojectoes = projectos?.filter((project) =>
        project?.nome.toLowerCase().includes(searchTerm?.toLowerCase())
    );



    useEffect(() => {
        buscarProjectos()
    }, [order, orderBy, clienteId, date, searchTerm])
    const styleDropdown = {};
    return (
        <AppButtonRoot>
            <div className="w-100 d-flex  justify-content-between">
                <strong>Lista de Projectos ({projectos?.length})  <Person></Person></strong>
                <div>
                    <Link
                        onClick={() => {
                            setVisibleMapa(prev => true)
                        }}
                    >

                    </Link>

                    <Link to={`/clientes/${clienteId}/projectos/add`}>
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
                            onChange={(event) => { setOrderBy(prev => event.target.value) }}
                            id="validationServer05"  >
                            <option value={"nome"} selected>
                                Ordenar por
                            </option>

                            <option value={"createdAt"}>
                                Data de Criação
                            </option>
                            <option value={"nome"}>
                                nome
                            </option>
                            <option value={"clienteId"}>
                                cliente
                            </option>


                        </CFormSelect>
                        <CFormSelect onChange={(event) => { setOrder(prev => event.target.value) }}
                            size="sm"
                            id="validationServer05"  >
                            <option value={"DESC"} selected>
                                ordenar
                            </option>

                            <option value={"ASC"}>
                                Ascendente
                            </option>
                            <option value={2}>
                                Decrescente
                            </option>

                        </CFormSelect>
                        <CFormInput onChange={(event) => setDate(prev => new Date(event.target.value))} size="sm" type="date"></CFormInput>
                    </div>
                </CardHeader>
                <Box overflow="auto">
                    <ProductTable>
                        <TableHead>
                            <TableRow>

                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Projecto
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    ges Interno
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    ges externo
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Tot.processos
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
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
                                    {filteredprojectoes
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((proj, index) => (
                                            <TableRow key={index} hover>


                                                <TableCell
                                                    colSpan={3}
                                                    align="left"
                                                    sx={{ px: 2, textTransform: "capitalize" }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={4}>

                                                        <Paragraph> <Folder fontSize="large" color={index % 2 == 0 ? "info" : "warning"}></Folder>   {proj?.nome}</Paragraph>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={3}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        <CBadge className={proj.gestorInterno?.nome ? "bg-warning text-black" : "bg-secondary text-black"} > {proj?.gestorInterno?.nome || "Não Definido"}  </CBadge>
                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={3}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        <CBadge className="bg-info text-white" > {proj?.gestorExterno?.nome?.toUpperCase() || "INDEFINIDO"}  </CBadge>
                                                    </Paragraph>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={3}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        <CBadge className="bg-danger text-white fs-6" > {proj?.processos?.length || 0}  </CBadge>

                                                    </Paragraph>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={3}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        <ClockIcon></ClockIcon>
                                                        {formatDateDifference(new Date(proj?.createdAt))}

                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={3}>
                                                    <CFormSelect
                                                        style={{ fontSize: "12px", minWidth: "6.45rem" }}
                                                        id="validationServer04"
                                                        onChange={async (e) => {
                                                            if (e.target.value == 1) {
                                                                return goto(
                                                                    `/clientes/${clienteId}/projectos/${proj?.id}/detalhar`
                                                                );
                                                            }
                                                            if (e.target.value == 2) {
                                                                return goto(
                                                                    `/projectos/${proj?.id}/editar/${proj?.clienteId}`
                                                                );
                                                            } <CCol>
                                                                <CFormSelect
                                                                    label="Categoria"
                                                                    aria-describedby="exampleFormControlInputHelpInline"
                                                                    text={
                                                                        errors.nacionalidade && (
                                                                            <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                                                                        )
                                                                    }
                                                                    required
                                                                    {...register("categoria")}
                                                                >
                                                                    <option selected aria-readonly>selecione a categoria</option>
                                                                    {[{ name: "1 vez" }, { name: "prorrogação" }]?.map((pais) => (
                                                                        <option value={pais.name} key={pais.name}>
                                                                            {pais.name}
                                                                        </option>
                                                                    ))}
                                                                </CFormSelect>
                                                                {errors.nacionalidade && (
                                                                    <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                                                                )}
                                                            </CCol>

                                                            if (e.target.value == 3) {
                                                                console.log("projecto Id", proj?.id);
                                                                setPedido(prev => proj?.id);
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
                        count={projectos?.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[50, 100, 200]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Página seguinte" }}
                        backIconButtonProps={{ "aria-label": "Página anterior" }}
                    />
                </Box>
                <Box pt={3}></Box>
            </Card>
        </AppButtonRoot >
    );
}
