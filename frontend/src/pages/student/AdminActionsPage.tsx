import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";
import { auth } from "../../services/Firebase";
import axios from "axios";

interface AdminAction {
  _id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  isWarning: boolean;
  warningType?: string;
  severity: string;
  adminNotes: string;
  escalationAction?: string;
  escalationDuration?: number;
  createdAt: string;
  caseStatus: string;
}

interface AdminActionsPageProps {
  onBack: () => void;
  darkMode: boolean;
  studentMongoId?: string;
}

const AdminActionsPage: React.FC<AdminActionsPageProps> = ({
  onBack,
  darkMode,
  studentMongoId,
}) => {
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = studentMongoId || auth.currentUser?.uid;

  useEffect(() => {
    const fetchAdminActions = async () => {
      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching admin actions for userId:", userId);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL"}/api/admins/actions/student/${userId}`,
        );

        console.log("📨 Raw API response:", response);
        console.log("📨 Response data length:", response.data?.length);
        console.log("📨 All messages fetched:", response.data);

        // Safety check: ensure response.data is an array
        if (!response.data || !Array.isArray(response.data)) {
          console.warn(
            "⚠️ Response data is not in expected format:",
            response.data,
          );
          setActions([]);
          setLoading(false);
          return;
        }

        // Response is expected to already be admin actions for this student
        const actionsList = Array.isArray(response.data) ? response.data : [];
        setActions(
          actionsList.sort(
            (a: AdminAction, b: AdminAction) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      } catch (err) {
        console.error("❌ Error fetching admin actions:", err);
        setError("Failed to load admin actions and warnings");
        setActions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminActions();
  }, [userId]);

  const colorsDynamic = {
    mainBg: darkMode ? "#0f1419" : "#f5f7fa",
    cardBg: darkMode ? "#1a223f" : "#ffffff",
    textPrimary: darkMode ? "#ffffff" : "#222222",
    textSecondary: darkMode ? "#a0b0d0" : "#666666",
    borderColor: darkMode ? "#21325b" : "#e0e0e0",
    warningBg: darkMode ? "#2d1f1f" : "#fff3e0",
    warningText: "#ff6d00",
    restrictBg: darkMode ? "#1f2d3d" : "#e3f2fd",
    restrictText: "#0277bd",
    suspendBg: darkMode ? "#2d1f3d" : "#f3e5f5",
    suspendText: "#7b1fa2",
    banBg: darkMode ? "#3d1f1f" : "#ffebee",
    banText: "#c62828",
  };

  const getActionIcon = (
    action: string | undefined,
    warningType: string | undefined,
  ) => {
    if (!action && !warningType) return null;

    if (action === "restrict")
      return (
        <BlockRoundedIcon
          sx={{ fontSize: 28, color: colorsDynamic.restrictText }}
        />
      );
    if (action === "suspend")
      return (
        <PauseCircleRoundedIcon
          sx={{ fontSize: 28, color: colorsDynamic.suspendText }}
        />
      );
    if (action === "ban")
      return (
        <GppBadRoundedIcon
          sx={{ fontSize: 28, color: colorsDynamic.banText }}
        />
      );

    return (
      <WarningAmberRoundedIcon
        sx={{ fontSize: 28, color: colorsDynamic.warningText }}
      />
    );
  };

  const getActionColor = (
    action: string | undefined,
    warningType: string | undefined,
  ) => {
    if (!action && !warningType) return colorsDynamic.warningBg;

    if (action === "restrict") return colorsDynamic.restrictBg;
    if (action === "suspend") return colorsDynamic.suspendBg;
    if (action === "ban") return colorsDynamic.banBg;

    return colorsDynamic.warningBg;
  };

  const getActionLabel = (
    action: string | undefined,
    warningType: string | undefined,
  ) => {
    if (action === "restrict") return "🔒 User Restricted";
    if (action === "suspend") return "⏸️ Account Suspended";
    if (action === "ban") return "🚫 Account Banned";
    if (warningType)
      return `📧 ${warningType.charAt(0).toUpperCase() + warningType.slice(1)} Warning`;

    return "⚠️ Admin Action";
  };

  const getChipColor = (action: string | undefined) => {
    if (action === "restrict") return "warning";
    if (action === "suspend") return "warning";
    if (action === "ban") return "error";
    return "info";
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: colorsDynamic.mainBg,
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)",
          padding: "24px",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "white",
            textTransform: "none",
            fontSize: 14,
            "&:hover": { background: "rgba(255,255,255,0.2)" },
          }}
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
          📋 Admin Actions & Warnings
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#2152ff" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : actions.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              background: colorsDynamic.cardBg,
              border: `1px solid ${colorsDynamic.borderColor}`,
              borderRadius: 3,
            }}
          >
            <WarningAmberRoundedIcon
              sx={{ fontSize: 48, color: "#ffb900", mb: 2 }}
            />
            <Typography
              variant="h6"
              sx={{ color: colorsDynamic.textPrimary, fontWeight: 600 }}
            >
              ✅ No Active Warnings or Actions
            </Typography>
            <Typography sx={{ color: colorsDynamic.textSecondary, mt: 1 }}>
              You're all clear! Keep maintaining respectful behavior.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {actions.map((action) => (
              <Grid item xs={12} key={action._id}>
                <Card
                  sx={{
                    background: getActionColor(
                      action.escalationAction,
                      action.warningType,
                    ),
                    border: `2px solid ${colorsDynamic.borderColor}`,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(33, 82, 255, 0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      {/* Icon */}
                      <Box sx={{ mt: 0.5 }}>
                        {getActionIcon(
                          action.escalationAction,
                          action.warningType,
                        )}
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1 }}>
                        {/* Title and Badge */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: colorsDynamic.textPrimary,
                            }}
                          >
                            {getActionLabel(
                              action.escalationAction,
                              action.warningType,
                            )}
                          </Typography>
                          <Chip
                            label={action.caseStatus}
                            size="small"
                            color={getChipColor(action.escalationAction) as any}
                            variant="outlined"
                          />
                        </Box>

                        {/* Timestamp */}
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: colorsDynamic.textSecondary,
                            mb: 2,
                          }}
                        >
                          {new Date(action.createdAt).toLocaleString()}
                        </Typography>

                        <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                        {/* Message/Description */}
                        {action.text && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              sx={{
                                fontSize: 13,
                                color: colorsDynamic.textPrimary,
                                lineHeight: 1.6,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {action.text}
                            </Typography>
                          </Box>
                        )}

                        {/* Admin Notes */}
                        {action.adminNotes && (
                          <Box
                            sx={{
                              backgroundColor: "rgba(0,0,0,0.05)",
                              p: 1.5,
                              borderRadius: 1,
                              mb: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: colorsDynamic.textSecondary,
                                mb: 0.5,
                              }}
                            >
                              📝 Admin Notes:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: colorsDynamic.textPrimary,
                                lineHeight: 1.5,
                              }}
                            >
                              {action.adminNotes}
                            </Typography>
                          </Box>
                        )}

                        {/* Duration */}
                        {action.escalationDuration && (
                          <Box sx={{ display: "flex", gap: 2, mt: 1.5 }}>
                            <Chip
                              label={`⏱️ ${action.escalationDuration} Days`}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        )}

                        {/* Severity */}
                        {action.severity && (
                          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                            <Chip
                              label={`Severity: ${action.severity}`}
                              size="small"
                              variant={
                                action.severity === "High"
                                  ? "filled"
                                  : "outlined"
                              }
                              color={
                                action.severity === "High" ? "error" : "warning"
                              }
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Info Box */}
        {actions.length > 0 && (
          <Alert
            severity="info"
            sx={{ mt: 3, backgroundColor: "rgba(33, 82, 255, 0.1)" }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
              💡 <strong>What does this mean?</strong> These are administrative
              actions taken in response to reported policy violations. Review
              them carefully and contact support if you have any questions.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default AdminActionsPage;
