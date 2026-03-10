import {
  DashboardOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

import { paths } from "./paths";
export type TSidebarItem = {
  key: string;
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: TSidebarItem[];
};

export const SIDEBAR_ITEMS: TSidebarItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: paths.dashboard,
    icon: <DashboardOutlined />,
  },
  {
    key: "master-data",
    label: "Master Data",
    icon: <SettingsOutlined />,
    children: [
      {
        key: "master-data-iku",
        label: "IKU",
        path: paths.master.iku.list,
      },
      {
        key: "master-data-component",
        label: "Component",
        path: paths.master.component.list,
      },
      {
        key: "master-data-formula",
        label: "Formula",
        path: paths.master.formula.list,
      },
    ],
  },
];
