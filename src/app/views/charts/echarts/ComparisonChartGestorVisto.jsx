import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

export default function ComparisonChartGestorVisto({ height, color = [] }) {
  const theme = useTheme();

  const option = {
    grid: { top: "10%", bottom: "10%", right: "5%" },
    legend: { show: false },
    color: ["#223388", "rgba(34, 51, 136, 0.8)"],
    barGap: 0,
    barMaxWidth: "64px",
    dataset: {
      source: [
        ["Mês", "Website", "App"],
        ["Jan", 299, 1000],
        ["Fev", 800, 500],
        ["Mar", 700, 1350],
        ["Abril", 1500, 1250],
        ["Maio", 2450, 450],
        ["Junh", 1700, 1250],
        ["Julh", 1700, 1250],
        [("Agost", 1700, 1250)],
        [("Set", 1700, 1250)],
        [("Out", 1700, 1250)],
        [("Nov", 1700, 1250)],
        [("Dezem", 1700, 1250)]
      ]
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
