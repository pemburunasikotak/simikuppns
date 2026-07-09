import { FC, ReactElement } from "react";
import { useParams } from "react-router";
import { Typography, Box, Card, CardContent } from "@mui/material";
import { Page } from "@/app/_components/ui";

import OutputTable from "./_components/output-table";
import ProgressTable from "./_components/progress-table";
import EvidenceTable from "./_components/evidence-table";

const DetailAktivitasPage: FC = (): ReactElement => {
  const { id, activityId } = useParams<{ id: string; activityId: string }>();

  return (
    <Page
      title="Detail Aktivitas"
      breadcrumbs={[
        {
          label: "Manajemen Program",
          path: "/proker/program",
        },
        {
          label: "Program",
          path: "/proker/program",
        },
        {
          label: "Aktivitas",
          path: `/proker/program/${id}/aktivitas`,
        },
        {
          label: "Detail",
          path: null,
        },
      ]}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

        {/* Output Section */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Output Aktivitas
            </Typography>
            <OutputTable activityId={activityId as string} />
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Progress Aktivitas
            </Typography>
            <ProgressTable activityId={activityId as string} />
          </CardContent>
        </Card>

        {/* Evidence Section */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Evidence / Bukti Fisik
            </Typography>
            <EvidenceTable activityId={activityId as string} />
          </CardContent>
        </Card>

      </Box>
    </Page>
  );
};

export default DetailAktivitasPage;
