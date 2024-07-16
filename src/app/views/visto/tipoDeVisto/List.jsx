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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner
} from "@coreui/react";
import {
  Download,
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
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
// import { ChartLine } from "./ChartLine";
import { NotifyError } from "app/utils/toastyNotification";
import { formatDateDifference } from "app/utils/validate";

import { Solicitacao } from "./util";
import { StatusBadge, VistoBadge } from "./function";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
export default function List() {
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

  const [loading, setLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [totalSolicitacao, setTotalSolicitacao] = useState(0);
  const [totalSolicitacaoLocal, setTotalSolicitacaoLocal] = useState(0);
  const [totalSolicitacaoSite, setTotalSolicitacaoSite] = useState(0);

  const [statusId, setStatusId] = useState(null);
  const [tipoId, setTipoId] = useState(null);
  const [tipoVistoId, setTipoVistoId] = useState(null);
  const [fromSite, setFromSite] = useState(null);
  const [visibleAprovar, setVisibleAprovar] = useState(false);

  const [statusToUpdateId, setUpdateStatusId] = useState(null);
  const [pedidoId, setPedido] = useState(null);

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


  const filteredSolicitacoes = solicitacoes?.filter((solicitacao) =>
    solicitacao?.requerente?.nome.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  console.log("PEDISOS", solicitacoes);
  const styleDropdown = {};
  return (
    <AppButtonRoot>
      <div className="w-100 d-flex  justify-content-between">
        <h5>TIPOS DE VISTO ({totalSolicitacao}) </h5>

        <div role="group" aria-label="Basic radio toggle button group flex-0">
          <Link to={"/vistos/tipo/add"}>
            <StyledButton style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "5.45rem", borderRadius: 0 }} variant="outlined" color="success">
              Criar Novo
            </StyledButton>
          </Link>

        </div>
      </div>

      <Box pt={4}>{/* <Campaigns /> */}</Box>

      <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
        <CContainer className="d-flex justify-content-between">
        </CContainer>
        <CardHeader className="d-flex justify-content-center align-items-center">
          <TextField
            style={{ marginLeft: "-34%", fontSize: "0.54rem", scale: "0.67", borderRadius: 0 }}
            label="Pesquisar"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth

          />

        </CardHeader>

        <Box overflow="auto">
          <ProductTable>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} sx={{ px: 3 }}>
                  ID
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 2 }}>
                  Visto
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Validade
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Tempo de conclusãoa
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  data. criação
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

                        <TableCell sx={{ px: 2 }} align="left" colSpan={2}>
                          {VistoBadge({ status: solicitacao?.tipoVisto?.id })}
                        </TableCell>


                        <TableCell sx={{ px: 2 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: "0.60rem" }}>{4}</Paragraph>
                        </TableCell>
                        <TableCell sx={{ px: 2 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: "0.60rem" }}>{90}</Paragraph>
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
                                  `/vistos/tipo/${solicitacao?.id}/editar`
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

                            <option value={2}>Editar</option>
                            <option value={3}>Eliminar</option>
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
