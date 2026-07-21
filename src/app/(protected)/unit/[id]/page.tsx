import { FC, ReactElement, useState } from "react";
import { useParams } from "react-router";
import { Box, Tab, Tabs } from "@mui/material";

import { Page } from "@/app/_components/ui";
import { paths } from "@/commons/constants/paths";

import UsersTab from "./_components/users-tab";
import IKUTab from "./_components/iku-tab";

const UnitDetailPage: FC = (): ReactElement => {
  const { id: unitId } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = useState(0);

  if (!unitId) return <></>;

  return (
    <Page
      breadcrumbs={[
        { label: "Manajemen Unit", path: paths.unit.list },
        { label: "Detail Unit", path: null },
      ]}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Anggota Unit" />
          <Tab label="IKU Unit" />
        </Tabs>
      </Box>

      <UsersTab unitId={unitId} value={tabValue} index={0} />
      <IKUTab unitId={unitId} value={tabValue} index={1} />
    </Page>
  );
};

export default UnitDetailPage;
