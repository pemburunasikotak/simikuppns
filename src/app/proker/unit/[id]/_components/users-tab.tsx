import { FC, useState, useMemo } from "react";
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
  Typography,
  CircularProgress,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PersonAddOutlined, DeleteOutlined, AddOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { useFilter } from "@/app/_hooks/use-filter";

import useGetUnitUsers from "../_hooks/use-get-unit-users";
import useAssignUsers from "../_hooks/use-assign-users";
import { useGetInfiniteUser } from "../_hooks/use-get-list-user";
import useGetUnitDetails from "../_hooks/use-get-unit-details";
import { getErrorMessage } from "./utils";
import { TUnitUserItem } from "../_hooks/use-get-unit-users";
import TabPanel from "./tab-panel";

type TUserItem = {
  id: string;
  name: string;
  nip?: string;
  email?: string;
  [key: string]: unknown;
};

interface UsersTabProps {
  unitId: string;
  value: number;
  index: number;
}

const UsersTab: FC<UsersTabProps> = ({ unitId, value, index }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilter } = useFilter<Record<string, unknown>>();
  const [isAssignUserOpen, setIsAssignUserOpen] = useState(false);
  const [userSearchInput, setUserSearchInput] = useState("");

  type TAssignRow = { userId: string; type: "PIC" | "MEMBER" };
  const [assignRows, setAssignRows] = useState<TAssignRow[]>([{ userId: "", type: "PIC" }]);

  const usersQuery = useGetUnitUsers(unitId, {
    limit: filters.limit ? Number(filters.limit) : 50,
    page: filters.page ? Number(filters.page) : 1,
  });

  const usersInfiniteQuery = useGetInfiniteUser({
    ...(userSearchInput.trim() ? { search: userSearchInput.trim(), search_value: userSearchInput.trim() } : {}),
  });

  const allUsers: TUserItem[] = useMemo(() => {
    if (!usersInfiniteQuery.data?.pages) return [];
    return usersInfiniteQuery.data.pages.flatMap((page) => {
      const rawData = (page as Record<string, unknown>)?.data;
      if (Array.isArray(rawData)) return rawData as TUserItem[];
      if (rawData && typeof rawData === "object" && "items" in rawData && Array.isArray((rawData as { items: unknown[] }).items)) {
        return (rawData as { items: TUserItem[] }).items;
      }
      return [];
    });
  }, [usersInfiniteQuery.data]);

  const detailQuery = useGetUnitDetails(unitId);

  const userOptions = useMemo(() => {
    const map = new Map<string, TUserItem>();
    if (detailQuery.data?.users && Array.isArray(detailQuery.data.users)) {
      detailQuery.data.users.forEach((u: { id?: string; userId?: string; name?: string; email?: string; nip?: string; user?: TUserItem }) => {
        const id = u.id || u.userId || u.user?.id;
        if (id) {
          map.set(id, {
            id,
            name: u.name || u.user?.name || id,
            nip: u.nip || u.user?.nip,
            email: u.email || u.user?.email,
          });
        }
      });
    }
    allUsers.forEach((u) => {
      if (u.id) {
        map.set(u.id, u);
      }
    });
    return Array.from(map.values());
  }, [detailQuery.data?.users, allUsers]);

  const assignUserMutation = useAssignUsers(unitId);

  const handleOpenAssign = () => {
    if (detailQuery.data?.users && detailQuery.data.users.length > 0) {
      const rows = detailQuery.data.users.map((u: { id?: string; userId?: string; user?: { id?: string }; memberType?: string; type?: string }) => ({
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

  const [selectedUnassignUser, setSelectedUnassignUser] = useState<TUnitUserItem | null>(null);

  const handleConfirmUnassignUser = async () => {
    if (!selectedUnassignUser) return;
    const currentUsers = detailQuery.data?.users || [];
    const targetId = selectedUnassignUser.id;
    const remainingUsers = currentUsers
      .filter((u: { id?: string; userId?: string; user?: { id?: string } }) => {
        const uId = u.id || u.userId || (u.user && u.user.id);
        return uId !== targetId;
      })
      .map((u: { id?: string; userId?: string; user?: { id?: string }; memberType?: string; type?: string }) => ({
        userId: u.id || u.userId || (u.user && u.user.id) || "",
        type: (u.memberType || u.type || "PIC") as "PIC" | "MEMBER",
      }));

    try {
      await assignUserMutation.mutateAsync({ users: remainingUsers });
      enqueueSnackbar(`User "${selectedUnassignUser.name}" berhasil dihapus dari unit`, { variant: "success" });
      setSelectedUnassignUser(null);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal menghapus user dari unit"), { variant: "error" });
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
    {
      field: "actions",
      headerName: "Aksi",
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="error"
          title="Unassign User"
          onClick={() => setSelectedUnassignUser(params.row)}
        >
          <DeleteOutlined fontSize="small" />
        </IconButton>
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
        rows={usersQuery.data?.data?.items || []}
        columns={userColumns}
        paginationInfo={createPaginationInfo({
          per_page: filters.limit ? Number(filters.limit) : 10,
          total: usersQuery.data?.data?.pagination?.totalItems || 0,
          page: usersQuery.data?.data?.pagination?.page || 1,
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
                  options={userOptions}
                  filterOptions={(options) => options}
                  getOptionLabel={(opt) =>
                    typeof opt === "string"
                      ? opt
                      : `${opt.name} (${opt.nip || opt.email || opt.id})`
                  }
                  isOptionEqualToValue={(option, val) => Boolean(option && val && option.id === val.id)}
                  loading={usersInfiniteQuery.isLoading || usersInfiniteQuery.isFetchingNextPage}
                  value={userOptions.find((u) => u.id === row.userId) ?? null}
                  onChange={(_, val) => handleRowChange(idx, "userId", val?.id || "")}
                  onInputChange={(_, val, reason) => {
                    if (reason === "input") {
                      setUserSearchInput(val);
                    } else if (reason === "clear") {
                      setUserSearchInput("");
                    }
                  }}
                  ListboxProps={{
                    onScroll: (event: React.SyntheticEvent) => {
                      const listboxNode = event.currentTarget as HTMLElement;
                      if (listboxNode) {
                        const { scrollTop, clientHeight, scrollHeight } = listboxNode;
                        if (scrollHeight - scrollTop - clientHeight <= 80) {
                          if (usersInfiniteQuery.hasNextPage && !usersInfiniteQuery.isFetchingNextPage) {
                            usersInfiniteQuery.fetchNextPage();
                          }
                        }
                      }
                    },
                    style: { maxHeight: 250, overflow: "auto" },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pilih User"
                      placeholder="Cari user (nama, NIP, email)..."
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {usersInfiniteQuery.isFetchingNextPage || usersInfiniteQuery.isLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
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

      {/* Confirm Unassign User Dialog */}
      <Dialog
        open={Boolean(selectedUnassignUser)}
        onClose={() => setSelectedUnassignUser(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Konfirmasi Hapus User</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body2" sx={{ my: 1 }}>
            Apakah Anda yakin ingin menghapus user <strong>{selectedUnassignUser?.name}</strong> dari unit ini?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setSelectedUnassignUser(null)}
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={assignUserMutation.isPending}
            onClick={handleConfirmUnassignUser}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {assignUserMutation.isPending ? "Menghapus..." : "Hapus / Unassign"}
          </Button>
        </DialogActions>
      </Dialog>
    </TabPanel>
  );
};

export default UsersTab;
