import { FC, ReactElement, useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import { useFilter } from "@/app/_hooks/use-filter";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  AddOutlined,
  PlayCircleOutline,
  DescriptionOutlined,
  CloudDownloadOutlined,
  LaunchOutlined,
  VideoLibraryOutlined,
  MenuBookOutlined,
  CloseOutlined,
  YouTube,
  AddToDriveOutlined,
  InsertDriveFileOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";

import { SessionUser } from "@/libs/localstorage";
import { TGuideItem, TGetGuidesParams } from "@/api/guides/type";
import useGetListGuide from "./_hooks/use-get-list-guide";
import useCreateGuide from "./_hooks/use-create-guide";
import useUpdateGuide from "./_hooks/use-update-guide";
import useDeleteGuide from "./_hooks/use-delete-guide";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import FormTextField from "@/app/_components/ui/form-text-field";

interface SessionUserProfile {
  id?: string;
  name?: string;
  email?: string;
  roles?: { id: string; key: string; name: string }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatFileSize = (bytes?: number | null): string => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return String(err.response.data.message);
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  } catch {
    return null;
  }
};

const getGoogleDriveEmbedUrl = (url: string): string | null => {
  try {
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    const matchId = url.match(/id=([^&]+)/);
    if (matchId && matchId[1]) {
      return `https://drive.google.com/file/d/${matchId[1]}/preview`;
    }
    return url;
  } catch {
    return url;
  }
};

// ─── Form Schema ─────────────────────────────────────────────────────────────

const guideSchema = z.object({
  title: z.string().min(1, "Judul panduan wajib diisi"),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
});

type TGuideForm = z.infer<typeof guideSchema>;

// ─── Main Component ──────────────────────────────────────────────────────────

const GuidesPage: FC = (): ReactElement => {
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilter } = useFilter<TGetGuidesParams>();

  // Session / Role
  const sessionUser = SessionUser.get();
  const user = (sessionUser?.user as unknown as SessionUserProfile) ?? {};
  const userRoleKeys = user?.roles?.map((r) => r.key) || [];
  const isAdmin = userRoleKeys.includes("admin_sim_iku");

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<TGuideItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Queries & Mutations
  const page = filters.page ? Number(filters.page) : 1;
  const limit = filters.limit ? Number(filters.limit) : (isAdmin ? 10 : 12);
  const search = (filters.search_value as string) || (filters.search as string) || "";

  const query = useGetListGuide({ page, limit, search });
  const createMutation = useCreateGuide();
  const updateMutation = useUpdateGuide();
  const deleteMutation = useDeleteGuide();

  // Forms
  const createForm = useForm<TGuideForm>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
    },
  });

  const editForm = useForm<TGuideForm>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
    },
  });

  useEffect(() => {
    if (selectedGuide && isEditOpen) {
      editForm.reset({
        title: selectedGuide.title,
        description: selectedGuide.description || "",
        videoUrl: selectedGuide.videoUrl || "",
      });
      setSelectedFile(null);
    }
  }, [selectedGuide, isEditOpen, editForm]);

  const guidesList: TGuideItem[] = query.data?.data?.data || [];
  const paginationData = query.data?.data?.pagination || {
    page: 1,
    limit: limit,
    total: 0,
    totalPages: 1,
  };

  // Handlers
  const handleOpenCreate = () => {
    createForm.reset({ title: "", description: "", videoUrl: "" });
    setSelectedFile(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (guide: TGuideItem) => {
    setSelectedGuide(guide);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (guide: TGuideItem) => {
    setSelectedGuide(guide);
    setIsDeleteOpen(true);
  };

  const handleOpenPreview = (guide: TGuideItem) => {
    setSelectedGuide(guide);
    setIsPreviewOpen(true);
  };

  const handleCreateSubmit = createForm.handleSubmit(async (values) => {
    if (!selectedFile && !values.videoUrl?.trim()) {
      enqueueSnackbar("Minimal salah satu dari File Materi atau Link Video wajib diisi", {
        variant: "warning",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: values.title,
        description: values.description,
        videoUrl: values.videoUrl,
        file: selectedFile,
      });
      enqueueSnackbar("Panduan berhasil dibuat", { variant: "success" });
      setIsCreateOpen(false);
      createForm.reset();
      setSelectedFile(null);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Gagal membuat panduan"), { variant: "error" });
    }
  });

  const handleEditSubmit = editForm.handleSubmit(async (values) => {
    if (!selectedGuide) return;
    if (!selectedFile && !values.videoUrl?.trim() && !selectedGuide.fileUrl) {
      enqueueSnackbar("Minimal salah satu dari File Materi atau Link Video wajib diisi", {
        variant: "warning",
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedGuide.id,
        title: values.title,
        description: values.description,
        videoUrl: values.videoUrl,
        file: selectedFile,
      });
      enqueueSnackbar("Panduan berhasil diperbarui", { variant: "success" });
      setIsEditOpen(false);
      setSelectedGuide(null);
      setSelectedFile(null);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Gagal memperbarui panduan"), { variant: "error" });
    }
  });

  const handleDeleteConfirm = async () => {
    if (!selectedGuide) return;
    try {
      await deleteMutation.mutateAsync(selectedGuide.id);
      enqueueSnackbar("Panduan berhasil dihapus", { variant: "success" });
      setIsDeleteOpen(false);
      setSelectedGuide(null);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Gagal menghapus panduan"), { variant: "error" });
    }
  };

  // Data Table Columns for Admin View
  const columns: GridColDef<TGuideItem>[] = [
    {
      field: "index",
      headerName: "No",
      width: 60,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const rowIndex = guidesList.findIndex((item) => item.id === params.row.id);
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            {(page - 1) * limit + (rowIndex >= 0 ? rowIndex + 1 : 1)}
          </Box>
        );
      },
    },
    {
      field: "title",
      headerName: "Judul Panduan",
      flex: 1.5,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
          <Typography variant="body2" fontWeight={600} color="text.primary" align="center">
            {params.row.title}
          </Typography>
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Deskripsi",
      flex: 2,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.description || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "media",
      headerName: "Tipe Media",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const { videoSource, videoUrl, fileUrl } = params.row;
        return (
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ height: "100%", width: "100%" }}>
            {videoUrl && videoSource === "YOUTUBE" && (
              <Chip
                icon={<YouTube style={{ color: "#FF0000" }} />}
                label="YouTube"
                size="small"
                variant="outlined"
                color="error"
              />
            )}
            {videoUrl && videoSource === "GOOGLE_DRIVE" && (
              <Chip
                icon={<AddToDriveOutlined style={{ color: "#1A73E8" }} />}
                label="Google Drive"
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
            {videoUrl && !videoSource && (
              <Chip
                icon={<VideoLibraryOutlined />}
                label="Video Link"
                size="small"
                variant="outlined"
              />
            )}
            {fileUrl && (
              <Chip
                icon={<InsertDriveFileOutlined />}
                label="File Materi"
                size="small"
                variant="outlined"
                color="success"
              />
            )}
            {!videoUrl && !fileUrl && "-"}
          </Stack>
        );
      },
    },
    {
      field: "fileInfo",
      headerName: "Detail Berkas / Link",
      flex: 1.5,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const { originalName, size, videoUrl } = params.row;
        if (originalName) {
          return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
              <Tooltip title={originalName}>
                <Typography variant="caption" color="text.secondary" noWrap align="center">
                  {originalName} {size ? `(${formatFileSize(size)})` : ""}
                </Typography>
              </Tooltip>
            </Box>
          );
        }
        if (videoUrl) {
          return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
              <Tooltip title={videoUrl}>
                <Typography variant="caption" color="primary" noWrap component="a" href={videoUrl} target="_blank" align="center">
                  {videoUrl}
                </Typography>
              </Tooltip>
            </Box>
          );
        }
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            -
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Tanggal Dibuat",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
          {dayjs(params.row.createdAt).format("DD MMM YYYY HH:mm")}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 200,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        const fileUrl = params.row.fileUrl;
        const downloadUrl = fileUrl || params.row.videoUrl;

        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            <ActionButtonTable
              items={[
                {
                  key: "detail",
                  type: "detail",
                  label: "Pratinjau",
                  onClick: () => handleOpenPreview(params.row),
                },
                ...(downloadUrl
                  ? [
                    {
                      key: "download",
                      type: "download" as const,
                      label: "Unduh / Download",
                      href: downloadUrl,
                      target: "_blank",
                      download: fileUrl ? true : undefined,
                    },
                  ]
                  : []),
                {
                  key: "edit",
                  type: "edit",
                  onClick: () => handleOpenEdit(params.row),
                },
                {
                  key: "delete",
                  type: "delete",
                  onClick: () => handleOpenDelete(params.row),
                },
              ]}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <Page title="Panduan" description="Pusat informasi dan materi panduan penggunaan sistem SIM IKU">
      {/* ── Top Header Actions & Search ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box sx={{ maxWidth: { xs: "100%", sm: 400 }, flexGrow: 1 }}>
          <Filter
            variants={["search"]}
            labelSearch="Cari panduan..."
            defaultValue={{
              search_value: search,
            }}
          />
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlined />}
            onClick={handleOpenCreate}
            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
          >
            Tambah Panduan
          </Button>
        )}
      </Stack>

      {/* ── ADMIN VIEW (Data Table) ── */}
      {isAdmin ? (
        <DataTable
          rows={guidesList}
          columns={columns}
          loading={query.isLoading}
          paginationInfo={createPaginationInfo({
            page: paginationData.page,
            per_page: paginationData.limit,
            total: paginationData.total,
          })}
          handleChange={({ page, per_page }) => {
            setFilter({
              page: page ?? paginationData.page,
              limit: per_page ?? paginationData.limit,
            });
          }}
        />
      ) : (
        /* ── USER VIEW (Card Grid View) ── */
        <Box>
          {query.isLoading ? (
            <Typography align="center" color="text.secondary" sx={{ py: 8 }}>
              Memuat data panduan...
            </Typography>
          ) : guidesList.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
                bgcolor: "background.paper",
                borderRadius: 3,
                border: "1px dashed #e0e0e0",
              }}
            >
              <MenuBookOutlined sx={{ fontSize: 60, color: "text.secondary", mb: 1, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
                Belum Ada Panduan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Materi panduan penggunaan sistem belum tersedia atau tidak ditemukan.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {guidesList.map((guide) => {
                const isYouTube = guide.videoSource === "YOUTUBE" || (guide.videoUrl && guide.videoUrl.includes("youtube"));
                const isDrive = guide.videoSource === "GOOGLE_DRIVE" || (guide.videoUrl && guide.videoUrl.includes("drive.google"));
                const hasFile = Boolean(guide.fileUrl);

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={guide.id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                          borderColor: "primary.main",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {/* Card Type Header Accent */}
                      <Box
                        sx={{
                          p: 2,
                          background: isYouTube
                            ? "linear-gradient(135deg, #FFF0F0 0%, #FFE6E6 100%)"
                            : isDrive
                              ? "linear-gradient(135deg, #EBF3FE 0%, #D8E8FE 100%)"
                              : "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          {isYouTube ? (
                            <YouTube style={{ color: "#FF0000" }} />
                          ) : isDrive ? (
                            <AddToDriveOutlined style={{ color: "#1A73E8" }} />
                          ) : (
                            <DescriptionOutlined style={{ color: "#16A34A" }} />
                          )}
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{
                              color: isYouTube ? "#990000" : isDrive ? "#004085" : "#15803D",
                            }}
                          >
                            {isYouTube ? "Video YouTube" : isDrive ? "Google Drive" : "Dokumen Panduan"}
                          </Typography>
                        </Stack>

                        <Typography variant="caption" color="text.secondary">
                          {dayjs(guide.createdAt).format("DD MMM YYYY")}
                        </Typography>
                      </Box>

                      {/* Card Content */}
                      <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: "1.05rem", lineHeight: 1.3 }}>
                          {guide.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: 60,
                          }}
                        >
                          {guide.description || "Tidak ada deskripsi."}
                        </Typography>

                        {hasFile && (
                          <Chip
                            icon={<InsertDriveFileOutlined />}
                            label={`${guide.originalName || "Dokumen"} ${guide.size ? `(${formatFileSize(guide.size)})` : ""}`}
                            size="small"
                            variant="outlined"
                            color="success"
                            sx={{ maxWidth: "100%", mb: 1 }}
                          />
                        )}
                      </CardContent>

                      <Divider />

                      {/* Card Actions */}
                      <CardActions sx={{ p: 2, gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {(guide.videoUrl || guide.fileUrl) && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={guide.videoUrl ? <PlayCircleOutline /> : <VisibilityOutlined />}
                            onClick={() => handleOpenPreview(guide)}
                            sx={{ textTransform: "none", borderRadius: "6px", fontWeight: 600 }}
                          >
                            {guide.videoUrl ? "Tonton Video" : "Pratinjau"}
                          </Button>
                        )}
                        {guide.fileUrl && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            startIcon={<CloudDownloadOutlined />}
                            component="a"
                            href={guide.fileUrl}
                            target="_blank"
                            download
                            sx={{ textTransform: "none", borderRadius: "6px", fontWeight: 600 }}
                          >
                            Unduh
                          </Button>
                        )}
                        {guide.videoUrl && (
                          <IconButton
                            size="small"
                            color="secondary"
                            component="a"
                            href={guide.videoUrl}
                            target="_blank"
                            title="Buka Link Eksternal"
                          >
                            <LaunchOutlined fontSize="small" />
                          </IconButton>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* ── CREATE DIALOG (Admin) ── */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Tambah Panduan Baru</DialogTitle>
        <form onSubmit={handleCreateSubmit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <FormTextField
                name="title"
                label="Judul Panduan *"
                placeholder="Masukkan judul panduan..."
                control={createForm.control}
              />
              <FormTextField
                name="description"
                label="Deskripsi Panduan"
                placeholder="Masukkan deskripsi penjelasan..."
                multiline
                rows={3}
                control={createForm.control}
              />
              <FormTextField
                name="videoUrl"
                label="Link Video (YouTube / Google Drive)"
                placeholder="https://www.youtube.com/watch?v=... atau https://drive.google.com/..."
                control={createForm.control}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlayCircleOutline color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  File Materi (Opsional)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudDownloadOutlined />}
                  sx={{ textTransform: "none" }}
                >
                  {selectedFile ? selectedFile.name : "Pilih File Dokumen"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Terpilih: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  * Minimal salah satu dari Link Video atau File Materi wajib diisi.
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsCreateOpen(false)} color="inherit">
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Menyimpan..." : "Simpan Panduan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── EDIT DIALOG (Admin) ── */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Panduan</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <FormTextField
                name="title"
                label="Judul Panduan *"
                placeholder="Masukkan judul panduan..."
                control={editForm.control}
              />
              <FormTextField
                name="description"
                label="Deskripsi Panduan"
                placeholder="Masukkan deskripsi penjelasan..."
                multiline
                rows={3}
                control={editForm.control}
              />
              <FormTextField
                name="videoUrl"
                label="Link Video (YouTube / Google Drive)"
                placeholder="https://www.youtube.com/watch?v=... atau https://drive.google.com/..."
                control={editForm.control}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlayCircleOutline color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Ganti File Materi (Opsional)
                </Typography>
                {selectedGuide?.originalName && !selectedFile && (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                    File saat ini: <strong>{selectedGuide.originalName}</strong> ({formatFileSize(selectedGuide.size)})
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudDownloadOutlined />}
                  sx={{ textTransform: "none" }}
                >
                  {selectedFile ? selectedFile.name : "Pilih File Baru"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Terpilih file baru: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </Typography>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsEditOpen(false)} color="inherit">
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Menyimpan..." : "Perbarui"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── DELETE DIALOG ── */}
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>Konfirmasi Hapus</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Apakah Anda yakin ingin menghapus panduan <strong>"{selectedGuide?.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsDeleteOpen(false)} color="inherit">
            Batal
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── PREVIEW MODAL ── */}
      <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={700}>
            {selectedGuide?.title}
          </Typography>
          <IconButton size="small" onClick={() => setIsPreviewOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          {selectedGuide?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedGuide.description}
            </Typography>
          )}

          {/* Embedded YouTube / Google Drive Video */}
          {selectedGuide?.videoUrl && (
            <Box sx={{ mb: 2, width: "100%", height: 420, borderRadius: 2, overflow: "hidden", bgcolor: "black" }}>
              {selectedGuide.videoSource === "YOUTUBE" || selectedGuide.videoUrl.includes("youtube") || selectedGuide.videoUrl.includes("youtu.be") ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(selectedGuide.videoUrl) || selectedGuide.videoUrl}
                  title={selectedGuide.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={getGoogleDriveEmbedUrl(selectedGuide.videoUrl) || selectedGuide.videoUrl}
                  title={selectedGuide.title}
                  frameBorder="0"
                  allow="autoplay"
                  allowFullScreen
                />
              )}
            </Box>
          )}

          {/* Attached Document File View / Download */}
          {selectedGuide?.fileUrl && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <InsertDriveFileOutlined color="primary" fontSize="large" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {selectedGuide.originalName || "File Materi Panduan"}
                  </Typography>
                  {selectedGuide.size && (
                    <Typography variant="caption" color="text.secondary">
                      Ukuran: {formatFileSize(selectedGuide.size)}
                    </Typography>
                  )}
                </Box>
              </Stack>
              <Button
                variant="contained"
                color="success"
                startIcon={<CloudDownloadOutlined />}
                component="a"
                href={selectedGuide.fileUrl}
                target="_blank"
                download
                sx={{ textTransform: "none", borderRadius: "6px" }}
              >
                Unduh File
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsPreviewOpen(false)} variant="outlined">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default GuidesPage;
