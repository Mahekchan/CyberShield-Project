import React from "react";
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Avatar,
  Badge,
  Stack,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Box, 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import type { Report } from "../../types/api";

interface AdminNavbarProps {
  search: string;
  setSearch: (value: string) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  flaggedReports: Report[];
  setShowNotificationsPage: (value: boolean) => void;
  setShowProfilePage: (value: boolean) => void;
  handleLogout: () => void;
  profileImage?: string; 
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  search,
  setSearch,
  darkMode,
  setDarkMode,
  flaggedReports,
  setShowNotificationsPage,
  setShowProfilePage,
  handleLogout,
  profileImage,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const inputBorder = darkMode ? "#22304a" : "#e3e8f7";
  const fontFamily = "'Inter', 'Poppins', Arial, sans-serif";

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "transparent",
        boxShadow: "none",
        borderBottom: "none",
        ml: 0,
        px: 0,
        width: "100%",
        left: 0,
        zIndex: 1,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 68,
          px: 4,
          display: "flex",
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#fff",
            letterSpacing: 0.5,
            fontFamily,
            textShadow: "0 2px 10px #41caff33, 0 1px 2px #2152ff55",
            flexGrow: 1,
          }}
        >
          Admin Dashboard
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 2,
              px: 2,
              width: 340,
              maxWidth: "100%",
              boxShadow: "0 1px 8px 0 #2152ff0a",
              border: `1.5px solid ${inputBorder}`,
            }}
          >
            <InputBase
              placeholder="Search students / messages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                ml: 1,
                flex: 1,
                color: "#2152ff",
                fontSize: 15,
                fontWeight: 500,
                fontFamily,
              }}
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton
              type="submit"
              sx={{ p: "6px", color: "#2152ff", fontSize: 15 }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Box>
          <Tooltip title="Notifications">
            <IconButton
              onClick={() => {
                setShowNotificationsPage(true);
              }}
            >
              <Badge
                badgeContent={flaggedReports.filter((r) => r.status === "Flagged").length}
                color="error"
              >
                <NotificationsNoneRoundedIcon sx={{ color: "#fff", fontSize: 24 }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? (
                <WbSunnyRoundedIcon sx={{ color: "#fff" }} />
              ) : (
                <DarkModeRoundedIcon sx={{ color: "#fff" }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar
              src={profileImage || undefined}
                sx={{
                  bgcolor: "#fff",
                  color: "#2152ff",
                  width: 34,
                  height: 34,
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow: "0 1.5px 8px #2152ff35",
                }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              style: {
                background: "#fff",
                color: "#2152ff",
                fontSize: 15,
                boxShadow: "0 4px 24px #2152ff26",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleProfileMenuClose();
                setShowProfilePage(true);
              }}
            >
              <PersonOutlineOutlinedIcon fontSize="small" sx={{ mr: 1, color: "#2152ff" }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutRoundedIcon fontSize="small" sx={{ mr: 1, color: "#2152ff" }} />
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;