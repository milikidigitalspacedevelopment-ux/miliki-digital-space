import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#005c2c",
  "#198754",
  "#d4a017",
  "#ffc107"
];

function DonutChartComponent({
  data = [],
}) {
  const series = data || [];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>

        <Pie
          data={series}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={120}
          paddingAngle={4}
        >
          {series.map((item, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />

      </PieChart>
    </ResponsiveContainer>
  );
}

export default DonutChartComponent;