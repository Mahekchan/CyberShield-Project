import { Paper, Typography, Box, Button, Stack } from "@mui/material";

const data = [48, 32, 60, 44, 22, 36, 0];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AlertActivityChart() {
  return (
    <Paper sx={{ mt: 3, p: 3, borderRadius: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Alert Activity
        </Typography>
        <Box>
          <Button variant="contained" size="small" sx={{ borderRadius: 2, fontWeight: 600, mr: 1 }}>
            Weekly
          </Button>
          <Button variant="text" size="small" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Monthly
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%", overflowX: "auto", height: 180, mt: 2, px: 1, pb: 1 }}>
        <Stack direction="row" alignItems="flex-end" spacing={3} sx={{ height: "100%" }}>
          {data.map((value, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: (value / 70) * 130 + 18,
                  background:
                    "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)",
                  borderRadius: 3,
                  mb: 1,
                  transition: "height 0.3s",
                  boxShadow: "0 2px 8px 0 #2563eb22",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {value}
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {days[i]}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}