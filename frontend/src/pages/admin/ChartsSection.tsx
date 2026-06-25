// src/pages/admin/ChartsSection.tsx
import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface ChartsSectionProps {
  activeUsers: number;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ activeUsers }) => {
  const barData = [
    { name: "Active Users", users: activeUsers, reports: 20 },
    { name: "Inactive Users", users: Math.max(0, 100 - activeUsers), reports: 10 },
  ];

  const lineData = [
    { month: "Jan", users: 50, reports: 12 },
    { month: "Feb", users: 70, reports: 15 },
    { month: "Mar", users: 80, reports: 25 },
    { month: "Apr", users: 65, reports: 20 },
    { month: "May", users: 90, reports: 30 },
  ];

  const pieData = [
    { name: "Active", value: activeUsers },
    { name: "Inactive", value: Math.max(0, 100 - activeUsers) },
    { name: "Pending", value: 10 },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Dashboard Analytics
      </Typography>

      <Grid container spacing={4}>
        {/* === BAR CHART === */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#4FC3F7" name="Users" />
                <Bar dataKey="reports" fill="#81C784" name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* === LINE CHART === */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly User Growth
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#4FC3F7" strokeWidth={3} name="Users" />
                <Line type="monotone" dataKey="reports" stroke="#81C784" strokeWidth={3} name="Reports" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* === PIE CHART === */}
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Distribution
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ResponsiveContainer width="50%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartsSection;
