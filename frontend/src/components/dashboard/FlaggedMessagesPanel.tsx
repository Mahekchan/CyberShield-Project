import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

type FlaggedMessage = {
  id: number;
  comment: string;
  cleaned: string;
  labels: string[];
  reasons: string[];
  created_at: string;
  senderName?: string;
};

export const FlaggedMessagesPanel: React.FC = () => {
  const [messages, setMessages] = useState<FlaggedMessage[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/flagged-messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body1" fontWeight={700} sx={{ mb: 2, fontSize: "1rem" }}>
        Flagged Messages
      </Typography>
      <Stack spacing={2}>
        {messages.length === 0 ? (
          <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
            No flagged messages at this time.
          </Typography>
        ) : (
          messages.map((msg) => (
            <Paper
              key={msg.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #ffe0e0",
                backgroundColor: "#fff5f5",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: "#d32f2f",
                      flexShrink: 0,
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: "#333", fontSize: "0.9rem" }}
                    >
                      {msg.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                      From: <strong>{msg.senderName || "Unknown"}</strong>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {msg.labels.map((label, idx) => (
                    <Chip
                      key={`label-${idx}`}
                      label={label}
                      size="small"
                      sx={{
                        backgroundColor: "#ffcdd2",
                        color: "#b71c1c",
                        fontWeight: 600,
                        height: 24,
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(msg.created_at).toLocaleString()}
                </Typography>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
};
