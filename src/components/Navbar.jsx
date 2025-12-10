import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CommonIconButton from "./CommonIconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import {
  Link,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { isLoggedIn as checkLoggedIn, removeToken } from "../api/auth";
import APP_CONFIG from "../constants/appConfig";
import Home from "../pages/Home";
import About from "../pages/About";
import AuthPage from "../pages/AuthPage";
import CourseContent from "../pages/CourseContent";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/CircleNotifications";
import EducationIcon from "@mui/icons-material/CastForEducationOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import VillaOutlinedIcon from "@mui/icons-material/VillaOutlined";

const iconMap = {
  InboxIcon: InboxIcon,
  MailIcon: MailIcon,
  LoginIcon: LoginIcon,
  LogoutIcon: LogoutIcon,
  NotificationsIcon: NotificationsIcon,
  EducationIcon: EducationIcon,
  InfoIcon: InfoIcon,
  VillaOutlinedIcon: VillaOutlinedIcon,
};

function DynamicIcon({ name, ...props }) {
  const Component = iconMap[name];
  if (!Component) return null; // or a fallback icon
  return <Component {...props} />;
}

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background:
    "linear-gradient(90deg, #05486aff 0%, #0F4BD8 50%, #3ba5f6ff 100%)",
  color: theme.palette.common.white,
  boxShadow: "none",
  borderRadius: 0,
  // borderTopLeftRadius: 0,
  // borderTopRightRadius: 0,
  // borderBottomLeftRadius: 5,
  // borderBottomRightRadius: 5,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = React.useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNotificationClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationsAnchor(null);
  };

  const products = [
    { id: 1, icon: "VillaOutlinedIcon", name: "Dashboard", to: "/home" },
    { id: 2, icon: "EducationIcon", name: "Courses", to: "/education" },
    { id: 3, icon: "InfoIcon", name: "About", to: "/about" },
  ];

  // Use a small helper function to check auth state (from src/api/auth.js)
  const isLoggedIn = checkLoggedIn();

  // Get current page name based on location
  const getPageName = () => {
    const path = location.pathname;
    const product = products.find((p) => p.to === path);
    if (product) return product.name;

    // Handle other paths
    if (path === "/home" || path === "/") return "Dashboard";
    if (path === "/about") return "About";
    if (path === "/education") return "Learning";
    return "Page"; // default fallback
  };

  return (
    <>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<AuthPage />} />
        </Routes>
      ) : (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <CommonIconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    marginRight: 5,
                  },
                  open && { display: "none" },
                ]}
              >
                <MenuIcon />
              </CommonIconButton>
              {!open && (
                <Typography variant="h6" noWrap component="div">
                  {APP_CONFIG.name}
                </Typography>
              )}
              <div
                color="inherit"
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(1.5), // 12px
                }}
              >
                <CommonIconButton
                  color="inherit"
                  aria-label="notifications"
                  onClick={handleNotificationClick}
                >
                  <DynamicIcon
                    key="NotificationsIcon"
                    name="NotificationsIcon"
                  />
                </CommonIconButton>
                <CommonIconButton
                  color="inherit"
                  aria-label="logout"
                  onClick={() => {
                    // simple logout: remove token and navigate to /login
                    removeToken();
                    navigate("/login");
                  }}
                >
                  <DynamicIcon key="LogoutIcon" name="LogoutIcon" />
                </CommonIconButton>
              </div>
            </Toolbar>
          </AppBar>
          {isSmUp ? (
            <Drawer variant="permanent" open={open}>
              <DrawerHeader>
                <Box
                  sx={{
                    ...theme.custom.drawerHeaderPageName,
                    textAlign: "center",
                  }}
                >
                  {APP_CONFIG.name}
                </Box>
                <CommonIconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </CommonIconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {products.map((product) => (
                  <ListItem
                    key={product.name}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={[
                        {
                          minHeight: 48,
                          px: 2.5,
                        },
                        open
                          ? {
                              justifyContent: "initial",
                            }
                          : {
                              justifyContent: "center",
                            },
                      ]}
                      component={Link}
                      to={product.to}
                    >
                      <ListItemIcon
                        sx={[
                          {
                            minWidth: 0,
                            justifyContent: "center",
                          },
                          open
                            ? {
                                mr: 3,
                              }
                            : {
                                mr: "auto",
                              },
                        ]}
                      >
                        <DynamicIcon key={product.id} name={product.icon} />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.name}
                        sx={[
                          open
                            ? {
                                opacity: 1,
                              }
                            : {
                                opacity: 0,
                              },
                        ]}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          ) : (
            <MuiDrawer
              variant="temporary"
              open={open}
              onClose={handleDrawerClose}
              ModalProps={{ keepMounted: true }}
              sx={{
                "& .MuiDrawer-paper": { width: drawerWidth },
              }}
            >
              <DrawerHeader>
                <Box
                  sx={{
                    ...theme.custom.drawerHeaderPageName,
                    textAlign: "center",
                  }}
                >
                  {APP_CONFIG.name}
                </Box>
                <CommonIconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </CommonIconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {products.map((product) => (
                  <ListItem
                    key={product.name}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{ minHeight: 48, px: 2.5 }}
                      component={Link}
                      to={product.to}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon
                        sx={{ minWidth: 0, justifyContent: "center", mr: 3 }}
                      >
                        <DynamicIcon key={product.id} name={product.icon} />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.name}
                        sx={{ opacity: 1 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </MuiDrawer>
          )}
          <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
            <DrawerHeader />
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Typography sx={theme.custom.breadcrumbs}>{"Home"}</Typography>
              <Typography sx={theme.custom.breadcrumbs}>{"Mid"}</Typography>
              <Typography sx={theme.custom.breadcrumbs}>
                {getPageName()}
              </Typography>
            </Breadcrumbs>
            <Box sx={theme.custom.drawerHeaderPageName}>{getPageName()}</Box>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/education" element={<CourseContent />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Box>

          {/* Notifications Popover */}
          <Popover
            open={Boolean(notificationsAnchor)}
            anchorEl={notificationsAnchor}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ width: 400, maxHeight: 500, overflow: "auto", p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Notifications
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Sample notifications */}
              {[
                {
                  id: 1,
                  user: "Whitney Robinson",
                  action: "mentioned you",
                  time: "10 hours ago",
                  type: "Core screens",
                },
                {
                  id: 2,
                  user: "Coley Logan",
                  action: "replied to a comment",
                  time: "2 days ago",
                  type: "Core screens",
                },
                {
                  id: 3,
                  user: "Tim Van Damme",
                  action: "replied to a comment",
                  time: "2 days ago",
                  type: "Core screens",
                },
                {
                  id: 4,
                  user: "Sarah McIlwain",
                  action: "replied to a comment",
                  time: "3 days ago",
                  type: "Core screens",
                },
                {
                  id: 5,
                  user: "Eva Marina Illescas Sanchez",
                  action: "replied to a comment",
                  time: "4 days ago",
                  type: "Core screens",
                },
              ].map((notif) => (
                <Box
                  key={notif.id}
                  onClick={() => {
                    navigate("/education");
                    handleNotificationClose();
                  }}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.light,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {notif.user}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {notif.action} on the airboard{" "}
                      <span style={{ fontWeight: 600 }}>
                        New Branch from File Modal
                      </span>
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notif.time} • {notif.type}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>
      )}
    </>
  );
}
