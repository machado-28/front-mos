import { Delete, Edit, Visibility } from "@mui/icons-material";
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
} from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { H3, Paragraph } from "app/components/Typography";
import StatusCard from "app/components/StatusCard";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "app/hooks/useApi";
import { useEffect } from "react";

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" },
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));
const AppButtonRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
  "& .button": { margin: theme.spacing(1) },
  "& .input": { display: "none" },
}));
export default function ListarcargoLocalSubmetidos() {
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

  const [cargos, setProcesos] = useState([]);
  const [total, settotal] = useState(0);
  const api = useApi();

  async function ListarCargos() {
    await api.list("cargos").then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setProcesos((prev) => response.data?.cargos)
      }
    })
  }

  useEffect(() => {
    ListarCargos();
  }, [])

  return (
    <AppButtonRoot>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Material", path: "/material" },
            { name: "Buttons" },
          ]}
        />
      </Box>

      <Box py="12px" />
      <SimpleCard title="">
        <H3> LISTAGEM DE CARGOS</H3>
      </SimpleCard>
      <Box py="12px" />
      <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
        <CardHeader>

          <Select size="small" defaultValue="this_month">
            <MenuItem value="this_month">Este Mês</MenuItem>
            <MenuItem value="last_month">Mês Anterior</MenuItem>
          </Select>
        </CardHeader>

        <Box overflow="auto">
          <ProductTable>
            <TableHead>
              <TableRow>
                <TableCell colSpan={4} sx={{ px: 3 }}>
                  Cargo
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Criado Em
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Funcionarios
                </TableCell>
                <TableCell colSpan={1} sx={{ px: 0 }}>
                  Acções
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {cargos
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((cargo, index) => (
                  <TableRow key={index} hover>
                    <TableCell
                      colSpan={4}
                      align="left"
                      sx={{ px: 0, textTransform: "capitalize" }}
                    >
                      <Box display="flex" alignItems="center" gap={4}>
                        <Paragraph>{(rowsPerPage - page)}</Paragraph>
                        <Paragraph>{cargo?.nome}</Paragraph>
                      </Box>
                    </TableCell>

                    <TableCell
                      align="left"
                      colSpan={2}
                      sx={{ px: 0, textTransform: "capitalize" }}
                    >
                      {new Date(cargo?.createdAt).toLocaleString() > 999
                        ? (new Date(cargo?.createdAt).toLocaleString() / 1000).toFixed(1) + "k"
                        : new Date(cargo?.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>

                      <Small bgcolor={bgPrimary}>
                        {cargo?.funcionarios?.length || 0}
                      </Small>

                    </TableCell>

                    <TableCell sx={{ px: 0 }} colSpan={1}>
                      <IconButton>
                        <Delete onClick={() => alert("indisponivel")} color="error" />
                      </IconButton>
                      <IconButton>
                        <Edit onClick={() => alert("indisponivel")} color="success" />
                      </IconButton>
                      <IconButton>
                        <Link to={"/departamentos/cargo/detalhe/" + cargo?.id}>
                          {" "}
                          <Visibility color="primary"></Visibility>
                        </Link>
                      </IconButton>
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
            count={cargos?.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </Box>
      </Card>
    </AppButtonRoot>
  );
}

const cargosList = [
  {
    id: 1,
    avatarUrl: "/assets/images/products/headphone-2.jpg",
    name: "Antonio Machado",
    createdAt: new Date().toLocaleDateString(),
    available: 15,
    status: {
      id: 1,
      name: "pendente",
    },
    tipo: {
      id: 1,
      name: "estudante",
    },
  },
  {
    id: 2,
    avatarUrl: "/assets/images/products/headphone-2.jpg",
    name: "Antonio Machado",
    createdAt: new Date().toLocaleDateString(),
    available: 15,
    status: {
      id: 2,
      name: "pendente",
    },
    tipo: {
      id: 2,
      name: "estudante",
    },
  },
  {
    id: 3,
    avatarUrl: "/assets/images/products/headphone-2.jpg",
    name: "Antonio Machado",
    createdAt: new Date().toLocaleDateString(),
    available: 15,
    status: {
      id: 3,
      name: "pendente",
    },
    tipo: {
      id: 3,
      name: "estudante",
    },
  },
];
