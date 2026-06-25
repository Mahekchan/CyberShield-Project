import { Box, Typography, Paper } from "@mui/material";
import AlertActivityChart from "../../components/graphs/AlertActivityChart";

export default function Graphs() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ color: "#2152ff", mb: 2 }}
      >
        Graphs
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
          fontWeight={600}
          sx={{ mb: 2, color: "#2152ff" }}
        >
          Alert Activity Overview
        </Typography>

        {/* ✅ The graph will appear here */}
        <Box sx={{ height: 300 }}>
          <AlertActivityChart />
        </Box>
      </Paper>
    </Box>
  );
}
