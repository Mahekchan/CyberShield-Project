import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ChatIcon from "@mui/icons-material/Chat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import axios from "axios";

interface Analytics {
  totalMessages: number;
  totalQuestions: number;
  helpfulFeedback: number;
  notHelpfulFeedback: number;
  averageResponseTime: number;
  topQuestions: Array<{ question: string; count: number }>;
  feedbackRatio: number;
}

interface DashboardProps {
  userType: "student" | "admin";
  userId?: string;
}

const ChatbotAnalyticsDashboard: React.FC<DashboardProps> = ({
  userType,
  userId,
}) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [userType, userId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const endpoint =
        userType === "admin"
          ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/chatbot/analytics/all`
          : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/chatbot/analytics/user/${userId}`;

      const response = await axios.get(endpoint);
      setAnalytics(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analytics) {
    return <Alert severity="info">No analytics data available</Alert>;
  }

  const helpfulPercentage =
    analytics.totalMessages > 0
      ? Math.round(
          (analytics.helpfulFeedback /
            (analytics.helpfulFeedback + analytics.notHelpfulFeedback)) *
            100,
        )
      : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", color: "#2152ff" }}
      >
        📊 Chatbot Analytics Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Total Messages */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ChatIcon sx={{ mr: 1 }} />
                <Typography variant="caption">Total Messages</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {analytics.totalMessages}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Questions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="caption">Questions Asked</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {analytics.totalQuestions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Helpful Feedback */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ThumbUpIcon sx={{ mr: 1 }} />
                <Typography variant="caption">Helpful</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {analytics.helpfulFeedback}
              </Typography>
              <Typography variant="caption">
                {helpfulPercentage}% positive
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Not Helpful Feedback */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ThumbDownIcon sx={{ mr: 1 }} />
                <Typography variant="caption">Not Helpful</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {analytics.notHelpfulFeedback}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feedback Ratio */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Feedback Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Positive Feedback</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {helpfulPercentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={helpfulPercentage}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Negative Feedback</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {100 - helpfulPercentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={100 - helpfulPercentage}
                sx={{ height: 8, borderRadius: 4, backgroundColor: "#f5f5f5" }}
                color="error"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Questions */}
      {analytics.topQuestions && analytics.topQuestions.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Most Asked Questions
          </Typography>
          <List>
            {analytics.topQuestions.slice(0, 5).map((item, index) => (
              <Box key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: "500" }}>
                        {index + 1}. {item.question}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        Asked {item.count} time{item.count > 1 ? "s" : ""}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < analytics.topQuestions.slice(0, 5).length - 1 && (
                  <Divider />
                )}
              </Box>
            ))}
          </List>
        </Paper>
      )}

      {/* Average Response Time */}
      {analytics.averageResponseTime > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            ⏱️ Average Response Time
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "#2152ff", fontWeight: "bold" }}
          >
            {analytics.averageResponseTime.toFixed(2)} ms
          </Typography>
          <Typography variant="caption" sx={{ color: "#666" }}>
            Time taken to generate responses
          </Typography>
        </Paper>
      )}

      {/* Refresh Button */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{
            color: "#2152ff",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={fetchAnalytics}
        >
          ↻ Refresh Analytics
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatbotAnalyticsDashboard;
