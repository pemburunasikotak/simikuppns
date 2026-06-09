import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
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
  LockReset,
  Visibility,
  VisibilityOff,
  AccountCircle,
  BadgeOutlined,
  EmailOutlined,
} from "@mui/icons-material";

import { SIDEBAR_ITEMS, TSidebarItem } from "@/commons/constants/sidebar";
import { useSession } from "../_components/providers/session";
import { SessionUser } from "@/libs/localstorage";
import useChangeProfilePassword from "./_hooks/use-change-profile-password";

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

// ─── Profile Dialog ───────────────────────────────────────────────────────────

// The actual runtime shape stored by the auth API (superset of TUserItem)
type SessionUserProfile = {
  id?: string;
  name?: string;
  email?: string;
  nip?: string;
  type?: string;
  isActive?: boolean;
};

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDialog = ({ open, onClose }: ProfileDialogProps) => {
  const sessionUser = SessionUser.get();
  const user = (sessionUser?.user as unknown as SessionUserProfile) ?? {};

  const changePassword = useChangeProfilePassword();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setSuccessMsg("");
    onClose();
  };

  const handleSubmit = () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Semua field wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    changePassword.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setSuccessMsg("Password berhasil diubah.");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err: unknown) => {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          setErrorMsg(
            axiosErr?.response?.data?.message || "Gagal mengubah password. Periksa kembali password lama Anda."
          );
        },
      }
    );
  };

  // Determine initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Person color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Profil Saya
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* ── User Info Card ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
            py: 2,
            px: 3,
            borderRadius: 2,
            bgcolor: "primary.50",
            border: "1px solid",
            borderColor: "primary.100",
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              fontSize: "1.6rem",
              fontWeight: 700,
              bgcolor: "primary.main",
            }}
          >
            {initials}
          </Avatar>

          {/* Name */}
          {user?.name && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <AccountCircle fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={600}>
                {user.name}
              </Typography>
            </Box>
          )}

          {/* NIP */}
          {user?.nip && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <BadgeOutlined fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                NIP: {user.nip}
              </Typography>
            </Box>
          )}

          {/* Email */}
          {user?.email && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <EmailOutlined fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          )}

          {/* Type badge */}
          {user?.type && (
            <Chip
              label={user.type}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            />
          )}
        </Box>

        <Divider sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LockReset fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              GANTI PASSWORD
            </Typography>
          </Box>
        </Divider>

        {/* ── Error Message ── */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg("")}>
            {errorMsg}
          </Alert>
        )}

        {/* ── Success Snackbar ── */}
        <Snackbar
          open={Boolean(successMsg)}
          autoHideDuration={4000}
          onClose={() => setSuccessMsg("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setSuccessMsg("")} sx={{ width: "100%" }}>
            {successMsg}
          </Alert>
        </Snackbar>

        {/* ── Password Fields ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Password Lama"
            type={showOld ? "text" : "password"}
            size="small"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowOld((v) => !v)} edge="end">
                    {showOld ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password Baru"
            type={showNew ? "text" : "password"}
            size="small"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Minimal 6 karakter"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowNew((v) => !v)} edge="end">
                    {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Konfirmasi Password Baru"
            type={showConfirm ? "text" : "password"}
            size="small"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword.length > 0 && confirmPassword !== newPassword}
            helperText={
              confirmPassword.length > 0 && confirmPassword !== newPassword
                ? "Password tidak cocok"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowConfirm((v) => !v)} edge="end">
                    {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={handleClose} disabled={changePassword.isPending}>
          Tutup
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={changePassword.isPending}
          startIcon={changePassword.isPending ? <CircularProgress size={16} /> : <LockReset />}
        >
          {changePassword.isPending ? "Menyimpan..." : "Simpan Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Settings Menu Config ─────────────────────────────────────────────────────

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

// ─── Protected Layout ─────────────────────────────────────────────────────────

const ProtectedLayout = () => {
  const location = useLocation();
  const { signout } = useSession();
  const theme = useTheme();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const sessionUser = SessionUser.get();
  const user = (sessionUser?.user as unknown as SessionUserProfile) ?? {};
  const displayName = user?.name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
    } else if (key === "profile") {
      setProfileOpen(true);
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
                    alt={displayName}
                    src=""
                    sx={{
                      height: "32px",
                      width: "32px",
                      bgcolor: "primary.main",
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
              {/* User info header inside menu */}
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
        <Box sx={{ p: "16px" }}>
          <Outlet />
        </Box>
      </Box>

      {/* ── Profile Dialog ── */}
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Box>
  );
};

export default ProtectedLayout;
