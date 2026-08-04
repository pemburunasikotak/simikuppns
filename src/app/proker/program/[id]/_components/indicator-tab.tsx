import { FC, ReactElement, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
// import EditIcon from "@mui/icons-material/Edit";
// import AddCircleIcon from "@mui/icons-material/AddCircle";

import useGetProgram from "../../_hooks/use-get-program";
import useGetListProgramIndicator from "../_hooks/use-get-list-program-indicator";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";

import DataTable from "@/app/_components/ui/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import ModalSetTarget from "./modal-set-target";
import ModalAddIndicator from "./modal-add-indicator";

const IndicatorTab: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
  });

  const { data: programData } = useGetProgram(id as string);
  const program = programData?.data;

  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<TDefaultProgramIndicator | null>(null);

  const [openModalIndicator, setOpenModalIndicator] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const handleOpenTargetModal = (indicator: TDefaultProgramIndicator) => {
    setSelectedIndicator(indicator);
    setTargetModalOpen(true);
  };

  const { data: indicatorsResponse, isLoading } = useGetListProgramIndicator(id as string, params);
  const isPaginated = indicatorsResponse?.data && !Array.isArray(indicatorsResponse.data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawItems = isPaginated ? (indicatorsResponse.data as any).items : (indicatorsResponse?.data || []);
  const items = isPaginated
    ? rawItems
    : rawItems.slice((params.page - 1) * params.per_page, params.page * params.per_page);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pagination = isPaginated ? (indicatorsResponse?.data as any).pagination : {
    page: params.page,
    limit: params.per_page,
    totalItems: rawItems.length,
    totalPages: Math.ceil(rawItems.length / params.per_page),
  };

  const columns: GridColDef<TDefaultProgramIndicator>[] = [
    { field: "name", headerName: "Nama Indikator", minWidth: 250, flex: 1 },
    { field: "unit_measurement", headerName: "Satuan", width: 100 },
    { field: "targetQ1", headerName: "Target Q1", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    { field: "targetQ2", headerName: "Target Q2", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    { field: "targetQ3", headerName: "Target Q3", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    { field: "targetQ4", headerName: "Target Q4", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    { field: "status", headerName: "Status", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    // { field: "order", headerName: "Urutan", width: 100, align: "center", headerAlign: "center" },
    {
      field: "action",
      headerName: "Aksi",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const actionItems = [];
        actionItems.push({
          key: "edit",
          type: "edit" as const,
          onClick: () => {
            setSelectedIndicator(params.row);
            setModalMode("edit");
            setOpenModalIndicator(true);
          },
        });
        if (params.row.status === "ASSIGNED_TO_UNIT") {
          actionItems.push({
            key: "assign",
            type: "assign" as const,
            onClick: () => handleOpenTargetModal(params.row),
          });
        }
        if (params.row.status === "IN_PROGRESS") {
          actionItems.push({
            key: "detail",
            type: "detail" as const,
            onClick: () => navigate(`/proker/program/${id}/indicator/${params.row.id}`),
          });
        }

        if (actionItems.length > 0) {
          return <ActionButtonTable items={actionItems} />;
        }
        return null;
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, p: 3, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="body2" color="textSecondary" fontWeight="medium" gutterBottom>
          {program?.code} • {program?.year}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {program?.title}
        </Typography>
        {program?.description && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {program.description}
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold">Daftar Indikator Program</Typography>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => {
            setSelectedIndicator(null);
            setModalMode("add");
            setOpenModalIndicator(true);
          }}
        >
          Tambah Indikator
        </Button>
      </Box>
      <DataTable
        loading={isLoading}
        rows={items}
        columns={columns}
        checkboxSelection={false}
        handleChange={(newParams) => setParams(prev => ({ ...prev, ...newParams }))}
        paginationInfo={
          pagination
            ? {
              page: pagination.page,
              page_size: pagination.totalPages,
              limit: pagination.limit,
              total: pagination.totalItems,
            }
            : undefined
        }
      />
      <ModalSetTarget
        open={targetModalOpen}
        onClose={() => {
          setTargetModalOpen(false);
          setSelectedIndicator(null);
        }}
        programId={id as string}
        selectedIndicator={selectedIndicator}
      />
      <ModalAddIndicator
        open={openModalIndicator}
        onClose={() => setOpenModalIndicator(false)}
        programId={id as string}
        mode={modalMode}
        selectedIndicator={selectedIndicator}
      />
    </Box>
  );
};

export default IndicatorTab;
