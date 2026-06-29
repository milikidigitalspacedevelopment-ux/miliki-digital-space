import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer
} from "recharts";

function RadialChartComponent({
  data
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        innerRadius="20%"
        outerRadius="90%"
        data={data}
      >
        <RadialBar
          dataKey="value"
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export default RadialChartComponent;