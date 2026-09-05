import { useState } from "react";
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

import { ProkerSessionUser } from "@/libs/localstorage/proker-session";
import { TProkerGuideItem, TGetProkerGuidesParams } from "@/api/proker/guides/type";
import useGetListProkerGuide from "./_hooks/use-get-list-proker-guide";
import useCreateProkerGuide from "./_hooks/use-create-proker-guide";
import useUpdateProkerGuide from "./_hooks/use-update-proker-guide";
import useDeleteProkerGuide from "./_hooks/use-delete-proker-guide";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import FormTextField from "@/app/_components/ui/form-text-field";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get("v") || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
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

type TGuideFormValues = z.infer<typeof guideSchema>;

// ─── Component Main ──────────────────────────────────────────────────────────

export default function ProkerGuidesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilter } = useFilter<TGetProkerGuidesParams>();

  const search = (filters.search_value as string) || "";
  const page = filters.page ? Number(filters.page) : 1;
  const limit = filters.limit ? Number(filters.limit) : 10;

  // Role check
  const user = ProkerSessionUser.get()?.user;
  const userRoleKeys = user?.roles?.map((r: { key: string }) => r.key) || [];
  const isAdmin = userRoleKeys.includes("admin_sim_proker");

  // Fetch list
  const query = useGetListProkerGuide({
    page,
    limit,
    search_value: search,
  });

  const guidesList: TProkerGuideItem[] =
    query.data?.data?.items ?? query.data?.data?.data ?? [];
  const paginationData = {
    page: query.data?.data?.pagination?.page ?? page,
    limit: query.data?.data?.pagination?.limit ?? limit,
    total:
      query.data?.data?.pagination?.totalItems ??
      query.data?.data?.pagination?.total ??
      0,
  };

  // Mutations
  const createMutation = useCreateProkerGuide();
  const updateMutation = useUpdateProkerGuide();
  const deleteMutation = useDeleteProkerGuide();

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<TProkerGuideItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState<TProkerGuideItem | null>(null);
  const [previewGuide, setPreviewGuide] = useState<TProkerGuideItem | null>(null);

  // Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TGuideFormValues>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
    },
  });

  // Handlers
  const handleOpenCreate = () => {
    setSelectedGuide(null);
    setSelectedFile(null);
    reset({ title: "", description: "", videoUrl: "" });
    setModalOpen(true);
  };

  const handleOpenEdit = (guide: TProkerGuideItem) => {
    setSelectedGuide(guide);
    setSelectedFile(null);
    reset({
      title: guide.title,
      description: guide.description || "",
      videoUrl: guide.videoUrl || "",
    });
    setModalOpen(true);
  };

  const handleOpenDelete = (guide: TProkerGuideItem) => {
    setGuideToDelete(guide);
    setDeleteDialogOpen(true);
  };

  const handleOpenPreview = (guide: TProkerGuideItem) => {
    setPreviewGuide(guide);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGuide(null);
    setSelectedFile(null);
    reset();
  };

  const onSubmitForm = async (values: TGuideFormValues) => {
    try {
      if (selectedGuide) {
        await updateMutation.mutateAsync({
          id: selectedGuide.id,
          title: values.title,
          description: values.description,
          videoUrl: values.videoUrl,
          file: selectedFile,
        });
        enqueueSnackbar("Panduan berhasil diperbarui", { variant: "success" });
      } else {
        await createMutation.mutateAsync({
          title: values.title,
          description: values.description,
          videoUrl: values.videoUrl,
          file: selectedFile,
        });
        enqueueSnackbar("Panduan berhasil ditambahkan", { variant: "success" });
      }
      handleCloseModal();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menyimpan panduan",
        { variant: "error" }
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!guideToDelete) return;
    try {
      await deleteMutation.mutateAsync(guideToDelete.id);
      enqueueSnackbar("Panduan berhasil dihapus", { variant: "success" });
      setDeleteDialogOpen(false);
      setGuideToDelete(null);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menghapus panduan",
        { variant: "error" }
      );
    }
  };

  // Data Table Columns for Admin View
  const columns: GridColDef<TProkerGuideItem>[] = [
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
        <Box sx={{ display: "flex", alignItems: "center", height: "100%", width: "100%" }}>
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
        const { videoSource, videoUrl } = params.row;
        const fileUrl = params.row.url || params.row.fileUrl;
        const isYoutube = videoSource === "YOUTUBE" || (videoUrl && videoUrl.includes("youtube"));
        const isDrive = videoSource === "GOOGLE_DRIVE" || (videoUrl && videoUrl.includes("drive.google"));

        return (
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ height: "100%", width: "100%" }}>
            {videoUrl && isYoutube && (
              <Chip
                icon={<YouTube style={{ color: "#FF0000" }} />}
                label="YouTube"
                size="small"
                variant="outlined"
                color="error"
              />
            )}
            {videoUrl && isDrive && (
              <Chip
                icon={<AddToDriveOutlined style={{ color: "#1A73E8" }} />}
                label="Google Drive"
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
            {videoUrl && !isYoutube && !isDrive && (
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
        const fileName = params.row.fileName || params.row.originalName || params.row.filename;
        const fileSize = params.row.fileSize ?? params.row.size;
        const { videoUrl } = params.row;

        if (fileName) {
          return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
              <Tooltip title={fileName}>
                <Typography variant="caption" color="text.secondary" noWrap align="center">
                  {fileName} {fileSize ? `(${formatFileSize(fileSize)})` : ""}
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
        const fileUrl = params.row.url || params.row.fileUrl;
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
    <Page title="Panduan SIM PROKER" description="Pusat informasi dan materi panduan penggunaan sistem SIM PROKER">
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

      {/* ── MAIN CONTENT ── */}
      {isAdmin ? (
        /* ── ADMIN VIEW (Data Table) ── */
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
                const fileUrl = guide.url || guide.fileUrl;
                const fileName = guide.fileName || guide.originalName || guide.filename;
                const fileSize = guide.fileSize ?? guide.size;
                const isYouTube = guide.videoSource === "YOUTUBE" || (guide.videoUrl && guide.videoUrl.includes("youtube"));
                const isDrive = guide.videoSource === "GOOGLE_DRIVE" || (guide.videoUrl && guide.videoUrl.includes("drive.google"));
                const hasFile = Boolean(fileUrl);

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
                      {/* Card Media Preview Header */}
                      <Box
                        sx={{
                          height: 140,
                          bgcolor: guide.videoUrl
                            ? isYouTube
                              ? "#fff5f5"
                              : isDrive
                                ? "#f0f7ff"
                                : "#f5f3ff"
                            : "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {guide.videoUrl ? (
                          isYouTube ? (
                            <YouTube sx={{ fontSize: 56, color: "#FF0000" }} />
                          ) : isDrive ? (
                            <AddToDriveOutlined sx={{ fontSize: 56, color: "#1A73E8" }} />
                          ) : (
                            <VideoLibraryOutlined sx={{ fontSize: 56, color: "primary.main" }} />
                          )
                        ) : (
                          <DescriptionOutlined sx={{ fontSize: 56, color: "text.secondary" }} />
                        )}

                        {/* Badges */}
                        <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 12, right: 12 }}>
                          {guide.videoUrl && (
                            <Chip
                              label={isYouTube ? "YouTube" : isDrive ? "Google Drive" : "Video"}
                              size="small"
                              color={isYouTube ? "error" : isDrive ? "primary" : "secondary"}
                              sx={{ fontWeight: 600 }}
                            />
                          )}
                          {hasFile && (
                            <Chip
                              label="Berkas PDF/Dokumen"
                              size="small"
                              color="success"
                              sx={{ fontWeight: 600 }}
                            />
                          )}
                        </Stack>
                      </Box>

                      {/* Card Content */}
                      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontSize: "1rem", lineHeight: 1.3 }}>
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
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "action.hover",
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <InsertDriveFileOutlined color="action" fontSize="small" />
                            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                              <Typography variant="caption" fontWeight={600} display="block" noWrap color="text.primary">
                                {fileName || "Dokumen Panduan"}
                              </Typography>
                              {fileSize ? (
                                <Typography variant="caption" color="text.secondary">
                                  {formatFileSize(fileSize)}
                                </Typography>
                              ) : null}
                            </Box>
                          </Box>
                        )}
                      </CardContent>

                      <Divider />

                      {/* Card Actions */}
                      <CardActions sx={{ p: 2, gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {(guide.videoUrl || hasFile) && (
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
                        {(fileUrl || guide.videoUrl) && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            component="a"
                            href={fileUrl || guide.videoUrl || "#"}
                            target="_blank"
                            download={hasFile ? true : undefined}
                            startIcon={<CloudDownloadOutlined />}
                            sx={{ textTransform: "none", borderRadius: "6px", fontWeight: 600 }}
                          >
                            Unduh File
                          </Button>
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

      {/* ── MODAL CREATE / EDIT (ADMIN) ── */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {selectedGuide ? "Edit Panduan" : "Tambah Panduan Baru"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <FormTextField
                name="title"
                control={control}
                label="Judul Panduan"
                placeholder="Masukkan judul materi panduan"
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
                required
              />

              <FormTextField
                name="description"
                control={control}
                label="Deskripsi / Catatan"
                placeholder="Masukkan penjelasan singkat panduan"
                multiline
                rows={3}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
              />

              <FormTextField
                name="videoUrl"
                control={control}
                label="URL Video (YouTube / Google Drive)"
                placeholder="Contoh: https://www.youtube.com/watch?v=... atau Google Drive URL"
                error={Boolean(errors.videoUrl)}
                helperText={errors.videoUrl?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlayCircleOutline color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Box>
                <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 1 }}>
                  Upload File Panduan (PDF / Dokumen)
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
                {selectedFile ? (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Terpilih: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </Typography>
                ) : (selectedGuide?.fileName || selectedGuide?.originalName || selectedGuide?.filename) ? (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    File saat ini: {selectedGuide.fileName || selectedGuide.originalName || selectedGuide.filename}
                  </Typography>
                ) : null}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseModal} color="inherit" disabled={createMutation.isPending || updateMutation.isPending}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Menyimpan..."
                : selectedGuide
                  ? "Simpan Perubahan"
                  : "Tambah Panduan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── DIALOG DELETE CONFIRMATION ── */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Hapus Panduan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Apakah Anda yakin ingin menghapus panduan{" "}
            <strong>"{guideToDelete?.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" disabled={deleteMutation.isPending}>
            Batal
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DIALOG PREVIEW MEDIA (YOUTUBE / DRIVE / PDF) ── */}
      <Dialog open={Boolean(previewGuide)} onClose={() => setPreviewGuide(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 2 }}>
          <Typography variant="h6" fontWeight={700} noWrap sx={{ maxWidth: "85%" }}>
            {previewGuide?.title}
          </Typography>
          <IconButton onClick={() => setPreviewGuide(null)} size="small">
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, bgcolor: "#000", minHeight: 420, display: "flex", flexDirection: "column" }}>
          {previewGuide && (() => {
            const fileUrl = previewGuide.url || previewGuide.fileUrl;
            const fileName = previewGuide.fileName || previewGuide.originalName || previewGuide.filename;
            const isYouTube = previewGuide.videoSource === "YOUTUBE" || (previewGuide.videoUrl && previewGuide.videoUrl.includes("youtube"));
            const isDrive = previewGuide.videoSource === "GOOGLE_DRIVE" || (previewGuide.videoUrl && previewGuide.videoUrl.includes("drive.google"));

            if (previewGuide.videoUrl && isYouTube) {
              const embedUrl = getYouTubeEmbedUrl(previewGuide.videoUrl);
              return embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={previewGuide.title}
                  style={{ width: "100%", height: 480, border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Box sx={{ p: 4, color: "#fff", textAlign: "center" }}>
                  <Typography>Link YouTube tidak valid atau tidak dapat di-embed.</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    component="a"
                    href={previewGuide.videoUrl}
                    target="_blank"
                    startIcon={<LaunchOutlined />}
                  >
                    Buka di YouTube
                  </Button>
                </Box>
              );
            }

            if (previewGuide.videoUrl && isDrive) {
              const embedUrl = getGoogleDriveEmbedUrl(previewGuide.videoUrl);
              return (
                <iframe
                  src={embedUrl || previewGuide.videoUrl}
                  title={previewGuide.title}
                  style={{ width: "100%", height: 480, border: "none" }}
                  allow="autoplay"
                  allowFullScreen
                />
              );
            }

            if (previewGuide.videoUrl) {
              return (
                <Box sx={{ p: 4, color: "#fff", textAlign: "center" }}>
                  <Typography sx={{ mb: 2 }}>Pratinjau video eksternal:</Typography>
                  <Button
                    variant="contained"
                    component="a"
                    href={previewGuide.videoUrl}
                    target="_blank"
                    startIcon={<LaunchOutlined />}
                  >
                    Buka Video di Tab Baru
                  </Button>
                </Box>
              );
            }

            if (fileUrl) {
              const isPdf = fileUrl.toLowerCase().endsWith(".pdf") || previewGuide.mimeType?.includes("pdf");
              const isImage =
                previewGuide.mimeType?.includes("image") ||
                /\.(png|jpe?g|gif|webp|svg)$/i.test(fileUrl);

              if (isPdf) {
                return (
                  <iframe
                    src={fileUrl}
                    title={previewGuide.title}
                    style={{ width: "100%", height: 500, border: "none" }}
                  />
                );
              }

              if (isImage) {
                return (
                  <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#111" }}>
                    <img src={fileUrl} alt={previewGuide.title} style={{ maxWidth: "100%", maxHeight: 500, objectFit: "contain" }} />
                  </Box>
                );
              }

              return (
                <Box sx={{ p: 6, color: "#fff", textAlign: "center" }}>
                  <InsertDriveFileOutlined sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>{fileName || "File Panduan"}</Typography>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.7 }}>
                    Tipe berkas ini tidak dapat dipratinjau langsung di browser.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component="a"
                    href={fileUrl}
                    target="_blank"
                    download
                    startIcon={<CloudDownloadOutlined />}
                  >
                    Unduh Berkas ({formatFileSize(previewGuide.fileSize ?? previewGuide.size ?? 0)})
                  </Button>
                </Box>
              );
            }

            return (
              <Box sx={{ p: 4, color: "#fff", textAlign: "center" }}>
                <Typography>Tidak ada media atau file untuk dipratinjau.</Typography>
              </Box>
            );
          })()}
        </DialogContent>
        {previewGuide?.description && (
          <Box sx={{ p: 2.5, bgcolor: "background.paper" }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              Deskripsi Materi:
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
              {previewGuide.description}
            </Typography>
          </Box>
        )}
      </Dialog>
    </Page>
  );
}
