import { FC, useState } from "react";
import {
  Stack,
  Button,
  Chip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PersonAddOutlined, DeleteOutlined, AddOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { useFilter } from "@/app/_hooks/use-filter";

import { TUnitUserItem, TGetUnitUsersParams } from "@/api/unit/type";
import useGetUnitUsers from "../_hooks/use-get-unit-users";
import useAssignUsers from "../_hooks/use-assign-users";
import useGetListUser from "../../../user/_hooks/use-get-list-user";
import TabPanel from "./tab-panel";
import { getErrorMessage } from "./utils";

interface UsersTabProps {
  unitId: string;
  value: number;
  index: number;
}

const UsersTab: FC<UsersTabProps> = ({ unitId, value, index }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilter } = useFilter<TGetUnitUsersParams>();
  const [isAssignUserOpen, setIsAssignUserOpen] = useState(false);

  type TAssignRow = { userId: string; type: "PIC" | "MEMBER" };
  const [assignRows, setAssignRows] = useState<TAssignRow[]>([{ userId: "", type: "PIC" }]);

  const usersQuery = useGetUnitUsers(unitId, {
    limit: filters.limit ? Number(filters.limit) : 10,
    page: filters.page ? Number(filters.page) : 1,
  });
  const allUsersQuery = useGetListUser({ limit: 100, page: 1 });
  const assignUserMutation = useAssignUsers(unitId);

  const handleOpenAssign = () => {
    if (usersQuery.data?.data && usersQuery.data.data.length > 0) {
      const rows = usersQuery.data.data.map((u: { id?: string; userId?: string; user?: { id?: string }; memberType?: string; type?: string }) => ({
        userId: u.id || u.userId || (u.user && u.user.id) || "",
        type: (u.memberType || u.type || "PIC") as "PIC" | "MEMBER",
      }));
      setAssignRows(rows);
    } else {
      setAssignRows([{ userId: "", type: "PIC" }]);
    }
    setIsAssignUserOpen(true);
  };

  const handleAddRow = () => setAssignRows((prev) => [...prev, { userId: "", type: "PIC" }]);
  const handleRemoveRow = (idx: number) => setAssignRows((prev) => prev.filter((_, i) => i !== idx));
  const handleRowChange = (idx: number, field: "userId" | "type", val: string) =>
    setAssignRows((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: val } : row)));

  const handleAssignUser = async () => {
    const valid = assignRows.filter((r) => r.userId);
    if (valid.length === 0) return;
    try {
      await assignUserMutation.mutateAsync({
        users: valid.map((r) => ({ userId: r.userId, type: r.type })),
      });
      enqueueSnackbar("User berhasil ditambahkan ke unit", { variant: "success" });
      setIsAssignUserOpen(false);
      setAssignRows([{ userId: "", type: "PIC" }]);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal menambahkan user"), { variant: "error" });
    }
  };

  const userColumns: GridColDef<TUnitUserItem>[] = [
    { field: "nip", headerName: "NIP", width: 150 },
    { field: "name", headerName: "Nama", minWidth: 200, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    { field: "type", headerName: "Tipe User", width: 130 },
    {
      field: "memberType",
      headerName: "Role di Unit",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.row.memberType}
          size="small"
          sx={{
            backgroundColor:
              params.row.memberType === "PIC"
                ? alpha("#1976d2", 0.1)
                : alpha("#2e7d32", 0.1),
            color: params.row.memberType === "PIC" ? "#1976d2" : "#2e7d32",
            fontWeight: 700,
            borderRadius: "6px",
          }}
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? "Aktif" : "Nonaktif"}
          color={params.row.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  return (
    <TabPanel value={value} index={index}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddOutlined />}
          onClick={handleOpenAssign}
        >
          Tambah Anggota
        </Button>
      </Stack>

      <DataTable
        loading={usersQuery.isLoading}
        rows={usersQuery.data?.data || []}
        columns={userColumns}
        paginationInfo={createPaginationInfo({
          per_page: filters.limit ? Number(filters.limit) : 10,
          total: usersQuery.data?.pagination?.total || 0,
          page: usersQuery.data?.pagination?.page || 1,
        })}
        handleChange={setFilter}
      />

      <Dialog
        open={isAssignUserOpen}
        onClose={() => {
          setIsAssignUserOpen(false);
          setAssignRows([{ userId: "", type: "PIC" }]);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Tambah Anggota Unit</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {assignRows.map((row, idx) => (
              <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={allUsersQuery.data?.data || []}
                  getOptionLabel={(opt) => `${opt.name} (${opt.nip || opt.email})`}
                  loading={allUsersQuery.isLoading}
                  value={allUsersQuery.data?.data?.find((u) => u.id === row.userId) ?? null}
                  onChange={(_, val) => handleRowChange(idx, "userId", val?.id || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pilih User"
                      placeholder="user..."
                      size="small"
                    />
                  )}
                />
                <FormControl size="small" sx={{ minWidth: 110 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={row.type}
                    label="Role"
                    onChange={(e) => handleRowChange(idx, "type", e.target.value as "PIC" | "MEMBER")}
                  >
                    <MenuItem value="PIC">PIC</MenuItem>
                    <MenuItem value="MEMBER">MEMBER</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  size="small"
                  color="error"
                  disabled={assignRows.length === 1}
                  onClick={() => handleRemoveRow(idx)}
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </Stack>
            ))}

            <Button
              variant="text"
              startIcon={<AddOutlined />}
              onClick={handleAddRow}
              sx={{ alignSelf: "flex-start", fontWeight: 600 }}
            >
              Tambah User Lagi
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setIsAssignUserOpen(false);
              setAssignRows([{ userId: "", type: "PIC" }]);
            }}
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            disabled={assignRows.every((r) => !r.userId) || assignUserMutation.isPending}
            onClick={handleAssignUser}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {assignUserMutation.isPending ? "Menyimpan..." : "Tambahkan"}
          </Button>
        </DialogActions>
      </Dialog>
    </TabPanel>
  );
};

export default UsersTab;
