import { useParams, useSearchParams } from "react-router";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useState } from "react";

import { Page, DocumentCell } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import useGetIndicatorRealizations from "./_hooks/use-get-indicator-realizations";
import ModalAddRealization from "./_components/modal-add-realization";
import { TIndicatorRealizationItem } from "@/api/proker/program/type";

const IndicatorRealizationPage = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const programId = params.id as string;
  const indicatorId = params.indicatorId as string;
  const unitType = (searchParams.get("type") || "NUMBER").toUpperCase();

  const [openModal, setOpenModal] = useState(false);

  const { data, isLoading } = useGetIndicatorRealizations(programId, indicatorId);

  const columns: GridColDef<TIndicatorRealizationItem>[] = [
    { field: "month", headerName: "Bulan", width: 100 },
    { field: "realization", headerName: "Realisasi", width: 150 },
    { field: "remark", headerName: "Catatan", minWidth: 200, flex: 1 },
    {
      field: "documents",
      headerName: "Dokumen",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row = params.row as any;
        const docs = row.documentIds || row.documents || (row.documentUrl ? [row.documentUrl] : []);
        if (!docs || docs.length === 0) return "-";
        return <DocumentCell documents={Array.isArray(docs) ? docs : [docs]} title={`Dokumen Realisasi Bulan ${row.month}`} />;
      },
    },
    { 
      field: "createdAt", 
      headerName: "Dibuat Pada", 
      width: 200,
      renderCell: (params) => dayjs(params.row.createdAt).format("DD MMM YYYY HH:mm")
    },
  ];

  return (
    <Page
      loading={isLoading}
      title="Detail Indikator"
      breadcrumbs={[
        {
          label: "Proker",
          path: "/proker",
        },
        {
          label: "Program",
          path: "/proker/program",
        },
        {
          label: "Detail Program",
          path: `/proker/program/${programId}`,
        },
        {
          label: "Detail Indikator",
          path: null,
        },
      ]}
    >
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" gutterBottom ml={1}>
              Daftar Realisasi
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
            >
              Tambah Realisasi
            </Button>
          </Box>
          <DataTable
            loading={isLoading}
            rows={data?.data || []}
            columns={columns}
            hidePagination={true}
          />
        </Grid>
      </Grid>

      <ModalAddRealization
        open={openModal}
        onClose={() => setOpenModal(false)}
        programId={programId}
        indicatorId={indicatorId}
        unitType={unitType}
      />
    </Page>
  );
};

export default IndicatorRealizationPage;
