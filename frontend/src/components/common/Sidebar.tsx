// src/components/Sidebar.tsx
import {
  Box,
  Drawer,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemIcon,
  Typography,
  Button,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined"; // New: Import for Weekly Report

// Define the shape of a sidebar item
export type SidebarItem = {
  text: string;
  icon: JSX.Element;
  color: string;
};

// Define the props the Sidebar component will accept
interface SidebarProps {
  darkMode: boolean;
  selected: string;
  onItemClick: (text: string) => void;
  onLogout: () => void;
}

// Updated Sidebar items with "Time Tracker", "Weekly Report", and "Settings"
const sideBarItems: SidebarItem[] = [
  { text: "Home", icon: <HomeRoundedIcon />, color: "#2152ff" },
  { text: "My Alerts", icon: <WarningAmberRoundedIcon />, color: "#2152ff" },
  { text: "Resources", icon: <MenuBookRoundedIcon />, color: "#2152ff" },
  { text: "Chat", icon: <ChatBubbleRoundedIcon />, color: "#2152ff" },
  { text: "Time Tracker", icon: <AccessTimeOutlinedIcon />, color: "#2152ff" },
  { text: "Weekly Report", icon: <AssessmentOutlinedIcon />, color: "#2152ff" }, // New button
  { text: "Settings", icon: <SettingsOutlinedIcon />, color: "#2152ff" },
  { text: "Report Bullying", icon: <ReportProblemRoundedIcon />, color: "#d7263d" },
];

const drawerWidth = 200;

export default function Sidebar({ darkMode, selected, onItemClick, onLogout }: SidebarProps) {
  const sidebarBorder = darkMode ? "#22304a" : "#e6e8f0";
  const fontFamily = "'Inter', 'Poppins', Arial, sans-serif";
  const colors = {
    sidebarBg: darkMode ? "linear-gradient(160deg, #111a2f 0%, #172a4c 80%, #161e35 100%)" : "#fff",
    sidebarActiveBg: darkMode ? "linear-gradient(90deg, #163b77 0%, #105bcb 100%)" : "#f2f6ff",
    sidebarActiveText: "#21d4fd",
    sidebarText: darkMode ? "#d8e7ff" : "#222",
    logoutButtonBg: "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)",
    logoutButtonHoverBg: "linear-gradient(90deg, #2580ff 0%, #7fd7fb 100%)",
    logoutButtonActiveBg: "linear-gradient(90deg, #1538a3 0%, #1ba8d7 100%)",
    logoTextShadow: darkMode
      ? "0 2px 10px #41caff55, 0 1px 2px #2152ff88"
      : "0 2px 10px #41caff33, 0 1px 2px #2152ff55",
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        minWidth: drawerWidth,
        maxWidth: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          minWidth: drawerWidth,
          maxWidth: drawerWidth,
          background: colors.sidebarBg,
          color: colors.sidebarText,
          borderRight: `1.5px solid ${sidebarBorder}`,
          boxShadow: darkMode ? "0 2px 16px #2152ff1a" : "none",
          display: "flex",
          flexDirection: "column",
          py: 0,
          borderRadius: 0,
          overflowX: "hidden",
        },
      }}
    >
      {/* Sidebar Logo */}
      <Box
        sx={{
          px: 3,
          py: 3.2,
          display: "flex",
          alignItems: "center",
          gap: 1.4,
          borderBottom: `1.5px solid ${sidebarBorder}`,
          overflow: "hidden",
        }}
      >
        <img
          src="./cybershield.png"
          alt="CyberShield Logo"
          style={{ width: 32, height: 32, objectFit: "contain", display: "block" }}
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
            textShadow: colors.logoTextShadow,
            lineHeight: "1.1",
          }}
        >
          CyberShield
        </Typography>
      </Box>

      {/* Navigation Items */}
      <MUIList sx={{ width: "100%", mt: 1, flexGrow: 1, pb: 2, overflow: "hidden" }}>
        {sideBarItems.map((item) => (
          <MUIListItem
            button
            key={item.text}
            onClick={() => onItemClick(item.text)}
            sx={{
              my: 1,
              borderRadius: 2.5,
              mx: 1,
              px: 1.5,
              height: 44,
              minHeight: 44,
              justifyContent: "flex-start",
              alignItems: "center",
              position: "relative",
              background: selected === item.text ? colors.sidebarActiveBg : "transparent",
              color: selected === item.text ? colors.sidebarActiveText : colors.sidebarText,
              boxShadow: selected === item.text && darkMode ? "0 2px 14px #21d4fd22" : "none",
              fontWeight: selected === item.text ? 800 : 500,
              fontSize: 16,
              transition: "background 0.18s, box-shadow 0.18s, color 0.18s, filter 0.22s",
              "&:hover": {
                background: darkMode ? "linear-gradient(90deg, #112148 0%, #163b77 100%)" : "#f4f8ff",
                color: colors.sidebarActiveText,
                filter: "brightness(1.05)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: selected === item.text ? colors.sidebarActiveText : item.color || (darkMode ? "#d8e7ff" : "#b3b3b3"),
                mr: 1.6,
                fontSize: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.18s, filter 0.22s",
                filter: selected === item.text && darkMode ? "drop-shadow(0px 0px 8px #21d4fd88)" : "none",
                background: selected === item.text && darkMode ? "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)" : "none",
                borderRadius: 2,
                p: selected === item.text ? 0.5 : 0,
                boxShadow: selected === item.text && darkMode ? "0 2px 8px #21d4fd33" : "none",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <Typography
              component="span"
              sx={{
                fontWeight: "inherit",
                fontSize: 16,
                letterSpacing: 0.1,
                textShadow: selected === item.text && darkMode ? "0 0 7px #21d4fd66" : "none",
              }}
            >
              {item.text}
            </Typography>
          </MUIListItem>
        ))}
      </MUIList>

      {/* Logout Button */}
      <Box sx={{ width: "100%", mt: "auto", mb: 2, px: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutRoundedIcon />}
          sx={{
            background: colors.logoutButtonBg,
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: 1,
            borderRadius: 2.5,
            py: 1.4,
            boxShadow: darkMode ? "0 4px 18px #21d4fd38" : "0 2px 8px #2152ff22",
            textTransform: "uppercase",
            filter: "brightness(1.05)",
            transition: "background 0.22s cubic-bezier(.4,0,.2,1), filter 0.18s",
            "&:hover": {
              background: colors.logoutButtonHoverBg,
              filter: "brightness(1.15)",
            },
            "&:active": {
              background: colors.logoutButtonActiveBg,
            },
          }}
          onClick={onLogout}
        >
          LOGOUT
        </Button>
      </Box>
    </Drawer>
  );
}