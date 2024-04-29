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
export default function ListPedidosPendentes({ data = {
    breadcamName: "",
    titulo: "",
    button: [{
        name: "",
        path: "",
        color: ""
    }],
    hedeader: [
        { name: "" },
        { name: "" },
        { name: "" }
    ],
    items: [{
        img, nome, data
    }]

} }) {
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

    return (
        <AppButtonRoot>
            <Box className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: "Material", path: "/material" },
                        { name: "Home" },
                    ]}
                />
            </Box>

            <Box py="12px" />
            <SimpleCard title="">
                <H3> LISTAGEM DE PEDIDO DE VISTO</H3>
            </SimpleCard>
            <Box py="12px" />
            <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
                <CardHeader>
                    <Title>pedidos de visto ainda não examinados</Title>
                    <Select size="small" defaultValue="this_month">
                        <MenuItem value="this_month">This Month</MenuItem>
                        <MenuItem value="last_month">Last Month</MenuItem>
                    </Select>
                </CardHeader>

                <Box overflow="auto">
                    <ProductTable>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4} sx={{ px: 3 }}>
                                    Cliente
                                </TableCell>

                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    Data da solicitação
                                </TableCell>

                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    Status/Situação
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    Motivo de viagem
                                </TableCell>

                                <TableCell colSpan={1} sx={{ px: 0 }}>
                                    Acções
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pedidosList
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((pedido, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell
                                            colSpan={4}
                                            align="left"
                                            sx={{ px: 0, textTransform: "capitalize" }}
                                        >
                                            <Box display="flex" alignItems="center" gap={4}>
                                                <Avatar src={pedido.avatarUrl} />
                                                <Paragraph>{pedido.name}</Paragraph>
                                            </Box>
                                        </TableCell>

                                        <TableCell
                                            align="left"
                                            colSpan={2}
                                            sx={{ px: 0, textTransform: "capitalize" }}
                                        >
                                            {pedido.createdAt > 999
                                                ? (pedido.createdAt / 1000).toFixed(1) + "k"
                                                : pedido.createdAt}
                                        </TableCell>

                                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                            {pedido.status ? (
                                                pedido.status?.id % 2 === 0 ? (
                                                    <Small bgcolor={bgSecondary}>
                                                        {pedido.status?.name}
                                                    </Small>
                                                ) : (
                                                    <Small bgcolor={bgPrimary}>
                                                        {" "}
                                                        {pedido.status?.name}{" "}
                                                    </Small>
                                                )
                                            ) : (
                                                <Small bgcolor={bgError}> {pedido.status?.name} </Small>
                                            )}
                                        </TableCell>

                                        <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                            {pedido.tipo ? (
                                                pedido.tipo?.id % 2 !== 0 ? (
                                                    <Small bgcolor={bgSecondary}>
                                                        {pedido.tipo?.name}
                                                    </Small>
                                                ) : (
                                                    <Small bgcolor={bgPrimary}>
                                                        {" "}
                                                        {pedido.tipo?.name}{" "}
                                                    </Small>
                                                )
                                            ) : (
                                                <Small bgcolor={bgError}> {pedido.tipo?.name} </Small>
                                            )}
                                        </TableCell>

                                        <TableCell sx={{ px: 0 }} colSpan={1}>
                                            <IconButton>
                                                <Delete color="error" />
                                            </IconButton>

                                            <IconButton>
                                                <Link to={"/pedido/detalhe/" + pedido?.id}>
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
                        count={pedidosList.length}
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

const pedidosList = [
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
