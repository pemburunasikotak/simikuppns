import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider as Provider } from "@mui/x-date-pickers/LocalizationProvider";

export interface LocalizationProviderProps {
  children: React.ReactNode;
}

const LocalizationProvider = ({ children }: LocalizationProviderProps) => {
  return <Provider dateAdapter={AdapterDayjs}>{children}</Provider>;
};

export default LocalizationProvider;
