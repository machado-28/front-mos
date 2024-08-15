import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

export default function LineChart({ height, color = [] }) {
  const theme = useTheme();

  const option = {
    grid: { top: "10%", bottom: "10%", left: "5%", right: "5%" },
    legend: {
      itemGap: 20,
      icon: "circle",
      textStyle: {
        fontSize: 13,
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily
      }
    },
    label: {
      fontSize: 13,
      color: theme.palette.text.secondary,
      fontFamily: theme.typography.fontFamily
    },
    xAxis: {
      type: "category",
      data: [ "Sun","Seg", "Ter", "Qua", "Qui", "Sex", "Sáb",],
      axisLine: { show: true },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 14,
        fontFamily: "roboto",
        color:"warning"
      }
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color:"warning", opacity: 0.15 }
      },
      axisLabel: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: "roboto" }
    },
    series: [
      {
        data: [30, 40, 20, 50, 40, 80, 90],
        type: "line",
        stack: "Este Mês",
        name: "Este Mês",
        smooth: true,
        symbolSize: 4,
        lineStyle: { width: 4 }
      },
      {
        data: [0, 50, 15, 50, 30, 70, 95],
        type: "line",
        stack: "Mês Passado",
        name: "Mês Passado",
        smooth: true,
        symbolSize: 4,
        lineStyle: { width: 4 }
      }
    ]
  };

  return <ReactEcharts style={{ height: height }} option={{ ...option, color: [...color] }} />;
}
