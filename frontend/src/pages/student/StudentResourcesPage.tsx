import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import { useMemo } from "react";

// Define the type for a resource item
type Resource = {
  title: string;
  link: string;
  description: string;
};

// Define the props for the StudentResourcesPage component.
type StudentResourcesPageProps = {
  onBack: () => void; // Function to navigate back to the dashboard
  darkMode: boolean; // Current dark mode state from the dashboard
};

const StudentResourcesPage: React.FC<StudentResourcesPageProps> = ({
  onBack,
  darkMode,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Define wellness resources directly within the component for now.
  // In a larger application, you might fetch these from an API.
  const wellnessResources: Resource[] = [
    {
      title: "Coping with Stress",
      link: "https://kidshealth.org/en/teens/stress.html",
      description: "Tips and articles for managing daily stress and pressure.",
    },
    {
      title: "Building Self-Esteem",
      link: "https://kidshealth.org/en/teens/self-esteem.html",
      description: "Guidance for improving self-worth and confidence.",
    },
    {
      title: "Understanding Bullying",
      link: "https://www.stopbullying.gov/",
      description: "Identify, prevent, and address bullying situations.",
    },
    {
      title: "Cyberbullying 101 (Video)",
      link: "https://www.youtube.com/watch?v=K8P8uFahAgc",
      description: "Video lesson on recognizing and handling online bullying.",
    },
    {
      title: "Mindfulness for Teens",
      link: "https://www.mindful.org/mindfulness-for-teens/",
      description: "Simple mindfulness exercises to help manage emotions.",
    },
    {
      title: "Healthy Relationships",
      link: "https://www.loveisrespect.org/for-teens/",
      description: "Learn about healthy relationships and how to spot red flags.",
    },
    {
      title: "Digital Citizenship",
      link: "https://www.commonsense.org/education/digital-citizenship",
      description: "Resources on being safe, responsible, and ethical online.",
    },
    {
      title: "Anxiety & Depression in Teens",
      link: "https://www.nimh.nih.gov/health/publications/teen-depression",
      description: "Information on symptoms, causes, and getting help for mental health.",
    },
  ];

  // Dynamic colors and styles based on dark mode.
  const colorsDynamic = useMemo(() => {
    return {
      mainBg: darkMode ? "#111a2f" : "#f8f9fe",
      cardBg: darkMode ? "#1a223f" : "#fff",
      cardShadow: darkMode ? "0 4px 24px #102a4d70" : "0 8px 32px 0 #2152ff22",
      textPrimary: darkMode ? "#d8e7ff" : "#2152ff",
      textSecondary: darkMode ? "#a0b0d0" : "#446",
      divider: darkMode ? "#22304a" : "#d9e3fa",
      resourceCardBg: darkMode ? "linear-gradient(90deg, #1b253b 0%, #1e2840 100%)" : "#f0f6ff",
      resourceCardText: darkMode ? "#d8e7ff" : "#2152ff",
      linkText: darkMode ? "#21d4fd" : "#2152ff",
    };
  }, [darkMode]);

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
      {/* Header Section: Back Button and Page Title */}
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
          Wellness Resources
        </Typography>
      </Box>

      {/* Resources List */}
      <Grid container spacing={3}>
        {wellnessResources.map((resource, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 2.5,
                background: colorsDynamic.resourceCardBg,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                border: `1.5px solid ${colorsDynamic.divider}`,
                boxShadow: darkMode ? "0 4px 18px #21d4fd18" : "0 2px 8px #2152ff12",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: darkMode ? "0 6px 24px #21d4fd28" : "0 4px 16px #2152ff22",
                },
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: colorsDynamic.resourceCardText }}
              >
                {resource.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colorsDynamic.textSecondary, mb: 1 }}
              >
                {resource.description}
              </Typography>
              <Button
                variant="contained"
                startIcon={<LinkRoundedIcon />}
                href={resource.link}
                target="_blank" // Open link in a new tab
                rel="noopener noreferrer" // Security best practice for target="_blank"
                sx={{
                  mt: "auto", // Push button to the bottom if content varies in height
                  bgcolor: colorsDynamic.linkText,
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: colorsDynamic.linkText,
                    filter: "brightness(1.1)",
                  },
                }}
              >
                Learn More
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentResourcesPage;
