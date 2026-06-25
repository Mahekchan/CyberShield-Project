import { Grid, Paper, Typography, Box, Avatar, Stack } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const stats = [
  {
    title: "Total Alerts",
    value: 247,
    icon: <InfoOutlinedIcon color="primary" />,
    trendIcon: (
      <TrendingDownIcon
        sx={{ color: "#34c759", fontSize: 20, verticalAlign: "middle" }}
      />
    ),
    trendText: "12% from last month",
    isUp: false,
    trendColor: "#34c759",
    iconBg: "#e6edfb",
  },
  {
    title: "Active Cases",
    value: 18,
    icon: <WarningAmberOutlinedIcon sx={{ color: "#f59e42" }} />,
    trendIcon: (
      <TrendingUpIcon
        sx={{ color: "#ef4444", fontSize: 20, verticalAlign: "middle" }}
      />
    ),
    trendText: "3% from last week",
    isUp: true,
    trendColor: "#ef4444",
    iconBg: "#fdf6e3",
  },
  {
    title: "Resolved Cases",
    value: 189,
    icon: <CheckCircleOutlineOutlinedIcon sx={{ color: "#22c55e" }} />,
    trendIcon: (
      <TrendingUpIcon
        sx={{ color: "#34c759", fontSize: 20, verticalAlign: "middle" }}
      />
    ),
    trendText: "8% from last month",
    isUp: true,
    trendColor: "#34c759",
    iconBg: "#e9fbe8",
  },
  {
    title: "Monitored Platforms",
    value: 7,
    icon: <BarChartOutlinedIcon sx={{ color: "#a78bfa" }} />,
    trendIcon: null,
    trendText: "+1 new platform added",
    isUp: true,
    trendColor: "#7c3aed",
    iconBg: "#f3e8ff",
  },
  {
    title: "Flagged Incidents",
    value: 0,
    icon: <WarningAmberOutlinedIcon sx={{ color: "#d32f2f" }} />,
    trendIcon: (
      <TrendingDownIcon
        sx={{ color: "#34c759", fontSize: 20, verticalAlign: "middle" }}
      />
    ),
    trendText: "5% decrease",
    isUp: false,
    trendColor: "#34c759",
    iconBg: "#ffebee",
  },
];

export default function StatsCards() {
  return (
    <Grid container spacing={3} mb={2}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} lg={4} xl={2.4} key={stat.title}>
          <Paper sx={{ p: 3, borderRadius: 4, textAlign: "center" }}>
            <Stack direction="column" alignItems="center" spacing={1}>
              <Avatar sx={{ bgcolor: stat.iconBg, width: 48, height: 48 }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ fontSize: "0.75rem" }}
                >
                  {stat.title}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.75rem", my: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  color={stat.trendColor}
                  fontWeight={600}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.trendIcon && stat.trendIcon}
                  {stat.isUp === false
                    ? "↓"
                    : stat.isUp === true
                      ? "↑"
                      : ""}{" "}
                  {stat.trendText}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
