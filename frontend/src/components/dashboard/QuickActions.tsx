import { Paper, Typography, Button, Stack } from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PolicyIcon from "@mui/icons-material/Policy";

export default function QuickActions() {
  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Quick Actions
      </Typography>
      <Stack spacing={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ReportIcon />}
          sx={{ borderRadius: 2, fontWeight: 600, py: 1, fontSize: 16 }}
          fullWidth
        >
          Generate Alert Report
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EventNoteIcon />}
          sx={{ borderRadius: 2, fontWeight: 600, py: 1, fontSize: 16 }}
          fullWidth
        >
          Schedule Intervention
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<PolicyIcon />}
          sx={{ borderRadius: 2, fontWeight: 600, py: 1, fontSize: 16 }}
          fullWidth
        >
          Create New Policy
        </Button>
      </Stack>
    </Paper>
  );
}