import React, { useState } from "react";
import {
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
} from "@mui/material";

interface Alert {
  id?: number;
  _id?: string;
  severity?: "High" | "Medium" | "Low";
  description?: string;
  timeAgo?: string;
  senderName?: string;
  receiverName?: string;
  senderClass?: string | null;
  receiverClass?: string | null;
  status?: "flagged" | "pending" | "resolved";
  message?: string;
  student_email?: string;
  time?: string;
  [key: string]: any;
}

interface AlertsListProps {
  alerts?: Alert[];
  onMarkPending?: (id: string | number) => void;
  onResolve?: (id: string | number) => void;
  onViewAll?: () => void;
}

const initialAlerts: Alert[] = [
  {
    id: 1,
    severity: "High",
    description: "Detected threatening language in Instagram comments",
    timeAgo: "10 minutes ago",
    senderName: "Alex Johnson",
    receiverName: "Sam Smith",
    status: "flagged",
  },
  {
    id: 2,
    severity: "Medium",
    description: "Detected exclusionary behavior in group chat",
    timeAgo: "1 hour ago",
    senderName: "Jordan Davis",
    receiverName: "Taylor Brown",
    status: "flagged",
  },
  {
    id: 3,
    severity: "Low",
    description: "Detected potential name-calling in Discord server",
    timeAgo: "3 hours ago",
    senderName: "Casey Williams",
    receiverName: "Morgan Lee",
    status: "flagged",
  },
  {
    id: 4,
    severity: "Low",
    description: "Detected repeated negative comments on student forum",
    timeAgo: "Yesterday",
    senderName: "Riley Martinez",
    receiverName: "Riley Martinez",
    status: "pending",
  },
  {
    id: 5,
    severity: "Medium",
    description: "Suspicious private messages detected",
    timeAgo: "2 days ago",
    senderName: "Chris Anderson",
    receiverName: "Jordan White",
    status: "flagged",
  },
];

// Helper function to capitalize severity
function capitalizeSeverity(severity: string): "High" | "Medium" | "Low" {
  const lower = String(severity).toLowerCase();
  if (lower === "high") return "High";
  if (lower === "medium") return "Medium";
  return "Low";
}

function getSeverityColor(severity: string) {
  const normalized = capitalizeSeverity(severity);
  if (normalized === "High") return "#d32f2f"; // Red
  if (normalized === "Medium") return "#fbc02d"; // Yellow
  return "#1976d2"; // Blue
}

function getSeverityBg(severity: string) {
  const normalized = capitalizeSeverity(severity);
  if (normalized === "High") return "#ffebee";
  if (normalized === "Medium") return "#fff9c4";
  return "#e3f2fd";
}

function getSeverityBorder(severity: string) {
  const normalized = capitalizeSeverity(severity);
  if (normalized === "High") return "#ef5350";
  if (normalized === "Medium") return "#fdd835";
  return "#42a5f5";
}

function determineSeverity(status: string): "High" | "Medium" | "Low" {
  if (status === "Flagged" || status === "Pending Review") return "High";
  if (status === "Resolved") return "Low";
  return "Medium";
}

export default function AlertsList({
  alerts = initialAlerts,
  onMarkPending,
  onResolve,
  onViewAll,
}: AlertsListProps) {
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);

  // Update local alerts when props change
  React.useEffect(() => {
    if (alerts && alerts.length > 0) {
      setLocalAlerts(alerts);
    }
  }, [alerts]);

  const handleMarkPending = (id: string | number) => {
    setLocalAlerts(
      localAlerts.map((alert) =>
        alert._id === id || alert.id === id
          ? { ...alert, status: "pending" }
          : alert,
      ),
    );
    onMarkPending?.(id);
  };

  const handleResolve = (id: string | number) => {
    setLocalAlerts(
      localAlerts.map((alert) =>
        alert._id === id || alert.id === id
          ? { ...alert, status: "resolved" }
          : alert,
      ),
    );
    onResolve?.(id);
  };

  // Show only top 5 alerts
  const topAlerts = localAlerts.slice(0, 5);

  // Transform data for display
  const displayAlerts = topAlerts.map((alert) => {
    const normalizedSeverity = capitalizeSeverity(
      alert.severity || determineSeverity(alert.status || ""),
    );
    return {
      _id: alert._id,
      id: alert.id,
      severity: normalizedSeverity,
      description: alert.description || alert.message || "",
      timeAgo: alert.timeAgo || alert.time || "Recently",
      senderName: alert.senderName || "Unknown",
      receiverName: alert.receiverName || "Unknown",
      senderClass: alert.senderClass || null,
      receiverClass: alert.receiverClass || null,
      status:
        alert.status === "resolved"
          ? "resolved"
          : alert.status === "pending"
            ? "pending"
            : "flagged",
    };
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={700}>
          Recent Alerts
        </Typography>
        <Typography
          color="primary"
          variant="body2"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={onViewAll}
        >
          View All
        </Typography>
      </Box>
      <Stack spacing={2.5}>
        {displayAlerts.map((alert) => (
          <Box
            key={alert._id || alert.id}
            sx={{
              background: getSeverityBg(alert.severity),
              border: `2px solid ${getSeverityBorder(alert.severity)}`,
              borderRadius: 2.5,
              p: { xs: 2, sm: 2.5, md: 3 },
              borderLeft: `5px solid ${getSeverityColor(alert.severity)}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {/* Header with severity and status */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={2}
              flexWrap="wrap"
              gap={1}
            >
              <Box flex={1} minWidth={200}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={getSeverityColor(alert.severity)}
                  sx={{ mb: 0.5, fontSize: "1.1rem" }}
                >
                  {alert.severity} Severity Alert
                </Typography>
              </Box>
              <Chip
                label={alert.status.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor:
                    alert.status === "flagged"
                      ? "#d32f2f"
                      : getSeverityColor(alert.severity),
                  color: "white",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                }}
              />
            </Box>

            {/* Sender and Receiver */}
            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <AvatarGroup max={2} sx={{ flexDirection: "row" }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: "0.9rem",
                    bgcolor: getSeverityColor(alert.severity),
                  }}
                >
                  {alert.senderName.charAt(0)}
                </Avatar>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: "0.9rem",
                    bgcolor: getSeverityColor(alert.severity) + "99",
                  }}
                >
                  {alert.receiverName.charAt(0)}
                </Avatar>
              </AvatarGroup>
              <Box flex={1} minWidth={250}>
                <Typography
                  variant="body2"
                  sx={{ display: "block", fontWeight: 500 }}
                >
                  <strong>Sender:</strong> {alert.senderName}
                  {alert.senderClass ? (
                    <span
                      style={{ marginLeft: 6, color: "#555", fontWeight: 600 }}
                    >
                      ({alert.senderClass})
                    </span>
                  ) : null}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: "block", fontWeight: 500 }}
                >
                  <strong>Receiver:</strong> {alert.receiverName}
                  {alert.receiverClass ? (
                    <span
                      style={{ marginLeft: 6, color: "#555", fontWeight: 600 }}
                    >
                      ({alert.receiverClass})
                    </span>
                  ) : null}
                </Typography>
              </Box>
            </Box>

            {/* Alert Description */}
            <Typography
              variant="body1"
              color="#000"
              sx={{ mb: 2, fontWeight: 500, lineHeight: 1.6 }}
            >
              {alert.description}
            </Typography>

            {/* Time and Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 100 }}
              >
                {alert.timeAgo}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    handleMarkPending(
                      (alert._id || alert.id) as string | number,
                    )
                  }
                  disabled={alert.status === "resolved"}
                  sx={{
                    borderColor: getSeverityColor(alert.severity),
                    color: getSeverityColor(alert.severity),
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    padding: "8px 16px",
                    opacity: alert.status === "resolved" ? 0.5 : 1,
                    "&:hover": {
                      backgroundColor: getSeverityColor(alert.severity) + "08",
                      borderColor: getSeverityColor(alert.severity),
                    },
                  }}
                >
                  Mark Pending
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    handleResolve((alert._id || alert.id) as string | number)
                  }
                  disabled={alert.status === "resolved"}
                  sx={{
                    backgroundColor: getSeverityColor(alert.severity),
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    padding: "8px 16px",
                    opacity: alert.status === "resolved" ? 0.5 : 1,
                    "&:hover": {
                      backgroundColor: getSeverityColor(alert.severity),
                      opacity: 0.9,
                    },
                  }}
                >
                  Resolve
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
