import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Modal,
  IconButton,
  Button,
  Grid,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useState, useEffect, useMemo } from "react";
import { auth } from "../../services/Firebase";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

// Define the type for a flagged alert, consistent with your files.
type FlaggedAlert = {
  id: number;
  comment: string;
  cleaned: string;
  labels: string[];
  reasons: string[];
  created_at: string;
  platform?: string;
  privateNote?: string;
};

// Define the props for the component.
type StudentNotificationsPageProps = {
  onBack: () => void;
  darkMode: boolean;
};

const StudentNotificationsPage: React.FC<StudentNotificationsPageProps> = ({
  onBack,
  darkMode,
}) => {
  // --- Alerts & Real-Time Notifications ---
  const [alerts, setAlerts] = useState<FlaggedAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [incomingFlagged, setIncomingFlagged] = useState<FlaggedAlert | null>(
    null,
  );
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  // --- Private Note State ---
  const [privateNote, setPrivateNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // --- Dynamic Colors & Styles ---
  const colorsDynamic = useMemo(() => {
    return {
      mainBg: darkMode ? "#111a2f" : "#f8f9fe",
      cardBg: darkMode ? "#1a223f" : "#fff",
      cardShadow: darkMode ? "0 4px 24px #102a4d70" : "0 8px 32px 0 #2152ff22",
      textPrimary: darkMode ? "#d8e7ff" : "#2152ff",
      textSecondary: darkMode ? "#a0b0d0" : "#446",
      divider: darkMode ? "#22304a" : "#d9e3fa",
      inputBg: darkMode ? "#2d3759" : "#fff",
      inputBorder: darkMode ? "#4a5a7a" : "#e3eafc",
      inputColor: darkMode ? "#fff" : "#222",
      inputLabel: darkMode ? "#a0b0d0" : "#2152ff",
      alertCardBg: darkMode
        ? "linear-gradient(90deg, #1b253b 0%, #1e2840 100%)"
        : "#f0f6ff",
      alertCardText: darkMode ? "#d8e7ff" : "#2152ff",
    };
  }, [darkMode]);

  // --- Fetch flagged alerts on component mount ---
  useEffect(() => {
    setLoadingAlerts(true);
    const fetchUrl = `${API_URL}/api/messages/flagged`;
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        const signedInUid = auth.currentUser?.uid;
        const signedInName = auth.currentUser?.displayName;
        const formatted = (Array.isArray(data) ? data : [])
          .filter((item: any) => {
            if (signedInUid && String(item.receiverId) === String(signedInUid))
              return true;
            if (
              signedInName &&
              item.receiverName &&
              String(item.receiverName) === String(signedInName)
            )
              return true;
            // Include messages without specific receiver (broadcast)
            if (!item.receiverId && !item.receiverName) return true;
            return false;
          })
          .map((item: any) => ({
            ...item,
            platform: item.platform || "Unknown",
          }));

        setAlerts(formatted);
      })
      .catch(() => setAlerts([]))
      .finally(() => setLoadingAlerts(false));
  }, []);

  // --- Real-time WebSocket for flagged alerts ---
  useEffect(() => {
    const socket: Socket = io(API_URL);
    // Join personal room on connect so the server can target this user
    socket.on("connect", () => {
      const uid = auth.currentUser?.uid;
      if (uid) socket.emit("join", uid);
    });
    // Also attempt to join when auth state becomes available later
    const authUnsub = auth.onAuthStateChanged((user) => {
      if (user && user.uid) socket.emit("join", user.uid);
    });

    // Listen for incoming 'flagged_message' events from the server
    socket.on("flagged_message", (data: any) => {
      // Only accept events targeted at this student (or broadcast items without receiver)
      const signedInUid = auth.currentUser?.uid;
      const signedInName = auth.currentUser?.displayName;
      if (data.receiverId) {
        if (signedInUid && String(data.receiverId) !== String(signedInUid))
          return; // not for me
        if (
          !signedInUid &&
          signedInName &&
          data.receiverName &&
          String(data.receiverName) !== String(signedInName)
        )
          return;
      }

      const newAlert: FlaggedAlert = {
        id: Date.now(),
        comment: data.text || data.comment || data.message || "",
        cleaned: data.cleaned || "",
        labels: data.labels || [],
        reasons: data.reasons || [],
        created_at: data.createdAt || new Date().toISOString(),
        platform: data.platform || "Unknown",
      };
      setIncomingFlagged(newAlert);
      setSnackbarOpen(true);
      // Add the new alert to the top of the list
      setAlerts((prev) => [newAlert, ...prev]);
    });

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      authUnsub();
      socket.disconnect();
    };
  }, []);

  // --- Helper Functions ---
  const handleNoteSave = (alertId: number) => {
    setAlerts((cur) =>
      cur.map((a) => (a.id === alertId ? { ...a, privateNote } : a)),
    );
    setShowNote(false);
    setPrivateNote("");
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAlertClick = (alertId: number) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert.id);
      setPrivateNote(alert.privateNote || "");
    }
  };

  const selectedAlertData = alerts.find((a) => a.id === selectedAlert);

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        pt: isMobile ? 1 : 3.5,
        background: colorsDynamic.mainBg,
        minHeight: "100vh",
        color: colorsDynamic.textPrimary,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2, color: colorsDynamic.textPrimary }}
        >
          Back to Dashboard
        </Button>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: colorsDynamic.textPrimary }}
        >
          Notifications
        </Typography>
      </Box>

      {/* Loading state */}
      {loadingAlerts && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Alerts list */}
      {!loadingAlerts && alerts.length === 0 && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <WarningAmberRoundedIcon
            sx={{ fontSize: 80, color: colorsDynamic.textSecondary, mb: 2 }}
          />
          <Typography
            variant="h6"
            sx={{ color: colorsDynamic.textSecondary, fontWeight: 600 }}
          >
            No new notifications at this time.
          </Typography>
          <Typography sx={{ color: colorsDynamic.textSecondary, mt: 1 }}>
            Check back later for updates.
          </Typography>
        </Box>
      )}

      {!loadingAlerts && (
        <Grid container spacing={3}>
          {alerts.map((alert) => (
            <Grid item xs={12} key={alert.id}>
              <Paper
                onClick={() => handleAlertClick(alert.id)}
                sx={{
                  p: 2,
                  background: colorsDynamic.alertCardBg,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1.5,
                  cursor: "pointer",
                  border: `1.5px solid ${colorsDynamic.divider}`,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    borderColor: "#2152ff",
                    boxShadow: darkMode
                      ? "0 4px 18px #21d4fd38"
                      : "0 2px 8px #2152ff22",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: colorsDynamic.alertCardText,
                        mb: 0.5,
                      }}
                    >
                      New Alert - {alert.platform}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: colorsDynamic.textSecondary }}
                    >
                      {new Date(alert.created_at).toLocaleString()}
                    </Typography>
                    {/* Show sender name/class and severity when available */}
                    {(alert as any).senderName && (
                      <Typography
                        variant="caption"
                        sx={{ color: colorsDynamic.textSecondary, mt: 0.5 }}
                      >
                        <strong>From:</strong> {(alert as any).senderName}
                        {(alert as any).senderClass ? (
                          <span
                            style={{
                              marginLeft: 6,
                              color: "#666",
                              fontWeight: 600,
                            }}
                          >
                            ({(alert as any).senderClass})
                          </span>
                        ) : null}
                      </Typography>
                    )}
                    {(alert as any).severity && (
                      <Typography
                        variant="caption"
                        sx={{ color: colorsDynamic.textSecondary }}
                      >
                        <strong>Severity:</strong> {(alert as any).severity}
                      </Typography>
                    )}
                  </Box>
                  <Tooltip title="View Details">
                    <IconButton sx={{ color: colorsDynamic.textPrimary }}>
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography
                  sx={{
                    color: colorsDynamic.textPrimary,
                    width: "100%",
                    wordBreak: "break-word",
                  }}
                >
                  "**{alert.comment}**"
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {alert.labels && alert.labels.length > 0 && (
                    <Chip
                      label={alert.labels.join(", ")}
                      size="small"
                      sx={{
                        background: darkMode ? "#d7263d20" : "#ffeff1",
                        color: "#d7263d",
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {alert.reasons && alert.reasons.length > 0 && (
                    <Chip
                      label={alert.reasons.join(", ")}
                      size="small"
                      sx={{
                        background: darkMode ? "#105bcb20" : "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for Alert Details */}
      <Modal
        open={selectedAlert !== null}
        onClose={() => setSelectedAlert(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            width: isMobile ? "95%" : 550,
            maxWidth: "95%",
            background: colorsDynamic.cardBg,
            borderRadius: 4,
            p: 4,
            position: "relative",
            outline: "none",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: colorsDynamic.cardShadow,
          }}
        >
          <IconButton
            onClick={() => setSelectedAlert(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: colorsDynamic.textSecondary,
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
          {selectedAlertData && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <WarningAmberRoundedIcon
                  sx={{ fontSize: 32, color: "#d7263d" }}
                />
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={colorsDynamic.textPrimary}
                >
                  Alert Details
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={colorsDynamic.textSecondary}
                  >
                    Platform
                  </Typography>
                  <Typography color={colorsDynamic.textPrimary}>
                    {selectedAlertData.platform}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={colorsDynamic.textSecondary}
                  >
                    Timestamp
                  </Typography>
                  <Typography color={colorsDynamic.textPrimary}>
                    {new Date(selectedAlertData.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={colorsDynamic.textSecondary}
                  >
                    Original Message
                  </Typography>
                  <Typography
                    sx={{
                      background: colorsDynamic.inputBg,
                      p: 1.5,
                      borderRadius: 1,
                      color: colorsDynamic.inputColor,
                      fontStyle: "italic",
                      border: `1.5px solid ${colorsDynamic.inputBorder}`,
                    }}
                  >
                    {selectedAlertData.comment}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={colorsDynamic.textSecondary}
                  >
                    Labels
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {selectedAlertData.labels.map((label, index) => (
                      <Chip
                        key={index}
                        label={label}
                        size="small"
                        sx={{
                          background: darkMode ? "#d7263d20" : "#ffeff1",
                          color: "#d7263d",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={colorsDynamic.textSecondary}
                    mb={1}
                  >
                    Private Note (for your reference)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    value={privateNote}
                    onChange={(e) => setPrivateNote(e.target.value)}
                    placeholder="Add a private note about this alert..."
                    sx={{
                      "& .MuiInputBase-input": {
                        color: colorsDynamic.inputColor,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colorsDynamic.inputBorder,
                      },
                      "& .MuiInputBase-root": {
                        background: colorsDynamic.inputBg,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleNoteSave(selectedAlertData.id)}
                    sx={{ mt: 2, bgcolor: "#2152ff", color: "#fff" }}
                  >
                    Save Note
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Modal>

      {/* Real-time Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          variant="filled"
          sx={{
            width: "100%",
            background: "#d7263d",
            color: "#fff",
            "& .MuiAlert-icon": { color: "#fff" },
          }}
        >
          <Typography fontWeight={700}>
            New Alert! Bullying Detected.
          </Typography>
          <Typography variant="body2">
            A new flagged message was detected.
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentNotificationsPage;
