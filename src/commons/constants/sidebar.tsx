import {
  DashboardOutlined,
  ExtensionOutlined,
  SettingsOutlined,
  PeopleOutlined,
  CorporateFareOutlined,
  AssignmentIndOutlined,
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
        label: "IKP",
        path: paths.master.component.list,
      },
      // {
      //   key: "master-data-formula",
      //   label: "Formula",
      //   path: paths.master.formula.list,
      // },
    ],
  },
  // {
  //   key: "period",
  //   label: "Periode",
  //   path: paths.period.list,
  //   icon: <CalendarMonthOutlined />,
  // },
  {
    key: "component",
    label: "Komponen",
    icon: <ExtensionOutlined />,
    path: paths.component.realisasi,
    // children: [
    //   {
    //     key: "component-iku",
    //     label: "IKU",
    //     path: paths.component.iku,
    //   },
    //   {
    //     key: "component-ikp",
    //     label: "IKP",
    //     path: paths.component.ikp,
    //   },
    //   {
    //     key: "component-realization",
    //     label: "Input Realisasi",
    //     path: paths.component.realisasi,
    //   },
    // ],
  },
  {
    key: "user",
    label: "User",
    path: paths.user.list,
    icon: <PeopleOutlined />,
  },
  {
    key: "pic",
    label: "PIC",
    path: paths.pic.list,
    icon: <AssignmentIndOutlined />,
  },
  {
    key: "bidang",
    label: "Bidang",
    path: paths.bidang.list,
    icon: <CorporateFareOutlined />,
  },
];