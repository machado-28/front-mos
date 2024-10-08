import { Fragment } from "react";
import { Card, Grid, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/Doughnut";
import UpgradeCard from "./shared/UpgradeCard";
import TopSellingTable from "./shared/TopSellingTable";
// import { ChartLine } from "../admin/processos/ChartLine";

// STYLED COMPONENTS
export const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginRight: ".5rem",
  textTransform: "capitalize",
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "16px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
}));

export default function Analytics() {
  const { palette } = useTheme();

  return (
    <Fragment>
      <ContentBox className="analytics h-auto">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards />
            <TopSellingTable />
            {/* <ChartLine></ChartLine> */}
          </Grid>

          <Grid item lg={4} md={8} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }} style={{ height: "auto" }}>
              <Title>RELATÓRIO DE VISTO / PROCESSOS NOS </Title>
              <SubTitle>Últimos 30 dias</SubTitle>
              <DoughnutChart
                height="440px"
                color={[
                  palette.primary.dark,
                  palette.primary.main,
                  palette.primary.light,
                ]}
              />
            </Card>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
