import { Fragment } from "react";
import { Card, Grid, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/Doughnut";
import UpgradeCard from "./shared/UpgradeCard";
import TopSellingTable from "./shared/TopSellingTable";
import { CChart } from "@coreui/react-chartjs";
import { useState } from "react";
import { useApi } from "app/hooks/useApi";
import { useEffect } from "react";
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

export default function DashRH() {

  const { palette } = useTheme();


  const [processosMensais, setProcessosMensais] = useState([])
  const [processosDiario, setProcessosDiario] = useState([])
  const visaTypes = ["Turismo", "Trabalho", "Curta Duração", "Fronteira"];
  async function buscarEstatisicas() {
    const processosMensais = await useApi().list("processos/estatistica")
    console.log("PROCESSOS MENSAIS", processosMensais);
    setProcessosMensais(prev => processosMensais?.data)

    const processosDiario = await useApi().list("processos/estatisticadiaria")
    console.log("PROCESSOS Diario", processosDiario);
    setProcessosDiario(prev => processosDiario?.data);
  }

  useEffect(() => {
    buscarEstatisicas()
  }, [])

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
              <Title>FUNCIONARIOS </Title>
              <SubTitle>Últimos 30 dias</SubTitle>
              <CChart
                type="bar"
                data={{
                  labels: Object.keys(processosMensais),
                  datasets: visaTypes.map((visaType, index) => {
                    const colors = [
                      'rgba(255, 99, 132, 0.2)', // Turismo color
                      'rgba(54, 162, 235, 0.2)', // Trabalho color
                      'rgba(75, 192, 192, 0.2)', // Curta Duração color
                      'rgba(45, 292, 12, 0.2)'
                    ];
                    const borderColors = [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(75, 192, 192, 1)'
                    ];
                    return {
                      label: visaType,
                      data: Object.values(processosMensais).map(monthData => {
                        const visa = monthData?.find(v => v.tipoVisto === visaType);
                        return visa ? visa.count : 0;

                      }),
                      backgroundColor: colors[index],
                      borderColor: borderColors[index],
                      borderWidth: 1
                    };
                  })
                }}
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: "#41B883",
                      }
                    }
                  }
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
