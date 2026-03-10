import { createTheme, CssBaseline, ThemeProvider as MUIThemeProvider } from "@mui/material";
import React from "react";

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif",
      fontSize: 14,
    },
    palette: {
      mode: "light",
      primary: {
        main: "#516F58",
      },
      background: {
        default: "#F7F8FA",
        paper: "#FFFFFF",
      },
      text: {
        primary: "#737373",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "unset",
            borderRadius: "10px",
            padding: "16px 14px",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            backgroundColor: "rgba(244, 242, 244, 1)",
          },
          notchedOutline: {
            borderColor: "transparent",
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            width: "fit-content",
            display: "flex",
            flexDirection: "row-reverse",
            gap: "4px",
            marginBottom: "14px",
          },
          asterisk: {
            color: "rgba(208, 0, 0, 1)",
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: "#FFFFFF",
            borderBottom: "none",
            borderLeft: "none",
            borderRight: "none",
          },
          columnHeader: {
            backgroundColor: "#FFFFFF",
            fontWeight: "bold",
            color: "#2B2B2B",
          },
        },
      },
      MuiPickersOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(244, 242, 244, 1)",
            borderRadius: "10px",
          },
          notchedOutline: {
            borderColor: "transparent",
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
