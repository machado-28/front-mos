import { useTheme } from "@mui/material/styles";
import { useApi } from "app/hooks/useApi";
import ReactEcharts from "echarts-for-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PizzaSecretaria({ height, color = [] }) {
  const theme = useTheme();
  const redirect = useNavigate()
  const [processos, setProcesos] = useState();
  const api = useApi();

  async function BuscarProcesso() {
    await api.list("processos/dashboard").then((res) => {
      if (res.status === 200) {
        setProcesos(res.data?.processos);
        console.log(res);
      }
    }).catch(() => {
      redirect("/500")
    })
  }

  useEffect(() => {
    BuscarProcesso()
  }, [])
  const option = {
    legend: {
      show: true,
      itemGap: 10,
      icon: "circle",
      bottom: 0,
      textStyle: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: "roboto" }
    },
    tooltip: { show: false, trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    xAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],
    yAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],

    series: [
      {
        name: "Traffic Rate",
        type: "pie",
        radius: ["45%", "72.55%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        hoverOffset: 5,
        stillShowZeroSum: false,
        label: {
          normal: {
            show: false,
            position: "center", // shows the description data to center, turn off to show in right side
            textStyle: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: "roboto" },
            formatter: "{a}"
          },
          emphasis: {
            show: true,
            textStyle: { fontSize: "14", fontWeight: "normal" },
            formatter: "{b} \n{c} ({d}%)"
          }
        },
        labelLine: { normal: { show: false } },
        data: [
          { value: 65, name: "Processos pendentes" },
          { value: 15, name: "Vistos submetidos" },
          { value: 15, name: "Procesos aprovados" },
          { value: 15, name: "Processos recusados" },
        ],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" }
        }
      }
    ]
  };

  return <ReactEcharts style={{ height: height }} option={{ ...option, color: [...color] }} />;
}
