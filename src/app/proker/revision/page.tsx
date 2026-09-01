import { useState } from "react";
import {
  Typography,
  Chip,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { Page, DocumentCell } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import { paths } from "@/commons/constants/paths";
import { useFilter } from "@/app/_hooks/use-filter";
import { useGetRevisionIndicators } from "./_hooks/use-get-revision-indicators";
import { TRevisionIndicatorItem } from "@/api/proker/revision/type";
import ModalReviseIndicator from "./_components/modal-revise-indicator";

const formatRupiah = (amount?: string | number) => {
  if (!amount) return "-";
  const num = Number(amount);
  if (isNaN(num)) return String(amount);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function RevisionPage() {
  const { filters: filter, setFilter } = useFilter<{
    page?: number;
    per_page?: number;
    search_value?: string;
    search?: string;
  }>();

  const [selectedIndicator, setSelectedIndicator] = useState<TRevisionIndicatorItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const queryParams = {
    ...filter,
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
  };

  const query = useGetRevisionIndicators(queryParams);

  const handleOpenReviseModal = (item: TRevisionIndicatorItem) => {
    setSelectedIndicator(item);
    setModalOpen(true);
  };

  const handleCloseReviseModal = () => {
    setModalOpen(false);
    setSelectedIndicator(null);
  };

  const getLevelLabel = (level?: string) => {
    if (level === "INDICATOR_VERIFICATION") return "Verifikasi Indikator";
    if (level === "BUDGET_VERIFICATION") return "Verifikasi Anggaran";
    return level || "-";
  };

  const columns: GridColDef<TRevisionIndicatorItem>[] = [
    {
      field: "name",
      headerName: "Nama Indikator",
      minWidth: 200,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%", py: 1 }}>
          <Typography variant="body2" fontWeight={500}>
            {params.row.name || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "program",
      headerName: "Program",
      minWidth: 200,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const title = params.row.program?.title || "-";
        return (
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", py: 1 }}>
            <Typography variant="body2" fontWeight={500} lineHeight={1.3}>
              {title}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "unit",
      headerName: "Unit",
      minWidth: 180,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const unitName = params.row.unit?.name || params.row.unit?.code;
        if (!unitName)
          return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            </Box>
          );

        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <Chip
              label={unitName}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                height: "auto",
                minHeight: 28,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderRadius: "6px",
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "revisionLevel",
      headerName: "Level Revisi",
      minWidth: 170,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Chip
            label={getLevelLabel(params.row.revisionLevel)}
            size="small"
            color="warning"
            variant="filled"
            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
          />
        </Box>
      ),
    },
    {
      field: "revisionNote",
      headerName: "Catatan Revisi",
      minWidth: 200,
      flex: 1.2,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Tooltip title={params.row.revisionNote || ""} placement="top">
            <Typography
              variant="body2"
              color="warning.dark"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              {params.row.revisionNote || "-"}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "targetQ1",
      headerName: "Q1",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Typography variant="body2">{params.row.targetQ1 ?? 0}</Typography>
        </Box>
      ),
    },
    {
      field: "targetQ2",
      headerName: "Q2",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Typography variant="body2">{params.row.targetQ2 ?? 0}</Typography>
        </Box>
      ),
    },
    {
      field: "targetQ3",
      headerName: "Q3",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Typography variant="body2">{params.row.targetQ3 ?? 0}</Typography>
        </Box>
      ),
    },
    {
      field: "targetQ4",
      headerName: "Q4",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Typography variant="body2">{params.row.targetQ4 ?? 0}</Typography>
        </Box>
      ),
    },
    {
      field: "budget",
      headerName: "Anggaran",
      minWidth: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Typography variant="body2">{formatRupiah(params.row.budget)}</Typography>
        </Box>
      ),
    },
    {
      field: "revisionRequestedAt",
      headerName: "Tanggal Revisi",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Typography variant="body2">{formatDate(params.row.revisionRequestedAt)}</Typography>
        </Box>
      ),
    },
    {
      field: "documents",
      headerName: "Dokumen",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const row = params.row;
        const docs: { label: string; doc: unknown }[] = [];
        if (row.proposalURL) docs.push({ label: "TOR", doc: row.proposalURL });
        if (row.rabURL) docs.push({ label: "RAB", doc: row.rabURL });
        if (docs.length === 0)
          return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
              <Typography variant="body2" color="text.secondary">-</Typography>
            </Box>
          );
        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <DocumentCell documents={docs} title={`Dokumen: ${row.name}`} />
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Aksi",
      width: 120,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Button
            variant="contained"
            color="warning"
            size="small"
            startIcon={<EditOutlined />}
            onClick={() => handleOpenReviseModal(params.row)}
            sx={{ fontWeight: 700, textTransform: "none", borderRadius: "6px" }}
          >
            Revisi
          </Button>
        </Box>
      ),
    },
  ];

  const items = query.data?.data?.items || [];
  const paginationData = query.data?.data?.pagination;
  const totalItems = paginationData?.totalItems || items.length;
  const currentPage = paginationData?.page || (filter.page ? Number(filter.page) : 1);
  const limit = paginationData?.limit || (filter.per_page ? Number(filter.per_page) : 10);

  const searchParam = (filter.search_value || filter.search || "") as string;
  const filteredItems = items.filter((item) => {
    if (!searchParam) return true;
    const term = searchParam.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.program?.title?.toLowerCase().includes(term) ||
      item.unit?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <Page
      title="Revision"
      breadcrumbs={[
        { label: "Dashboard", path: paths.proker.dashboard },
        { label: "Revision", path: paths.proker.revision },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch="Cari indikator revisi..."
          defaultValue={{ search_value: filter.search_value || filter.search }}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={filteredItems}
        columns={columns}
        checkboxSelection={false}
        getRowHeight={() => "auto"}
        paginationInfo={createPaginationInfo({
          per_page: limit,
          total: totalItems,
          page: currentPage,
        })}
        handleChange={setFilter}
        getRowId={(row) => row.id}
      />

      <ModalReviseIndicator
        open={modalOpen}
        onClose={handleCloseReviseModal}
        indicator={selectedIndicator}
      />
    </Page>
  );
}
