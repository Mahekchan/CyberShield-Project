import React from "react";
import { Box, Typography, Chip } from "@mui/material";

interface AlertCardProps {
  message: {
    _id: string;
    text: string;
    senderName: string;
    timestamp: string;
    severity: "High" | "Medium" | "Low";
  };
}

const severityColors: Record<string, "error" | "warning" | "info"> = {
  High: "error",
  Medium: "warning",
  Low: "info",
};

const AlertCard: React.FC<AlertCardProps> = ({ message }) => {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        boxShadow: "0 2px 12px #2152ff22",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        mb: 2,
      }}
    >
      <Typography variant="body1" fontWeight={700}>
        {message.text}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Sender: {message.senderName}
        </Typography>
        <Chip
          label={message.severity}
          color={severityColors[message.severity]}
          size="small"
          sx={{ fontWeight: 700 }}
        />
        <Typography variant="caption" color="text.secondary">
          {new Date(message.timestamp).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default AlertCard;
