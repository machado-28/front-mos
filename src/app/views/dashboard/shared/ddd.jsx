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
import { useEffect } from "react";
import { useState } from "react";

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

const departamtamentoTable = styled(Table)(() => ({
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

export default function TopSellingTable() {
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
        <departamtamentoTable>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} sx={{ px: 3 }}>
                Deepartamento
              </TableCell>
              <TableCell colSpan={1} sx={{ px: 0 }}>
                Valor Gasto
              </TableCell>
              <TableCell colSpan={1} sx={{ px: 0 }}>
                Funcionários
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departamentos?.map((departamtamento, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center" gap={4}>
                    <Paragraph>{departamtamento?.id}</Paragraph>
                    <Paragraph>{departamtamento?.nome}</Paragraph>
                  </Box>
                </TableCell>

                <TableCell align="left" colSpan={12} sx={{ px: 0, textTransform: "capitalize" }}>
                  ${departamtamento?.price > 999 ? (departamtamento?.price / 1000).toFixed(1) + "k" : departamtamento?.price}
                </TableCell>

                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                  {departamtamento?.available ? (
                    departamtamento?.available < 20 ? (
                      <Small bgcolor={bgSecondary}>{departamtamento?.available} available</Small>
                    ) : (
                      <Small bgcolor={bgPrimary}>in stock</Small>
                    )
                  ) : (
                    <Small bgcolor={bgError}>out of stock</Small>
                  )}
                </TableCell>


              </TableRow>
            ))}
          </TableBody>
        </departamtamentoTable>
      </Box>
    </Card>
  );
}