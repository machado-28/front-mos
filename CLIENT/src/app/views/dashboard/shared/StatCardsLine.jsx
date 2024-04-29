import { Box, Card, Grid, IconButton, styled, Tooltip } from "@mui/material";
import {
  AttachMoney,
  Group,
  ShoppingCart,
  Store,
  ArrowRightAlt,
  PausePresentation
} from "@mui/icons-material";
import { Small } from "app/components/Typography";
import { Link } from "react-router-dom";
import paletaCor from "app/utils/paletaCor";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ color, theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: color,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": {
    opacity: 0.6,
    fontSize: "44px",
    color: theme.palette.primary.main
  }
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main
}));

export default function StatCardsLine({
  cardList = [
    {
      name: "Funcionários",
      amount: 3050,
      Icon: Group,
      path: "funcionarios/list",
      color: paletaCor.Estudo
    },
    {
      name: "Folha de Pagamento",
      amount: "AOA | 80,500 kzs",
      Icon: AttachMoney,
      color: paletaCor.Turismo
    },
    { name: "Faltas ", amount: "8.5% faltas", Icon: Store },
    { name: "Atrasos", amount: "305 atrasos", Icon: PausePresentation }
  ]
}) {
  return (
    <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name, path, color }) => (
        <Grid item xs={12} md={3} key={name}>
          <StyledCard color={color} elevation={6}>
            <ContentBox>
              <Icon className="icon" />

              <Box style={{ backgroundClip: color }} ml="12px">
                <Small>{name}</Small>
                <Heading>{amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              <Link replace={true} to={path}>
                <IconButton>
                  <ArrowRightAlt />
                </IconButton>
              </Link>
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
