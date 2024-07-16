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
  import FormAprovar from "../processos/Local/Formularios/FormAprovar";
import FormRecusar from "../processos/Local/Formularios/FormRecusar";

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
  export default function Aprovadas() {
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
  
    const [pedidos, setPedidos] = useState([]);
    const [tipoDeVistos, setTipoDeVisto] = useState([]);
    const [entidades, setEntidade] = useState([]);
    const [statusPedidos, setStatusDePedidos] = useState([]);
    const fSize = "0.775rem";
    const [totalPedidoSubmetido, setTotalPedidoSubmetido] = useState(0);
    const [totalPedidoCancelados, setTotalPedidoCancelados] = useState(0);
    const [totalPedidoMIREMPET, setTotalMIREMPET] = useState(0);
    const [totalPedidoSME, setTotalStotalPedidoSME] = useState(0);
    const [tipoId, setTipoId] = useState(null);
    const [tipoVistoId, setTipoVistoId] = useState(null);
    const [statusId, setStatusId] = useState(null);
    const [fazeId, setFazeId] = useState(null);
    const [pedidoId, setPedidoId] = useState(1);
    const [fazes, setFazes] = useState([]);
    const [tituloEntidade, setTituloEntidade] = useState("Faze/Entidade");
    const [tituloStatus, setTituloStatus] = useState("Status");
    const [activeStep, setActiveStep] = useState(0);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
  
    const [openRecusar, setOpenRecusar] = useState(false);
    const handleCloseRecusar = () => setOpenRecusar(false);
  
    const [openAprovar, setOpenAprovar] = useState(false);
    const handleCloseAprovar = () => setOpenAprovar(false);
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const StyledButton = styled(Button)(({ theme }) => ({
      margin: theme.spacing(1)
    }));
  
    const buscarRelario = async () => {
      try {
        await api.list("pedido-emissao/count").then((resp) => {
          setTotalPedidoSubmetido(resp?.data?.total);
        });
  
        await api.listQuery(`pedido-emissao/count?statusId=7`).then((resp) => {
          setTotalPedidoCancelados(resp?.data?.total);
        });
  
        await api.listQuery(`pedido-emissao/count?fazeId=2`).then((resp) => {
          setTotalMIREMPET(resp?.data?.total);
        });
  
        await api.listQuery(`pedido-emissao/count?fazeId=4`).then((resp) => {
          setTotalStotalPedidoSME(resp?.data?.total);
        });
      } catch (error) {
        NotifyError(error);
      }
    };
  
    async function buscarStatus() {
      try {
        if (fazeId !== null) {
          await api.listQuery(`status-de-pedido/${fazeId}`).then((resp) => {
            console.log("STATUS DE DAS FAZES", resp);
            const status = resp?.data?.[0]?.status || [];
            setStatusDePedidos(status);
          });
        }
        await api.listQuery(`status-de-pedido/1`).then((resp) => {
          console.log(resp);
          const status = resp?.data?.[0]?.status || [];
          setStatusDePedidos(status);
        });
      } catch (error) {
        NotifyError("algo deu errado:" + error);
      }
    }
  
    useEffect(() => {
      buscarStatus();
    }, [statusId, fazeId, tipoVistoId, tipoId]);
    const [loadPedido, setLoadingPedido] = useState(false);
    async function ListarPedidos() {
      try {
        if (fazeId !== null && statusId === null && tipoVistoId === null) {
          setLoadingPedido((prev) => !prev);
          await api
            .listQuery(`pedido-emissao/list?fazeId=${fazeId}`)
            .then((resp) => {
              console.log("Pedido Recebidos", resp);
              const pedidos = resp?.data?.pedidos || [];
              console.log(pedidos);
              setPedidos(pedidos);
            })
            .finally(() => {
              setLoadingPedido((prev) => !prev);
            });
          return;
        }
        if (fazeId !== null && statusId !== null && tipoVistoId === null) {
          setLoadingPedido((prev) => !prev);
          await api
            .listQuery(`pedido-emissao/list?fazeId=${fazeId}&statusId=${statusId}`)
            .then((resp) => {
              console.log("Pedido Recebidos", resp);
              const pedidos = resp?.data?.pedidos || [];
              console.log(pedidos);
              setPedidos(pedidos);
            })
            .finally(() => {
              setLoadingPedido((prev) => !prev);
            });
          return;
        }
        if (fazeId !== null && statusId === null && tipoVistoId !== null) {
          console.log("VEIO");
          setLoadingPedido((prev) => !prev);
          await api
            .listQuery(`pedido-emissao/list?fazeId=${fazeId}&tipoVistoId=${tipoVistoId}`)
            .then((resp) => {
              console.log("Pedido Recebidos", resp);
              const pedidos = resp?.data?.pedidos || [];
              console.log(pedidos);
              setPedidos(pedidos);
            })
            .finally(() => {
              setLoadingPedido((prev) => !prev);
            });
          return;
        }
  
        if (fazeId === null && statusId === null && tipoVistoId !== null) {
          console.log("tipo de visto", tipoVistoId);
          setLoadingPedido((prev) => !prev);
          await api
            .listQuery(`pedido-emissao/list?tipoVistoId=${tipoVistoId}`)
            .then((resp) => {
              console.log("Pedido Recebidos", resp);
              const pedidos = resp?.data?.pedidos || [];
              console.log(pedidos);
              setPedidos(pedidos);
            })
            .finally(() => {
              setLoadingPedido((prev) => !prev);
            });
          return;
        }
  
        if (fazeId === null && statusId !== null && tipoVistoId === null) {
          setLoadingPedido((prev) => !prev);
          await api
            .listQuery(`pedido-emissao/list?statusId=${statusId}`)
            .then((resp) => {
              console.log("Pedido Recebidos", resp);
              const pedidos = resp?.data?.pedidos || [];
              console.log(pedidos);
              setPedidos(pedidos);
            })
            .finally(() => {
              setLoadingPedido((prev) => !prev);
            });
          return;
        }
        if (fazeId === null && statusId !== null && tipoVistoId !== null) {
          setLoadingPedido((prev) => !prev);
          await api
            .listQuery(`pedido-emissao/list?tipoVistoId=${tipoVistoId}&statusId=${statusId}`)
            .then((resp) => {
              console.log("Pedido Recebidos", resp);
              const pedidos = resp?.data?.pedidos || [];
              console.log(pedidos);
              setPedidos(pedidos);
            })
            .finally(() => {
              setLoadingPedido((prev) => !prev);
            });
          return;
        }
  
        if (fazeId === null && statusId === null && tipoVistoId === null) {
          setLoadingPedido((prev) => !prev);
          await api
            .listQuery(`pedido-emissao/list`)
            .then((resp) => {
              console.log("Pedido Recebidos", resp);
              const pedidos = resp?.data?.pedidos || [];
              console.log(pedidos);
              setPedidos(pedidos);
            })
            .finally(() => {
              setLoadingPedido((prev) => !prev);
            });
          return;
        }
      } catch (error) {
        NotifyError("algo deu errado:" + error);
      }
    }
  
    useEffect(() => {
      ListarPedidos();
    }, [statusId, fazeId, tipoVistoId, tipoId]);
  
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
  
    useEffect(() => {
      buscarEntidade();
    }, [statusId, fazeId, tipoVistoId, tipoId]);
  
    useEffect(() => {
      buscarRelario({});
    }, []);
  
    async function actualizarFaze() {
      await api.edit(`processo/?fazeId=${fazeId}`);
    }
  
    const cardList = [
      {
        name: "Submetidos",
        amount: totalPedidoSubmetido,
        Icon: Group,
        color: "info"
      },
      {
        name: "SME",
        amount: totalPedidoSME,
        Icon: AttachMoney
      },
      { name: "MIREMPET ", amount: totalPedidoMIREMPET, Icon: Store },
      { name: "Cancelados ", amount: totalPedidoCancelados, Icon: Store }
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
  
    async function Aprovar(id) {
      await api
        .editQuery(`processo/${id}?statusId=5`)
        .then((res) => {
          if (res.status == 200) {
            Notify(res?.data?.message);
          }
        })
        .catch((err) => {
          NotifyError("Erro ao realizar esta operação");
          console.log(err);
        });
    }
  
    async function Recusar(id) {
      setLoadingPedido(true);
      await api
        .editQuery(`processo/${id}?statusId=6`)
        .then((res) => {
          if (res.status == 200) {
            Notify(res?.data?.message);
          }
        })
        .catch((err) => {
          NotifyError("Erro ao realizar esta operação");
          console.log(err);
        })
        .finally(() => {
          setLoadingPedido(false);
        });
    }
  
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
    const filteredProcessos = pedidos?.filter((pedido) =>
      pedido?.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const styleDropdown = {};
    return (
      <AppButtonRoot>
        <TextField
          label="Pesquisar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />
        <SimpleCard>
          <div className="w-100 d-flex  justify-content-between">
            <Title>Listagem de pedidos de emissão de visto</Title>
            <div>
              <Link to={"/pedidos/add"}>
                <StyledButton variant="contained" color="success">
                  Criar Novo
                </StyledButton>
              </Link>
              <Link
                onClick={() => {
                  alert("Em desenvolvimento");
                }}
              >
                <StyledButton variant="contained" color="info">
                  Gerar Relatorio PDF <Download></Download>
                </StyledButton>
              </Link>
            </div>
          </div>
        </SimpleCard>
        <Box pt={1}>{/* <Campaigns /> */}</Box>
  
        <ContentBox className="analytics h-auto">
          <StatCardsLine cardList={cardList}></StatCardsLine>
        </ContentBox>
  
        <Box pt={1}></Box>
  
        <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
          <CContainer className="d-flex justify-content-between">
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              <div className="d-flex aling-items-center justify-content-center flex-column">
                <div>
                  {/* <Select size="small" defaultValue={new Date()}>
                    <MenuItem value={new Date()}>Este Mês</MenuItem>
                    <MenuItem value={new Date(new Date().setMonth())}>Mês Anterior</MenuItem>
                  </Select> */}
                  <CDropdown>
                    <CDropdownToggle>{tituloEntidade}</CDropdownToggle>
                    <CDropdownMenu container="body">
                      <CDropdownItem
                        onClick={() => {
                          setFazeId((prev) => null);
                          setTituloEntidade((prev) => "Entidade");
                        }}
                        href="#"
                      >
                        Todos
                      </CDropdownItem>
                      {entidades?.map((entidade) => (
                        <CDropdownItem
                          onClick={() => {
                            setFazeId(entidade?.id);
                            setTituloEntidade((prev) => entidade?.nome);
                          }}
                          href="#"
                        >
                          {entidade?.nome}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>
                  <CDropdown style={styleDropdown}>
                    <CDropdownToggle style={styleDropdown}>{tituloStatus}</CDropdownToggle>
                    <CDropdownMenu style={styleDropdown}>
                      <CDropdownItem
                        onClick={() => {
                          setStatusId((prev) => null);
                          setTituloStatus((prev) => "Status");
                        }}
                        href="#"
                      >
                        Todos
                      </CDropdownItem>
                      {statusPedidos?.map((status) => (
                        <CDropdownItem
                          onClick={() => {
                            setStatusId(status?.id);
                            setTituloStatus((prev) => status?.nome);
                          }}
                          href="#"
                        >
                          {status?.nome}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>
                </div>
  
                <CRow></CRow>
              </div>
            </div>
  
            <div role="group" aria-label="Basic radio toggle button group flex-0">
              <StyledButton
                style={{ borderRadius: 0 }}
                onClick={() => setTipoVistoId((prev) => null)}
                className="m-0"
                variant={tipoVistoId === null ? "contained" : "outlined"}
                color="primary"
              >
                Todos
              </StyledButton>
              <StyledButton
                style={{ borderRadius: 0 }}
                onClick={() => setTipoVistoId((prev) => 1)}
                className="m-0"
                variant={tipoVistoId === 1 ? "contained" : "outlined"}
                color="primary"
              >
                Turismo
              </StyledButton>
              <StyledButton
                style={{ borderRadius: 0 }}
                className="m-0"
                onClick={() => setTipoVistoId((prev) => 2)}
                variant={tipoVistoId === 2 ? "contained" : "outlined"}
                color="primary"
              >
                Trabalho
              </StyledButton>
              <StyledButton
                onClick={() => setTipoVistoId((prev) => 3)}
                style={{ borderRadius: 0 }}
                className="m-0"
                variant={tipoVistoId === 3 ? "contained" : "outlined"}
                color="primary"
              >
                Curta Duração
              </StyledButton>{" "}
              <StyledButton
                onClick={() => setTipoVistoId((prev) => 4)}
                style={{ borderRadius: 0 }}
                className="m-0"
                variant={tipoVistoId === 4 ? "contained" : "outlined"}
                color="primary"
              >
                Fronteira
              </StyledButton>
            </div>
          </CContainer>
          <CardHeader>
            <Link to={"/pedidos/add"}></Link>
          </CardHeader>
  
          <Box overflow="auto">
            <ProductTable>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} sx={{ px: 2 }}>
                    Nº proc.
                  </TableCell>
  
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Nº Pass.
                  </TableCell>
                  <TableCell colSpan={4} sx={{ px: 2 }}>
                    Cliente
                  </TableCell>
  
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Entidade/Faze
                  </TableCell>
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Visto
                  </TableCell>
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Data Subtd.
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
                {loadPedido ? (
                  <CSpinner></CSpinner>
                ) : (
                  <>
                    {filteredProcessos
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map((processo, index) => (
                        <TableRow key={index} hover>
                          <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                            <Paragraph style={{ fontSize: "0.60rem" }}>{processo?.numero}</Paragraph>
                          </TableCell>
                          <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                            <Paragraph style={{ fontSize: fSize }}>
                              {processo?.requerente?.Documentos?.[0]?.numero}
                            </Paragraph>
                          </TableCell>
                          <TableCell
                            colSpan={4}
                            align="left"
                            sx={{ px: 0, textTransform: "capitalize" }}
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              <Paragraph style={{ fontSize: fSize }}>
                                {processo?.requerente?.nome}
                              </Paragraph>
                            </Box>
                          </TableCell>
  
                          <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                            <Paragraph style={{ fontSize: fSize }}>
                              {processo?.fazeActual?.nome}
                            </Paragraph>
                          </TableCell>
  
                          <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                            {renderColorVisto({
                              id: processo?.tipoVisto?.id,
                              nome: processo?.tipoVisto?.nome
                            })}
                          </TableCell>
                          <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                            <Paragraph style={{ fontSize: fSize }}>
                              {formatDateDifference(new Date(processo?.createdAt))}
                            </Paragraph>
                          </TableCell>
  
                          <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                            {renderColorStatus({
                              id: processo?.statusActual?.id,
                              nome: processo?.statusActual?.nome
                            })}
                          </TableCell>
                          <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                            <Paragraph style={{ fontSize: fSize }}>
                              {formatDateDifference(new Date(processo?.updatedAt))}
                            </Paragraph>
                          </TableCell>
  
                          <TableCell>
                            <CFormSelect
                              style={{ fontSize: "12px", minWidth: "6.45rem" }}
                              id="validationServer04"
                              onChange={(e) => {
                                if (e.target.value == 1) {
                                  return goto(
                                    `/processo/detalhe/${processo?.id}?_statusId=${processo?.statusActualId}&_fazeId=${processo?.fazeActualId}`
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
                              sx={2}
                            >
                              <option>selecione</option>
  
                              <option value={1}>visualisar</option>
                              <option value={2}>Aprovar</option>
                              <option value={3}>Recusar</option>
                            </CFormSelect>
                          </TableCell>
  
                          <Dialog
                            open={openAprovar}
                            onClose={handleCloseAprovar}
                            aria-labelledby="form-dialog-title"
                          >
                            <FormAprovar
                              handleClose={handleCloseAprovar}
                              processoId={processo?.id}
                            ></FormAprovar>
                          </Dialog>
  
                          <Dialog
                            open={openRecusar}
                            onClose={handleCloseRecusar}
                            aria-labelledby="form-dialog-title"
                          >
                            <FormRecusar
                              handleClose={handleCloseRecusar}
                              processoId={processo?.id}
                            ></FormRecusar>
                          </Dialog>
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
              count={pedidos?.length}
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
  