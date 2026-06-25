import { Box, Typography, Button, Paper, Stack, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Report } from "../../types/types";

interface NotificationsPageProps {
  onBack: () => void;
  darkMode: boolean;
  notifications: Report[];
}

function severityColor(severity: string) {
  if (severity === "High") return "#ff4d4f";
  if (severity === "Medium") return "#ffc84b";
  return "#6ec6ff";
}

const NotificationsPage = ({
  onBack,
  darkMode,
  notifications,
}: NotificationsPageProps) => {
  const pageColors = {
    background: darkMode ? "#111a2f" : "#f8f9fe",
    paperBg: darkMode ? "#1a223f" : "#f6faff",
    paperBorder: darkMode ? "#21325b" : "#eaf2ff",
    textPrimary: darkMode ? "#d8e7ff" : "#2152ff",
    textSecondary: darkMode ? "#a0b0d0" : "#446",
    bgPattern: darkMode
      ? "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTggMjggTCAzMiA0MiBMIDE4IDU2IEwgNSAzNSBMIDE4IDI4IFogTTU2IDcwIEwgNzAgODQgTCA1NiA5OCBMIDQyIDc3IEwgNTYgNzAgWiIgZmlsbD0iI2ZjZmNmYjEwIiBvcGFjaXR5PSIwLjAyIiAvPgo8L3N2Zz4=')"
      : "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTggMjggTCAzMiA0MiBMIDE4IDU2IEwgNSAzNSBMIDE4IDI4IFogTTU2IDcwIEwgNzAgODQgTCA1NiA5OCBMIDQyNzdMIDU2IDcwIFoiIGZpbGw9IiMyMTUyZmYiIG9wYWNpdHk9IjAuMDIiIC8+Cjwvc3ZnPg==')",
  };

  return (
    <Box
      sx={{
        p: 4,
        pt: 3.5,
        background: `${pageColors.background} ${pageColors.bgPattern}`,
        minHeight: "100vh",
        color: darkMode ? "#d8e7ff" : "#222",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2, color: pageColors.textPrimary }}
        >
          Back to Dashboard
        </Button>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: pageColors.textPrimary }}
        >
          Notifications
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          borderRadius: 4.5,
          background: pageColors.paperBg,
          boxShadow: "0 2px 10px #2152ff0a",
          border: `1.5px solid ${pageColors.paperBorder}`,
          mb: 4,
        }}
      >
        <Stack spacing={2}>
          {notifications.length > 0 ? (
            notifications.map((report, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: darkMode ? "#1e2747" : "#f9fafc",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  borderLeft: `4px solid ${severityColor(
                    report.status === "Flagged" ||
                      report.status === "Pending Review"
                      ? "High"
                      : report.status === "Resolved"
                      ? "Low"
                      : "Medium"
                  )}`,
                }}
              >
                <Box>
                  <Typography
                    fontWeight={700}
                    sx={{
                      color: darkMode ? "#eaf6ff" : "#1b2850",
                      fontSize: 15,
                      mb: 0.5,
                    }}
                  >
                    {report.message}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: pageColors.textSecondary,
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    {report.student_email || "Unknown"} — {report.time || ""}
                  </Typography>
                </Box>
                <Chip
                  label={report.status}
                  sx={{
                    fontWeight: 600,
                    color: "#fff",
                    fontSize: 14,
                    px: 1.5,
                    background: severityColor(
                      report.status === "Flagged" ||
                        report.status === "Pending Review"
                        ? "High"
                        : report.status === "Resolved"
                        ? "Low"
                        : "Medium"
                    ),
                  }}
                />
              </Box>
            ))
          ) : (
            <Typography
              variant="body1"
              sx={{
                color: pageColors.textSecondary,
                textAlign: "center",
                py: 4,
              }}
            >
              No new notifications.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default NotificationsPage;
