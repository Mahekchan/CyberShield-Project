import { Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", alerts: 2 },
  { day: "Tue", alerts: 3 },
  { day: "Wed", alerts: 1 },
  { day: "Thu", alerts: 4 },
  { day: "Fri", alerts: 5 },
  { day: "Sat", alerts: 3 },
  { day: "Sun", alerts: 2 },
];

export default function AlertActivityChart() {
  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 12 }} />
          <YAxis tick={{ fill: "#555", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="alerts"
            stroke="#2152ff"
            strokeWidth={3}
            dot={{ r: 5, fill: "#21d4fd" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
