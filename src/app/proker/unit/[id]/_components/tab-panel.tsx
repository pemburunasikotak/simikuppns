import { FC, ReactNode } from "react";
import { Box } from "@mui/material";

interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

export default TabPanel;
