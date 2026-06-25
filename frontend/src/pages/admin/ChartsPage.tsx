import { Box, Typography, Paper } from "@mui/material";
import AlertActivityChart from "../../components/graphs/AlertActivityChart";

export default function ChartsPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: 3,
        background: "linear-gradient(180deg, #f8fbff 0%, #eef3ff 100%)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{
          color: "#2152ff",
          fontFamily: "'Inter', 'Poppins', sans-serif",
          textShadow: "0 2px 8px rgba(33,82,255,0.15)",
        }}
      >
        Charts & Analytics
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
          sx={{ color: "#2152ff", fontFamily: "'Inter', 'Poppins', sans-serif" }}
        >
          Alert Activity Overview
        </Typography>

        {/* Chart Component */}
        <AlertActivityChart />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
          sx={{ color: "#2152ff", fontFamily: "'Inter', 'Poppins', sans-serif" }}
        >
          Weekly Summary
        </Typography>

        <Typography sx={{ color: "#555", fontSize: 15 }}>
          Here you can visualize weekly flagged messages, resolved cases, and other key data
          trends. Use this section to track platform activity and ensure proactive moderation.
        </Typography>
      </Paper>
    </Box>
  );
}
