import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Collapse,
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
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Logout,
  NotificationsOutlined,
  Person,
  Settings,
  Menu as MenuIcon,
} from "@mui/icons-material";

import { SIDEBAR_ITEMS, TSidebarItem } from "@/commons/constants/sidebar";
import { useSession } from "../_components/providers/session";

interface Props {
  item: TSidebarItem;
  isChild?: boolean;
  collapsed?: boolean;
  onExpandSidebar?: () => void;
}

const SidebarItem = ({ isChild, item, collapsed, onExpandSidebar }: Props) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const matchesPath = (path?: string) => (path ? location.pathname.startsWith(path) : false);

  const isChildActive = (item.children || []).some((child) => matchesPath(child.path));

  const isActive = matchesPath(item.path) || isChildActive;

  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  const handleClick = () => {
    if (collapsed) {
      onExpandSidebar?.();
    } else if (hasChildren) {
      setOpen((prev) => !prev);
    }
  };

  const itemContent = (
    <ListItemButton
      onClick={handleClick}
      component={item.path && !hasChildren ? Link : "button"}
      to={item.path || ""}
      sx={{
        pl: collapsed ? 1 : (isChild ? 7 : 2),
        pr: collapsed ? 1 : 2,
        height: collapsed ? 40 : 48,
        width: "100%",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: "8px",
        "&.Mui-selected": {
          color: "primary.main",
          backgroundColor: hasChildren && !collapsed ? "transparent" : undefined,
          borderRadius: "8px",
        },
        "& .MuiListItemIcon-root": {
          color: isActive ? "primary.main" : "inherit",
        },
      }}
      selected={isActive}
    >
      {item.icon && (
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
      )}
      {!collapsed && <ListItemText primary={item.label} />}
      {!collapsed && hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
    </ListItemButton>
  );

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        {collapsed ? (
          <Tooltip title={item.label} placement="right">
            {itemContent}
          </Tooltip>
        ) : (
          itemContent
        )}
      </ListItem>

      {!collapsed && hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children!.map((child) => (
              <SidebarItem
                item={child}
                key={child.key}
                isChild
                collapsed={collapsed}
                onExpandSidebar={onExpandSidebar}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
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

const ProtectedLayout = () => {
  const location = useLocation();
  const { signout } = useSession();
  const theme = useTheme();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  const flattenMenus = (items: TSidebarItem[]): TSidebarItem[] => {
    return items.flatMap(({ children, ...item }) => [
      item,
      ...(children ? flattenMenus(children) : []),
    ]);
  };

  const flattenedMenus = flattenMenus(SIDEBAR_ITEMS);
  const activeMenu = flattenedMenus.find((menu) => menu.path === location.pathname);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (key: string) => {
    setAnchorElUser(null);
    if (key === "logout") {
      signout();
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
            }}
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
          <List
            component="nav"
            sx={{
              width: "100%",
              p: "0 16px",
              boxSizing: "border-box",
            }}
          >
            {SIDEBAR_ITEMS.map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                collapsed={collapsed}
                onExpandSidebar={() => setCollapsed(false)}
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
            <Typography variant="h6">{activeMenu?.label}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "24px", pr: 4 }}>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={1} color="error">
                  <NotificationsOutlined fontSize="medium" />
                </Badge>
              </IconButton>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Admin 1"
                    src=""
                    sx={{
                      height: "32px",
                      width: "32px",
                    }}
                  >
                    A
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
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.key} onClick={() => handleCloseUserMenu(setting.key)}>
                  <ListItemIcon>{setting.icon}</ListItemIcon>
                  <Typography>{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: "16px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
