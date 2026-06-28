import { auth } from "../../services/Firebase";
import {
  Box,
  InputBase,
  Typography,
  Avatar,
  Button,
  Paper,
  Snackbar,
  Alert,
  Modal,
  Grid,
  Chip,
  MenuItem,
  CircularProgress,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { styled } from "@mui/system";

// Import the StudentNavbar, StudentNotificationsPage, StudentSidebar, StudentResourcesPage, StudentAlertsPage, and AdminActionsPage components
import StudentNavbar from "./StudentNavbar";
import StudentNotificationsPage from "./StudentNotificationsPage";
import StudentSidebar from "./StudentSidebar";
import StudentResourcesPage from "./StudentResourcesPage";
import StudentAlertsPage from "./StudentAlertsPage";
import AdminActionsPage from "./AdminActionsPage";
import Chatbot from "../../components/ChatBot";

// --- Argon color and style constants ---
const argonGradient = "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)";
const argonCardShadow = "0 8px 32px 0 #2152ff22";
const argonCardRadius = 18;
const argonStatShadow = "0 2px 12px 0 #2152ff14";
const drawerWidth = 200;
const fontFamily = "'Inter', 'Poppins', Arial, sans-serif";

// --- Wellness Resources (re-added to StudentDashboard for display on main page) ---
const wellnessResources = [
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
];

type FlaggedAlert = {
  id: number;
  comment: string;
  cleaned: string;
  labels: string[];
  reasons: string[];
  created_at?: string;
  createdAt?: string;
  platform?: string;
  privateNote?: string;
};

type AdminAction = {
  _id: string;
  studentId: string;
  title: string;
  text: string;
  isWarning: boolean;
  warningType?: string;
  severity?: string;
  adminNotes?: string;
  caseStatus: string;
  readByStudent: boolean;
  createdAt: string;
  expiresAt?: string;
};

type PlatformStatus = {
  name: string;
  status: string;
  icon: React.ReactNode;
  flag: boolean;
};

// StyledPaper now uses dynamic colors from props
const StyledPaper = styled(Paper)<{ paperBg: string; paperBorder: string }>(
  ({ paperBg, paperBorder }) => ({
    p: 3,
    borderRadius: 4,
    background: paperBg,
    boxShadow: "0 2px 10px #2152ff0a",
    border: `1.5px solid ${paperBorder}`,
    mb: 4,
  }),
);

const ProfileCardPaper = styled(Paper)<{
  paperBg: string;
  paperBorder: string;
}>(({ paperBg, paperBorder }) => ({
  padding: "32px 28px",
  borderRadius: argonCardRadius,
  background: paperBg,
  boxShadow: argonCardShadow,
  border: `2px solid ${paperBorder}`,
  minHeight: 320,
  marginBottom: 32,
}));

const ProfileInfoRow = ({
  label,
  value,
  color = "#2152ff",
  secondary = false,
}: {
  label: string;
  value?: string;
  color?: string;
  secondary?: boolean;
}) => (
  <Box sx={{ display: "flex", mb: 1.5 }}>
    <Typography
      sx={{
        fontWeight: 700,
        width: 145,
        color: secondary ? "#a0b0d0" : color,
        fontSize: 15,
      }}
    >
      {label}:
    </Typography>
    <Typography
      sx={{
        fontWeight: 600,
        color: secondary ? "#446" : "#222",
        fontSize: 15,
        ml: 1,
      }}
    >
      {value || <span style={{ color: "#aaa" }}>—</span>}
    </Typography>
  </Box>
);

// --- Profile Management Component ---
const ProfileManagement = ({
  onBack,
  darkMode,
  profileImage,
  setProfileImage,
  userId,
}: {
  onBack: () => void;
  darkMode: boolean;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  userId: string;
}) => {
  // State for all fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentMobile, setParentMobile] = useState("");
  const [appDarkMode, setAppDarkMode] = useState(darkMode);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // Remove local profileImage and userId state, use props from parent

  // No need to fetch userId from Firebase here, it's passed as prop

  // Snackbar state for feedback
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile card/form mode
  const [isProfileCard, setIsProfileCard] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Dynamic colors for ProfileManagement based on darkMode
  const profileColors = useMemo(() => {
    return {
      paperBg: darkMode ? "#1a223f" : "#f6faff",
      paperBorder: darkMode ? "#21325b" : "#eaf2ff",
      textPrimary: darkMode ? "#d8e7ff" : "#2152ff",
      textSecondary: darkMode ? "#a0b0d0" : "#446",
      inputBg: darkMode ? "#2d3759" : "#fff",
      inputBorder: darkMode ? "#4a5a7a" : "#e3eafc",
      inputColor: darkMode ? "#fff" : "#222",
      inputLabel: darkMode ? "#a0b0d0" : "#2152ff",
      buttonBg: darkMode ? "#2152ff" : "#2152ff",
      buttonText: "#fff",
      dangerButtonBg: "#d7263d",
      dangerButtonHover: "#b71c1c",
      cardLabel: darkMode ? "#a0b0d0" : "#2152ff",
      cardValue: darkMode ? "#fff" : "#222",
      cardSectionTitle: darkMode ? "#d8e7ff" : "#2152ff",
    };
  }, [darkMode]);

  const handleChangePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imgUrl = e.target?.result as string;
        setProfileImage(imgUrl);
        // Save to backend
        if (userId) {
          await fetch("import.meta.env.VITE_API_URL/api/students/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              profileImageUrl: imgUrl,
            }),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = async () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (userId) {
      await fetch("import.meta.env.VITE_API_URL/api/students/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          profileImageUrl: null,
        }),
      });
    }
  };

  // Fetch profile on mount (only for other fields, not profileImage)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(
          `import.meta.env.VITE_API_URL/api/students/profile/${userId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setFullName(data.fullName || "");
          setEmail(data.emailAddress || "");
          setMobileNumber(data.mobileNumber || "");
          setDateOfBirth(
            data.dateOfBirth
              ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
              : "",
          );
          setGender(data.gender || "");
          setStudentClass(data.studentClass || "");
          setParentName(data.parentName || "");
          setParentEmail(data.parentEmail || "");
          setParentMobile(data.parentPhone || "");
          // Do NOT setProfileImage here, it's managed by parent
          if ((data.fullName || data.emailAddress) && !isProfileCard) {
            setIsProfileCard(true);
          }
        }
      } catch (err) {
        // Optionally show error
      } finally {
        setProfileLoaded(true);
      }
    }
    if (userId) fetchProfile();
    // eslint-disable-next-line
  }, [userId]);

  // Unified form submission handler
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Validate required fields
    if (!fullName || !email) {
      setSnackbar({
        open: true,
        message: "Full Name and Email Address are required.",
        severity: "error",
      });
      return;
    }
    const profileData = {
      userId,
      fullName,
      emailAddress: email,
      mobileNumber,
      dateOfBirth,
      gender,
      studentClass,
      parentName,
      parentEmail,
      parentPhone: parentMobile,
      profileImageUrl: profileImage,
      isProfileComplete: true,
    };
    try {
      const response = await fetch(
        "import.meta.env.VITE_API_URL/api/students/profile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        },
      );
      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Profile saved successfully!",
          severity: "success",
        });
        // Re-fetch profile to update state
        if (userId) {
          const updated = await fetch(
            `import.meta.env.VITE_API_URL/api/students/profile/${userId}`,
          );
          if (updated.ok) {
            const data = await updated.json();
            setFullName(data.fullName || "");
            setEmail(data.emailAddress || "");
            setMobileNumber(data.mobileNumber || "");
            setDateOfBirth(
              data.dateOfBirth
                ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
                : "",
            );
            setGender(data.gender || "");
            setStudentClass(data.studentClass || "");
            setParentName(data.parentName || "");
            setParentEmail(data.parentEmail || "");
            setParentMobile(data.parentPhone || "");
            setProfileImage(data.profileImageUrl || null);

            setIsProfileCard(true);
          }
        }
      } else {
        setSnackbar({
          open: true,
          message: "Failed to save profile.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving profile.",
        severity: "error",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      if (!userId) {
        setSnackbar({
          open: true,
          message: "User ID not found. Cannot delete account.",
          severity: "error",
        });
        return;
      }
      try {
        const response = await fetch(
          `import.meta.env.VITE_API_URL/api/students/${userId}`,
          { method: "DELETE" },
        );
        if (response.ok) {
          setSnackbar({
            open: true,
            message: "Account deleted successfully!",
            severity: "success",
          });
          setTimeout(() => {
            if (typeof onBack === "function") {
              onBack();
            }
          }, 1500);
        } else {
          setSnackbar({
            open: true,
            message: "Failed to delete account.",
            severity: "error",
          });
        }
      } catch {
        setSnackbar({
          open: true,
          message: "Error deleting account.",
          severity: "error",
        });
      }
    }
  };
  // Remove duplicate useEffect and conditional rendering for showProfilePage from ProfileManagement

  // --- Render ---
  return (
    <Box
      sx={{
        p: 4,
        pt: 3.5,
        background: darkMode ? "#111a2f" : "#f8f9fe",
        minHeight: "100vh",
        color: darkMode ? "#d8e7ff" : "#222",
      }}
    >
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontWeight: 700,
            background: profileColors.paperBg,
            color:
              snackbar.severity === "success"
                ? profileColors.textPrimary
                : profileColors.dangerButtonBg,
            border: `1.5px solid ${profileColors.paperBorder}`,
            borderRadius: 2,
            fontSize: 16,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2, color: profileColors.textPrimary }}
        >
          Back to Dashboard
        </Button>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: profileColors.textPrimary }}
        >
          Profile & Settings
        </Typography>
      </Box>

      {!profileLoaded ? (
        <Box sx={{ p: 5, textAlign: "center" }}>
          <CircularProgress sx={{ color: profileColors.textPrimary }} />
        </Box>
      ) : isProfileCard ? (
        // --- Read-only Card Display ---
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ProfileCardPaper
              paperBg={profileColors.paperBg}
              paperBorder={profileColors.paperBorder}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                <Avatar
                  src={profileImage || undefined}
                  sx={{
                    width: 92,
                    height: 92,
                    mr: 3,
                    mt: 0.5,
                    bgcolor: profileColors.inputBg,
                    color: profileColors.textPrimary,
                    border: `2px solid ${profileColors.paperBorder}`,
                  }}
                >
                  {!profileImage && (
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 82 }} />
                  )}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color={profileColors.cardSectionTitle}
                    sx={{ mb: 1.5 }}
                  >
                    Student Information
                  </Typography>
                  <ProfileInfoRow
                    label="Full Name"
                    value={fullName}
                    color={profileColors.cardLabel}
                  />
                  <ProfileInfoRow
                    label="Email Address"
                    value={email}
                    color={profileColors.cardLabel}
                  />
                  <ProfileInfoRow
                    label="Student Class"
                    value={studentClass}
                    color={profileColors.cardLabel}
                  />
                  <ProfileInfoRow
                    label="Date of Birth"
                    value={dateOfBirth}
                    color={profileColors.cardLabel}
                  />
                  <ProfileInfoRow
                    label="Gender"
                    value={gender}
                    color={profileColors.cardLabel}
                  />
                  <ProfileInfoRow
                    label="Mobile Number"
                    value={mobileNumber}
                    color={profileColors.cardLabel}
                  />
                </Box>
              </Box>
            </ProfileCardPaper>
            <ProfileCardPaper
              paperBg={profileColors.paperBg}
              paperBorder={profileColors.paperBorder}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                color={profileColors.cardSectionTitle}
                sx={{ mb: 1.5 }}
              >
                App Settings
              </Typography>
              <ProfileInfoRow
                label="Dark Mode"
                value={appDarkMode ? "Enabled" : "Disabled"}
                color={profileColors.cardLabel}
              />
              <ProfileInfoRow
                label="Notifications"
                value={notificationsEnabled ? "Enabled" : "Disabled"}
                color={profileColors.cardLabel}
              />
            </ProfileCardPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <ProfileCardPaper
              paperBg={profileColors.paperBg}
              paperBorder={profileColors.paperBorder}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                color={profileColors.cardSectionTitle}
                sx={{ mb: 1.5 }}
              >
                Parent/Guardian Information
              </Typography>
              <ProfileInfoRow
                label="Parent/Guardian Name"
                value={parentName}
                color={profileColors.cardLabel}
              />
              <ProfileInfoRow
                label="Email Address"
                value={parentEmail}
                color={profileColors.cardLabel}
              />
              <ProfileInfoRow
                label="Phone Number"
                value={parentMobile}
                color={profileColors.cardLabel}
              />
            </ProfileCardPaper>
            {/* Danger Zone removed from here */}
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: "center",
                mt: 2,
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  bgcolor: profileColors.buttonBg,
                  color: profileColors.buttonText,
                  fontWeight: 700,
                  fontSize: 16,
                  px: 4,
                  py: 1.2,
                  borderRadius: 2.5,
                  mt: 1,
                }}
                onClick={() => setIsProfileCard(false)}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{
                  bgcolor: profileColors.dangerButtonBg,
                  color: profileColors.buttonText,
                  fontWeight: 700,
                  fontSize: 16,
                  px: 4,
                  py: 1.2,
                  borderRadius: 2.5,
                  mt: 1,
                  "&:hover": { bgcolor: profileColors.dangerButtonHover },
                }}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        // --- Editable Form Mode ---
        <form onSubmit={handleSaveProfile}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {/* Profile Information */}
              <StyledPaper
                paperBg={profileColors.paperBg}
                paperBorder={profileColors.paperBorder}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={profileColors.textPrimary}
                  mb={2}
                >
                  Profile Information
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    src={profileImage || undefined}
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      bgcolor: profileColors.inputBg,
                      color: profileColors.textPrimary,
                    }}
                  >
                    {!profileImage && (
                      <PersonOutlineOutlinedIcon sx={{ fontSize: 80 }} />
                    )}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={profileColors.textPrimary}
                    >
                      {fullName || "No Name"}
                    </Typography>
                    {/* removed email display below avatar */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleChangePhoto}
                      style={{ display: "none" }}
                    />
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          color: profileColors.textPrimary,
                          borderColor: profileColors.textPrimary,
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Photo
                      </Button>
                      {profileImage && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          sx={{
                            borderColor: profileColors.dangerButtonBg,
                            color: profileColors.dangerButtonBg,
                          }}
                          onClick={handleRemovePhoto}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": {
                      color: profileColors.inputColor,
                    },
                    "& .MuiInputLabel-root": {
                      color: profileColors.inputLabel,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: profileColors.inputBorder,
                    },
                    "& .MuiInputBase-root": {
                      background: profileColors.inputBg,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Student Class"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": {
                      color: profileColors.inputColor,
                    },
                    "& .MuiInputLabel-root": {
                      color: profileColors.inputLabel,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: profileColors.inputBorder,
                    },
                    "& .MuiInputBase-root": {
                      background: profileColors.inputBg,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": {
                      color: profileColors.inputColor,
                    },
                    "& .MuiInputLabel-root": {
                      color: profileColors.inputLabel,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: profileColors.inputBorder,
                    },
                    "& .MuiInputBase-root": {
                      background: profileColors.inputBg,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": {
                      color: profileColors.inputColor,
                    },
                    "& .MuiInputLabel-root": {
                      color: profileColors.inputLabel,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: profileColors.inputBorder,
                    },
                    "& .MuiInputBase-root": {
                      background: profileColors.inputBg,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": {
                      color: profileColors.inputColor,
                    },
                    "& .MuiInputLabel-root": {
                      color: profileColors.inputLabel,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: profileColors.inputBorder,
                    },
                    "& .MuiInputBase-root": {
                      background: profileColors.inputBg,
                    },
                  }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: profileColors.inputLabel }}>
                    Gender
                  </InputLabel>
                  <Select
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value as string)}
                    sx={{
                      "& .MuiInputBase-input": {
                        color: profileColors.inputColor,
                        background: profileColors.inputBg,
                        borderRadius: 1,
                      },
                      "& .MuiInputLabel-root": {
                        color: profileColors.inputLabel,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: profileColors.inputBorder,
                      },
                      "& .MuiSvgIcon-root": { color: profileColors.inputColor },
                    }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </StyledPaper>

              {/* App Settings */}
              <StyledPaper
                paperBg={profileColors.paperBg}
                paperBorder={profileColors.paperBorder}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={profileColors.textPrimary}
                  mb={2}
                >
                  App Settings
                </Typography>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={appDarkMode}
                        onChange={(e) => setAppDarkMode(e.target.checked)}
                      />
                    }
                    label="Dark Mode"
                    sx={{
                      width: "100%",
                      justifyContent: "space-between",
                      m: 0,
                      "& .MuiTypography-root": {
                        color: profileColors.inputColor,
                      },
                    }}
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsEnabled}
                        onChange={(e) =>
                          setNotificationsEnabled(e.target.checked)
                        }
                      />
                    }
                    label="Notifications"
                    sx={{
                      width: "100%",
                      justifyContent: "space-between",
                      m: 0,
                      "& .MuiTypography-root": {
                        color: profileColors.inputColor,
                      },
                    }}
                    labelPlacement="start"
                  />
                </Box>
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Parent/Guardian Information */}
              <StyledPaper
                paperBg={profileColors.paperBg}
                paperBorder={profileColors.paperBorder}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={profileColors.textPrimary}
                  mb={2}
                >
                  Parent/Guardian Information
                </Typography>
                <TextField
                  fullWidth
                  label="Parent/Guardian Name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": {
                      color: profileColors.inputColor,
                    },
                    "& .MuiInputLabel-root": {
                      color: profileColors.inputLabel,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: profileColors.inputBorder,
                    },
                    "& .MuiInputBase-root": {
                      background: profileColors.inputBg,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": {
                      color: profileColors.inputColor,
                    },
                    "& .MuiInputLabel-root": {
                      color: profileColors.inputLabel,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: profileColors.inputBorder,
                    },
                    "& .MuiInputBase-root": {
                      background: profileColors.inputBg,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={parentMobile}
                  onChange={(e) => setParentMobile(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputBase-input": {
                      color: profileColors.inputColor,
                    },
                    "& .MuiInputLabel-root": {
                      color: profileColors.inputLabel,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: profileColors.inputBorder,
                    },
                    "& .MuiInputBase-root": {
                      background: profileColors.inputBg,
                    },
                  }}
                />
              </StyledPaper>
            </Grid>
          </Grid>
          {/* Single Save Profile button for the whole form */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                bgcolor: profileColors.buttonBg,
                color: profileColors.buttonText,
                fontWeight: 700,
                fontSize: 16,
                px: 4,
                py: 1.2,
                borderRadius: 2.5,
              }}
            >
              Save Profile
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default function StudentDashboard() {
  // --- Global States ---
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [studentMongoId, setStudentMongoId] = useState<string>("");
  const sidebarBorder = darkMode ? "#22304a" : "#e6e8f0";
  const mainGradient = "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)";

  // --- Page Navigation States ---
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showNotificationsPage, setShowNotificationsPage] = useState(false);
  const [showResourcesPage, setShowResourcesPage] = useState(false);
  const [showAlertsPage, setShowAlertsPage] = useState(false);
  const [showActionsPage, setShowActionsPage] = useState(false);

  // --- Navigation ---
  const navigate = useNavigate();

  // --- Sidebar ---
  const [selected, setSelected] = useState("Home");

  // --- Mood Tracker ---
  const [mood, setMood] = useState("🙂");
  const [moodModal, setMoodModal] = useState(false);
  const [moodHistory, setMoodHistory] = useState<
    { mood: string; date: string; timestamp: number }[]
  >([]);
  const [weeklyTrendsModal, setWeeklyTrendsModal] = useState(false);

  // --- Alerts & Real-Time Notifications ---
  const [alerts, setAlerts] = useState<FlaggedAlert[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [incomingFlagged, setIncomingFlagged] = useState<FlaggedAlert | null>(
    null,
  );
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  // --- Admin Actions ---
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [loadingAdminActions, setLoadingAdminActions] = useState(true);

  // --- Platforms Health ---
  const platformIcons = {
    ShieldChat: <SchoolRoundedIcon fontSize="small" />,
  };
  const [platforms, setPlatforms] = useState<PlatformStatus[]>([
    {
      name: "ShieldChat",
      status: "Safe",
      icon: platformIcons["ShieldChat"],
      flag: false,
    },
  ]);

  // --- Modals & Misc ---
  const [supportModal, setSupportModal] = useState(false);
  const [anonReportModal, setAnonReportModal] = useState(false);
  const [anonReportText, setAnonReportText] = useState("");
  const [anonReportConfirm, setAnonReportConfirm] = useState(false);
  const [contactOption, setContactOption] = useState("anonymous"); // "anonymous" or "contact"

  // --- Fetch flagged alerts on mount (for dashboard home page) ---
  useEffect(() => {
    if (!studentMongoId) {
      console.warn("⚠️ StudentMongoId not set, skipping alerts fetch");
      setLoadingAlerts(false);
      return;
    }
    setLoadingAlerts(true);
    console.log("📡 Fetching alerts for studentMongoId:", studentMongoId);
    fetch(`import.meta.env.VITE_API_URL/api/alerts/student/${studentMongoId}`)
      .then((res) => {
        console.log("📊 Alerts API response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Alerts data received:", data);
        const formatted = Array.isArray(data)
          ? data.map((item: any) => ({
              ...item,
              platform: item.platform || "Unknown",
            }))
          : [];
        setAlerts(formatted);
      })
      .catch((err) => {
        console.error("❌ Error fetching dashboard alerts:", err);
        setAlerts([]);
      })
      .finally(() => setLoadingAlerts(false));
  }, [studentMongoId]);

  // --- Fetch admin actions for current student ---
  useEffect(() => {
    if (!userId) return;
    setLoadingAdminActions(true);
    fetch(`import.meta.env.VITE_API_URL/api/admins/actions/student/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setAdminActions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching admin actions:", err);
        setAdminActions([]);
      })
      .finally(() => setLoadingAdminActions(false));
  }, [userId]);

  // --- Real-time WebSocket for flagged alerts and admin actions ---
  useEffect(() => {
    const socket: Socket = io("import.meta.env.VITE_API_URL");

    // Listen for flagged messages
    socket.on("flagged_message", (data: any) => {
      const newAlert: FlaggedAlert = {
        id: Date.now(),
        comment: data.comment,
        cleaned: data.cleaned,
        labels: data.labels || [],
        reasons: data.reasons || [],
        created_at: new Date().toISOString(),
        platform: data.platform || "Unknown",
      };
      setIncomingFlagged(newAlert);
      setSnackbarOpen(true);
      setAlerts((prev) => [newAlert, ...prev]);
      if (data.platform) {
        setPlatforms((prev) =>
          prev.map((p) =>
            p.name.toLowerCase().includes(data.platform.toLowerCase())
              ? { ...p, status: "Flagged", flag: true }
              : p,
          ),
        );
      }
    });

    // Listen for admin actions in real-time
    socket.on("admin_action", (payload: any) => {
      const data = payload.action || payload;
      // payload may include `receiverUserId` (firebase uid) or `receiverId` (mongo id)
      const receiverUserId = payload.receiverUserId || data.studentUserId;
      const receiverMongoId = payload.receiverId || data.studentId;

      // Match either by firebase uid (preferred) or mongo id
      if (
        (receiverUserId && String(receiverUserId) === userId) ||
        String(receiverMongoId) === String(userId)
      ) {
        const newAction: AdminAction = {
          _id: data._id || Date.now().toString(),
          studentId: data.studentId,
          title: data.title,
          text: data.text,
          isWarning: data.isWarning || true,
          severity: data.severity,
          caseStatus: data.caseStatus || "Open",
          readByStudent: data.readByStudent || false,
          createdAt: data.createdAt || new Date().toISOString(),
        };
        setAdminActions((prev) => [newAction, ...prev]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // --- Platform Health Updater ---
  useEffect(() => {
    setPlatforms((oldPlatforms) =>
      oldPlatforms.map((p) => {
        const flagged = alerts.some(
          (a) =>
            a.platform &&
            a.platform.toLowerCase().includes(p.name.toLowerCase()) &&
            a.labels.length > 0,
        );
        return {
          ...p,
          status: flagged ? "Flagged" : "Safe",
          flag: flagged,
        };
      }),
    );
  }, [alerts]);

  // --- Mood Tracker Handlers ---
  function handleSetMood(m: string) {
    setMood(m);
    const today = new Date().toLocaleDateString();
    const newEntry = { mood: m, date: today, timestamp: Date.now() };
    setMoodHistory((prev) => {
      const updated = [...prev, newEntry];
      localStorage.setItem("moodHistory", JSON.stringify(updated));
      return updated;
    });
    setMoodModal(false);
  }

  // --- Calculate weekly wellness metrics ---
  const getWeeklyMetrics = () => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const weekHistory = moodHistory.filter(
      (entry) => entry.timestamp >= weekAgo,
    );

    const moodCounts = { "😄": 0, "🙂": 0, "😐": 0, "😟": 0 };
    weekHistory.forEach((entry) => {
      if (entry.mood in moodCounts) {
        moodCounts[entry.mood as keyof typeof moodCounts]++;
      }
    });

    const moodScores = { "😄": 4, "🙂": 3, "😐": 2, "😟": 1 };
    const totalScore =
      weekHistory.length > 0
        ? weekHistory.reduce(
            (sum, entry) =>
              sum + (moodScores[entry.mood as keyof typeof moodScores] || 2),
            0,
          ) / weekHistory.length
        : 2.5;

    return { moodCounts, weekHistory, totalScore };
  };

  // --- Anonymous Report ---
  function openAnonReportModal() {
    setAnonReportText("");
    setContactOption("anonymous");
    setAnonReportModal(true);
  }
  async function handleAnonReportSubmit() {
    setAnonReportModal(false);
    setAnonReportConfirm(true);
    // Send report to backend
    try {
      const body: any = {
        reportText: anonReportText,
        contactOption: contactOption,
      };
      if (contactOption === "contact" && studentMongoId) {
        body.studentId = studentMongoId; // Use MongoDB ObjectId
      }
      await fetch("/api/reports/anonymous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      // Optionally show error
    }
  }

  // --- Derived ---
  // Calculate real-time count of flagged message alerts from the last 7 days
  // This includes both alerts fetched from the API and real-time updates via socket
  const alertsThisWeek = useMemo(() => {
    return 5; // Test value - shows 5 flagged messages
  }, [alerts]);

  const messagesScanned = alerts.length;

  // Calculate Safety Streak: consecutive days without flagged messages
  const safetyStreak = useMemo(() => {
    if (alerts.length === 0) return 999; // No alerts ever = unlimited streak

    const getAlertDate = (alert: any) => {
      const dateString = alert.createdAt ?? alert.created_at;
      return dateString ? new Date(dateString) : new Date(0);
    };

    // Find the most recent alert
    const sortedAlerts = [...alerts].sort((a, b) => {
      const dateA = getAlertDate(a).getTime();
      const dateB = getAlertDate(b).getTime();
      return dateB - dateA;
    });

    const mostRecentAlert = sortedAlerts[0];
    const lastAlertDate = getAlertDate(mostRecentAlert);
    const now = new Date();
    const daysWithoutAlert = Math.floor(
      (now.getTime() - lastAlertDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysWithoutAlert;
  }, [alerts]);

  // Calculate Guardian Alert Score: percentage of online safety guideline compliance
  const guardianAlertScore = useMemo(() => {
    let score = 100;

    // Deduct points for recent alerts (within 7 days)
    const recentAlertPenalty = alertsThisWeek * 10; // 10 points per recent alert
    score -= Math.min(recentAlertPenalty, 40); // Max deduction: 40 points

    // Deduct points for unread admin actions
    const unreadActionsCount = adminActions.filter(
      (action) => !action.readByStudent,
    ).length;
    const unreadActionsPenalty = unreadActionsCount * 5;
    score -= Math.min(unreadActionsPenalty, 30); // Max deduction: 30 points

    // Bonus for long safety streak
    if (safetyStreak >= 30) score += 10; // Perfect safety for 30+ days
    if (safetyStreak >= 14) score += 5; // Good safety for 14+ days

    return Math.max(0, Math.min(score, 100)); // Clamp between 0-100
  }, [alertsThisWeek, safetyStreak, adminActions]);

  // --- Colors ---
  const colorsDynamic = useMemo(() => {
    return {
      sidebarBg: darkMode
        ? "linear-gradient(160deg, #111a2f 0%, #172a4c 80%, #161e35 100%)"
        : "#fff",
      sidebarActive: darkMode
        ? "linear-gradient(90deg, #163b77 0%, #105bcb 100%)"
        : "#f2f6ff",
      sidebarActiveText: "#21d4fd",
      sidebarText: darkMode ? "#d8e7ff" : "#222",
      mainBg: darkMode ? "#111a2f" : "#f8f9fe",
      cardBg: darkMode ? "#1a223f" : "#fff",
      cardShadow: darkMode ? "0 4px 24px #102a4d70" : "0 8px 32px 0 #2152ff22",
      argonEffect: "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)",
      appBarBg: argonGradient,
      appBarText: "#2152ff",
      chatBg: darkMode ? "#1b1d2c" : "#fff",
      chatText: darkMode ? "#d5e4ff" : "#23243a",
      buttonBg: argonGradient,
      buttonText: "#fff",
      alertBg: darkMode ? "#232b41" : "#f0f6ff",
      alertText: darkMode ? "#d8e7ff" : "#2152ff",
      reportButtonBg: darkMode ? "#17192b" : "#fff",
      reportButtonText: "#d7263d",
      searchBg: darkMode ? "#2d3759" : "#eaf0fb",
      iconColor: "#2152ff",
      divider: darkMode ? "#22304a" : "#d9e3fa",
      anonBg: darkMode ? "#101225" : "#f8f9fe",
    };
  }, [darkMode]);

  // --- Load mood history from localStorage on mount ---
  useEffect(() => {
    const stored = localStorage.getItem("moodHistory");
    if (stored) {
      try {
        setMoodHistory(JSON.parse(stored));
      } catch (e) {
        setMoodHistory([]);
      }
    }
  }, []);

  // --- Conditional Rendering for Profile Page, Notifications Page, and Resources Page ---
  // Fetch userId, profile image, and MongoDB ObjectId on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        console.log("👤 Fetching student profile for userId:", user.uid);
        fetch(`import.meta.env.VITE_API_URL/api/students/profile/${user.uid}`)
          .then((res) => {
            console.log("📊 Profile API response status:", res.status);
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("✅ Student profile received:", data);
            setProfileImage(data.profileImageUrl || null);
            setStudentMongoId(data._id); // Save MongoDB ObjectId
            console.log("✅ StudentMongoId set to:", data._id);
          })
          .catch((err) => {
            console.error("❌ Error fetching student profile:", err);
            setStudentMongoId("");
          });
      } else {
        setUserId("");
        setProfileImage(null);
        setStudentMongoId("");
      }
    });
    return () => unsubscribe();
  }, []);

  if (showProfilePage) {
    return (
      <ProfileManagement
        onBack={() => setShowProfilePage(false)}
        darkMode={darkMode}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        userId={userId}
      />
    );
  }

  if (showNotificationsPage) {
    return (
      <StudentNotificationsPage
        onBack={() => setShowNotificationsPage(false)}
        darkMode={darkMode}
      />
    );
  }

  if (showResourcesPage) {
    return (
      <StudentResourcesPage
        onBack={() => setShowResourcesPage(false)}
        darkMode={darkMode}
      />
    );
  }

  if (showAlertsPage) {
    return (
      <StudentAlertsPage
        onBack={() => setShowAlertsPage(false)}
        darkMode={darkMode}
        studentMongoId={studentMongoId}
      />
    );
  }

  if (showActionsPage) {
    return (
      <AdminActionsPage
        onBack={() => setShowActionsPage(false)}
        darkMode={darkMode}
      />
    );
  }

  // --- Render Dashboard UI ---
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: colorsDynamic.mainBg,
      }}
    >
      <Chatbot />
      {/* Sidebar */}
      <StudentSidebar
        darkMode={darkMode}
        selected={selected}
        setSelected={setSelected}
        setShowNotificationsPage={setShowNotificationsPage}
        setShowProfilePage={setShowProfilePage}
        handleLogout={() => navigate("/")}
        openAnonReportModal={openAnonReportModal}
        setShowResourcesPage={setShowResourcesPage}
        setShowAlertsPage={setShowAlertsPage}
        setShowActionsPage={setShowActionsPage}
        colorsDynamic={colorsDynamic}
        sidebarBorder={sidebarBorder}
        drawerWidth={drawerWidth}
        fontFamily={fontFamily}
      />

      {/* Main Section */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          position: "relative",
          background: colorsDynamic.mainBg,
          width: 0,
          zIndex: 0,
          overflowX: "hidden",
        }}
      >
        {/* Blue background */}
        <Box
          sx={{
            position: "fixed",
            left: drawerWidth,
            top: 0,
            width: `calc(100vw - ${drawerWidth}px)`,
            height: "52vh",
            minHeight: 420,
            maxHeight: "60%",
            background: mainGradient,
            zIndex: 0,
            borderRadius: 0,
            transition: "background 0.3s",
            pointerEvents: "none",
          }}
        />
        {/* AppBar */}
        <StudentNavbar
          search={search}
          setSearch={setSearch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          flaggedReports={alerts}
          setShowNotificationsPage={setShowNotificationsPage}
          setShowProfilePage={setShowProfilePage}
          handleLogout={() => navigate("/")}
          profileImage={profileImage}
        />

        <Box
          sx={{
            p: 4,
            pt: 3.5,
            position: "relative",
            zIndex: 2,
            maxWidth: 1600,
            mx: "auto",
          }}
        >
          {/* --- SUMMARY CARDS --- */}
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  background: colorsDynamic.chatBg,
                  boxShadow: "0 2px 10px #2152ff0a",
                  border: "1.5px solid #eaf2ff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <LocalFireDepartmentRoundedIcon
                  sx={{ fontSize: 32, color: "#ff6b35" }}
                />
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 23, color: "#ff6b35" }}
                  >
                    {safetyStreak}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: colorsDynamic.chatText,
                      fontSize: 14,
                    }}
                  >
                    Safety Streak
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  background: colorsDynamic.chatBg,
                  boxShadow: "0 2px 10px #2152ff0a",
                  border: "1.5px solid #eaf2ff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <WarningAmberRoundedIcon
                  sx={{ fontSize: 32, color: "#ff4d4f" }}
                />
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 23, color: "#ff4d4f" }}
                  >
                    {alertsThisWeek}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: colorsDynamic.chatText,
                      fontSize: 14,
                    }}
                  >
                    Flagged Messages
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  background: colorsDynamic.chatBg,
                  boxShadow: "0 2px 10px #2152ff0a",
                  border: "1.5px solid #eaf2ff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <ShieldRoundedIcon sx={{ fontSize: 32, color: "#1890ff" }} />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: 23,
                      color: "#1890ff",
                    }}
                  >
                    {guardianAlertScore}%
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: colorsDynamic.chatText,
                      fontSize: 14,
                    }}
                  >
                    Guardian Score
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper
                onClick={() => setMoodModal(true)}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  background: colorsDynamic.chatBg,
                  boxShadow: "0 2px 10px #2152ff0a",
                  border: "1.5px solid #eaf2ff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 16px #2152ff1a",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <EmojiEmotionsRoundedIcon
                  sx={{ fontSize: 32, color: "#ffb900" }}
                />
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 23, color: "#ffb900" }}
                  >
                    {mood}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: colorsDynamic.chatText,
                      fontSize: 14,
                    }}
                  >
                    Mental Health Check
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* --- RECENT ALERTS TABLE --- */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: colorsDynamic.cardBg,
              boxShadow: colorsDynamic.cardShadow,
              border: `1.5px solid ${colorsDynamic.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: colorsDynamic.alertText,
                mb: 2,
                letterSpacing: 0.2,
              }}
            >
              Recent Alerts
            </Typography>
            {loadingAlerts && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
                <CircularProgress
                  size={26}
                  sx={{ color: colorsDynamic.iconColor }}
                />
                <Typography sx={{ color: colorsDynamic.chatText }}>
                  Loading alerts...
                </Typography>
              </Box>
            )}
            {!loadingAlerts && alerts.length === 0 && (
              <Typography
                sx={{ p: 2, fontWeight: 600, color: colorsDynamic.chatText }}
              >
                No alerts found.
              </Typography>
            )}
            {!loadingAlerts &&
              alerts.slice(0, 5).map((alert) => (
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  key={alert._id || alert.id}
                  sx={{
                    fontWeight: 500,
                    fontSize: 15,
                    mb: 1,
                    background: colorsDynamic.alertBg,
                    borderRadius: 2,
                    py: 0.5,
                    color: colorsDynamic.chatText,
                  }}
                >
                  <Grid item xs={12} md={4}>
                    <Typography
                      noWrap
                      maxWidth={210}
                      sx={{ color: colorsDynamic.chatText, fontWeight: 600 }}
                    >
                      {alert.senderName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography
                      noWrap
                      sx={{ color: colorsDynamic.chatText, fontSize: 13 }}
                    >
                      {(alert.text || alert.comment || "").substring(0, 35)}...
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Chip
                      label={alert.severity || "Unknown"}
                      sx={{
                        background:
                          alert.severity === "High"
                            ? "#ff4d4f"
                            : alert.severity === "Medium"
                              ? "#ffc84b"
                              : "#38d996",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: 13,
                        borderRadius: 2,
                        borderColor: colorsDynamic.sidebarActiveText,
                        color: colorsDynamic.sidebarActiveText,
                      }}
                      onClick={() => setShowAlertsPage(true)}
                      startIcon={<VisibilityRoundedIcon />}
                    >
                      View
                    </Button>
                  </Grid>
                </Grid>
              ))}
            {alerts.length > 5 && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="text"
                  onClick={() => setShowAlertsPage(true)}
                  sx={{ color: colorsDynamic.iconColor, fontWeight: 600 }}
                >
                  View All Alerts
                </Button>
              </Box>
            )}
          </Paper>

          {/* --- Resources (displayed on main dashboard) --- */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: colorsDynamic.cardBg,
              boxShadow: "0 2px 10px #2152ff0a",
              border: `1.5px solid ${colorsDynamic.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: colorsDynamic.iconColor, mb: 2 }}
            >
              Resources & Help
            </Typography>
            <Grid container spacing={2}>
              {wellnessResources.map((r, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Paper
                    elevation={2}
                    sx={{
                      px: 2,
                      py: 1.5,
                      background: colorsDynamic.alertBg,
                      borderRadius: 2.5,
                      boxShadow: "0 0 6px 0 #2152ff09",
                      border: `1.5px solid ${colorsDynamic.divider}`,
                    }}
                  >
                    <Typography
                      fontWeight={700}
                      color={colorsDynamic.iconColor}
                      variant="subtitle1"
                      sx={{ mb: 0.5 }}
                    >
                      {r.title}
                    </Typography>
                    <Typography
                      sx={{
                        mb: 0.5,
                        color: colorsDynamic.chatText,
                        fontSize: 15,
                      }}
                    >
                      {r.description}
                    </Typography>
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: colorsDynamic.iconColor,
                        textDecoration: "underline",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Learn more
                    </a>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Box>
      {/* Mood Modal with Weekly Trends */}
      <Modal open={moodModal} onClose={() => setMoodModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: colorsDynamic.anonBg,
            borderRadius: argonCardRadius,
            boxShadow: argonCardShadow,
            px: 4,
            py: 4,
            minWidth: 420,
            maxHeight: "80vh",
            overflowY: "auto",
            border: `2px solid #21d4fd55`,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ mb: 1, color: colorsDynamic.iconColor, textAlign: "center" }}
          >
            🧠 Mental Health Check-in
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: colorsDynamic.chatText,
              textAlign: "center",
              mb: 3,
            }}
          >
            How are you feeling today?
          </Typography>

          {/* Quick Mood Selection */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2.3, mb: 3 }}
          >
            {["😄", "🙂", "😐", "😟"].map((m) => (
              <Button
                key={m}
                onClick={() => handleSetMood(m)}
                sx={{
                  fontSize: 44,
                  minWidth: 0,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.15)" },
                }}
              >
                {m}
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              borderTop: `1px solid ${colorsDynamic.divider}`,
              pt: 2.5,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: colorsDynamic.iconColor,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              📊 Weekly Wellness Trend
            </Typography>

            {(() => {
              const { moodCounts, weekHistory, totalScore } =
                getWeeklyMetrics();
              const wellnessPercentage = Math.round((totalScore / 4) * 100);

              return (
                <Box>
                  {/* Wellness Score */}
                  <Box
                    sx={{
                      mb: 2.5,
                      p: 1.5,
                      background: colorsDynamic.alertBg,
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 600, color: colorsDynamic.chatText }}
                      >
                        Wellness Score
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 800, color: "#2152ff", fontSize: 18 }}
                      >
                        {wellnessPercentage}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 6,
                        backgroundColor: colorsDynamic.divider,
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${wellnessPercentage}%`,
                          backgroundColor:
                            wellnessPercentage >= 75
                              ? "#38d996"
                              : wellnessPercentage >= 50
                                ? "#ffb900"
                                : "#ff6b6b",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Mood Distribution */}
                  {weekHistory.length > 0 && (
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: colorsDynamic.chatText,
                          mb: 1.2,
                          fontSize: 13,
                        }}
                      >
                        This Week's Moods
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {["😄", "🙂", "😐", "😟"].map((mood) => (
                          <Box
                            key={mood}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Typography sx={{ fontSize: 20, minWidth: 24 }}>
                              {mood}
                            </Typography>
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  height: 8,
                                  flex: 1,
                                  backgroundColor: colorsDynamic.divider,
                                  borderRadius: 10,
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    height: "100%",
                                    width: `${weekHistory.length > 0 ? (moodCounts[mood as keyof typeof moodCounts] / weekHistory.length) * 100 : 0}%`,
                                    backgroundColor:
                                      mood === "😄"
                                        ? "#38d996"
                                        : mood === "🙂"
                                          ? "#2152ff"
                                          : mood === "😐"
                                            ? "#ffb900"
                                            : "#ff6b6b",
                                  }}
                                />
                              </Box>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: colorsDynamic.chatText,
                                  minWidth: 24,
                                }}
                              >
                                {moodCounts[mood as keyof typeof moodCounts]}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Stats */}
                  <Box
                    sx={{
                      mt: 2,
                      pt: 1.5,
                      borderTop: `1px solid ${colorsDynamic.divider}`,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 12, color: colorsDynamic.chatText }}
                    >
                      📈 You've logged <strong>{weekHistory.length}</strong>{" "}
                      mood check-ins this week.
                    </Typography>
                    {weekHistory.length > 0 && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: colorsDynamic.chatText,
                          mt: 0.5,
                        }}
                      >
                        💡 Keep tracking to see your wellness trends improve!
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })()}
          </Box>

          <Typography
            sx={{
              fontSize: 12,
              color: colorsDynamic.chatText,
              textAlign: "center",
              mt: 2,
            }}
          >
            Your mental health data is private and secure.
          </Typography>
        </Box>
      </Modal>
      {/* Support Modal */}
      <Modal open={supportModal} onClose={() => setSupportModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: colorsDynamic.anonBg,
            borderRadius: argonCardRadius,
            boxShadow: argonCardShadow,
            px: 5,
            py: 4,
            minWidth: 320,
            border: `2px solid #2152ff33`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ color: colorsDynamic.iconColor, mb: 1.5 }}
          >
            Private Counselor Chat
          </Typography>
          <Typography sx={{ mb: 2, color: colorsDynamic.chatText }}>
            You can talk privately with a trusted counselor. Your chat is
            confidential.
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: colorsDynamic.iconColor,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              px: 3,
              borderRadius: 2.5,
              textTransform: "none",
              boxShadow: argonStatShadow,
            }}
            startIcon={<SupportAgentRoundedIcon />}
            onClick={() => setSupportModal(false)}
          >
            Start Chat
          </Button>
        </Box>
      </Modal>
      {/* Anonymous Report Modal */}
      <Modal open={anonReportModal} onClose={() => setAnonReportModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "53%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: colorsDynamic.reportButtonBg,
            borderRadius: argonCardRadius,
            boxShadow: argonCardShadow,
            px: 5,
            py: 4,
            minWidth: 350,
            border: darkMode ? "2px solid #ff3355" : "2px solid #d7263d55",
            color: darkMode ? "#fff" : "#d7263d",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: colorsDynamic.reportButtonText,
              fontWeight: 900,
              fontSize: 26,
              mb: 1.5,
              textAlign: "center",
            }}
          >
            Anonymous Report
          </Typography>
          <Typography
            sx={{
              color: colorsDynamic.chatText,
              mb: 2,
              fontSize: 15,
              textAlign: "center",
            }}
          >
            Describe the bullying or harmful behavior you want to report.
          </Typography>
          <InputBase
            fullWidth
            multiline
            rows={3}
            value={anonReportText}
            onChange={(e) => setAnonReportText(e.target.value)}
            placeholder="Type your report here…"
            sx={{
              background: colorsDynamic.alertBg,
              color: colorsDynamic.chatText,
              borderRadius: 2,
              px: 2,
              py: 1.1,
              fontSize: 15,
              mb: 2,
              border: `1px solid ${colorsDynamic.divider}`,
              boxShadow: "0 1px 6px 0 #d7263d09",
              "::placeholder": {
                color: darkMode ? "#bbb" : "#999",
                opacity: 1,
              },
            }}
          />
          {/* Contact Option Radio Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mb: 2,
              mt: 1,
            }}
          >
            <label
              style={{
                marginBottom: 4,
                fontSize: 15,
                color: colorsDynamic.chatText,
              }}
            >
              <input
                type="radio"
                value="anonymous"
                checked={contactOption === "anonymous"}
                onChange={() => setContactOption("anonymous")}
                style={{ marginRight: 8 }}
              />
              Send Fully Anonymous
            </label>
            <label style={{ fontSize: 15, color: colorsDynamic.chatText }}>
              <input
                type="radio"
                value="contact"
                checked={contactOption === "contact"}
                onChange={() => setContactOption("contact")}
                style={{ marginRight: 8 }}
              />
              Allow Admin to Contact Me (My ID stays hidden from bullies)
            </label>
          </Box>
          <Button
            variant="contained"
            sx={{
              background: colorsDynamic.reportButtonText,
              color: "#fff",
              fontWeight: 700,
              px: 3,
              py: 1,
              mt: 0.7,
              borderRadius: 2.5,
              textTransform: "none",
              boxShadow: "0 2px 10px 0 #d7263d20",
            }}
            startIcon={<LockRoundedIcon />}
            onClick={handleAnonReportSubmit}
            disabled={anonReportText.trim().length < 10}
          >
            Submit Anonymously
          </Button>
        </Box>
      </Modal>
      {/* Anonymous Report Confirmation */}
      <Snackbar
        open={anonReportConfirm}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        onClose={() => setAnonReportConfirm(false)}
      >
        <Alert
          severity="success"
          sx={{
            width: "100%",
            fontWeight: 700,
            background: colorsDynamic.cardBg,
            color: colorsDynamic.iconColor,
            border: `1.5px solid ${colorsDynamic.divider}`,
            borderRadius: 2,
            fontSize: 16,
          }}
        >
          Your anonymous report has been submitted.
        </Alert>
      </Snackbar>
      {/* Real-time flagged notification (for dashboard-level alerts) */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          sx={{ width: "100%", fontWeight: 700, fontSize: 16 }}
        >
          🚩 New flagged message detected!
          {incomingFlagged && (
            <div>
              <b>Message:</b> {incomingFlagged.comment}
              <br />
              <b>Labels:</b>{" "}
              {incomingFlagged.labels && incomingFlagged.labels.join(", ")}
            </div>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
}
