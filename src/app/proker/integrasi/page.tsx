import { useState } from "react";
import { Button, CircularProgress, Chip } from "@mui/material";
import { SyncOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";
import { useGetIntegrationPrograms } from "./_hooks/use-get-integration-programs";
import { useSyncIntegrationPrograms } from "./_hooks/use-sync-integration";
import { TIntegrationProgram } from "@/api/proker/integrasi/type";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";

export default function IntegrasiPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: programs, isLoading } = useGetIntegrationPrograms();
  const syncMutation = useSyncIntegrationPrograms();
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const handleSync = () => {
    syncMutation.mutate(undefined, {
      onSuccess: () => {
        enqueueSnackbar("Sinkronisasi berhasil dijalankan", { variant: "success" });
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        enqueueSnackbar(error?.response?.data?.message || "Gagal melakukan sinkronisasi", { variant: "error" });
      },
    });
  };

  const columns: GridColDef<TIntegrationProgram>[] = [
    {
      field: "programName", headerName: "Nama Program", minWidth: 200, flex: 1,
      renderCell: (params) => params.row.programName || (params.row as Record<string, unknown>).name || '-'
    },
    {
      field: "source", headerName: "Sumber Data", minWidth: 150, flex: 1,
      renderCell: (params) => params.value || '-'
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value || 'UNKNOWN'}
          color={params.value === 'SUCCESS' ? 'success' : params.value === 'FAILED' ? 'error' : 'default'}
          size="small"
        />
      )
    },
    {
      field: "lastSync",
      headerName: "Terakhir Sinkron",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'
    },
  ];

  const filteredRows = programs || [];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Integrasi Program",
          path: "/proker/integrasi",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Program..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
          actions={[
            <Button
              key="sync"
              variant="contained"
              color="primary"
              startIcon={syncMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SyncOutlined />}
              onClick={handleSync}
              disabled={syncMutation.isPending}
            >
              Sinkronisasi Data
            </Button>,
          ]}
        />
      }
    >
      <DataTable
        loading={isLoading}
        rows={filteredRows}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: filter.per_page ? Number(filter.per_page) : 10,
          total: programs?.length || 0,
          page: filter.page ? Number(filter.page) : 1,
        })}
        handleChange={setFilter}
      />
    </Page>
  );
}
