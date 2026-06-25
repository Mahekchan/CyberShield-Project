import React, { useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  Box,
  Chip,
  Button,
  Modal,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import SmsIcon from "@mui/icons-material/Sms";
import ForumIcon from "@mui/icons-material/Forum";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SlackIcon from "@mui/icons-material/Forum"; // For real Slack icon, use @mui/icons-material/Slack if available
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";

type Platform = {
  name: string;
  icon: React.ReactNode;
  status: string;
  color: string;
  apiKey?: string;
  monitorTypes?: string[];
};

const platformOptions: { label: string; icon: React.ReactNode }[] = [
  { label: "School Chat App", icon: <SmsIcon sx={{ color: "#60a5fa" }} /> },
  { label: "Discord", icon: <ForumIcon sx={{ color: "#a78bfa" }} /> },
  { label: "Instagram", icon: <InstagramIcon sx={{ color: "#fda4af" }} /> },
  { label: "WhatsApp", icon: <WhatsAppIcon sx={{ color: "#43d854" }} /> },
  { label: "Slack", icon: <SlackIcon sx={{ color: "#611f69" }} /> },
  { label: "Other", icon: <QuestionMarkIcon sx={{ color: "#38bdf8" }} /> },
];

const monitorTypesOptions = [
  { value: "messages", label: "Chat Messages" },
  { value: "posts", label: "Posts" },
  { value: "images", label: "Images" },
  { value: "comments", label: "Comments" },
];

export default function PlatformMonitoring({ sx = {} }: { sx?: object }) {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      name: "School Chat App",
      icon: <SmsIcon sx={{ color: "#60a5fa" }} />,
      status: "Active",
      color: "#a7f3d0",
    },
    {
      name: "Discord",
      icon: <ForumIcon sx={{ color: "#a78bfa" }} />,
      status: "Active",
      color: "#a7f3d0",
    },
    {
      name: "Instagram",
      icon: <InstagramIcon sx={{ color: "#fda4af" }} />,
      status: "Active",
      color: "#a7f3d0",
    },
  ]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [platformName, setPlatformName] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [monitorTypes, setMonitorTypes] = useState<string[]>([]);
  const [customName, setCustomName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddPlatform = () => {
    setError("");
    let finalName = platformName === "Other" && customName ? customName : platformName;

    if (!finalName) {
      setError("Please select or enter a platform name.");
      return;
    }
    if (platforms.some((p) => p.name === finalName)) {
      setError("Platform already added.");
      return;
    }
    const selected = platformOptions.find((p) => p.label === platformName);
    setPlatforms((prev) => [
      ...prev,
      {
        name: finalName,
        icon: selected
          ? selected.icon
          : <QuestionMarkIcon sx={{ color: "#38bdf8" }} />,
        status: "Active",
        color: "#a7f3d0",
        apiKey: apiKey || undefined,
        monitorTypes: monitorTypes.length ? monitorTypes : undefined,
      },
    ]);
    // Reset modal state
    setPlatformName("");
    setApiKey("");
    setMonitorTypes([]);
    setCustomName("");
    setModalOpen(false);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, mt: 3, ...sx }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Platform Monitoring
      </Typography>
      <Stack spacing={2}>
        {platforms.map((platform, i) => (
          <Box key={i} display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {platform.icon}
              <Typography variant="body1" fontWeight={600} ml={2}>
                {platform.name}
              </Typography>
            </Box>
            <Chip
              label={platform.status}
              size="small"
              sx={{
                bgcolor: platform.color,
                color: "#059669",
                fontWeight: 700,
                fontSize: 14,
                px: 2,
              }}
            />
          </Box>
        ))}
      </Stack>
      <Button
        variant="outlined"
        color="primary"
        sx={{
          mt: 2,
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 16,
          borderStyle: "dashed",
        }}
        fullWidth
        onClick={() => setModalOpen(true)}
      >
        + Add Platform
      </Button>
      {/* Add Platform Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            minWidth: 320,
            width: 380,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography fontWeight={700} fontSize={19} color="#2152ff">
              Add Platform
            </Typography>
            <IconButton onClick={() => setModalOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <TextField
            select
            label="Platform"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {platformOptions
              .filter((opt) => !platforms.some((p) => p.name === opt.label))
              .map((option) => (
                <MenuItem value={option.label} key={option.label}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {option.icon}
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
          </TextField>
          {platformName === "Other" && (
            <TextField
              label="Custom Platform Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label="API Key / Token"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Required if platform needs integration"
          />
          <TextField
            select
            label="Monitor Data Types"
            value={monitorTypes}
            onChange={(e) =>
              setMonitorTypes(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              )
            }
            SelectProps={{ multiple: true }}
            fullWidth
            sx={{ mb: 2 }}
          >
            {monitorTypesOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {error && (
            <Typography color="error" fontSize={14} mb={1}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              borderRadius: 2,
              py: 1.2,
              width: "100%",
              mt: 1,
              "&:hover": { background: "linear-gradient(90deg, #2580ff 0%, #7fd7fb 100%)" },
            }}
            onClick={handleAddPlatform}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
}