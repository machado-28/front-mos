import {
  AttachMoney,
  Delete,
  Edit,
  FileDownload,
  Group,
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
  Grid
} from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { H3, Paragraph } from "app/components/Typography";
import "../style.css";
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
  CFormSelect,
  CRow
} from "@coreui/react";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import { ContentBox } from "app/views/dashboard/Analytics";
import StatCards from "app/views/dashboard/shared/StatCards";
// import { ChartLine } from "./ChartLine";
import StatCardsLine from "app/views/dashboard/shared/StatCardsLine";
import { NotifyError } from "app/utils/toastyNotification";

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
export default function ListProcessoSME() {
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
  const fSize = "0.65rem";
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

  async function ListarPedidos() {
    try {
      if (fazeId !== null && statusId === null && tipoVistoId === null) {
        await api.listQuery(`pedido-emissao/list?fazeId=${fazeId}`).then((resp) => {
          console.log("Pedido Recebidos", resp);
          const pedidos = resp?.data?.pedidos || [];
          console.log(pedidos);
          setPedidos(pedidos);
        });
        return;
      }
      if (fazeId !== null && statusId !== null && tipoVistoId === null) {
        await api
          .listQuery(`pedido-emissao/list?fazeId=${fazeId}&statusId=${statusId}`)
          .then((resp) => {
            console.log("Pedido Recebidos", resp);
            const pedidos = resp?.data?.pedidos || [];
            console.log(pedidos);
            setPedidos(pedidos);
          });
        return;
      }
      if (fazeId !== null && statusId === null && tipoVistoId !== null) {
        console.log("VEIO");
        await api
          .listQuery(`pedido-emissao/list?fazeId=${fazeId}&tipoVistoId=${tipoVistoId}`)
          .then((resp) => {
            console.log("Pedido Recebidos", resp);
            const pedidos = resp?.data?.pedidos || [];
            console.log(pedidos);
            setPedidos(pedidos);
          });
        return;
      }

      if (fazeId === null && statusId === null && tipoVistoId !== null) {
        console.log("tipo de visto", tipoVistoId);
        await api.listQuery(`pedido-emissao/list?tipoVistoId=${tipoVistoId}`).then((resp) => {
          console.log("Pedido Recebidos", resp);
          const pedidos = resp?.data?.pedidos || [];
          console.log(pedidos);
          setPedidos(pedidos);
        });
        return;
      }

      if (fazeId === null && statusId !== null && tipoVistoId === null) {
        await api.listQuery(`pedido-emissao/list?statusId=${statusId}`).then((resp) => {
          console.log("Pedido Recebidos", resp);
          const pedidos = resp?.data?.pedidos || [];
          console.log(pedidos);
          setPedidos(pedidos);
        });
        return;
      }
      if (fazeId === null && statusId !== null && tipoVistoId !== null) {
        await api
          .listQuery(`pedido-emissao/list?tipoVistoId=${tipoVistoId}&statusId=${statusId}`)
          .then((resp) => {
            console.log("Pedido Recebidos", resp);
            const pedidos = resp?.data?.pedidos || [];
            console.log(pedidos);
            setPedidos(pedidos);
          });
        return;
      }

      if (fazeId === null && statusId === null && tipoVistoId === null) {
        await api.listQuery(`pedido-emissao/list`).then((resp) => {
          console.log("Pedido Recebidos", resp);
          const pedidos = resp?.data?.pedidos || [];
          console.log(pedidos);
          setPedidos(pedidos);
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

  const cardList = [
    {
      name: "Submetidos",
      amount: totalPedidoSubmetido,
      Icon: Group
    },
    {
      name: "Aprovados",
      amount: totalPedidoSME,
      Icon: AttachMoney
    },
    { name: "Recusados", amount: totalPedidoMIREMPET, Icon: Store }
  ];

  const renderColorStatus = ({ id, nome }) => {
    switch (id) {
      case 1:
        return <Small bgcolor={bgSecondary}>{nome}</Small>;
        break;
      case 2:
        return <Small bgcolor={bgSecondary}>{nome}</Small>;
        break;
      case 3:
        return <Small bgcolor={bgSecondary}>{nome}</Small>;
        break;
      case 4:
        return <Small bgcolor={bgSecondary}>{nome}</Small>;
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
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Material", path: "/material" }, { name: "Buttons" }]}
        />
      </Box>
      <Box pt={4}>{/* <Campaigns /> */}</Box>
      <SimpleCard>
        <div className="w-100 d-flex  justify-content-between">
          <Title> Processos No MIREMPET</Title>
        </div>
      </SimpleCard>
      <ContentBox className="analytics h-auto">
        <StatCardsLine cardList={cardList}></StatCardsLine>
      </ContentBox>

      <Box pt={3}></Box>

      <Box pt={3}></Box>
      <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
        <CContainer className="d-flex justify-content-between">
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
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
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
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
                  Codio
                </TableCell>
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
              {pedidos
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((processo, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      <Paragraph style={{ fontSize: "0.60rem" }}>{processo?.numero}</Paragraph>
                    </TableCell>
                    <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Paragraph style={{ fontSize: fSize }}>
                          {processo?.requerente?.nome}
                        </Paragraph>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      <Paragraph style={{ fontSize: fSize }}>
                        {processo?.requerente?.Documentos?.[0]?.numero}
                      </Paragraph>
                    </TableCell>
                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      <Paragraph style={{ fontSize: fSize }}>{processo?.tipoVisto?.nome}</Paragraph>
                    </TableCell>
                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                      <Paragraph style={{ fontSize: fSize }}>
                        {new Date(processo?.createdAt).toDateString()}
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
                        {new Date(processo?.createdAt).toDateString()}
                      </Paragraph>
                    </TableCell>

                    <TableCell>
                      <CFormSelect
                        style={{ fontSize: "12px", minWidth: "6.45rem" }}
                        id="validationServer04"
                        onChange={(e) => {
                          if (e.target.value == 1) {
                            return goto(`/processo/detalhe/${processo?.id}`);
                          }
                          console.log(e.target.value);
                        }}
                        sx={2}
                      >
                        <option>selecione</option>

                        <option value={1}>visualisar</option>
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
