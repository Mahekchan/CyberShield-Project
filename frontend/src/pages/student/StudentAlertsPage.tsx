import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

interface FlaggedAlert {
  _id: string;
  senderName: string;
  receiverName: string;
  text: string;
  comment?: string;
  severity: "High" | "Medium" | "Low";
  caseStatus: string;
  platform?: string;
  labels?: string[];
  createdAt: string;
  isFlagged: boolean;
}

export default function StudentAlertsPage({
  onBack,
  darkMode,
  studentMongoId,
}: {
  onBack: () => void;
  darkMode: boolean;
  studentMongoId: string;
}) {
  const [alerts, setAlerts] = useState<FlaggedAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const colorsDynamic = {
    sidebarBg: darkMode
      ? "linear-gradient(160deg, #111a2f 0%, #172a4c 80%, #161e35 100%)"
      : "#fff",
    mainBg: darkMode ? "#111a2f" : "#f8f9fe",
    cardBg: darkMode ? "#1a223f" : "#fff",
    cardShadow: darkMode ? "0 4px 24px #102a4d70" : "0 8px 32px 0 #2152ff22",
    chatText: darkMode ? "#d5e4ff" : "#23243a",
    buttonBg: "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)",
    buttonText: "#fff",
    alertBg: darkMode ? "#232b41" : "#f0f6ff",
    alertText: darkMode ? "#d8e7ff" : "#2152ff",
    divider: darkMode ? "#22304a" : "#d9e3fa",
    highSeverity: "#ff4d4f",
    mediumSeverity: "#ffc84b",
    lowSeverity: "#38d996",
    iconColor: "#2152ff",
  };

  // Fetch alerts from backend
  useEffect(() => {
    if (!studentMongoId) {
      setLoadingAlerts(false);
      return;
    }

    setLoadingAlerts(true);
    fetch(`${API_URL}/api/alerts/student/${studentMongoId}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedAlerts = Array.isArray(data)
          ? data.sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
          : [];
        setAlerts(sortedAlerts);
        setUnreadCount(sortedAlerts.length);
      })
      .catch((err) => {
        console.error("Error fetching alerts:", err);
        setAlerts([]);
      })
      .finally(() => setLoadingAlerts(false));
  }, [studentMongoId]);

  // Real-time WebSocket for new alerts
  useEffect(() => {
    const socket: Socket = io(API_URL);

    socket.on("flagged_message_student", (data: any) => {
      // Check if this alert is for the current student
      if (
        data.receiverId === studentMongoId ||
        data.receiverMongoId === studentMongoId
      ) {
        const newAlert: FlaggedAlert = {
          _id: data._id || Date.now().toString(),
          senderName: data.senderName || "Unknown",
          receiverName: data.receiverName || "Unknown",
          text: data.text || "",
          comment: data.comment || data.text || "",
          severity: data.severity || "Low",
          caseStatus: data.caseStatus || "Flagged",
          platform: data.platform || "Unknown",
          labels: [data.severity || "Flagged"],
          createdAt: new Date().toISOString(),
          isFlagged: true,
        };
        setAlerts((prev) => [newAlert, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [studentMongoId]);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "HIGH":
        return colorsDynamic.highSeverity;
      case "MEDIUM":
        return colorsDynamic.mediumSeverity;
      case "LOW":
        return colorsDynamic.lowSeverity;
      default:
        return colorsDynamic.mediumSeverity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "flagged":
        return "#ff4d4f";
      case "pending":
      case "pending review":
        return "#ffc84b";
      case "resolved":
      case "low priority":
        return "#38d996";
      default:
        return "#2152ff";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <Box
      sx={{
        p: 4,
        pt: 3.5,
        background: colorsDynamic.mainBg,
        minHeight: "100vh",
        color: colorsDynamic.chatText,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: colorsDynamic.alertText,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          Back to Dashboard
        </Button>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: colorsDynamic.alertText,
          }}
        >
          My Alerts
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: colorsDynamic.cardBg,
              boxShadow: "0 2px 10px #2152ff0a",
              border: `1.5px solid ${colorsDynamic.divider}`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: colorsDynamic.highSeverity }}
            >
              {alerts.filter((a) => a.severity === "High").length}
            </Typography>
            <Typography sx={{ color: colorsDynamic.chatText, fontSize: 14 }}>
              High Severity
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: colorsDynamic.cardBg,
              boxShadow: "0 2px 10px #2152ff0a",
              border: `1.5px solid ${colorsDynamic.divider}`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: colorsDynamic.mediumSeverity }}
            >
              {alerts.filter((a) => a.severity === "Medium").length}
            </Typography>
            <Typography sx={{ color: colorsDynamic.chatText, fontSize: 14 }}>
              Medium Severity
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: colorsDynamic.cardBg,
              boxShadow: "0 2px 10px #2152ff0a",
              border: `1.5px solid ${colorsDynamic.divider}`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: colorsDynamic.lowSeverity }}
            >
              {alerts.filter((a) => a.severity === "Low").length}
            </Typography>
            <Typography sx={{ color: colorsDynamic.chatText, fontSize: 14 }}>
              Low Severity
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: colorsDynamic.cardBg,
              boxShadow: "0 2px 10px #2152ff0a",
              border: `1.5px solid ${colorsDynamic.divider}`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: colorsDynamic.iconColor }}
            >
              {alerts.length}
            </Typography>
            <Typography sx={{ color: colorsDynamic.chatText, fontSize: 14 }}>
              Total Alerts
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Alerts Table */}
      <Paper
        sx={{
          borderRadius: 2,
          background: colorsDynamic.cardBg,
          boxShadow: colorsDynamic.cardShadow,
          border: `1.5px solid ${colorsDynamic.divider}`,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          {loadingAlerts ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress sx={{ color: colorsDynamic.iconColor }} />
            </Box>
          ) : alerts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <CheckCircleIcon
                sx={{ fontSize: 64, color: colorsDynamic.lowSeverity, mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: colorsDynamic.chatText, mb: 1 }}
              >
                No Alerts
              </Typography>
              <Typography sx={{ color: colorsDynamic.chatText, fontSize: 14 }}>
                You're all clear! No bullying alerts have been detected.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ background: darkMode ? "#232b41" : "#f0f6ff" }}>
                  <TableCell
                    sx={{ color: colorsDynamic.alertText, fontWeight: 700 }}
                  >
                    From
                  </TableCell>
                  <TableCell
                    sx={{ color: colorsDynamic.alertText, fontWeight: 700 }}
                  >
                    Message
                  </TableCell>
                  <TableCell
                    sx={{ color: colorsDynamic.alertText, fontWeight: 700 }}
                  >
                    Severity
                  </TableCell>
                  <TableCell
                    sx={{ color: colorsDynamic.alertText, fontWeight: 700 }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ color: colorsDynamic.alertText, fontWeight: 700 }}
                  >
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert, index) => (
                  <TableRow
                    key={alert._id || index}
                    sx={{
                      background:
                        index % 2 === 0
                          ? colorsDynamic.cardBg
                          : darkMode
                            ? "#212738"
                            : "#fafbfc",
                      borderBottom: `1px solid ${colorsDynamic.divider}`,
                      "&:hover": {
                        background: darkMode ? "#252d41" : "#f5f9ff",
                      },
                    }}
                  >
                    <TableCell sx={{ color: colorsDynamic.chatText }}>
                      <Tooltip title={alert.senderName}>
                        <Typography
                          noWrap
                          sx={{ maxWidth: 150, fontWeight: 600 }}
                        >
                          {alert.senderName || "Unknown"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ color: colorsDynamic.chatText }}>
                      <Tooltip title={alert.text || alert.comment || ""}>
                        <Typography noWrap sx={{ maxWidth: 250 }}>
                          {alert.text || alert.comment || "No message"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.severity || "Unknown"}
                        sx={{
                          background: getSeverityColor(alert.severity),
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.caseStatus || "Pending"}
                        sx={{
                          background: getStatusColor(alert.caseStatus),
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ color: colorsDynamic.chatText, fontSize: 14 }}
                    >
                      {formatDate(alert.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
}
