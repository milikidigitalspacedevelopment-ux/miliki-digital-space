import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#005c2c",
  "#0c7b3e",
  "#d4a017",
  "#1f2937",
  "#198754",
];

function PieChartComponent({
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
          outerRadius={120}
          label
        >
          {series.map((entry, index) => (
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

export default PieChartComponent;