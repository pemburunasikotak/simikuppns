import { FC, ReactElement, useState, useMemo, MouseEvent } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  AddOutlined,
  MoreVert,
  EditOutlined,
  DeleteOutlined,
  VisibilityOutlined,
  AssignmentTurnedInOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

import { TProkerProgram } from "@/api/proker/program/type";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useDeleteProgramIndicator from "../[id]/_hooks/use-delete-program-indicator";
import useModal from "@/app/_components/ui/modal";
import { useSnackbar } from "notistack";
import { DocumentCell } from "@/app/_components/ui";
import { formatRupiah } from "@/utils/commons";

interface ProgramItemCardProps {
  program: TProkerProgram;
  isExpanded: boolean;
  onToggle: () => void;
  isAdmin: boolean;
  onAddIndicator: (program: TProkerProgram) => void;
  onSetTarget: (program: TProkerProgram, indicator: TDefaultProgramIndicator) => void;
  onEditIndicator: (program: TProkerProgram, indicator: TDefaultProgramIndicator) => void;
  onDeleteIndicator?: (program: TProkerProgram, indicator: TDefaultProgramIndicator) => void;
  onEditProgram: (program: TProkerProgram) => void;
  onDeleteProgram: (program: TProkerProgram) => void;
}

const getStatusBg = (status?: string) => {
  switch (status) {
    case "ASSIGNED_TO_UNIT":
      return "#DCFCE7";
    case "IN_PROGRESS":
      return "#E0F2FE";
    case "SUBMITTED":
    case "INDICATOR_APPROVED":
      return "#FEF3C7";
    case "APPROVED":
    case "COMPLETED":
      return "#DCFCE7";
    case "REVISION":
    case "REJECTED":
    case "CANCELLED":
      return "#FEE2E2";
    default:
      return "#F1F5F9";
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "ASSIGNED_TO_UNIT":
      return "#16A34A";
    case "IN_PROGRESS":
      return "#0284C7";
    case "SUBMITTED":
    case "INDICATOR_APPROVED":
      return "#D97706";
    case "APPROVED":
    case "COMPLETED":
      return "#16A34A";
    case "REVISION":
    case "REJECTED":
    case "CANCELLED":
      return "#DC2626";
    default:
      return "#475569";
  }
};

/**
 * Ambil daftar nama PIC dari sebuah indikator.
 * Mendukung beberapa bentuk data:
 * - pics: [{ name }]
 * - pics: [{ user: { name } }]
 * - pics: [{ userName }] / [{ fullName }]
 * - pics: ["Nama"]
 * Catatan: respons API list indikator per-program hanya berisi { id, indicatorId, userId, createdAt }
 * tanpa nama. Agar nama tampil, backend perlu meng-include relasi user di `pics`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPicNames = (ind: any): string[] => {
  const rawPics = Array.isArray(ind?.pics)
    ? ind.pics
    : ind?.pics
      ? [ind.pics]
      : ind?.pic
        ? [ind.pic]
        : [];

  const names = rawPics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .flatMap((p: any) => {
      if (typeof p === "string") return [p];
      const n = p?.name ?? p?.user?.name ?? p?.userName ?? p?.fullName;
      return Array.isArray(n) ? n : [n];
    })
    .filter(Boolean) as string[];

  if (names.length > 0) return names;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const picName = (ind as any)?.picName ?? (ind as any)?.pic?.name;
  if (picName) return [picName];

  return [];
};

const renderPicChips = (ind: TDefaultProgramIndicator): ReactElement => {
  const names = getPicNames(ind);

  if (names.length === 0) {
    return (
      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#94A3B8" }}>
        -
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center" }}>
      {names.map((name, i) => (
        <Chip
          key={i}
          label={name}
          size="small"
          variant="outlined"
          sx={{
            fontSize: "11px",
            fontWeight: 600,
            height: "24px",
            borderRadius: "6px",
            bgcolor: "#F8FAFC",
            borderColor: "#E2E8F0",
            color: "#334155",
          }}
        />
      ))}
    </Box>
  );
};

export const ProgramItemCard: FC<ProgramItemCardProps> = ({
  program,
  isExpanded,
  onToggle,
  isAdmin,
  onAddIndicator,
  onSetTarget,
  onEditIndicator,
  onDeleteIndicator,
  onEditProgram,
  onDeleteProgram,
}): ReactElement => {
  const navigate = useNavigate();
  const modal = useModal();
  const { enqueueSnackbar } = useSnackbar();
  const deleteIndicatorMutation = useDeleteProgramIndicator();

  const handleDeleteIndicatorInternal = (indicator: TDefaultProgramIndicator) => {
    if (onDeleteIndicator) {
      onDeleteIndicator(program, indicator);
      return;
    }

    modal.confirm({
      title: "Hapus Indikator",
      description: `Apakah anda yakin ingin menghapus indikator "${indicator.name}"?`,
      icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
      onOk: () => {
        if (program.id && indicator.id) {
          deleteIndicatorMutation.mutate(
            { programId: program.id, id: indicator.id },
            {
              onSuccess: () => {
                enqueueSnackbar("Berhasil menghapus indikator", { variant: "success" });
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onError: (error: any) => {
                enqueueSnackbar(error?.response?.data?.message || "Gagal menghapus indikator", {
                  variant: "error",
                });
              },
            }
          );
        }
      },
    });
  };

  // Indikator langsung diambil dari data program
  const indicators: TDefaultProgramIndicator[] = useMemo(() => {
    return program.indicators || [];
  }, [program.indicators]);

  // Program menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const handleOpenMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  // Indicator item menu state
  const [indMenuAnchor, setIndMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedInd, setSelectedInd] = useState<TDefaultProgramIndicator | null>(null);

  const handleOpenIndMenu = (e: MouseEvent<HTMLElement>, ind: TDefaultProgramIndicator) => {
    e.stopPropagation();
    setSelectedInd(ind);
    setIndMenuAnchor(e.currentTarget);
  };

  const handleCloseIndMenu = () => {
    setIndMenuAnchor(null);
    setSelectedInd(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyProgram = program as any;
  const ikuBadge =
    anyProgram.ikuCode ||
    anyProgram.categoryName ||
    anyProgram.iku?.code ||
    anyProgram.category?.name ||
    (program.code?.startsWith("IKU") ? program.code.split("-")[0] : null);

  const handleIndicatorClick = (ind: TDefaultProgramIndicator) => {
    const isTargetEligible = ["ASSIGNED_TO_UNIT", "APPROVED", "SUBMITTED"].includes(ind.status || "");
    if (isTargetEligible) {
      onSetTarget(program, ind);
    } else if (ind.status === "IN_PROGRESS") {
      const masterUnitType = ind.masterUnitType;
      const unitType = typeof masterUnitType === "object" ? masterUnitType?.type : undefined;
      const queryStr = unitType ? `?type=${encodeURIComponent(unitType)}` : "";
      navigate(`/proker/program/${program.id}/indicator/${ind.id}${queryStr}`);
    } else {
      // Default: allow setting target or editing
      onSetTarget(program, ind);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #E2E8F0",
        mb: 2,
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        },
      }}
    >
      {/* ── Program Header Row ── */}
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 2.5 },
          py: 2,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Left: Chevron & Program Details */}
        <Box sx={{ display: "flex", alignItems: "center", flex: 1, mr: 2, minWidth: 0 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isExpanded ? "#E8F5E9" : "#F1F5F9",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            {isExpanded ? (
              <KeyboardArrowDown sx={{ color: "#16A34A", fontSize: 24 }} />
            ) : (
              <KeyboardArrowRight sx={{ color: "#64748B", fontSize: 24 }} />
            )}
          </Box>

          <Box sx={{ ml: 2, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "15px" },
                color: "#0F172A",
                lineHeight: 1.35,
                wordBreak: "break-word",
              }}
            >
              {program.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                fontSize: "12px",
                mt: 0.5,
                display: "block",
                wordBreak: "break-all",
              }}
            >
              Kode Program: {program.code}
            </Typography>
          </Box>
        </Box>

        {/* Center: IKU Badge */}
        {ikuBadge && (
          <Box sx={{ display: { xs: "none", md: "block" }, mx: 2, flexShrink: 0 }}>
            <Box
              sx={{
                bgcolor: "#EEF2FF",
                color: "#4F46E5",
                px: 1.6,
                py: 0.4,
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: 0.2,
                display: "inline-block",
              }}
            >
              {ikuBadge}
            </Box>
          </Box>
        )}

        {/* Right: Indicator Counter & Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          <Box
            sx={{
              bgcolor: "#E0F2FE",
              color: "#0284C7",
              px: 1.8,
              py: 0.5,
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {indicators.length} indikator
          </Box>

          <IconButton size="small" onClick={handleOpenMenu} sx={{ color: "#94A3B8" }}>
            <MoreVert fontSize="small" />
          </IconButton>

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleCloseMenu();
                navigate(`/proker/program/${program.id}`);
              }}
            >
              <ListItemIcon>
                <VisibilityOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Detail Program" />
            </MenuItem>
            {isAdmin && [
              <MenuItem
                key="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseMenu();
                  onEditProgram(program);
                }}
              >
                <ListItemIcon>
                  <EditOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Edit Program" />
              </MenuItem>,
              <MenuItem
                key="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseMenu();
                  onDeleteProgram(program);
                }}
              >
                <ListItemIcon>
                  <DeleteOutlined fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Hapus Program" sx={{ color: "error.main" }} />
              </MenuItem>,
            ]}
          </Menu>
        </Box>
      </Box>

      {/* ── Expanded Indicators Section ── */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            bgcolor: "#F4F8F6",
            borderTop: "1px solid #E2E8F0",
            p: { xs: 2, sm: 2.5 },
          }}
        >
          {/* Header inside expanded area */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#1E293B" }}>
              Daftar Indikator Program
            </Typography>

            <Button
              variant="outlined"
              size="small"
              startIcon={<AddOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onAddIndicator(program);
              }}
              sx={{
                borderColor: "#16A34A",
                color: "#16A34A",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "13px",
                px: 2,
                py: 0.6,
                bgcolor: "#ffffff",
                "&:hover": {
                  borderColor: "#15803D",
                  bgcolor: "rgba(22, 163, 74, 0.04)",
                },
              }}
            >
              Tambah Indikator
            </Button>
          </Box>

          {/* Indicators List */}
          {indicators.length === 0 ? (
            <Box
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "10px",
                p: 3,
                textAlign: "center",
                border: "1px dashed #CBD5E1",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Belum ada indikator untuk program ini.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {indicators.map((ind) => {
                const proposalDoc =
                  ind.proposalURL ||
                  ind.proposalDocument ||
                  ind.proposal ||
                  ind.propsal ||
                  ind.proposalDocumentId;
                const rabDoc =
                  ind.rabURL ||
                  ind.rabDocument ||
                  ind.rab ||
                  ind.rabDocumentId;

                const hasProposalDoc = Boolean(
                  proposalDoc &&
                  (typeof proposalDoc !== "string" || proposalDoc.trim() !== "") &&
                  (typeof proposalDoc !== "object" || Object.keys(proposalDoc).length > 0)
                );
                const hasRabDoc = Boolean(
                  rabDoc &&
                  (typeof rabDoc !== "string" || rabDoc.trim() !== "") &&
                  (typeof rabDoc !== "object" || Object.keys(rabDoc).length > 0)
                );

                return (
                <Box
                  key={ind.id}
                  onClick={() => handleIndicatorClick(ind)}
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    px: { xs: 1.5, sm: 2.5 },
                    py: 1.5,
                    display: "flex",
                    flexDirection: { xs: "column", md: "column" },
                    justifyContent: "space-between",
                    gap: 1.5,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      borderColor: "#16A34A",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {/* Row 1: Indicator Name (kiri) & Action Menu (kanan) */}
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ width: "100%" }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                      <Tooltip title="Klik untuk eksekusi indikator ini">
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#1E293B",
                            lineHeight: 1.4,
                          }}
                        >
                          {ind.name}
                        </Typography>
                      </Tooltip>
                    </Box>

                    {/* Action Menu (pojok kanan atas) */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenIndMenu(e, ind)}
                      sx={{ color: "#94A3B8", p: 0.5, flexShrink: 0 }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Stack>

                  {/* Row 2: Metadata (Kategori, Status, Unit, PIC) */}
                  <Stack
                    direction="row"
                    spacing={{ xs: 1.5, sm: 2.5 }}
                    alignItems="center"
                    sx={{ flexWrap: "wrap", rowGap: 1 }}
                  >
                    {/* Column 1: KATEGORI */}
                    <Box sx={{ minWidth: 70 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#94A3B8",
                          letterSpacing: 0.5,
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        KATEGORI
                      </Typography>
                      <Chip
                        label={ind.category || "TUSI"}
                        size="small"
                        sx={{
                          bgcolor: "#EEF2FF",
                          color: "#2563EB",
                          fontWeight: 700,
                          fontSize: "11px",
                          height: "24px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    {/* Column 2: STATUS */}
                    <Box sx={{ minWidth: 120 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#94A3B8",
                          letterSpacing: 0.5,
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        STATUS
                      </Typography>
                      <Chip
                        label={(ind.status || "ASSIGNED_TO_UNIT").replace(/_/g, " ")}
                        size="small"
                        sx={{
                          bgcolor: getStatusBg(ind.status),
                          color: getStatusColor(ind.status),
                          fontWeight: 700,
                          fontSize: "11px",
                          height: "24px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    {/* Column 3: Unit */}
                    <Box sx={{ minWidth: 120 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#94A3B8",
                          letterSpacing: 0.5,
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        UNIT
                      </Typography>
                      <Chip
                        label={
                          (typeof ind.unit === "object"
                            ? ind.unit?.name
                            : ind.unit) || "-"
                        }
                        size="small"
                        sx={{
                          bgcolor: "#EEF2FF",
                          color: "#2563EB",
                          fontWeight: 700,
                          fontSize: "11px",
                          height: "24px",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    {/* Column 4: PIC */}
                    <Box sx={{ textAlign: "left", minWidth: 110 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#94A3B8",
                          letterSpacing: 0.5,
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        PIC
                      </Typography>

                      {renderPicChips(ind)}
                    </Box>
                  </Stack>

                  {/* Row 3: Baris Target Q1 - Q4, Budget, TOR & RAB (Satu Baris Rapi) */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: { xs: 1.5, sm: 2 },
                      bgcolor: "#F8FAFC",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      px: 1.5,
                      py: 0.75,
                      mt: 0.5,
                    }}
                  >
                    {/* Target Q1 - Q4 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#64748B",
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                        }}
                      >
                        TARGET:
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Chip
                          label={`Q1: ${ind.targetQ1 ?? 0}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "11px",
                            fontWeight: 600,
                            height: "24px",
                            borderRadius: "6px",
                            borderColor: "#CBD5E1",
                            color: "#334155",
                            bgcolor: "#ffffff",
                          }}
                        />
                        <Chip
                          label={`Q2: ${ind.targetQ2 ?? 0}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "11px",
                            fontWeight: 600,
                            height: "24px",
                            borderRadius: "6px",
                            borderColor: "#CBD5E1",
                            color: "#334155",
                            bgcolor: "#ffffff",
                          }}
                        />
                        <Chip
                          label={`Q3: ${ind.targetQ3 ?? 0}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "11px",
                            fontWeight: 600,
                            height: "24px",
                            borderRadius: "6px",
                            borderColor: "#CBD5E1",
                            color: "#334155",
                            bgcolor: "#ffffff",
                          }}
                        />
                        <Chip
                          label={`Q4: ${ind.targetQ4 ?? 0}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "11px",
                            fontWeight: 600,
                            height: "24px",
                            borderRadius: "6px",
                            borderColor: "#CBD5E1",
                            color: "#334155",
                            bgcolor: "#ffffff",
                          }}
                        />
                      </Stack>
                    </Box>

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ height: 18, alignSelf: "center", borderColor: "#CBD5E1", display: { xs: "none", sm: "block" } }}
                    />

                    {/* Budget */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#64748B",
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                        }}
                      >
                        BUDGET:
                      </Typography>
                      {ind.budget ? (
                        <Chip
                          label={formatRupiah(ind.budget)}
                          size="small"
                          sx={{
                            bgcolor: "#F0FDF4",
                            color: "#16A34A",
                            fontWeight: 700,
                            fontSize: "11px",
                            height: "24px",
                            borderRadius: "6px",
                            border: "1px solid #BBF7D0",
                          }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#94A3B8" }}>
                          -
                        </Typography>
                      )}
                    </Box>

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ height: 18, alignSelf: "center", borderColor: "#CBD5E1", display: { xs: "none", sm: "block" } }}
                    />

                    {/* Dokumen: TOR & RAB */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        "& .MuiStack-root": { py: 0 },
                        "& .MuiStack-root > .MuiBox-root": {
                          height: "24px",
                          py: 0,
                          px: 1,
                          display: "flex",
                          alignItems: "center",
                          boxSizing: "border-box",
                        },
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#64748B",
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                        }}
                      >
                        DOKUMEN:
                      </Typography>

                      {/* TOR */}
                      {hasProposalDoc ? (
                        <DocumentCell
                          documents={[{ label: "TOR", doc: proposalDoc }]}
                          title={`TOR: ${ind.name}`}
                        />
                      ) : (
                        <Tooltip title="Belum ada dokumen TOR">
                          <Chip
                            label="TOR: -"
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              height: "24px",
                              borderRadius: "6px",
                              borderColor: "#E2E8F0",
                              color: "#94A3B8",
                              bgcolor: "#ffffff",
                            }}
                          />
                        </Tooltip>
                      )}

                      {/* RAB */}
                      {hasRabDoc ? (
                        <DocumentCell
                          documents={[{ label: "RAB", doc: rabDoc }]}
                          title={`RAB: ${ind.name}`}
                        />
                      ) : (
                        <Tooltip title="Belum ada dokumen RAB">
                          <Chip
                            label="RAB: -"
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              height: "24px",
                              borderRadius: "6px",
                              borderColor: "#E2E8F0",
                              color: "#94A3B8",
                              bgcolor: "#ffffff",
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Collapse>

      {/* ── Indicator Context Menu ── */}
      <Menu
        anchorEl={indMenuAnchor}
        open={Boolean(indMenuAnchor)}
        onClose={handleCloseIndMenu}
      >
        {["ASSIGNED_TO_UNIT", "APPROVED", "SUBMITTED"].includes(selectedInd?.status || "") && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleCloseIndMenu();
              if (selectedInd) onSetTarget(program, selectedInd);
            }}
          >
            <ListItemIcon>
              <AssignmentTurnedInOutlined fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Set Target" />
          </MenuItem>
        )}
        {selectedInd?.status === "IN_PROGRESS" && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleCloseIndMenu();
              const masterUnitType = selectedInd.masterUnitType;
              const unitType = typeof masterUnitType === "object" ? masterUnitType?.type : undefined;
              const queryStr = unitType ? `?type=${encodeURIComponent(unitType)}` : "";
              navigate(`/proker/program/${program.id}/indicator/${selectedInd.id}${queryStr}`);
            }}
          >
            <ListItemIcon>
              <TrendingUpOutlined fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText primary="Input Realisasi" />
          </MenuItem>
        )}
        {isAdmin && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleCloseIndMenu();
              if (selectedInd) onEditIndicator(program, selectedInd);
            }}
          >
            <ListItemIcon>
              <EditOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit Indikator" />
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleCloseIndMenu();
            if (selectedInd) {
              if (onDeleteIndicator) {
                onDeleteIndicator(program, selectedInd);
              } else {
                handleDeleteIndicatorInternal(selectedInd);
              }
            }
          }}
        >
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Hapus Indikator" sx={{ color: "error.main" }} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProgramItemCard;