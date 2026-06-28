import Chatbot from "../../components/ChatBot";
import { auth } from "../../services/Firebase";
import UserManagementPage from "../admin/UserManagementPage";
import axios from "axios";
import { Link } from "react-router-dom";
import type { Report } from "../../types/types";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  IconButton,
  Avatar,
  Button,
  Stack,
  Chip,
  Paper,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Modal,
  TextField,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";
import TeamsIcon from "@mui/icons-material/GroupsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { io } from "socket.io-client";
import NotificationsPage from "./AdminNotificationsPage";
import AdminNavbar from "./AdminNavbar";
import AlertsList from "../../components/dashboard/AlertsList";

const API_URL = import.meta.env.VITE_API_URL as string;
const drawerWidth = 210;
const paperRadius = 4.5;
const fontFamily = "'Inter', 'Poppins', Arial, sans-serif";

const sideBarItems = [
  {
    text: "Home",
    icon: <HomeRoundedIcon fontSize="small" />,
    link: "/admin-dashboard",
  },
  {
    text: "Flagged Messages",
    icon: <FlagOutlinedIcon fontSize="small" />,
    link: "/admin-dashboard",
  },
  {
    text: "Reports",
    icon: <InsertChartOutlinedIcon fontSize="small" />,
    link: "/admin-dashboard",
  },
  {
    text: "User Management",
    icon: <GroupsOutlinedIcon fontSize="small" />,
    link: "/admin-dashboard",
  },
  {
    text: "Resources",
    icon: <InfoOutlinedIcon fontSize="small" />,
    link: "/admin-dashboard",
  },
  {
    text: "Charts",
    icon: <InsertChartOutlinedIcon fontSize="small" />,
    link: "/admin/charts",
  }, // ✅ new
];

function severityColor(severity: string) {
  if (severity === "High") return "#d32f2f"; // Red
  if (severity === "Medium") return "#fbc02d"; // Yellow
  return "#1976d2"; // Blue
}

// --- Admin Profile Management Component (with persist & card on reload) ---
const AdminProfileManagement = ({
  adminProfile,
  setAdminProfile,
  onBack,
  darkMode,
}: {
  adminProfile: any;
  setAdminProfile: React.Dispatch<React.SetStateAction<any>>;
  onBack: () => void;
  darkMode: boolean;
}) => {
  // Get userId from Firebase Auth
  const [userId, setUserId] = React.useState("");
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : "");
    });
    return () => unsubscribe();
  }, []);

  // Card/form toggle (default false, but auto-switch below)
  const [isProfileCard, setIsProfileCard] = React.useState(false);
  const [profileLoaded, setProfileLoaded] = React.useState(false);

  // Snackbar state for feedback
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const profileColors = React.useMemo(
    () => ({
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
    }),
    [darkMode],
  );

  const StyledPaper = styled(Paper)(() => ({
    p: 3,
    borderRadius: 4,
    background: profileColors.paperBg,
    boxShadow: "0 2px 10px #2152ff0a",
    border: `1.5px solid ${profileColors.paperBorder}`,
    mb: 4,
  }));

  // --- Fetch profile on mount ---
  React.useEffect(() => {
    // Only fetch if we have a userId
    async function fetchProfile() {
      if (!userId) return;
      try {
        const res = await fetch(
          `import.meta.env.VITE_API_URL/api/admins/profile/${userId}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.fullName) {
            setAdminProfile({
              ...data,
              removeSuccessSnackbar: false,
              hasProfileImage: !!data.profileImage,
              appDarkMode: data.appDarkMode ?? darkMode,
            });
            setIsProfileCard(true);
          } else {
            setIsProfileCard(false);
          }
        } else {
          setIsProfileCard(false);
        }
      } catch {
        setIsProfileCard(false);
      }
      setProfileLoaded(true);
    }
    if (userId) fetchProfile();
    else setProfileLoaded(true); // fallback: show form instantly if not logged in
    // eslint-disable-next-line
  }, [userId]);

  const handleChangePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdminProfile((prev: any) => ({
          ...prev,
          profileImage: e.target?.result,
          hasProfileImage: true,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAdminProfile((prev: any) => ({
      ...prev,
      profileImage: null,
      hasProfileImage: false,
      removeSuccessSnackbar: true,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // === SAVE PROFILE: after save, show card ===
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const profileData = {
      userId: userId || adminProfile.userId,
      fullName: adminProfile.fullName,
      email: adminProfile.email,
      mobileNumber: adminProfile.mobileNumber,
      department: adminProfile.department,
      emergencyContact: {
        name: adminProfile.emergencyContact.name,
        phone: adminProfile.emergencyContact.phone,
      },
      profileImage: adminProfile.profileImage || null,
      appDarkMode: adminProfile.appDarkMode,
    };
    try {
      const response = await fetch(
        "import.meta.env.VITE_API_URL/api/admins/profile",
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
        setIsProfileCard(true);
      } else {
        setSnackbar({
          open: true,
          message: "Failed to save profile.",
          severity: "error",
        });
      }
    } catch {
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
          `import.meta.env.VITE_API_URL/api/admins/${userId}`,
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

  // --- Render ---
  if (!profileLoaded) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h6" color={profileColors.textPrimary}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        pt: 3.5,
        background: profileColors.paperBg,
        minHeight: "100vh",
        color: profileColors.textPrimary,
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
          Admin Profile & Settings
        </Typography>
      </Box>

      {isProfileCard ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            minHeight: "60vh",
            mt: 2,
          }}
        >
          <Paper
            sx={{
              background: profileColors.paperBg,
              borderRadius: 5,
              boxShadow: "0 8px 40px #2152ff16",
              px: 6,
              py: 5,
              minWidth: 700,
              maxWidth: 900,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 4,
            }}
          >
            {/* Profile Picture and Name */}
            <Box
              sx={{
                minWidth: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mr: 4,
              }}
            >
              <Avatar
                src={adminProfile.profileImage || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#fff",
                  color: "#2152ff",
                  boxShadow: "0 2px 16px #2152ff22",
                  mb: 2,
                }}
              >
                {!adminProfile.profileImage && (
                  <PersonOutlineOutlinedIcon sx={{ fontSize: 90 }} />
                )}
              </Avatar>
              <Typography
                variant="h5"
                fontWeight={800}
                color={profileColors.textPrimary}
                sx={{ mb: 1, textAlign: "center" }}
              >
                {adminProfile.fullName || "No Name"}
              </Typography>
            </Box>
            {/* Details Section */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* Admin Details */}
              <Box
                sx={{
                  background: profileColors.paperBg,
                  borderRadius: 3,
                  p: 3,
                  boxShadow: "0 2px 8px #2152ff0a",
                  mb: 3,
                }}
              >
                <Typography
                  fontWeight={700}
                  color={profileColors.cardSectionTitle}
                  fontSize={18}
                  sx={{ mb: 2 }}
                >
                  Administrator Details
                </Typography>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: profileColors.cardLabel,
                      minWidth: 120,
                    }}
                  >
                    Full Name:
                  </Typography>
                  <Typography
                    sx={{ color: profileColors.cardValue, fontWeight: 500 }}
                  >
                    {adminProfile.fullName || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: profileColors.cardLabel,
                      minWidth: 120,
                    }}
                  >
                    Email:
                  </Typography>
                  <Typography
                    sx={{ color: profileColors.cardValue, fontWeight: 500 }}
                  >
                    {adminProfile.email || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: profileColors.cardLabel,
                      minWidth: 120,
                    }}
                  >
                    Phone No.:
                  </Typography>
                  <Typography
                    sx={{ color: profileColors.cardValue, fontWeight: 500 }}
                  >
                    {adminProfile.mobileNumber || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: profileColors.cardLabel,
                      minWidth: 120,
                    }}
                  >
                    Department:
                  </Typography>
                  <Typography
                    sx={{ color: profileColors.cardValue, fontWeight: 500 }}
                  >
                    {adminProfile.department || "—"}
                  </Typography>
                </Box>
              </Box>
              {/* Emergency Contact - now below Admin Details */}
              <Box
                sx={{
                  background: profileColors.paperBg,
                  borderRadius: 3,
                  p: 3,
                  boxShadow: "0 2px 8px #2152ff0a",
                  mb: 3,
                }}
              >
                <Typography
                  fontWeight={700}
                  color={profileColors.cardSectionTitle}
                  fontSize={18}
                  sx={{ mb: 2 }}
                >
                  Emergency Contact
                </Typography>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: profileColors.cardLabel,
                      minWidth: 120,
                    }}
                  >
                    Full Name:
                  </Typography>
                  <Typography
                    sx={{ color: profileColors.cardValue, fontWeight: 500 }}
                  >
                    {adminProfile.emergencyContact?.name || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: profileColors.cardLabel,
                      minWidth: 120,
                    }}
                  >
                    Phone No.:
                  </Typography>
                  <Typography
                    sx={{ color: profileColors.cardValue, fontWeight: 500 }}
                  >
                    {adminProfile.emergencyContact?.phone || "—"}
                  </Typography>
                </Box>
              </Box>
              {/* Edit and Delete Buttons */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: profileColors.buttonBg,
                    color: profileColors.buttonText,
                    fontWeight: 700,
                    fontSize: 18,
                    px: 6,
                    py: 1.5,
                    borderRadius: 2.5,
                    boxShadow: "0 2px 16px #2152ff33",
                    "&:hover": { bgcolor: "#1741b6" },
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
                    fontSize: 18,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2.5,
                    boxShadow: "0 2px 16px #d7263d33",
                    "&:hover": { bgcolor: profileColors.dangerButtonHover },
                  }}
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      ) : (
        // --- Editable Form Mode ---
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleSaveProfile}
            style={{ width: "100%", maxWidth: 650 }}
            onKeyDown={(e) => {
              if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
              ) {
                if (e.key === "Enter") {
                  if (
                    !(e.target instanceof HTMLTextAreaElement) &&
                    !e.target.multiple
                  ) {
                    e.preventDefault();
                  }
                }
              }
            }}
          >
            <StyledPaper
              sx={{
                p: 5, // Increased padding
                fontSize: 18, // Increased base font size
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                color={profileColors.textPrimary}
                mb={2}
                align="center"
                sx={{ fontSize: 28 }}
              >
                Profile Information
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 4,
                  justifyContent: "center",
                }}
              >
                <Avatar
                  src={adminProfile.profileImage || undefined}
                  sx={{
                    width: 110,
                    height: 110,
                    mr: 4,
                    bgcolor: profileColors.inputBg,
                    color: profileColors.textPrimary,
                  }}
                >
                  {!adminProfile.profileImage && (
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 100 }} />
                  )}
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color={profileColors.textPrimary}
                    sx={{ fontSize: 26 }}
                  >
                    {adminProfile.fullName || "No Name"}
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleChangePhoto}
                    style={{ display: "none" }}
                  />
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="medium"
                      sx={{
                        color: profileColors.textPrimary,
                        borderColor: profileColors.textPrimary,
                        fontSize: 16,
                        px: 2,
                        py: 1,
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Photo
                    </Button>
                    {adminProfile.profileImage && (
                      <Button
                        variant="outlined"
                        size="medium"
                        color="error"
                        sx={{
                          borderColor: profileColors.dangerButtonBg,
                          color: profileColors.dangerButtonBg,
                          fontSize: 16,
                          px: 2,
                          py: 1,
                        }}
                        onClick={handleRemovePhoto}
                      >
                        Remove Photo
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
              {/* TEXTFIELD */}
              <TextField
                fullWidth
                label="Full Name"
                value={adminProfile.fullName}
                onChange={(e) =>
                  setAdminProfile((prev: typeof adminProfile) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                sx={{
                  mb: 3,
                  fontSize: 18,
                  "& .MuiInputBase-input": {
                    color: profileColors.inputColor,
                    fontSize: 18,
                    py: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: profileColors.inputLabel,
                    fontSize: 18,
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
                value={adminProfile.email}
                onChange={(e) =>
                  setAdminProfile((prev: typeof adminProfile) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                sx={{
                  mb: 3,
                  fontSize: 18,
                  "& .MuiInputBase-input": {
                    color: profileColors.inputColor,
                    fontSize: 18,
                    py: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: profileColors.inputLabel,
                    fontSize: 18,
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
                label="Phone No."
                value={adminProfile.mobileNumber}
                onChange={(e) =>
                  setAdminProfile((prev: typeof adminProfile) => ({
                    ...prev,
                    mobileNumber: e.target.value,
                  }))
                }
                sx={{
                  mb: 3,
                  fontSize: 18,
                  "& .MuiInputBase-input": {
                    color: profileColors.inputColor,
                    fontSize: 18,
                    py: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: profileColors.inputLabel,
                    fontSize: 18,
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
                label="Department"
                value={adminProfile.department}
                onChange={(e) =>
                  setAdminProfile((prev: typeof adminProfile) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                sx={{
                  mb: 3,
                  fontSize: 18,
                  "& .MuiInputBase-input": {
                    color: profileColors.inputColor,
                    fontSize: 18,
                    py: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: profileColors.inputLabel,
                    fontSize: 18,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: profileColors.inputBorder,
                  },
                  "& .MuiInputBase-root": {
                    background: profileColors.inputBg,
                  },
                }}
              />

              <Typography
                variant="subtitle1"
                fontWeight={700}
                color={profileColors.textPrimary}
                mb={2}
                sx={{ fontSize: 20 }}
              >
                Emergency Contact
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={adminProfile.emergencyContact.name}
                    onChange={(e) =>
                      setAdminProfile((prev: typeof adminProfile) => ({
                        ...prev,
                        emergencyContact: {
                          ...prev.emergencyContact,
                          name: e.target.value,
                        },
                      }))
                    }
                    sx={{
                      fontSize: 18,
                      "& .MuiInputBase-input": {
                        color: profileColors.inputColor,
                        fontSize: 18,
                        py: 2,
                      },
                      "& .MuiInputLabel-root": {
                        color: profileColors.inputLabel,
                        fontSize: 18,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: profileColors.inputBorder,
                      },
                      "& .MuiInputBase-root": {
                        background: profileColors.inputBg,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone No."
                    value={adminProfile.emergencyContact.phone}
                    onChange={(e) =>
                      setAdminProfile((prev: typeof adminProfile) => ({
                        ...prev,
                        emergencyContact: {
                          ...prev.emergencyContact,
                          phone: e.target.value,
                        },
                      }))
                    }
                    sx={{
                      fontSize: 18,
                      "& .MuiInputBase-input": {
                        color: profileColors.inputColor,
                        fontSize: 18,
                        py: 2,
                      },
                      "& .MuiInputLabel-root": {
                        color: profileColors.inputLabel,
                        fontSize: 18,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: profileColors.inputBorder,
                      },
                      "& .MuiInputBase-root": {
                        background: profileColors.inputBg,
                      },
                    }}
                    InputLabelProps={{ style: { fontSize: 18 } }}
                  />
                </Grid>
              </Grid>
              {/* Centered Save Profile Button */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    bgcolor: profileColors.buttonBg,
                    color: profileColors.buttonText,
                    fontWeight: 700,
                    fontSize: 16,
                    px: 6,
                    py: 1.2,
                    borderRadius: 2.5,
                  }}
                >
                  Save Profile
                </Button>
              </Box>
            </StyledPaper>
            <StyledPaper>
              <Typography
                variant="h6"
                fontWeight={700}
                color={profileColors.textPrimary}
                mb={2}
                align="center"
                sx={{ fontSize: 22 }}
              >
                App Settings
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={adminProfile.appDarkMode}
                      onChange={(e) =>
                        setAdminProfile((prev: typeof adminProfile) => ({
                          ...prev,
                          appDarkMode: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={<span style={{ fontSize: 18 }}>Dark Mode</span>}
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    m: 0,
                    "& .MuiTypography-root": {
                      color: profileColors.inputColor,
                      fontSize: 18,
                    },
                  }}
                  labelPlacement="start"
                />
              </Box>
            </StyledPaper>
          </form>
        </Box>
      )}

      <Snackbar
        open={adminProfile.removeSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() =>
          setAdminProfile((prev: typeof adminProfile) => ({
            ...prev,
            removeSuccessSnackbar: false,
          }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() =>
            setAdminProfile((prev: typeof adminProfile) => ({
              ...prev,
              removeSuccessSnackbar: false,
            }))
          }
          severity="success"
          sx={{ width: "100%" }}
        >
          Photo removed successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
};

// --- AdminDashboard.tsx (UPDATED) ---
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [, setActiveUsers] = useState(0);
  const [flaggedCount, setFlaggedCount] = useState(0);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/dashboard/active-users`,
        );
        setActiveUsers(response.data.activeUsers || 0);
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };

    fetchActiveUsers();
  }, []);

  // ✅ Fetch flagged messages from API on mount only
  useEffect(() => {
    const fetchFlaggedMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/messages/flagged`,
        );

        if (response.data && Array.isArray(response.data)) {
          console.log("📥 Raw flagged messages from API:", response.data);

          // Convert API messages to LocalReport format
          const allReports: LocalReport[] = response.data.map(
            (msg: any, index: number) => ({
              _id: msg._id,
              id: index,
              title: msg.text?.substring(0, 50) || "Flagged Message",
              description: msg.text || "",
              message: msg.text,
              senderId: msg.senderId, // Add senderId - offender's ID
              receiverId: msg.receiverId, // Add receiverId - victim's ID
              status:
                msg.caseStatus || // Use caseStatus from backend if it exists
                (msg.severity === "High"
                  ? "Flagged"
                  : msg.severity === "Medium"
                    ? "Pending Review"
                    : "Low Priority"),
              flagged: msg.severity === "High",
              student_email: msg.senderName || msg.senderId || "Unknown",
              senderName: msg.senderName || msg.senderId || "Unknown",
              receiverName: msg.receiverName || msg.receiverId || "Unknown",
              senderClass: msg.senderClass || msg.sender?.studentClass || null,
              receiverClass:
                msg.receiverClass || msg.receiver?.studentClass || null,
              language: msg.language || "English",
              englishMeaning: msg.englishMeaning || "",
              severity: (msg.severity || "Low") as "High" | "Medium" | "Low",
              caseStatus: msg.caseStatus,
              adminNotes: msg.adminNotes,
              time: msg.createdAt
                ? new Date(msg.createdAt).toLocaleString()
                : new Date().toLocaleString(),
            }),
          );

          console.log(
            "📋 Converted reports with senderId:",
            allReports.map((r) => ({
              name: r.senderName,
              senderId: r.senderId, // This should log senderId
              reportId: r._id,
            })),
          );

          // Set all reports and also set recent 5 for dashboard
          setAllFlaggedReports(allReports);
          setFlaggedReports(allReports.slice(0, 5));

          // Count only "Flagged" status messages (exclude Pending Review and Low Priority)
          const flaggedOnlyCount = allReports.filter(
            (report) => report.status === "Flagged",
          ).length;
          setFlaggedCount(flaggedOnlyCount);

          // Update stats
          setStats((prev) =>
            prev.map((stat) =>
              stat.label === "Total Flagged"
                ? { ...stat, value: response.data.length }
                : stat,
            ),
          );
        }
      } catch (error) {
        console.error("Error fetching flagged messages:", error);
      }
    };

    // Fetch on mount only
    fetchFlaggedMessages();
  }, []);

  // ✅ Update case status (Pending, Resolved, Reopen) - Updates BOTH Recent Alerts and Flagged Messages
  const updateCaseStatus = async (messageId: string, newStatus: string) => {
    if (!messageId) {
      setCaseUpdateSnackbar({
        open: true,
        message: "Error: Message ID not found",
        severity: "error",
      });
      return;
    }

    setUpdatingCaseId(messageId);

    try {
      const response = await axios.put(
        `${API_URL}/api/messages/${messageId}/status`,
        { caseStatus: newStatus },
      );

      if (response.status === 200) {
        // Update BOTH allFlaggedReports (Flagged Messages page) and flaggedReports (Recent Alerts)
        setAllFlaggedReports((prevReports) =>
          prevReports.map((report) =>
            report._id === messageId
              ? { ...report, status: newStatus, caseStatus: newStatus }
              : report,
          ),
        );

        setFlaggedReports((prevReports) =>
          prevReports.map((report) =>
            report._id === messageId
              ? { ...report, status: newStatus, caseStatus: newStatus }
              : report,
          ),
        );

        setCaseUpdateSnackbar({
          open: true,
          message: `Case marked as ${newStatus}`,
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error updating case status:", error);
      setCaseUpdateSnackbar({
        open: true,
        message: "Failed to update case status",
        severity: "error",
      });
    } finally {
      setUpdatingCaseId(null);
    }
  };

  // ✅ Format name - shorten ObjectIds to be more readable
  const formatName = (name: string | undefined) => {
    if (!name) return "Unknown";
    // If it's a 24-character MongoDB ObjectId, show first 8 chars + ...
    if (name.match(/^[0-9a-f]{24}$/i)) {
      return `${name.substring(0, 8)}...`;
    }
    return name;
  };

  // ✅ Send Warning Message Function
  const sendWarningMessage = async () => {
    if (!selectedStudentForWarning) return;

    setSendingWarning(true);

    try {
      let messageContent = "";

      if (warningTemplate === "gentle") {
        messageContent = `Hello ${selectedStudentForWarning.name},\n\nWe noticed that one of your recent messages may have violated our community guidelines. Please remember to communicate respectfully with others.\n\nOur platform is designed to be a safe and inclusive space. We encourage you to review our Digital Citizenship guidelines.\n\nIf you have any questions, please reach out to our support team.\n\nBest regards,\nCyberShield Safety Team`;
      } else if (warningTemplate === "formal") {
        messageContent = `Dear ${selectedStudentForWarning.name},\n\nYou have received a formal warning regarding content in your message: "${selectedStudentForWarning.message.substring(0, 50)}..."\n\nThis behavior violates our Anti-Bullying Policy. Further violations may result in account restrictions.\n\nWe ask that you:\n1. Review the CyberShield Code of Conduct\n2. Consider speaking with a school counselor\n3. Commit to respectful communication\n\nAdministration`;
      } else if (warningTemplate === "severity") {
        const severityMsg =
          selectedStudentForWarning.severity === "High"
            ? "This is a SERIOUS violation of our bullying policy."
            : "This message contains inappropriate content.";
        messageContent = `${selectedStudentForWarning.name},\n\n${severityMsg}\n\nYour account privileges are being monitored. Continued violations will result in suspension.\n\nCounseling is recommended.\n\nCyberShield Safety Team`;
      } else if (warningTemplate === "custom") {
        messageContent = customWarningMessage;
      }

      // Log the warning action
      console.log("📧 Sending warning...");
      console.log("SelectedStudentForWarning:", selectedStudentForWarning);
      console.log(
        "StudentId being sent:",
        selectedStudentForWarning.receiverId || selectedStudentForWarning.name,
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL"}/api/messages/${selectedStudentForWarning.reportId}/warn`,
        {
          studentName: selectedStudentForWarning.name,
          studentId:
            selectedStudentForWarning.receiverId ||
            selectedStudentForWarning.name,
          warningType: warningTemplate,
          messageContent: messageContent,
          severity: selectedStudentForWarning.severity,
          adminId: auth.currentUser?.uid,
          timestamp: new Date().toISOString(),
        },
      );

      // Update case status to Pending Review
      await updateCaseStatus(
        selectedStudentForWarning.reportId,
        "Pending Review",
      );

      // ALSO create a separate AdminAction so it appears on the student's dashboard
      try {
        const apiBase =
          import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL";
        const adminActionPayload = {
          // Prefer sending firebase uid if available
          studentUserId: selectedStudentForWarning.receiverId,
          // server will resolve mongo id if possible
          senderId: auth.currentUser?.uid,
          senderName:
            adminProfile?.fullName || auth.currentUser?.displayName || "Admin",
          title: `Warning: ${warningTemplate}`,
          text: messageContent,
          isWarning: true,
          severity: selectedStudentForWarning.severity || "Low",
          caseStatus: "Open",
        };

        await axios.post(`${apiBase}/api/admins/actions`, adminActionPayload);
      } catch (e) {
        console.error("Failed to create AdminAction record:", e);
      }

      setCaseUpdateSnackbar({
        open: true,
        message: `⚠️ Warning sent to ${selectedStudentForWarning.name}. Case marked as Pending Review.`,
        severity: "success",
      });

      setWarningModalOpen(false);
      setSelectedStudentForWarning(null);
      setCustomWarningMessage("");
      setWarningTemplate("gentle");
    } catch (error) {
      console.error("Error sending warning:", error);
      setCaseUpdateSnackbar({
        open: true,
        message: "Failed to send warning message",
        severity: "error",
      });
    } finally {
      setSendingWarning(false);
    }
  };

  // ✅ Open Warning Modal
  const openWarningModal = (report: LocalReport) => {
    setSelectedStudentForWarning({
      name: report.senderName || "Student",
      reportId: report._id || "",
      message: report.message || "",
      severity: report.severity || "Low",
      receiver: report.receiverName || "Unknown",
      receiverId: report.senderId || "",
    });
    setWarningModalOpen(true);
  };

  // ✅ Open Student Selection Modal for Escalation
  const openStudentSelectionModal = (action: string) => {
    if (flaggedReports.length === 0) {
      setCaseUpdateSnackbar({
        open: true,
        message: "No flagged reports available for action",
        severity: "error",
      });
      return;
    }
    setPendingEscalationAction(action);
    setStudentSelectionModalOpen(true);
  };

  // ✅ Handle Student Selection and Open Action Modal
  const handleStudentSelected = (report: LocalReport) => {
    console.log("📋 Student selected from flagged reports:");
    console.log("Full report object:", report);
    console.log("report.senderId:", report.senderId); // This is the offender's ID
    console.log("report.senderName:", report.senderName);
    console.log("report._id:", report._id); // This is the flagged message ID

    // Create student data from report
    const studentData = {
      name: report.senderName || "Student",
      reportId: String(report._id || report.id || ""), // Ensure reportId is string
      message: report.message || "",
      severity: report.severity || "Low",
      receiver: report.receiverName || "Unknown",
      receiverId: String(report.senderId || ""), // Ensure receiverId is string - this is the offender's ID
    };

    console.log("Student data being set:", studentData);

    setStudentSelectionModalOpen(false);

    // Set the appropriate object based on pending action
    if (pendingEscalationAction === "warning") {
      setSelectedStudentForWarning(studentData);
      setWarningTemplate("gentle");
      setCustomWarningMessage("");
      setWarningModalOpen(true);
    } else if (pendingEscalationAction === "restrict") {
      setSelectedStudentForEscalation(studentData);
      setRestrictDuration(7);
      setEscalationReason("");
      setRestrictModalOpen(true);
    } else if (pendingEscalationAction === "suspend") {
      setSelectedStudentForEscalation(studentData);
      setSuspendDuration(14);
      setEscalationReason("");
      setSuspendModalOpen(true);
    } else if (pendingEscalationAction === "ban") {
      setSelectedStudentForEscalation(studentData);
      setEscalationReason("");
      setBanModalOpen(true);
    }
    setPendingEscalationAction(null);
  };

  // ✅ Handle Restrict User
  const handleRestrictUser = async () => {
    if (
      !selectedStudentForEscalation ||
      !selectedStudentForEscalation.reportId
    ) {
      setCaseUpdateSnackbar({
        open: true,
        message: "❌ Error: Missing student or report information",
        severity: "error",
      });
      return;
    }

    setProcessingEscalation(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/messages/${selectedStudentForEscalation.reportId}/escalate`;
      const payload = {
        action: "restrict",
        duration: restrictDuration,
        reason:
          escalationReason || "Repeated violations of community guidelines",
        adminId: auth.currentUser?.uid,
        studentName: selectedStudentForEscalation.name,
      };

      console.log("🔵 DEBUG: Restricting user");
      console.log("URL:", apiUrl);
      console.log("Payload:", payload);
      console.log("ReportID:", selectedStudentForEscalation.reportId);

      await axios.post(apiUrl, payload);

      setCaseUpdateSnackbar({
        open: true,
        message: `✅ User restricted for ${restrictDuration} days`,
        severity: "success",
      });

      updateCaseStatus(selectedStudentForEscalation.reportId, "Pending Review");
      setRestrictModalOpen(false);
    } catch (error) {
      console.error("Error restricting user:", error);
      setCaseUpdateSnackbar({
        open: true,
        message: "❌ Failed to restrict user",
        severity: "error",
      });
    } finally {
      setProcessingEscalation(false);
    }
  };

  // ✅ Handle Suspend Account
  const handleSuspendAccount = async () => {
    if (
      !selectedStudentForEscalation ||
      !selectedStudentForEscalation.reportId
    ) {
      setCaseUpdateSnackbar({
        open: true,
        message: "❌ Error: Missing student or report information",
        severity: "error",
      });
      return;
    }

    setProcessingEscalation(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL"}/api/messages/${selectedStudentForEscalation.reportId}/escalate`;
      const payload = {
        action: "suspend",
        duration: suspendDuration,
        reason:
          escalationReason || "Serious violations of anti-bullying policy",
        adminId: auth.currentUser?.uid,
        studentName: selectedStudentForEscalation.name,
      };

      console.log("🔵 DEBUG: Suspending account");
      console.log("URL:", apiUrl);
      console.log("Payload:", payload);
      console.log("ReportID:", selectedStudentForEscalation.reportId);

      await axios.post(apiUrl, payload);

      setCaseUpdateSnackbar({
        open: true,
        message: `✅ Account suspended for ${suspendDuration} days`,
        severity: "success",
      });

      updateCaseStatus(selectedStudentForEscalation.reportId, "Pending Review");
      setSuspendModalOpen(false);
    } catch (error) {
      console.error("Error suspending account:", error);
      setCaseUpdateSnackbar({
        open: true,
        message: "❌ Failed to suspend account",
        severity: "error",
      });
    } finally {
      setProcessingEscalation(false);
    }
  };

  // ✅ Handle Permanent Ban
  const handlePermanentBan = async () => {
    if (
      !selectedStudentForEscalation ||
      !selectedStudentForEscalation.reportId
    ) {
      setCaseUpdateSnackbar({
        open: true,
        message: "❌ Error: Missing student or report information",
        severity: "error",
      });
      return;
    }

    setProcessingEscalation(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL"}/api/messages/${selectedStudentForEscalation.reportId}/escalate`;
      const payload = {
        action: "ban",
        reason:
          escalationReason ||
          "Persistent severe violations - permanent removal",
        adminId: auth.currentUser?.uid,
        studentName: selectedStudentForEscalation.name,
      };

      console.log("🔵 DEBUG: Banning user");
      console.log("URL:", apiUrl);
      console.log("Payload:", payload);
      console.log("ReportID:", selectedStudentForEscalation.reportId);

      await axios.post(apiUrl, payload);

      setCaseUpdateSnackbar({
        open: true,
        message: "✅ User permanently banned",
        severity: "success",
      });

      updateCaseStatus(selectedStudentForEscalation.reportId, "Pending Review");
      setBanModalOpen(false);
    } catch (error) {
      console.error("Error banning user:", error);
      setCaseUpdateSnackbar({
        open: true,
        message: "❌ Failed to ban user",
        severity: "error",
      });
    } finally {
      setProcessingEscalation(false);
    }
  };

  // --- LIFTED PROFILE STATE ---
  const [darkMode, setDarkMode] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    department: "",
    emergencyContact: { name: "", phone: "" },
    appDarkMode: darkMode,
    profileImage: null,
    hasProfileImage: false,
    removeSuccessSnackbar: false,
    userId: "",
  });
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(0);
  const [weeklyChartData, setWeeklyChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [severityData, setSeverityData] = useState<any[]>([]);

  // Fetch weekly flagged messages chart data
  useEffect(() => {
    if (section !== 5) return; // Only fetch when Charts section is active

    setChartLoading(true);
    fetch("import.meta.env.VITE_API_URL/api/analytics/weekly-flagged-messages")
      .then((res) => res.json())
      .then((data) => {
        if (data.weeklyData) {
          setWeeklyChartData(data.weeklyData);
        }
        if (data.severityBreakdown) {
          setSeverityData(data.severityBreakdown);
        }
      })
      .catch((err) => console.error("Error fetching chart data:", err))
      .finally(() => setChartLoading(false));
  }, [section]);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showNotificationsPage, setShowNotificationsPage] = useState(false);
  const [, setShowReportsPage] = useState(false);

  type LocalReport = {
    _id?: string;
    id?: number;
    title?: string;
    description?: string;
    flagged?: boolean;
    message: string;
    status: string;
    student_email?: string;
    senderName?: string;
    receiverName?: string;
    language?: string;
    englishMeaning?: string;
    time?: string;
    severity?: "High" | "Medium" | "Low";
    caseStatus?: string;
    adminNotes?: string;
    [key: string]: any;
  };

  const [flaggedReports, setFlaggedReports] = useState<LocalReport[]>([]);
  const [allFlaggedReports, setAllFlaggedReports] = useState<LocalReport[]>([]);
  const [flaggedMessagesFilter, setFlaggedMessagesFilter] = useState<
    "flagged" | "pending" | "resolved" | "all"
  >("flagged");
  const [updatingCaseId, setUpdatingCaseId] = useState<string | null>(null);
  const [caseUpdateSnackbar, setCaseUpdateSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [selectedStudentForWarning, setSelectedStudentForWarning] = useState<{
    name: string;
    reportId: string;
    message: string;
    severity: string;
    receiver: string;
    receiverId?: string;
  } | null>(null);
  const [warningTemplate, setWarningTemplate] = useState("gentle");
  const [customWarningMessage, setCustomWarningMessage] = useState("");
  const [sendingWarning, setSendingWarning] = useState(false);

  // Escalation Action States
  const [restrictModalOpen, setRestrictModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [studentSelectionModalOpen, setStudentSelectionModalOpen] =
    useState(false);
  const [pendingEscalationAction, setPendingEscalationAction] = useState<
    string | null
  >(null);
  const [selectedStudentForEscalation, setSelectedStudentForEscalation] =
    useState<any>(null);
  const [restrictDuration, setRestrictDuration] = useState(7); // days
  const [suspendDuration, setSuspendDuration] = useState(14); // days
  const [escalationReason, setEscalationReason] = useState("");
  const [processingEscalation, setProcessingEscalation] = useState(false);

  const [stats, setStats] = useState([
    {
      label: "Total Flagged",
      value: 5,
      color: "#ff4d4f",
      icon: <FlagOutlinedIcon sx={{ color: "#ff4d4f" }} fontSize="medium" />,
    },
    {
      label: "Resolved Cases",
      value: 2,
      color: "#38d996",
      icon: (
        <InsertChartOutlinedIcon sx={{ color: "#38d996" }} fontSize="medium" />
      ),
    },
    {
      label: "Pending Alerts",
      value: 3,
      color: "#ffc84b",
      icon: (
        <NotificationsNoneRoundedIcon
          sx={{ color: "#ffc84b" }}
          fontSize="medium"
        />
      ),
    },
    {
      label: "Active Users",
      value: 0,
      color: "#6c63ff",
      icon: <GroupsOutlinedIcon sx={{ color: "#6c63ff" }} fontSize="medium" />,
    },
  ]);
  // Real-time snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [incomingFlagged, setIncomingFlagged] = useState<any | null>(null);

  useEffect(() => {
    // Update stats based on allFlaggedReports
    const totalFlagged = allFlaggedReports.filter(
      (r: any) => r.status === "Flagged",
    ).length;
    const resolved = allFlaggedReports.filter(
      (r: any) => r.status === "Resolved" || r.status === "Low Priority",
    ).length;
    const pending = allFlaggedReports.filter(
      (r: any) => r.status === "Pending Review",
    ).length;

    setStats((prevStats) => [
      { ...prevStats[0], value: totalFlagged },
      {
        ...prevStats[1],
        value: resolved,
      },
      {
        ...prevStats[2],
        value: pending,
      },
      prevStats[3],
    ]);
  }, [allFlaggedReports]);

  // ✅ Socket.io real-time updates (no polling)
  useEffect(() => {
    const socket = io("import.meta.env.VITE_API_URL");

    socket.on("flagged_message", (data) => {
      setIncomingFlagged(data);
      setSnackbarOpen(true);

      // Add new flagged message to the top of the list
      const newReport: LocalReport = {
        _id: data._id,
        id: Date.now(),
        message: data.text || data.comment || "",
        status: "Flagged",
        student_email: data.senderName || data.student_email || "Unknown",
        senderName: data.senderName || data.senderId || "Unknown",
        receiverName: data.receiverName || data.receiverId || "Unknown",
        severity: (data.severity || "Low") as "High" | "Medium" | "Low",
        time: new Date().toLocaleString(),
        caseStatus: "Flagged",
        ...data,
      };

      setAllFlaggedReports((prev) => [newReport, ...prev]);
      setFlaggedReports((prev) => [newReport, ...prev.slice(0, 4)]);
    });

    socket.on("case_status_updated", (data) => {
      // Update case status in real-time in BOTH Recent Alerts and Flagged Messages
      setAllFlaggedReports((prev) =>
        prev.map((report) =>
          report._id === data._id
            ? { ...report, status: data.status, caseStatus: data.status }
            : report,
        ),
      );

      setFlaggedReports((prev) =>
        prev.map((report) =>
          report._id === data._id
            ? { ...report, status: data.status, caseStatus: data.status }
            : report,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  type Platform = {
    name: string;
    icon: React.ReactNode;
    status: string;
    color: string;
    monitorTypes?: string[];
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [platformName, setPlatformName] = useState("");
  const [monitorTypes, setMonitorTypes] = useState<string[]>([]);
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState("");

  const [platforms] = useState<Platform[]>([
    {
      name: "ShieldChat",
      icon: <ChatBubbleOutlineOutlinedIcon sx={{ color: "#2152ff" }} />,
      status: "Active",
      color: "#aaf8e9",
    },
  ]);

  const platformOptions = [
    {
      label: "ShieldChat",
      icon: <ChatBubbleOutlineOutlinedIcon sx={{ color: "#2152ff" }} />,
    },
    { label: "Discord", icon: <ForumOutlinedIcon sx={{ color: "#7fd7fb" }} /> },
    { label: "Microsoft Teams", icon: <TeamsIcon sx={{ color: "#6c63ff" }} /> },
    { label: "Other", icon: <QuestionMarkIcon sx={{ color: "#38bdf8" }} /> },
  ];

  const monitorTypesOptions = [
    { value: "messages", label: "Chat Messages" },
    { value: "images", label: "Images" },
    { value: "comments", label: "Comments" },
  ];

  const handleAddPlatform = () => {
    setError("");
    // Platform adding is disabled since platforms is static
    setPlatformName("");
    setMonitorTypes([]);
    setCustomName("");
    setModalOpen(false);
  };

  const sidebarTextColor = darkMode ? "#b9d3fa" : "#222b45";
  const sidebarTextActive = darkMode ? "#41caff" : "#2152ff";
  const sidebarBg = darkMode ? "#181e33" : "#fff";
  const sidebarBorder = darkMode ? "#22304a" : "#e6e8f0";
  const statCardBg = darkMode ? "#1a2647" : "#fff";
  const statCardShadow = darkMode
    ? "0 2px 10px #10254733"
    : "0 2px 10px #2152ff0a";
  const mainGradient = "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)";
  const mainBg = darkMode ? "#151f3b" : "#f6faff";
  const mainBgPattern = darkMode
    ? "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTggMjggTCAzMiA0MiBMIDE4IDU2IEwgNSAzNSBMIDE4IDI4IFogTTU2IDcwIEwgNzAgODQgTCA1NiA5OCBMIDQyIDc3IEwgNTYgNzAgWiIgZmlsbD0iI2ZjZmNmYjEwIiBvcGFjaXR5PSIwLjAyIiAvPgo8L3N2Zz4=')"
    : "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTggMjggTCAzMiA0MiBMIDE4IDU2IEwgNSAzNSBMIDE4IDI4IFogTTU2IDcwIEwgNzAgODQgTCA1NiA5OCBMIDQyNzdMIDU2IDcwIFoiIGZpbGw9IiMyMTUyZmYiIG9wYWNpdHk9IjAuMDIiIC8+Cjwvc3ZnPg==')";
  const headerText = darkMode ? "#41caff" : "#2152ff";
  const sectionTitle = darkMode ? "#eaf6ff" : "#1b2850";

  const handleLogout = () => {
    navigate("/");
  };

  // --- Fetch profile on dashboard mount ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const res = await fetch(
            `import.meta.env.VITE_API_URL/api/admins/profile/${user.uid}`,
          );
          if (res.ok) {
            const data = await res.json();
            setAdminProfile((prev) => ({
              ...prev,
              ...data,
              userId: user.uid,
              hasProfileImage: !!data.profileImage,
              appDarkMode: data.appDarkMode ?? darkMode,
            }));
          }
        } catch (err) {
          // Optionally handle error
        }
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Fetch initial active users count
    axios
      .get("import.meta.env.VITE_API_URL/api/dashboard/active-users")
      .then((res) => {
        setStats((prevStats) => {
          const newStats = [...prevStats];
          newStats[3] = { ...newStats[3], value: res.data.activeUsers };
          return newStats;
        });
      });

    // Listen for real-time updates
    const socket = io("import.meta.env.VITE_API_URL");
    socket.on("activeUsersUpdate", (data) => {
      setStats((prevStats) => {
        const newStats = [...prevStats];
        newStats[3] = { ...newStats[3], value: data.activeUsers };
        return newStats;
      });
    });

    return () => {
      socket.off("activeUsersUpdate");
      socket.disconnect();
    };
  }, []);

  // --- Anonymous/Contact Reports State ---
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (section === 2) {
      setLoadingReports(true);
      fetch("/api/reports/anonymous")
        .then((res) => res.json())
        .then((data) => {
          setReports(data);
          setLoadingReports(false);
        })
        .catch(() => setLoadingReports(false));
    }
  }, [section]);

  function renderSection() {
    switch (section) {
      case 0:
        return (
          <>
            <Grid
              container
              spacing={3}
              sx={{ mt: 0, maxWidth: 1600, mx: "auto" }}
            >
              {stats.map((stat) => (
                <Grid item xs={12} md={3} key={stat.label}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: statCardBg,
                      boxShadow: statCardShadow,
                      border: `1.5px solid ${darkMode ? "#22304a" : "#eaf2ff"}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 8px 20px ${stat.color}30`,
                      },
                    }}
                    onClick={() => {
                      if (stat.label === "Total Flagged") {
                        setFlaggedMessagesFilter("flagged");
                        setSection(1);
                      } else if (stat.label === "Resolved Cases") {
                        setFlaggedMessagesFilter("resolved");
                        setSection(1);
                      } else if (stat.label === "Pending Alerts") {
                        setFlaggedMessagesFilter("pending");
                        setSection(1);
                      } else if (stat.label === "Active Users") {
                        setSection(3);
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 36,
                        minHeight: 36,
                        borderRadius: 2,
                        background: `${stat.color}20`,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: stat.color,
                          fontWeight: 800,
                          fontSize: 20,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        sx={{
                          color: darkMode ? "#b9d3fa" : "#222b45",
                          fontWeight: 600,
                          fontSize: 15,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Grid
              container
              spacing={3}
              sx={{ mt: 1, maxWidth: 1600, mx: "auto" }}
            >
              <Grid item xs={12} md={12}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 3,
                    background: statCardBg,
                    boxShadow: statCardShadow,
                    border: `1.5px solid ${darkMode ? "#22304a" : "#eef2fa"}`,
                    mb: 3,
                  }}
                >
                  <AlertsList
                    alerts={flaggedReports.map((report) => ({
                      ...report,
                      status: (report.status === "Flagged"
                        ? "flagged"
                        : report.status === "Pending Review"
                          ? "pending"
                          : report.status === "Low Priority"
                            ? "resolved"
                            : "flagged") as
                        | "flagged"
                        | "pending"
                        | "resolved"
                        | undefined,
                    }))}
                    onViewAll={() => setSection(1)}
                    onMarkPending={(id) =>
                      updateCaseStatus(id as string, "Pending Review")
                    }
                    onResolve={(id) =>
                      updateCaseStatus(id as string, "Low Priority")
                    }
                  />
                </Paper>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        // Flagged Messages section
        return (
          <Paper
            sx={{
              p: 4,
              mt: 2,
              borderRadius: 3,
              background: statCardBg,
              boxShadow: statCardShadow,
            }}
          >
            <Typography
              sx={{ fontWeight: 700, fontSize: 30, mb: 3, color: headerText }}
            >
              Flagged Messages
            </Typography>
            {allFlaggedReports.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Button
                  variant={
                    flaggedMessagesFilter === "flagged"
                      ? "contained"
                      : "outlined"
                  }
                  sx={{
                    background:
                      flaggedMessagesFilter === "flagged"
                        ? "linear-gradient(90deg, #d32f2f 0%, #f57c00 100%)"
                        : "transparent",
                    color:
                      flaggedMessagesFilter === "flagged" ? "#fff" : "#d32f2f",
                    borderColor:
                      flaggedMessagesFilter === "flagged"
                        ? "transparent"
                        : "#d32f2f",
                    fontWeight: 700,
                    fontSize: 13,
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        flaggedMessagesFilter === "flagged"
                          ? "linear-gradient(90deg, #e53935 0%, #fb8c00 100%)"
                          : "rgba(211, 47, 47, 0.1)",
                    },
                  }}
                  onClick={() => setFlaggedMessagesFilter("flagged")}
                >
                  Flagged (
                  {
                    allFlaggedReports.filter((r) => r.status === "Flagged")
                      .length
                  }
                  )
                </Button>
                <Button
                  variant={
                    flaggedMessagesFilter === "pending"
                      ? "contained"
                      : "outlined"
                  }
                  sx={{
                    background:
                      flaggedMessagesFilter === "pending"
                        ? "linear-gradient(90deg, #fbc02d 0%, #f57f17 100%)"
                        : "transparent",
                    color:
                      flaggedMessagesFilter === "pending" ? "#fff" : "#fbc02d",
                    borderColor:
                      flaggedMessagesFilter === "pending"
                        ? "transparent"
                        : "#fbc02d",
                    fontWeight: 700,
                    fontSize: 13,
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        flaggedMessagesFilter === "pending"
                          ? "linear-gradient(90deg, #fdd835 0%, #f57f17 100%)"
                          : "rgba(251, 192, 45, 0.1)",
                    },
                  }}
                  onClick={() => setFlaggedMessagesFilter("pending")}
                >
                  Pending (
                  {
                    allFlaggedReports.filter(
                      (r) => r.status === "Pending Review",
                    ).length
                  }
                  )
                </Button>
                <Button
                  variant={
                    flaggedMessagesFilter === "resolved"
                      ? "contained"
                      : "outlined"
                  }
                  sx={{
                    background:
                      flaggedMessagesFilter === "resolved"
                        ? "linear-gradient(90deg, #2cc76f 0%, #3de77a 100%)"
                        : "transparent",
                    color:
                      flaggedMessagesFilter === "resolved" ? "#fff" : "#2cc76f",
                    borderColor:
                      flaggedMessagesFilter === "resolved"
                        ? "transparent"
                        : "#2cc76f",
                    fontWeight: 700,
                    fontSize: 13,
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        flaggedMessagesFilter === "resolved"
                          ? "linear-gradient(90deg, #3dd984 0%, #4aec8b 100%)"
                          : "rgba(44, 199, 111, 0.1)",
                    },
                  }}
                  onClick={() => setFlaggedMessagesFilter("resolved")}
                >
                  Resolved (
                  {
                    allFlaggedReports.filter((r) => r.status === "Low Priority")
                      .length
                  }
                  )
                </Button>
              </Box>
            )}
            {allFlaggedReports.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                No flagged messages found.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {allFlaggedReports
                  .filter((report) => {
                    if (flaggedMessagesFilter === "flagged")
                      return report.status === "Flagged";
                    if (flaggedMessagesFilter === "pending")
                      return report.status === "Pending Review";
                    if (flaggedMessagesFilter === "resolved")
                      return report.status === "Low Priority";
                    return true;
                  })
                  .map((report, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        background: darkMode ? "#1e2747" : "#f9fafc",
                        px: 2.5,
                        py: 2,
                        borderRadius: 2,
                        borderLeft: `4px solid ${
                          report.severity === "High"
                            ? "#d32f2f"
                            : report.severity === "Medium"
                              ? "#fbc02d"
                              : "#1976d2"
                        }`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          fontWeight={700}
                          sx={{
                            color: darkMode ? "#eaf6ff" : "#1b2850",
                            fontSize: 15,
                            mb: 0.8,
                            wordBreak: "break-word",
                          }}
                        >
                          {report.message}
                        </Typography>
                        {/* Language badge */}
                        {report.language && report.language !== "English" && (
                          <Box
                            sx={{
                              mb: 1,
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              label={report.language}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                color: "#fff",
                                fontSize: 12,
                                backgroundColor: "#6c5ce7",
                              }}
                            />
                            {report.englishMeaning && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: darkMode ? "#b0bec5" : "#666",
                                  fontStyle: "italic",
                                  fontSize: 13,
                                }}
                              >
                                <strong>English:</strong>{" "}
                                {report.englishMeaning}
                              </Typography>
                            )}
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            flexWrap: "wrap",
                            mb: 1,
                          }}
                        >
                          <Chip
                            label={`Status: ${report.status}`}
                            sx={{
                              fontWeight: 600,
                              color: "#fff",
                              fontSize: 11,
                              background:
                                report.status === "Flagged"
                                  ? "#d32f2f"
                                  : report.status === "Pending Review"
                                    ? "#fbc02d"
                                    : "#2cc76f",
                              px: 0.5,
                            }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#888",
                                fontWeight: 500,
                                fontSize: 14,
                              }}
                            >
                              <strong>Sender:</strong>{" "}
                              {formatName(report.senderName)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#888",
                                fontWeight: 500,
                                fontSize: 14,
                              }}
                            >
                              <strong>Receiver:</strong>{" "}
                              {formatName(report.receiverName)}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#888",
                              fontWeight: 500,
                              fontSize: 14,
                            }}
                          >
                            {report.time}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          ml: 2,
                          flexDirection: "column",
                          alignItems: "flex-end",
                          minWidth: "fit-content",
                        }}
                      >
                        <Chip
                          label={`Severity: ${report.severity || "Low"}`}
                          sx={{
                            fontWeight: 600,
                            color: "#fff",
                            fontSize: 12,
                            background: severityColor(report.severity || "Low"),
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                          }}
                        >
                          {report.status === "Flagged" && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  background:
                                    "linear-gradient(90deg, #ff9800 0%, #f57c00 100%)",
                                  color: "#fff",
                                  fontWeight: 700,
                                  fontSize: 11,
                                  borderRadius: 1,
                                  px: 1.2,
                                  py: 0.5,
                                  textTransform: "uppercase",
                                  transition:
                                    "background 0.22s cubic-bezier(.4,0,.2,1)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(90deg, #ffb74d 0%, #fb8c00 100%)",
                                  },
                                }}
                                onClick={() => openWarningModal(report)}
                              >
                                📧 Warn
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  background:
                                    "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)",
                                  color: "#fff",
                                  fontWeight: 700,
                                  fontSize: 11,
                                  borderRadius: 1,
                                  px: 1.2,
                                  py: 0.5,
                                  textTransform: "uppercase",
                                  transition:
                                    "background 0.22s cubic-bezier(.4,0,.2,1)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(90deg, #2580ff 0%, #7fd7fb 100%)",
                                  },
                                }}
                                onClick={() => {
                                  updateCaseStatus(
                                    report._id || String(idx),
                                    "Pending Review",
                                  );
                                }}
                                disabled={
                                  updatingCaseId === (report._id || String(idx))
                                }
                              >
                                {updatingCaseId === (report._id || String(idx))
                                  ? "..."
                                  : "Mark Pending"}
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  background:
                                    "linear-gradient(90deg, #2cc76f 0%, #3de77a 100%)",
                                  color: "#fff",
                                  fontWeight: 700,
                                  fontSize: 11,
                                  borderRadius: 1,
                                  px: 1.2,
                                  py: 0.5,
                                  textTransform: "uppercase",
                                  transition:
                                    "background 0.22s cubic-bezier(.4,0,.2,1)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(90deg, #3ed886 0%, #4aec8b 100%)",
                                  },
                                }}
                                onClick={() => {
                                  updateCaseStatus(
                                    report._id || String(idx),
                                    "Low Priority",
                                  );
                                }}
                                disabled={
                                  updatingCaseId === (report._id || String(idx))
                                }
                              >
                                {updatingCaseId === (report._id || String(idx))
                                  ? "..."
                                  : "Resolve"}
                              </Button>
                            </>
                          )}
                          {report.status === "Pending Review" && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  background:
                                    "linear-gradient(90deg, #2cc76f 0%, #3de77a 100%)",
                                  color: "#fff",
                                  fontWeight: 700,
                                  fontSize: 11,
                                  borderRadius: 1,
                                  px: 1.2,
                                  py: 0.5,
                                  textTransform: "uppercase",
                                  transition:
                                    "background 0.22s cubic-bezier(.4,0,.2,1)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(90deg, #3ed886 0%, #4aec8b 100%)",
                                  },
                                }}
                                onClick={() => {
                                  updateCaseStatus(
                                    report._id || String(idx),
                                    "Low Priority",
                                  );
                                }}
                                disabled={
                                  updatingCaseId === (report._id || String(idx))
                                }
                              >
                                {updatingCaseId === (report._id || String(idx))
                                  ? "..."
                                  : "Resolve"}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: "#d32f2f",
                                  color: "#d32f2f",
                                  fontWeight: 700,
                                  fontSize: 11,
                                  borderRadius: 1,
                                  px: 1.2,
                                  py: 0.5,
                                  textTransform: "uppercase",
                                  transition:
                                    "all 0.22s cubic-bezier(.4,0,.2,1)",
                                  "&:hover": {
                                    background: "rgba(211, 47, 47, 0.1)",
                                    borderColor: "#c62828",
                                  },
                                }}
                                onClick={() => {
                                  updateCaseStatus(
                                    report._id || String(idx),
                                    "Flagged",
                                  );
                                }}
                                disabled={
                                  updatingCaseId === (report._id || String(idx))
                                }
                              >
                                {updatingCaseId === (report._id || String(idx))
                                  ? "..."
                                  : "Reopen"}
                              </Button>
                            </>
                          )}
                          {report.status === "Low Priority" && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: "#d32f2f",
                                color: "#d32f2f",
                                fontWeight: 700,
                                fontSize: 11,
                                borderRadius: 1,
                                px: 1.2,
                                py: 0.5,
                                textTransform: "uppercase",
                                transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
                                "&:hover": {
                                  background: "rgba(211, 47, 47, 0.1)",
                                  borderColor: "#c62828",
                                },
                              }}
                              onClick={() => {
                                updateCaseStatus(
                                  report._id || String(idx),
                                  "Flagged",
                                );
                              }}
                              disabled={
                                updatingCaseId === (report._id || String(idx))
                              }
                            >
                              {updatingCaseId === (report._id || String(idx))
                                ? "..."
                                : "Reopen"}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </Stack>
            )}
          </Paper>
        );

      case 2:
        // Reports section: display anonymous/contact reports
        return (
          <Paper
            sx={{
              p: 4,
              mt: 2,
              borderRadius: 3,
              background: statCardBg,
              boxShadow: statCardShadow,
            }}
          >
            <Typography
              sx={{ fontWeight: 700, fontSize: 30, mb: 2, color: headerText }}
            >
              {sideBarItems[section].text}
            </Typography>
            {loadingReports ? (
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Loading reports...
              </Typography>
            ) : reports.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                No reports found.
              </Typography>
            ) : (
              <Box>
                {reports.map((report, idx) => (
                  <Paper
                    key={idx}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      background:
                        report.contactOption === "contact"
                          ? "#e1f2ffff"
                          : "#f7dfdfff",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 17,
                            color: "#2152ff",
                          }}
                        >
                          {report.contactOption === "contact"
                            ? "Contact Request"
                            : "Anonymous Report"}
                        </Typography>
                        <Typography sx={{ fontSize: 16, mt: 0.5, mb: 1.2 }}>
                          {report.reportText}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14, color: "#888", mb: 0.5 }}
                        >
                          Submitted:{" "}
                          {new Date(report.createdAt).toLocaleString()}
                        </Typography>
                        {report.contactOption === "contact" &&
                          report.student && (
                            <Box sx={{ mt: 1, pl: 1 }}>
                              <Typography
                                sx={{
                                  fontSize: 15,
                                  color: "#2152ff",
                                  fontWeight: 600,
                                }}
                              >
                                Student: {report.student.fullName} (
                                {report.student.className})
                              </Typography>
                              <Typography sx={{ fontSize: 14, color: "#888" }}>
                                Student ID: {report.student._id}
                              </Typography>
                            </Box>
                          )}
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#2152ff",
                            color: "#2152ff",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            padding: "6px 12px",
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "#f5faff",
                              borderColor: "#2152ff",
                            },
                          }}
                        >
                          Mark Pending
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#2cc76f",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            padding: "6px 12px",
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "#27b562",
                            },
                          }}
                        >
                          Resolve
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        );
      case 3:
        return <UserManagementPage />;
      case 4:
        return (
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: paperRadius,
                  background: statCardBg,
                  boxShadow: statCardShadow,
                  mt: 2,
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: sectionTitle,
                    fontSize: 21,
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  Resources
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Anti-Bullying Workshop Materials
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Resources for teachers and counselors
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Parent Communication Templates
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        For notifying parents about incidents
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PolicyOutlinedIcon />}
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Intervention Strategies Guide
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Best practices for addressing cyberbullying
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Digital Citizenship Curriculum
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Teaching responsible online behavior to students
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Mental Health Support Resources
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Counseling guides and emotional support materials
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Incident Documentation Templates
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Forms for reporting and tracking cyberbullying cases
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Peer Support & Bystander Training
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Empowering students to stand up against bullying
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Legal & Policy Framework
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Understanding cyberbullying laws and school policies
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Social Media Safety Guide
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Tips for using social platforms safely and responsibly
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Victim Support Programs
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Recovery and rehabilitation resources for affected
                        students
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Staff Training Modules
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Professional development for educators and
                        administrators
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "#b5cafb",
                      color: "#2152ff",
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: "30px",
                      py: 1.3,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
                      "&:hover": { background: "#f5faff" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                        Emergency Response Protocol
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Step-by-step guide for handling critical incidents
                      </Typography>
                    </Box>
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        );
      case 5:
        // Charts & Analytics section
        return (
          <Paper
            sx={{
              p: 4,
              mt: 2,
              borderRadius: 3,
              background: statCardBg,
              boxShadow: statCardShadow,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <IconButton
                onClick={() => setSection(0)}
                sx={{
                  color: "#2152ff",
                  background: "rgba(33, 82, 255, 0.08)",
                  border: "2px solid #2152ff",
                  padding: "8px",
                  "& .MuiSvgIcon-root": { fontSize: 24 },
                  "&:hover": {
                    background: "rgba(33, 82, 255, 0.15)",
                    borderColor: "#1637d0",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                sx={{ fontWeight: 700, fontSize: 28, color: headerText }}
              >
                📊 Charts & Analytics
              </Typography>
            </Box>

            {chartLoading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="textSecondary">
                  Loading analytics data...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* Weekly Flagged Messages Chart */}
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: darkMode ? "#1a223f" : "#f6faff",
                      border: `1.5px solid ${darkMode ? "#22304a" : "#eaf2ff"}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#2152ff",
                        mb: 2,
                      }}
                    >
                      📈 Alert Activity Overview (This Week)
                    </Typography>
                    {weeklyChartData && weeklyChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={weeklyChartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={darkMode ? "#22304a" : "#e8eef5"}
                          />
                          <XAxis
                            dataKey="day"
                            stroke={darkMode ? "#888" : "#666"}
                          />
                          <YAxis stroke={darkMode ? "#888" : "#666"} />
                          <Tooltip
                            contentStyle={{
                              background: darkMode ? "#1a223f" : "#fff",
                              border: `1px solid ${
                                darkMode ? "#22304a" : "#eaf2ff"
                              }`,
                              borderRadius: 8,
                              color: darkMode ? "#d8e7ff" : "#222",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#2152ff"
                            strokeWidth={2}
                            dot={{ fill: "#2152ff", r: 5 }}
                            activeDot={{ r: 7 }}
                            name="Flagged Messages"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography
                        sx={{
                          color: darkMode ? "#888" : "#999",
                          textAlign: "center",
                          py: 4,
                        }}
                      >
                        No data available for this week
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Severity Breakdown Chart */}
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: darkMode ? "#1a223f" : "#f6faff",
                      border: `1.5px solid ${darkMode ? "#22304a" : "#eaf2ff"}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#ff9800",
                        mb: 2,
                      }}
                    >
                      🎯 Alert Severity Breakdown
                    </Typography>
                    {severityData && severityData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={severityData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={darkMode ? "#22304a" : "#e8eef5"}
                          />
                          <XAxis
                            dataKey="severity"
                            stroke={darkMode ? "#888" : "#666"}
                          />
                          <YAxis stroke={darkMode ? "#888" : "#666"} />
                          <Tooltip
                            contentStyle={{
                              background: darkMode ? "#1a223f" : "#fff",
                              border: `1px solid ${
                                darkMode ? "#22304a" : "#eaf2ff"
                              }`,
                              borderRadius: 8,
                              color: darkMode ? "#d8e7ff" : "#222",
                            }}
                          />
                          <Bar
                            dataKey="count"
                            fill="#ff9800"
                            radius={[8, 8, 0, 0]}
                            name="Count"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography
                        sx={{
                          color: darkMode ? "#888" : "#999",
                          textAlign: "center",
                          py: 4,
                        }}
                      >
                        No severity data available
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Key Metrics */}
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: darkMode ? "#1a223f" : "#f6faff",
                      border: `1.5px solid ${darkMode ? "#22304a" : "#eaf2ff"}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#2152ff",
                        mb: 2,
                      }}
                    >
                      📌 Weekly Summary
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          background: darkMode ? "#2d3759" : "#f0f6ff",
                          borderRadius: 1.5,
                          borderLeft: "4px solid #2152ff",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: darkMode ? "#a0b0d0" : "#666",
                            fontWeight: 500,
                          }}
                        >
                          Total Alerts
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#2152ff",
                          }}
                        >
                          {weeklyChartData.reduce(
                            (sum, d) => sum + (d.count || 0),
                            0,
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          background: darkMode ? "#2d3759" : "#fff3e0",
                          borderRadius: 1.5,
                          borderLeft: "4px solid #ff9800",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: darkMode ? "#a0b0d0" : "#666",
                            fontWeight: 500,
                          }}
                        >
                          High Severity Alerts
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#ff9800",
                          }}
                        >
                          {severityData.find((d) => d.severity === "High")
                            ?.count || 0}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          background: darkMode ? "#2d3759" : "#f3e5f5",
                          borderRadius: 1.5,
                          borderLeft: "4px solid #f44336",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: darkMode ? "#a0b0d0" : "#666",
                            fontWeight: 500,
                          }}
                        >
                          Average Alerts/Day
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#f44336",
                          }}
                        >
                          {(
                            weeklyChartData.reduce(
                              (sum, d) => sum + (d.count || 0),
                              0,
                            ) / (weeklyChartData.length || 1)
                          ).toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Paper>
        );
      default:
        return (
          <Paper
            sx={{
              p: 4,
              mt: 2,
              borderRadius: 3,
              background: statCardBg,
              boxShadow: statCardShadow,
            }}
          >
            <Typography
              sx={{ fontWeight: 700, fontSize: 21, mb: 2, color: headerText }}
            >
              {sideBarItems[section].text}
            </Typography>
            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
              (Content goes here...)
            </Typography>
          </Paper>
        );
    }
  }

  if (showProfilePage) {
    return (
      <AdminProfileManagement
        adminProfile={adminProfile}
        setAdminProfile={setAdminProfile}
        onBack={() => setShowProfilePage(false)}
        darkMode={darkMode}
      />
    );
  }

  if (showNotificationsPage) {
    return (
      <NotificationsPage
        onBack={() => setShowNotificationsPage(false)}
        darkMode={darkMode}
        notifications={flaggedReports as Report[]}
      />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        fontFamily,
        background: mainBg,
        transition: "background 0.3s",
      }}
    >
      <Chatbot />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            background: sidebarBg,
            borderRight: `1.5px solid ${sidebarBorder}`,
            display: "flex",
            flexDirection: "column",
            py: 0,
            boxShadow: "none",
            borderRadius: 0,
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 3.2,
            display: "flex",
            alignItems: "center",
            gap: 1.4,
            borderBottom: `1.5px solid ${sidebarBorder}`,
          }}
        >
          <img
            src="./cybershield.png"
            alt="CyberShield Logo"
            style={{
              width: 32,
              height: 32,
              objectFit: "contain",
              display: "block",
            }}
          />
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: "transparent",
              fontSize: 20,
              fontFamily,
              letterSpacing: 0,
              background: `linear-gradient(90deg, #2152ff 10%, #41caff 80%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 10px #41caff33, 0 1px 2px #2152ff55",
              lineHeight: "1.1",
            }}
          >
            CyberShield
          </Typography>
        </Box>
        <List sx={{ flexGrow: 1, px: 2, pt: 2, pb: 0 }}>
          {sideBarItems.map((item, idx) => (
            <ListItem
              component={Link}
              to={item.link} // ✅ lowercase
              key={item.text}
              button
              disableGutters
              selected={section === idx}
              onClick={() => {
                setSection(idx);
                setShowReportsPage(false);
              }}
              sx={{
                borderRadius: 1.5,
                px: 2.1,
                py: 1.1,
                mb: 0.8,
                color: section === idx ? sidebarTextActive : sidebarTextColor,
                fontWeight: section === idx ? 700 : 500,
              }}
            >
              {/* ✅ Icon + Text + Badge for Flagged Messages */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                {item.icon}
                <Typography sx={{ flex: 1 }}>{item.text}</Typography>
                {/* Show badge only for Flagged Messages */}
                {item.text === "Flagged Messages" && flaggedCount > 0 && (
                  <Chip
                    label={flaggedCount}
                    size="small"
                    sx={{
                      backgroundColor: "#d32f2f",
                      color: "white",
                      fontWeight: 700,
                      height: 20,
                      minWidth: 20,
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Box>
            </ListItem>
          ))}
        </List>

        <Box sx={{ width: "100%", mt: "auto", mb: 2, px: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<LogoutRoundedIcon />}
            sx={{
              background: "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 1,
              borderRadius: 1.5,
              py: 1.2,
              "&:hover": {
                background: "linear-gradient(90deg, #2580ff 0%, #7fd7fb 100%)",
              },
              "&:active": {
                background: "linear-gradient(90deg, #1538a3 0%, #1ba8d7 100%)",
              },
              boxShadow: "0 2px 8px #2152ff22",
              textTransform: "uppercase",
              transition: "background 0.22s cubic-bezier(.4,0,.2,1)",
            }}
            onClick={() => navigate("/")}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          position: "relative",
          background: `${mainBg} ${mainBgPattern}`,
          width: 0,
          zIndex: 0,
          overflowX: "hidden",
        }}
      >
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
        <AdminNavbar
          search={search}
          setSearch={setSearch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          flaggedReports={flaggedReports}
          setShowNotificationsPage={setShowNotificationsPage}
          setShowProfilePage={setShowProfilePage}
          handleLogout={handleLogout}
          profileImage={adminProfile.profileImage ?? undefined}
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
          {section !== 0 && (
            <Button
              onClick={() => setSection(0)}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#2152ff",
                fontWeight: 700,
                fontSize: 14,
                mb: 3,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                "&:hover": {
                  background: "rgba(33, 82, 255, 0.08)",
                },
              }}
            ></Button>
          )}
          {renderSection()}
        </Box>
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
      {/* Snackbar for case status updates */}
      <Snackbar
        open={caseUpdateSnackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setCaseUpdateSnackbar({ ...caseUpdateSnackbar, open: false })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={caseUpdateSnackbar.severity}
          sx={{
            width: "100%",
            fontWeight: 700,
            borderRadius: 2,
            fontSize: 14,
          }}
        >
          {caseUpdateSnackbar.message}
        </Alert>
      </Snackbar>

      {/* Warning Message Modal */}
      <Dialog
        open={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode ? "#1a1f3a" : "#f5f7fa",
            backgroundImage: darkMode
              ? "radial-gradient(circle at 20% 50%, rgba(24, 144, 255, 0.1) 0%, transparent 50%)"
              : "linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 212, 253, 0.05) 100%)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            border: `1px solid ${darkMode ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)"}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 18,
            fontWeight: 800,
            background: "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)",
            color: "#fff",
            borderRadius: 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            mb: 2,
            textTransform: "uppercase",
          }}
        >
          📧 Send Warning Message
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedStudentForWarning && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Student Info Box */}
              <Box
                sx={{
                  background: darkMode
                    ? "rgba(33, 150, 243, 0.1)"
                    : "rgba(33, 150, 243, 0.08)",
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                  borderRadius: 1.5,
                  p: 1.5,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>
                  👤 Student: {selectedStudentForWarning.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: darkMode ? "#aaa" : "#666",
                    mb: 0.8,
                  }}
                >
                  📌 Report ID: {selectedStudentForWarning.reportId}
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                  ⚠️ Incident: {selectedStudentForWarning.message}
                </Typography>
              </Box>

              {/* Template Selection */}
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    mb: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Select Warning Template:
                </Typography>
                <RadioGroup
                  value={warningTemplate}
                  onChange={(e) => setWarningTemplate(e.target.value)}
                  sx={{ ml: 0.5 }}
                >
                  <FormControlLabel
                    value="gentle"
                    control={<Radio size="small" />}
                    label={
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        🤝 Gentle Reminder (First Offense)
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="formal"
                    control={<Radio size="small" />}
                    label={
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        ⚖️ Formal Warning (Serious Violation)
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="severity"
                    control={<Radio size="small" />}
                    label={
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        🚨 Severity Notice (Major Incident)
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="custom"
                    control={<Radio size="small" />}
                    label={
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        ✍️ Custom Message
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Box>

              {/* Template Preview */}
              <Box
                sx={{
                  background: darkMode
                    ? "rgba(100, 200, 100, 0.08)"
                    : "rgba(44, 199, 111, 0.08)",
                  border: "1px solid rgba(44, 199, 111, 0.3)",
                  borderRadius: 1.5,
                  p: 1.5,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 1 }}>
                  📋 Message Preview:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    lineHeight: 1.6,
                    fontStyle: "italic",
                    color: darkMode ? "#bbb" : "#555",
                  }}
                >
                  {warningTemplate === "gentle" &&
                    `Dear ${selectedStudentForWarning.name}, we've received a report regarding your recent behavior. We kindly remind you to review our community guidelines. This is a gentle first reminder that respectful communication is essential to keeping our platform safe for everyone.`}
                  {warningTemplate === "formal" &&
                    `Dear ${selectedStudentForWarning.name}, your account has been flagged for violating our community standards. This formal warning indicates serious violations. Please review our guidelines immediately. Further violations may result in account restrictions.`}
                  {warningTemplate === "severity" &&
                    `URGENT: ${selectedStudentForWarning.name}, your account has been marked for serious misconduct. This is a severity notice. Continued behavior may result in immediate account suspension. Contact moderators for clarification.`}
                  {warningTemplate === "custom" &&
                    (customWarningMessage ||
                      "[Enter your custom message above]")}
                </Typography>
              </Box>

              {/* Custom Message Input */}
              {warningTemplate === "custom" && (
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Type your custom warning message here..."
                  value={customWarningMessage}
                  onChange={(e) => setCustomWarningMessage(e.target.value)}
                  sx={{
                    "& .MuiInputBase-root": {
                      background: darkMode ? "rgba(255,255,255,0.05)" : "#fff",
                      borderRadius: 1,
                    },
                  }}
                />
              )}

              {/* Severity Display */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  p: 1.2,
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  borderRadius: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                  ⚠️ Incident Severity:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      selectedStudentForWarning.severity === "High"
                        ? "#ff4444"
                        : selectedStudentForWarning.severity === "Medium"
                          ? "#ff8800"
                          : "#ffaa00",
                  }}
                >
                  {selectedStudentForWarning.severity}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
            borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          }}
        >
          <Button
            onClick={() => setWarningModalOpen(false)}
            sx={{
              color: darkMode ? "#aaa" : "#666",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={sendWarningMessage}
            disabled={
              sendingWarning ||
              (warningTemplate === "custom" && !customWarningMessage.trim())
            }
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #2cc76f 0%, #3de77a 100%)",
              color: "#fff",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: 12,
              borderRadius: 1,
              "&:hover": {
                background: "linear-gradient(90deg, #3ed886 0%, #4aec8b 100%)",
              },
            }}
          >
            {sendingWarning ? "Sending..." : "Send Warning"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Selection Modal for Escalation Actions */}
      <Dialog
        open={studentSelectionModalOpen}
        onClose={() => setStudentSelectionModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode ? "#1a1f3a" : "#f5f7fa",
            borderRadius: 2,
            border: `1px solid ${darkMode ? "rgba(156, 39, 176, 0.2)" : "rgba(156, 39, 176, 0.1)"}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 18,
            fontWeight: 800,
            background: "linear-gradient(90deg, #9c27b0 0%, #ba68c8 100%)",
            color: "#fff",
          }}
        >
          📋 Select Student for{" "}
          {pendingEscalationAction === "warning"
            ? "Warning"
            : pendingEscalationAction === "restrict"
              ? "Restriction"
              : pendingEscalationAction === "suspend"
                ? "Suspension"
                : "Ban"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography
            sx={{ fontSize: 13, color: darkMode ? "#aaa" : "#666", mb: 2 }}
          >
            Choose which student to apply this action to:
          </Typography>
          <Stack spacing={1.5} sx={{ maxHeight: 400, overflowY: "auto" }}>
            {allFlaggedReports.filter((r) => r.status === "Flagged").length >
            0 ? (
              allFlaggedReports
                .filter((r) => r.status === "Flagged")
                .map((report) => (
                  <Paper
                    key={report._id}
                    onClick={() => handleStudentSelected(report)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      border: "1.5px solid rgba(156, 39, 176, 0.3)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: darkMode
                          ? "rgba(156, 39, 176, 0.15)"
                          : "rgba(156, 39, 176, 0.08)",
                        borderColor: "rgba(156, 39, 176, 0.6)",
                        transform: "translateX(4px)",
                      },
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                          👤 {report.senderName || "Unknown"}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: darkMode ? "#999" : "#666",
                          }}
                        >
                          ⚠️ {report.severity || "Low"} Severity
                        </Typography>
                      </Box>
                      <Chip
                        label={report.status}
                        size="small"
                        sx={{
                          background:
                            report.status === "Flagged"
                              ? "linear-gradient(90deg, #ff9800, #f57c00)"
                              : "#666",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontStyle: "italic",
                        color: darkMode ? "#aaa" : "#555",
                      }}
                    >
                      "{report.message?.substring(0, 60)}..."
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: darkMode ? "#888" : "#999",
                        mt: 1,
                      }}
                    >
                      {report.time}
                    </Typography>
                  </Paper>
                ))
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  color: darkMode ? "#aaa" : "#999",
                  py: 3,
                }}
              >
                No flagged reports available
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setStudentSelectionModalOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restrict User Modal */}
      <Dialog
        open={restrictModalOpen}
        onClose={() => setRestrictModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode ? "#1a1f3a" : "#f5f7fa",
            borderRadius: 2,
            border: `1px solid ${darkMode ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)"}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 18,
            fontWeight: 800,
            background: "linear-gradient(90deg, #2196F3 0%, #21d4fd 100%)",
            color: "#fff",
          }}
        >
          🔒 Restrict User Access
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedStudentForEscalation && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>
                👤 {selectedStudentForEscalation.name}
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>
                  Restriction Duration (days):
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  value={restrictDuration}
                  onChange={(e) =>
                    setRestrictDuration(parseInt(e.target.value))
                  }
                  inputProps={{ min: 1, max: 90 }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>
                  Reason:
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Explain why this user is being restricted..."
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                />
              </Box>
              <Typography
                sx={{ fontSize: 12, color: darkMode ? "#aaa" : "#666" }}
              >
                This user will be unable to send messages or post content for{" "}
                {restrictDuration} days.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setRestrictModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRestrictUser}
            disabled={processingEscalation}
            variant="contained"
            sx={{ background: "#2196F3" }}
          >
            {processingEscalation ? "Processing..." : "Restrict"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Suspend Account Modal */}
      <Dialog
        open={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode ? "#1a1f3a" : "#f5f7fa",
            borderRadius: 2,
            border: `1px solid ${darkMode ? "rgba(244, 67, 54, 0.2)" : "rgba(244, 67, 54, 0.1)"}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 18,
            fontWeight: 800,
            background: "linear-gradient(90deg, #f44336 0%, #ff6b6b 100%)",
            color: "#fff",
          }}
        >
          ⏸️ Suspend Account
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedStudentForEscalation && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>
                👤 {selectedStudentForEscalation.name}
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>
                  Suspension Duration (days):
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  value={suspendDuration}
                  onChange={(e) => setSuspendDuration(parseInt(e.target.value))}
                  inputProps={{ min: 1, max: 180 }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>
                  Reason:
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Explain why this account is being suspended..."
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                />
              </Box>
              <Typography
                sx={{ fontSize: 12, color: darkMode ? "#aaa" : "#666" }}
              >
                This account will be completely frozen for {suspendDuration}{" "}
                days. User cannot access any features.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setSuspendModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSuspendAccount}
            disabled={processingEscalation}
            variant="contained"
            sx={{ background: "#f44336" }}
          >
            {processingEscalation ? "Processing..." : "Suspend"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permanent Ban Modal */}
      <Dialog
        open={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode ? "#1a1f3a" : "#f5f7fa",
            borderRadius: 2,
            border: `1px solid ${darkMode ? "rgba(211, 47, 47, 0.2)" : "rgba(211, 47, 47, 0.1)"}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 18,
            fontWeight: 800,
            background: "linear-gradient(90deg, #d32f2f 0%, #ff1744 100%)",
            color: "#fff",
          }}
        >
          🚫 Permanent Ban
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedStudentForEscalation && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Alert severity="error" sx={{ mb: 1 }}>
                ⚠️ This action is irreversible. The user will be permanently
                removed from the platform.
              </Alert>
              <Typography sx={{ fontWeight: 600 }}>
                👤 {selectedStudentForEscalation.name}
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>
                  Reason for Ban:
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Explain the severe violations leading to this permanent ban..."
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                />
              </Box>
              <Typography
                sx={{ fontSize: 12, color: darkMode ? "#aaa" : "#666" }}
              >
                This is a permanent action. The account will be completely
                removed and cannot be recovered.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setBanModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePermanentBan}
            disabled={processingEscalation}
            variant="contained"
            sx={{ background: "#d32f2f" }}
          >
            {processingEscalation ? "Processing..." : "Confirm Ban"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
