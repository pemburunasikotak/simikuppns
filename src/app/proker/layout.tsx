import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import {
  DashboardOutlined,
  CorporateFareOutlined,
  ListAltOutlined,
  Logout,
  Person,
  Settings,
  Menu as MenuIcon,
  ExpandMore,
} from "@mui/icons-material";

import { useProkerSession } from "@/app/_components/providers/proker-session";
import { ProkerSessionUser } from "@/libs/localstorage/proker-session";
import { useSession } from "@/app/_components/providers/session";
import { paths } from "@/commons/constants/paths";

export type TProkerSidebarItem = {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
};

const PROKER_SIDEBAR_ITEMS: TProkerSidebarItem[] = [
  {
    key: "proker-dashboard",
    label: "Dashboard",
    path: paths.proker.dashboard,
    icon: <DashboardOutlined />,
  },
  {
    key: "proker-unit",
    label: "Unit",
    path: paths.proker.unit,
    icon: <CorporateFareOutlined />,
  },
  {
    key: "proker-program",
    label: "Program",
    path: paths.proker.program,
    icon: <ListAltOutlined />,
  },
  {
    key: "proker-manajemen-program",
    label: "Manajemen Program",
    path: paths.proker.manajemenProgram,
    icon: <CorporateFareOutlined />,
  },
];

interface SidebarItemProps {
  item: TProkerSidebarItem;
  collapsed?: boolean;
}

const SidebarItem = ({ item, collapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.path);

  const itemContent = (
    <ListItemButton
      component={Link}
      to={item.path}
      sx={{
        pl: collapsed ? 1 : 2,
        pr: collapsed ? 1 : 2,
        height: 48,
        width: "100%",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: "8px",
        "&.Mui-selected": {
          color: "secondary.main",
          backgroundColor: "rgba(156, 39, 176, 0.08)",
          borderRadius: "8px",
        },
        "& .MuiListItemIcon-root": {
          color: isActive ? "secondary.main" : "inherit",
        },
      }}
      selected={isActive}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 36,
          display: collapsed ? "flex" : "inline-flex",
          justifyContent: collapsed ? "center" : "flex-start",
          width: "auto",
        }}
      >
        {item.icon}
      </ListItemIcon>
      {!collapsed && <ListItemText primary={item.label} />}
    </ListItemButton>
  );

  return (
    <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
      {collapsed ? (
        <Tooltip title={item.label} placement="right">
          {itemContent}
        </Tooltip>
      ) : (
        itemContent
      )}
    </ListItem>
  );
};

const settings = [
  {
    key: "profile",
    label: "Profile",
    icon: <Person />,
    danger: false,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings />,
    danger: false,
  },
  {
    key: "logout",
    label: "Logout",
    icon: <Logout />,
    danger: true,
  },
];

const ProkerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { signout } = useProkerSession();
  const theme = useTheme();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  const user = ProkerSessionUser.get()?.user;
  const { signout: signoutProker } = useProkerSession();
  const { signout: signoutIku } = useSession();

  const displayName = user?.name || "User Proker";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const activeMenu = PROKER_SIDEBAR_ITEMS.find((menu) => location.pathname.startsWith(menu.path));

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (key: string) => {
    setAnchorElUser(null);
    if (key === "logout") {
      signoutProker();
      signoutIku();
    }
  };

  return (
    <Box>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: collapsed ? 72 : 260,
          "& .MuiDrawer-paper": {
            width: collapsed ? 72 : 260,
            overflowX: "hidden",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              style={{
                width: collapsed ? "40px" : "100px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box sx={{ px: 2, mb: 2, textAlign: 'center' }}>
            {!collapsed && <Typography variant="subtitle2" color="secondary" fontWeight="bold">SIM PROKER</Typography>}
          </Box>
          <List
            component="nav"
            sx={{
              width: "100%",
              p: "0 16px",
              boxSizing: "border-box",
            }}
          >
            {PROKER_SIDEBAR_ITEMS.map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </List>
        </Box>
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <IconButton onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon />
          </IconButton>
          {!collapsed && (
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: "text.secondary",
                userSelect: "none",
                cursor: "pointer",
              }}
              onClick={() => setCollapsed(!collapsed)}
            >
              Sembunyikan Menu
            </Typography>
          )}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          ml: collapsed ? "72px" : "260px",
          backgroundColor: "#f5f7f9",
          minHeight: "100vh"
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
          }}
        >
          <Toolbar>
            <Typography variant="h6">{activeMenu?.label || "Proker"}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "24px", pr: 4 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={displayName}
                    src=""
                    sx={{
                      height: "36px",
                      width: "36px",
                      bgcolor: "secondary.main",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {initials}
                  </Avatar>
                  <ExpandMore />
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {displayName}
                </Typography>
                {user?.email && (
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                )}
              </Box>
              <Divider />
              {settings.map((setting) => (
                <MenuItem
                  key={setting.key}
                  onClick={() => handleCloseUserMenu(setting.key)}
                  sx={{ color: setting.danger ? "error.main" : "inherit" }}
                >
                  <ListItemIcon sx={{ color: setting.danger ? "error.main" : "inherit" }}>
                    {setting.icon}
                  </ListItemIcon>
                  <Typography>{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: "24px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ProkerLayout;
