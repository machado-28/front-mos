import { Edit } from "@mui/icons-material";
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
  IconButton
} from "@mui/material";
import { Paragraph } from "app/components/Typography";
import { useApi } from "app/hooks/useApi";
import { useState } from "react";
import { useEffect } from "react";

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

export default function Tabela2() {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const [departamentos, setDepartamentos] = useState([]);
  const api = useApi()

  async function ListarDepartamentos() {
    await api.list("departamentos").then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setDepartamentos((prev) => response.data?.departamentos)
      }
    })
  }

  useEffect(() => {
    ListarDepartamentos();
  }, [])
  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>Distribuição dos custos salariais por departamento</Title>
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
                Deepartamento
              </TableCell>

              <TableCell colSpan={2} sx={{ px: 0 }}>
                Valor Gasto
              </TableCell>

              <TableCell colSpan={2} sx={{ px: 0 }}>
                Status
              </TableCell>

              <TableCell colSpan={2} sx={{ px: 0 }}>
                Funcionários
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {departamentos?.map((departamento, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center" gap={4}>
                    <Avatar src={departamento?.imgUrl} />
                    <Paragraph>{departamento?.nome}</Paragraph>
                  </Box>
                </TableCell>

                <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: "capitalize" }}>
                  AOA 00,000{departamento?.price > 999 ? (departamento?.price / 1000).toFixed(1) + "k" : departamento?.price}
                </TableCell>

                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                  {departamento?.funcionarios?.total ? (
                    departamento?.funcionarios?.total < 20 ? (
                      <Small bgcolor={bgSecondary}>{departamento?.available} available</Small>
                    ) : (
                      <Small bgcolor={bgError}>máximo</Small>
                    )
                  ) : (
                    <Small bgcolor={bgPrimary}>médio</Small>
                  )}
                </TableCell>
                <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: "capitalize" }}>
                  {departamento?.funcionarios?.total}{index * departamento?.id}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
}

const productList = [
  {
    imgUrl: "/assets/images/products/headphone-2.jpg",
    name: "earphone",
    price: 100,
    available: 15
  },
  {
    imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "earphone",
    price: 1500,
    available: 30
  },
  {
    imgUrl: "/assets/images/products/iphone-2.jpg",
    name: "iPhone x",
    price: 1900,
    available: 35
  },
  {
    imgUrl: "/assets/images/products/iphone-1.jpg",
    name: "iPhone x",
    price: 100,
    available: 0
  },
  {
    imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "Head phone",
    price: 1190,
    available: 5
  }
];
