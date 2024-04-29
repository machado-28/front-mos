import { Box, Card, Grid, IconButton, styled, Tooltip } from "@mui/material";
import {
  AttachMoney,
  Group,
  ShoppingCart,
  Store,
  ArrowRightAlt,
  PausePresentation,
} from "@mui/icons-material";
import { Small } from "app/components/Typography";
import { Link } from "react-router-dom";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": {
    opacity: 0.6,
    fontSize: "44px",
    color: theme.palette.primary.main,
  },
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

export default function StatCardsCustom({
  cardList = [
    {
      name: "Funcionários",
      amount: 3050,
      Icon: Group,
      path: "funcionarios/list",
    },
    {
      name: "Folha de Pagamento",
      amount: "AOA | 80,500 kzs",
      Icon: AttachMoney,
    },
    { name: "Faltas ", amount: "8.5% faltas", Icon: Store },
    { name: "Atrasos", amount: "305 atrasos", Icon: PausePresentation },
  ],
}) {
  return (
    <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name, path }) => (
        <Grid item xs={12} md={6} key={name}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon" />
              <Box ml="12px">
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
