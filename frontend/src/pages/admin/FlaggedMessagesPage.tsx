import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

interface FlaggedMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  isFlagged: boolean;
  severity?: "High" | "Medium" | "Low";
  caseStatus?: string;
  createdAt: string;
  senderName: string;
  receiverName?: string;
  senderClass?: string | null;
  receiverClass?: string | null;
}

const FlaggedMessagesPage: React.FC = () => {
  const [messages, setMessages] = React.useState<FlaggedMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "Flagged" | "Pending Review" | "Low Priority" | "all"
  >("Flagged");

  // Fetch flagged messages on mount only
  React.useEffect(() => {
    const fetchFlaggedMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/messages/flagged`);
        console.log(
          "FlaggedMessagesPage - fetched",
          Array.isArray(response.data)
            ? response.data.length
            : typeof response.data,
          response.data,
        );
        // Ensure caseStatus is set (default to "Flagged" if not provided)
        const messagesWithStatus = (response.data || []).map((msg: any) => ({
          ...msg,
          caseStatus: msg.caseStatus || "Flagged",
        }));
        setMessages(messagesWithStatus);
      } catch (error) {
        console.error("Error fetching flagged messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedMessages();
  }, []);

  const handleUpdateStatus = async (messageId: string, caseStatus: string) => {
    try {
      setUpdatingIds((s) => [...s, messageId]);

      const apiBase = API_URL;
      const res = await axios.put(
        `${apiBase}/api/messages/${messageId}/status`,
        {
          caseStatus,
        },
      );

      const updated = res.data?.data;
      if (updated) {
        setMessages((prev) =>
          prev.map((m) => (m._id === updated._id ? { ...m, ...updated } : m)),
        );
      } else {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, caseStatus } : m)),
        );
      }
    } catch (err) {
      console.error("Failed to update case status", err);
    } finally {
      setUpdatingIds((s) => s.filter((id) => id !== messageId));
    }
  };

  const handleMarkPending = (messageId: string) => {
    handleUpdateStatus(messageId, "Pending Review");
  };

  const handleResolve = (messageId: string) => {
    handleUpdateStatus(messageId, "Low Priority");
  };

  // Socket.io real-time updates (no polling)
  React.useEffect(() => {
    const socket = io(API_URL);

    socket.on("flagged_message", (data) => {
      // Add new flagged message to the top of the list
      setMessages((prev) => [data, ...prev]);
    });

    socket.on("case_status_updated", (data) => {
      // Update case status in real-time
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data._id ? { ...msg, caseStatus: data.status } : msg,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "#d32f2f"; // Red
      case "Medium":
        return "#fbc02d"; // Yellow
      case "Low":
        return "#1976d2"; // Blue
      default:
        return "#666";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "High":
        return "#ffebee";
      case "Medium":
        return "#fff9c4";
      case "Low":
        return "#e3f2fd";
      default:
        return "#f5f5f5";
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case "High":
        return "#ef5350";
      case "Medium":
        return "#fdd835";
      case "Low":
        return "#42a5f5";
      default:
        return "#ddd";
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <WarningIcon sx={{ fontSize: 32, color: "#ff9800" }} />
        <Typography variant="h4" fontWeight={700}>
          Flagged Messages
        </Typography>
        <Chip
          label={`${messages.length} total`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Button
          variant={filterStatus === "Flagged" ? "contained" : "outlined"}
          onClick={() => setFilterStatus("Flagged")}
          sx={{ fontWeight: 600 }}
        >
          Flagged
        </Button>
        <Button
          variant={filterStatus === "Pending Review" ? "contained" : "outlined"}
          onClick={() => setFilterStatus("Pending Review")}
          sx={{ fontWeight: 600 }}
        >
          Pending Review
        </Button>
        <Button
          variant={filterStatus === "Low Priority" ? "contained" : "outlined"}
          onClick={() => setFilterStatus("Low Priority")}
          sx={{ fontWeight: 600 }}
        >
          Low Priority
        </Button>
        <Button
          variant={filterStatus === "all" ? "contained" : "outlined"}
          onClick={() => setFilterStatus("all")}
          sx={{ fontWeight: 600 }}
        >
          All
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <Alert severity="success">No flagged messages at the moment.</Alert>
      ) : (
        <Stack spacing={2}>
          {messages
            .filter((msg) => {
              if (filterStatus === "all") return true;
              return msg.caseStatus === filterStatus;
            })
            .map((msg) => {
              const severity = msg.severity || "Low";
              const severityColor = getSeverityColor(severity);

              return (
                <Box
                  key={msg._id}
                  sx={{
                    background: getSeverityBg(severity),
                    border: `2px solid ${getSeverityBorder(severity)}`,
                    borderRadius: 2,
                    p: 2,
                    borderLeft: `5px solid ${severityColor}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  {/* Header with severity badge and status */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{ mb: 0.5 }}
                      >
                        {msg.text}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip
                        label="Status: Flagged"
                        size="small"
                        sx={{
                          backgroundColor: severityColor,
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          height: 24,
                        }}
                      />
                      <Chip
                        label={`Severity: ${severity}`}
                        size="small"
                        sx={{
                          backgroundColor: getSeverityColor(severity),
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 24,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Sender and Receiver info on one line */}
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      <strong>Sender:</strong> {msg.senderName || msg.senderId}
                      {msg.senderClass && (
                        <span style={{ marginLeft: 4, color: "#666" }}>
                          ({msg.senderClass})
                        </span>
                      )}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      <strong>Receiver:</strong>{" "}
                      {msg.receiverName || msg.receiverId || "Unknown"}
                      {msg.receiverClass && (
                        <span style={{ marginLeft: 4, color: "#666" }}>
                          ({msg.receiverClass})
                        </span>
                      )}
                    </Typography>
                  </Box>

                  {/* Time and Actions */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {new Date(msg.createdAt).toLocaleString()}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={
                          updatingIds.includes(msg._id) ||
                          msg.caseStatus === "Pending Review" ||
                          msg.caseStatus === "Low Priority"
                        }
                        onClick={() => handleMarkPending(msg._id)}
                        sx={{
                          backgroundColor: "#2152ff",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          padding: "5px 12px",
                          textTransform: "uppercase",
                          "&:hover": {
                            backgroundColor: "#1741b6",
                          },
                        }}
                      >
                        {updatingIds.includes(msg._id) ? (
                          <CircularProgress size={12} sx={{ color: "white" }} />
                        ) : (
                          "Mark Pending"
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={
                          updatingIds.includes(msg._id) ||
                          msg.caseStatus === "Low Priority"
                        }
                        onClick={() => handleResolve(msg._id)}
                        sx={{
                          backgroundColor: "#2cc76f",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          padding: "5px 12px",
                          textTransform: "uppercase",
                          "&:hover": {
                            backgroundColor: "#24b85f",
                          },
                        }}
                      >
                        {updatingIds.includes(msg._id) ? (
                          <CircularProgress size={12} sx={{ color: "white" }} />
                        ) : (
                          "Resolve"
                        )}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              );
            })}
        </Stack>
      )}
    </Box>
  );
};

export default FlaggedMessagesPage;
