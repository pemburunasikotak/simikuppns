import { FC, ReactElement, useState } from "react";
import { useParams } from "react-router";
import { Box, Tab, Tabs } from "@mui/material";

import { Page } from "@/app/_components/ui";

import AktivitasTab from "./_components/aktivitas-tab";
import IndicatorTab from "./_components/indicator-tab";

const ProgramDetailPage: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = useState(0);

  if (!id) return <></>;

  return (
    <Page
      breadcrumbs={[
        {
          label: "Proker",
          path: "/proker",
        },
        {
          label: "Manajemen Program",
          path: "/proker/program",
        },
        {
          label: "Program",
          path: "/proker/program",
        },
        {
          label: "Detail",
          path: `/proker/program/${id}`,
        },
      ]}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Aktivitas" />
          <Tab label="Indikator" />
        </Tabs>
      </Box>

      {tabValue === 0 && <AktivitasTab />}
      {tabValue === 1 && <IndicatorTab />}
    </Page>
  );
};

export default ProgramDetailPage;
