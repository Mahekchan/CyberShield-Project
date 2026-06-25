import { Paper, Typography, Stack, Button } from "@mui/material";

const resources = [
  {
    title: "Anti-Bullying Workshop Materials",
    desc: "Resources for teachers and counselors",
    href: "#",
  },
  {
    title: "Parent Communication Templates",
    desc: "For notifying parents about incidents",
    href: "#",
  },
  {
    title: "Intervention Strategies Guide",
    desc: "Best practices for addressing cyberbullying",
    href: "#",
  },
];

export default function Resources() {
  return (
    <Paper sx={{ p: 3, borderRadius: 4, mt: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Resources
      </Typography>
      <Stack spacing={2}>
        {resources.map((res, i) => (
          <Button
            key={i}
            href={res.href}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: 3,
              textAlign: "left",
              alignItems: "flex-start",
              fontWeight: 600,
              flexDirection: "column",
              fontSize: 17,
              background: "#f6fafd",
              py: 2,
              px: 2.5,
            }}
          >
            <span style={{ color: "#2563eb", fontWeight: 700 }}>{res.title}</span>
            <span style={{ color: "#64748b", fontWeight: 400, fontSize: 15 }}>{res.desc}</span>
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}