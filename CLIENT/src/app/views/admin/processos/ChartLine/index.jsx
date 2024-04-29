import { Chart } from "react-google-charts";

// export const data = [
//   ["Year", "Sales", "Expenses"],
//   ["2004", 1000, 400],
//   ["2005", 1170, 460],
//   ["2006", 660, 1120],
//   ["2007", 1030, 540]
// ];

// export const options = {
//   title: "Company Performance",
//   curveType: "function",
//   legend: { position: "bottom" }
// };
 function ChartLine(
  {
    data = [
      ["Year", "submetidos", "Recusados"],
      ["2004", 1000, 400],
      ["2005", 1170, 460],
      ["2006", 660, 1120],
      ["2007", 1030, 540]
    ],
    options = {
      title: "Grafico",
      curveType: "function",
      legend: { position: "bottom" }
    }
  },
  ...props
) {
  return (
    <Chart
      props={props}
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
