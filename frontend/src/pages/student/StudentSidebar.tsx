import React from "react";
import {
  Box,
  Drawer,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemIcon,
  Button,
  Typography,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";

// Define props for the StudentSidebar component
interface StudentSidebarProps {
  darkMode: boolean;
  selected: string;
  setSelected: (text: string) => void;
  setShowNotificationsPage: (value: boolean) => void; // Still passed, as other components might use it
  setShowProfilePage: (value: boolean) => void; // Added for completeness, if sidebar ever links to profile
  handleLogout: () => void;
  openAnonReportModal: () => void;
  // Removed setResourcesModal as the sidebar will now directly trigger the page view
  setShowResourcesPage: (value: boolean) => void; // New prop to show the resources page
  setShowActionsPage: (value: boolean) => void; // New prop to show admin actions page
  setShowAlertsPage: (value: boolean) => void; // New prop to show alerts page
  colorsDynamic: {
    sidebarBg: string;
    sidebarActive: string;
    sidebarActiveText: string;
    sidebarText: string;
    buttonBg: string;
    buttonText: string;
    iconColor: string;
  };
  sidebarBorder: string;
  drawerWidth: number;
  fontFamily: string;
  alertsCount?: number;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  darkMode,
  selected,
  setSelected,
  handleLogout,
  openAnonReportModal,
  setShowResourcesPage, // Destructure the new prop
  setShowActionsPage, // Destructure the new prop for admin actions
  setShowAlertsPage, // Destructure the new prop for alerts page
  // optional prop to show count of alerts for badge
  alertsCount,
  colorsDynamic,
  sidebarBorder,
  drawerWidth,
  fontFamily,
}) => {
  // Define sidebar items, consistent with your dashboard
  const sideBarItems = [
    { text: "Home", icon: <HomeRoundedIcon />, color: "#2152ff" },
    { text: "My Alerts", icon: <WarningAmberRoundedIcon />, color: "#2152ff" },
    { text: "Resources", icon: <MenuBookRoundedIcon />, color: "#2152ff" },
    // ShieldChat is now an external link with a Material icon
    {
      text: "ShieldChat",
      icon: <ChatBubbleRoundedIcon />,
      color: "#2152ff",
      external: true,
      href: "https://fullstack-chat-app-qi77.onrender.com/login",
    },
    {
      text: "Report Bullying",
      icon: <ReportProblemRoundedIcon />,
      color: "#d7263d",
    },
  ];

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
          background: colorsDynamic.sidebarBg,
          color: colorsDynamic.sidebarText,
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
      {/* Logo and Title */}
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
          src="./cybershield.png" // Ensure this path is correct
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
            textShadow: darkMode
              ? "0 2px 10px #41caff55, 0 1px 2px #2152ff88"
              : "0 2px 10px #41caff33, 0 1px 2px #2152ff55",
            lineHeight: "1.1",
          }}
        >
          CyberShield
        </Typography>
      </Box>

      {/* Navigation List */}
      <MUIList
        sx={{ width: "100%", mt: 1, flexGrow: 1, pb: 2, overflow: "hidden" }}
      >
        {sideBarItems.map((item) =>
          item.external ? (
            <MUIListItem
              key={item.text}
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
                background: "transparent",
                color: colorsDynamic.sidebarText,
                fontWeight: 500,
                fontSize: 16,
                transition:
                  "background 0.18s, box-shadow 0.18s, color 0.18s, filter 0.22s",
                "&:hover": {
                  background: darkMode
                    ? "linear-gradient(90deg, #112148 0%, #163b77 100%)"
                    : "#f4f8ff",
                  color: "#21d4fd",
                  filter: "brightness(1.05)",
                },
              }}
            >
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                  height: "100%",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    color: item.color || colorsDynamic.sidebarText,
                    mr: 1.6,
                    fontSize: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.18s, filter 0.22s",
                    borderRadius: 2,
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
                  }}
                >
                  {item.text}
                </Typography>
              </a>
            </MUIListItem>
          ) : (
            <MUIListItem
              button
              key={item.text}
              onClick={() => {
                setSelected(item.text);
                if (item.text === "My Alerts") setShowAlertsPage(true);
                if (item.text === "Resources") setShowResourcesPage(true);
                if (item.text === "Report Bullying") openAnonReportModal();
              }}
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
                background:
                  selected === item.text
                    ? colorsDynamic.sidebarActive
                    : "transparent",
                color:
                  selected === item.text
                    ? colorsDynamic.sidebarActiveText
                    : colorsDynamic.sidebarText,
                boxShadow:
                  selected === item.text && darkMode
                    ? "0 2px 14px #21d4fd22"
                    : "none",
                fontWeight: selected === item.text ? 800 : 500,
                fontSize: 16,
                transition:
                  "background 0.18s, box-shadow 0.18s, color 0.18s, filter 0.22s",
                "&:hover": {
                  background: darkMode
                    ? "linear-gradient(90deg, #112148 0%, #163b77 100%)"
                    : "#f4f8ff",
                  color: "#21d4fd",
                  filter: "brightness(1.05)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color:
                    selected === item.text
                      ? colorsDynamic.sidebarActiveText
                      : item.color || colorsDynamic.sidebarText,
                  mr: 1.6,
                  fontSize: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.18s, filter 0.22s",
                  filter:
                    selected === item.text && darkMode
                      ? "drop-shadow(0px 0px 8px #21d4fd88)"
                      : "none",
                  background:
                    selected === item.text && darkMode
                      ? "linear-gradient(90deg, #2152ff 0%, #21d4fd 100%)"
                      : "none",
                  borderRadius: 2,
                  p: selected === item.text ? 0.5 : 0,
                  boxShadow:
                    selected === item.text && darkMode
                      ? "0 2px 8px #21d4fd33"
                      : "none",
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
                  textShadow:
                    selected === item.text && darkMode
                      ? "0 0 7px #21d4fd66"
                      : "none",
                }}
              >
                {item.text}
                {item.text === "My Alerts" &&
                typeof alertsCount === "number" &&
                alertsCount > 0 ? (
                  <span
                    style={{
                      marginLeft: 8,
                      background: "#d32f2f",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {alertsCount}
                  </span>
                ) : null}
              </Typography>
            </MUIListItem>
          ),
        )}
      </MUIList>

      {/* Logout Button */}
      <Box sx={{ width: "100%", mt: "auto", mb: 2, px: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutRoundedIcon />}
          sx={{
            background: colorsDynamic.buttonBg,
            color: colorsDynamic.buttonText,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: 1,
            borderRadius: 2.5,
            py: 1.4,
            boxShadow: darkMode
              ? "0 4px 18px #21d4fd38"
              : "0 2px 8px #2152ff22",
            textTransform: "uppercase",
            filter: "brightness(1.05)",
            transition:
              "background 0.22s cubic-bezier(.4,0,.2,1), filter 0.18s",
            "&:hover": {
              background: "linear-gradient(90deg, #2580ff 0%, #7fd7fb 100%)",
              filter: "brightness(1.15)",
            },
            "&:active": {
              background: "linear-gradient(90deg, #1538a3 0%, #1ba8d7 100%)",
            },
          }}
          onClick={handleLogout} // Calls the handleLogout prop
        >
          LOGOUT
        </Button>
      </Box>
    </Drawer>
  );
};

export default StudentSidebar;
