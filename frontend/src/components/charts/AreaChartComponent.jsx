import {
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

function AreaChartComponent({
  data,
  dataKey,
  xAxisKey
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>

        <CartesianGrid strokeDasharray="3 3"/>

        <XAxis dataKey={xAxisKey}/>

        <YAxis/>

        <Tooltip/>

        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#005c2c"
          fill="#198754"
        />

      </AreaChart>

    </ResponsiveContainer>
  );
}

export default AreaChartComponent;