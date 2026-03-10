import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ThemeProvider from "../../providers/theme";

export type ConfirmProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  onClose?: () => void;
  onOk?: () => void;
};

const ConfirmDialog = ({
  icon,
  title,
  description,
  okText = "Ya",
  cancelText = "Batal",
  onClose,
  onOk,
}: ConfirmProps) => {
  return (
    <ThemeProvider>
      <Dialog open>
        <Box sx={{ px: 4, pt: 4, textAlign: "center" }}>
          {icon}
          {title && <DialogTitle>{title}</DialogTitle>}
        </Box>
        <DialogContent sx={{ px: 4 }}>
          {description && <DialogContentText>{description}</DialogContentText>}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, display: "flex", gap: 2 }}>
          <Button variant="outlined" sx={{ p: 1 }} fullWidth onClick={onClose}>
            {cancelText}
          </Button>
          <Button sx={{ p: 1 }} fullWidth onClick={onOk} variant="contained">
            {okText}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ConfirmDialog;
