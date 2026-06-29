import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

function BarChartComponent({
  data,
  dataKey,
  xAxisKey
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey={xAxisKey} />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey={dataKey}
          radius={[8, 8, 0, 0]}
        />

      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartComponent;