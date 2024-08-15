import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

export default function FormtGrafico({ height, dadosMensais }) {
  const theme = useTheme();

  const adaptarDadosParaGrafico = (dadosMensais) => {
    // Adapta os dados para o formato necessário pelo gráfico
    const dadosFormatados = [["Mês", "Total", "Porcentagem"]];

    // Calcula a soma total dos processos
    const totalProcessos = dadosMensais.reduce((total, mes) => total + mes.total, 0);

    // Calcula as porcentagens para cada mês
    dadosMensais.forEach((mes) => {
      const porcentagem = (mes.total / totalProcessos) * 100;
      dadosFormatados.push([mes.mes, mes.total, porcentagem]);
    });

    return dadosFormatados;
  };

  const dadosFormatados = adaptarDadosParaGrafico(dadosMensais);

  const option = {
    grid: { top: "10%", bottom: "10%", right: "5%" },
    legend: { show: false },
    color: ["#223388", "rgba(34, 51, 136, 0.8)"],
    barGap: 0,
    barMaxWidth: "64px",
    dataset: {
      source: dadosFormatados
    },
    xAxis: {
      type: "category",
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 13, fontFamily: "roboto", color: theme.palette.text.secondary }
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 } },
      axisLabel: { fontSize: 13, fontFamily: "roboto", color: theme.palette.text.secondary }
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [{ type: "bar" }, { type: "bar" }]
  };

  return <ReactEcharts style={{ height: height }} option={{ ...option }} />;
}
