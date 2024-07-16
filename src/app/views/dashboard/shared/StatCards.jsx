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

export default function StatCards({
  cardList = [
    {
      name: "Funcionários",
      amount: 3050,
      Icon: Group,
      path: "funcionarios/list",
    },
    {
      name: "Folha de Pagamento",
      amount: "80,500 kzs",
      Icon: AttachMoney,
    },
    { name: "Faltas ", amount: "8.5% faltas", Icon: Store },
    { name: "Atrasos", amount: "305 atrasos", Icon: PausePresentation },
  ],
}) {
  return (
    <Grid container spacing={4} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name, path, bgColor, color }) => (
        <Grid item xs={8} md={4} key={name}>
          <StyledCard style={{ maxHeight: "100", minHeight: "100" }} className={"bg-" + bgColor + " text-" + color} elevation={6}>
            <ContentBox>
              <Icon className="icon  " style={{ color: "#fff", width: "40px", height: "50px" }} />

              <Box ml="12px">
                <Small className="text-white h-2">{name}</Small>
                <Heading className="text-white">{amount}</Heading>
              </Box>
            </ContentBox>


          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
