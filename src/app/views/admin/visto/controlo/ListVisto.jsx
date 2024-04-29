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
  TablePagination,
  Icon,
  Grid,
  TextField
} from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { H3, Paragraph } from "app/components/Typography";
import "./style.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  CFormInput,
  CFormSelect,
  CFormText,
  CRow,
  CSpinner
} from "@coreui/react";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import { ContentBox } from "app/views/dashboard/Analytics";
import StatCards from "app/views/dashboard/shared/StatCards";
// import { ChartLine } from "./ChartLine";
import StatCardsLine from "app/views/dashboard/shared/StatCardsLine";
import { NotifyError } from "app/utils/toastyNotification";
import { formatDateDifference } from "app/utils/validate";
import paletaCor from "app/utils/paletaCor";

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
export default function ListVisto() {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const [page, setPage] = useState(0);
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

  const [statusvistos, setStatusDevistos] = useState([]);
  const fSize = "0.65rem";
  const [totalvistosActivos, setTotalvistoActivos] = useState(0);
  const [totalVistosCancelados, setTotalVistoCancelados] = useState(0);
  const [totalVistosExpirados, setTotalVistoExpirados] = useState(0);
  const [tipoVistoId, setTipoVistoId] = useState(null);

  const buscarRelario = async () => {
    try {
      await api.list("vistos/expirados").then((resp) => {
        setTotalVistoExpirados(resp?.data?.total);
      });

      await api.listQuery(`vistos/cancelados`).then((resp) => {
        setTotalVistoCancelados(resp?.data?.total);
      });

      await api.listQuery(`vistos/activos`).then((resp) => {
        setTotalvistoActivos(resp?.data?.total);
      });
    } catch (error) {
      NotifyError(error);
    }
  };

  const [loadingVisto, setLoadingVisto] = useState(false);
  const [vistos, setVistos] = useState([]);

  async function ListarVisto() {
    try {
      setLoadingVisto(prev => !prev)
      await api.listQuery("vistos").then((res) => {
        if (res.status == 200) {
          setVistos(prev => res?.data?.vistos)
        }
      }).finally(() => {
        setLoadingVisto(prev => !prev)
      })


    } catch (error) {
      NotifyError("algo deu errado:" + error);
    }
  }

  async function ListarVistoActivos() {
    try {
      setLoadingVisto(prev => !prev)
      await api.listQuery("vistos/actived").then((res) => {
        if (res.status == 200) {
          setVistos(prev => res?.data?.vistos)
        }
      }).finally(() => {
        setLoadingVisto(prev => !prev)
      })

    } catch (error) {
      NotifyError("algo deu errado:" + error);
    }
  }

  async function ListarVistoExpirados() {
    try {
      setLoadingVisto(prev => !prev)
      await api.listQuery("vistos/expired").then((res) => {
        if (res.status == 200) {
          setVistos(prev => res?.data?.vistos)
        }
      }).finally(() => {
        setLoadingVisto(prev => !prev)
      })

    } catch (error) {
      NotifyError("algo deu errado:" + error);
    }
  }


  async function ListarVistoCancelados() {
    try {
      setLoadingVisto(prev => !prev)
      await api.listQuery("vistos").then((res) => {
        if (res.status == 200) {

          setVistos(prev => res?.data?.vistos)
        }
      }).finally(() => {
        setLoadingVisto(prev => !prev)
      })
    } catch (error) {
      NotifyError("algo deu errado:" + error);
    }
  }

  useEffect(() => {
    ListarVisto();
  }, []);
  async function gerarPDFGeral() {
    setLoadingDocumento((prev) => !prev);
    await api.documento("gerarPDF/visto/geral", vistos).finally(() => {
      setLoadingDocumento((prev) => !prev);
    });
  }
  useEffect(() => {
    buscarRelario({});
  }, []);

  const cardList = [
    {
      name: "Total",
      amount: vistos?.length,
      Icon: Group,
      color: "sucess"
    },
    {
      name: "Activos",
      amount: totalvistosActivos,
      Icon: Group,
      color: "sucess"
    },
    {
      name: "Expirados",
      amount: totalVistosExpirados,
      Icon: AttachMoney,
      color: "warning",
    },
    { name: "Cancelados", color: "danger", amount: totalVistosCancelados, Icon: Store },

  ];

  const renderColorStatus = ({ id, nome }) => {
    switch (id) {
      case 1:
        return <Small style={{ backgroundColor: paletaCor.Estudo }}>{nome}</Small>;
        break;
      case 2:
        return <Small style={{ backgroundColor: paletaCor.Trabalho }}>{nome}</Small>;
        break;
      case 3:
        return <Small style={{ backgroundColor: paletaCor.Residência }}>{nome}</Small>;
        break;
      case 4:
        return <Small style={{ backgroundColor: paletaCor.Turismo }}>{nome}</Small>;
        break;
      case 5:
        return <Small bgcolor={bgSecondary}>{nome}</Small>;
        break;
      case 6:
        return <Small bgcolor={bgSecondary}>{nome}</Small>;
        break;
      case 7:
        return <Small bgcolor={bgError}>{nome}</Small>;
        break;

      default:
        return <Small bgcolor={bgPrimary}>{nome}</Small>;
        break;
    }
  };

  const renderColorVisto = ({ id, nome }) => {
    switch (id) {
      case 1:
        return <Small style={{ backgroundColor: paletaCor.Trabalho }}>{nome}</Small>;
        break;
      case 2:
        return <Small style={{ backgroundColor: paletaCor.Turismo }}>{nome}</Small>;
        break;
      case 3:
        return <Small style={{ backgroundColor: paletaCor.Residência }}>{nome}</Small>;
        break;
      case 4:
        return <Small style={{ backgroundColor: paletaCor.Negócios }}>{nome}</Small>;
        break;
      case 5:
        return <Small bgcolor={bgSecondary}>{nome}</Small>;
        break;
      case 6:
        return <Small bgcolor={bgSecondary}>{nome}</Small>;
        break;
      case 7:
        return <Small bgcolor={bgError}>{nome}</Small>;
        break;

      default:
        return <Small bgcolor={bgPrimary}>{nome}</Small>;
        break;
    }
  };
  const styleDropdown = {};
  return (
    <AppButtonRoot>
      <SimpleCard>
        <div className="w-100 d-flex  justify-content-between">
          <Title>CONTROLO DE VISTO</Title>
          <div>
            <StyledButton onClick={async () => await gerarPDFGeral()} variant="contained" color="info">
              Gerar Relatorio PDF <Download></Download>
            </StyledButton>
          </div>
        </div>
      </SimpleCard>
      <ContentBox className="analytics h-auto">
        <StatCardsLine cardList={cardList}></StatCardsLine>
      </ContentBox>
      <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
        <CContainer className="d-flex justify-content-between">
          <div >
            <div className="d-flex aling-items-center justify-content-center flex-column">
              <div  >
                <StyledButton
                  style={{ borderRadius: 0 }}
                  onClick={async () => await ListarVisto()}
                  className="m-0"

                  color="primary"
                >
                  Todos
                </StyledButton>
                <StyledButton
                  style={{ borderRadius: 0 }}
                  onClick={async () => {
                    await ListarVistoExpirados()
                  }}
                  className="m-0"

                  color="primary"
                >
                  Expirados
                </StyledButton>
                <StyledButton
                  style={{ borderRadius: 0 }}
                  onClick={async () => {
                    await ListarVistoCancelados()
                  }}
                  className="m-0"

                  color="primary"
                >
                  Cancelados
                </StyledButton>
                <StyledButton
                  style={{ borderRadius: 0 }}
                  className="m-0"
                  onClick={async () => await ListarVistoActivos()}
                  color="primary"
                >
                  Activos
                </StyledButton>
              </div>
              <CRow></CRow>
            </div>
          </div>

        </CContainer>
        <CardHeader>
          <Link to={"/vistos/add"}></Link>
        </CardHeader>

        <Box overflow="auto">
          <ProductTable>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} sx={{ px: 2 }}>
                  Nº
                </TableCell>
                <TableCell colSpan={4} sx={{ px: 0 }}>
                  Cliente
                </TableCell>
                <TableCell colSpan={4} sx={{ px: 2 }}>
                  Visto
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Status
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Data Emissão.
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Data Validade
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Dat.Registo
                </TableCell>
                <TableCell colSpan={1} sx={{ px: 0 }}>
                  Acções
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loadingVisto ? (
                <CSpinner></CSpinner>
              ) : (
                <>
                  {vistos
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((visto, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: "0.60rem" }}>{visto?.numero}</Paragraph>
                        </TableCell>
                        <TableCell
                          colSpan={4}
                          align="left"
                          sx={{ px: 0, textTransform: "capitalize" }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Paragraph style={{ fontSize: fSize }}>
                              {visto?.processo?.requerente?.nome}
                            </Paragraph>
                          </Box>
                        </TableCell>
                        <TableCell colSpan={4}
                          align="left"
                          sx={{ px: 0, textTransform: "capitalize" }}>
                           
                          {renderColorVisto({
                            id: visto?.processo?.tipoVisto?.id,
                            nome: visto?.processo?.tipoVisto?.nome
                          })}
                        </TableCell>

                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          {renderColorVisto({
                            id: visto?.statusActual?.id,
                            nome: visto?.statusActual?.nome
                          })}
                        </TableCell>
                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: fSize }}>
                            {new Date(visto?.dataEmissao).toLocaleDateString()}
                          </Paragraph>
                        </TableCell>
                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: fSize }}>
                            {new Date(visto?.dataValidade).toLocaleDateString()}
                          </Paragraph>
                        </TableCell>

                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                          <Paragraph style={{ fontSize: fSize }}>
                            {formatDateDifference(new Date(visto?.createdAt))}
                          </Paragraph>
                        </TableCell>


                        <TableCell>
                          <CFormSelect
                            style={{ fontSize: "12px", minWidth: "6.45rem" }}
                            id="validationServer04"
                            onChange={async (e) => {
                              if (e.target.value == 1) {
                                return goto(
                                  `/visto/detalhe/${visto?.id}?_statusId=${visto?.statusActualId}&_fazeId=${visto?.fazeActualId}`
                                );
                              }
                              if (e.target.value == 2) {
                                await gerarPDF()
                              }
                              console.log(e.target.value);
                            }}
                            sx={2}
                          >
                            <option>selecione</option>

                            <option value={1}>visualisar</option>
                            <option value={2}>gerar Pdf</option>
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
            count={vistos?.length}
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
