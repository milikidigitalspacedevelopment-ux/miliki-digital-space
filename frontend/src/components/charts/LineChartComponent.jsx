import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

function LineChartComponent({
  data,
  dataKey,
  xAxisKey
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey={xAxisKey} />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey={dataKey}
          strokeWidth={3}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;