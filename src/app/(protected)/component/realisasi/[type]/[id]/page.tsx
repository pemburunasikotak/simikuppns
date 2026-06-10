"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  Skeleton,
  TextField,
  Collapse,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  FolderOutlined,
  FolderOpenOutlined,
  Circle,
  SearchOutlined,
  InfoOutlined,
  KeyboardArrowDownOutlined,
  KeyboardArrowRightOutlined,
  ArrowBackOutlined,
  SchoolOutlined,
  AnalyticsOutlined,
  CalendarTodayOutlined,
  TrendingUpOutlined,
  TagOutlined,
} from "@mui/icons-material";
import { Page } from "@/app/_components/ui";

import useGetComponentStructure from "../../../ikp/_hooks/use-get-component-structure";
import useGetMetricDetail from "../../../_hooks/use-get-metric-detail";
import useUpdateComponentRealization from "../../../_hooks/use-update-component-realization";
import RealizationDialog from "../../../view/[type]/[id]/_components/RealizationDialog";
import { TMetricYearData, TMetricTag } from "@/api/master/metrics/type";
import { TComponentStructureItem } from "@/api/master/component/type";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface TreeNode {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "component" | "iku";
  ikus?: Array<{ id: string; code: string; name: string }>;
  children: TreeNode[];
}

const RealisasiBreakdownPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  // State
  const [selectedYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<{ id: string; code: string; name: string; type: "component" | "iku" }>({
    id: id || "",
    code: "",
    name: "",
    type: (type as "component" | "iku") || "component"
  });
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Realization Dialog State
  const [selectedYearData, setSelectedYearData] = useState<TMetricYearData | null>(null);
  const [selectedRealizationId, setSelectedRealizationId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isProdiSelected = selectedNode.type === "iku";
  const compositeId = isProdiSelected ? `${id}_${selectedNode.id}` : "";

  // Queries
  const { data: structData, isLoading: isTreeLoading } = useGetComponentStructure(id || "", selectedYear);
  const { data: detailData, isLoading: isDetailLoading } = useGetMetricDetail("component", compositeId);
  const updateMutation = useUpdateComponentRealization();

  const handleRowClick = (yearData: TMetricYearData) => {
    setSelectedYearData(yearData);
    setSelectedRealizationId(yearData.realizations?.[0]?.id || null);
    setSelectedMonth(null);
    setIsDialogOpen(true);
  };

  const handleRowClickMonth = (realizationId: string | null, yearData: TMetricYearData, month: number) => {
    setSelectedRealizationId(realizationId);
    setSelectedYearData(yearData);
    setSelectedMonth(month);
    setIsDialogOpen(true);
  };

  // Synchronize URL parameters with selected node and expand parent nodes
  useEffect(() => {
    const rootData = structData?.result;
    if (rootData && id) {
      if (String(selectedNode.id) === String(id) && !selectedNode.code) {
        setSelectedNode({
          id: rootData.id,
          code: rootData.code,
          name: rootData.name,
          type: "component"
        });

        // Auto-expand the root node code
        if (rootData.code) {
          setExpandedNodes({ [rootData.code]: true });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structData, id]);

  // Construct hierarchy tree based on root component and its breakdown prodis
  const treeData = useMemo(() => {
    const rootData = structData?.result;

    if (!rootData) return [];

    const children: TreeNode[] = [];

    if (rootData.breakdown && rootData.breakdown.length > 0) {
      rootData.breakdown.forEach((item) => {
        if (item.prodi) {
          children.push({
            id: item.prodi.id,
            code: item.prodi.code || "",
            name: item.prodi.name || "",
            type: "iku", // Rendered as leaf nodes (blue circle)
            children: []
          });
        }
      });
    }

    const rootTreeNode: TreeNode = {
      id: rootData.id,
      code: rootData.code,
      name: rootData.name,
      description: rootData.description,
      type: "component",
      children
    };

    // Apply search query filter if present
    if (searchQuery.trim()) {
      const filterTree = (nodes: TreeNode[]): TreeNode[] => {
        return nodes
          .map(node => {
            const filteredChildren = filterTree(node.children);
            const matchesSearch =
              node.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              node.name.toLowerCase().includes(searchQuery.toLowerCase());

            if (matchesSearch || filteredChildren.length > 0) {
              return {
                ...node,
                children: filteredChildren
              };
            }
            return null;
          })
          .filter((n): n is TreeNode => n !== null);
      };

      return filterTree([rootTreeNode]);
    }

    return [rootTreeNode];
  }, [structData, searchQuery]);

  // Sync details from structure or realization queries
  const activeComponentDetails = useMemo<Partial<TComponentStructureItem>>(() => {
    const liveDetails = structData?.result;
    if (liveDetails) return liveDetails;

    return {
      id: id || "",
      code: "",
      name: "",
      description: "Informasi detail komponen indikator.",
      dataType: "number",
      sourceType: "manual",
      periodType: "yearly",
      hasBreakdown: true
    };
  }, [structData, id]);

  // Expand parent node helper
  const toggleExpand = (code: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };



  // Recursive Tree Node Renderer
  const renderTreeItem = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes[node.code] || false;
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode.id === node.id && selectedNode.type === node.type;
    const isIku = node.type === "iku";

    return (
      <Box key={node.id} sx={{ display: "block" }}>
        <Stack
          direction="row"
          alignItems="center"
          onClick={() => {
            if (hasChildren && !isIku) {
              toggleExpand(node.code);
            }
            setSelectedNode({
              id: node.id,
              code: node.code,
              name: node.name,
              type: node.type
            });
          }}
          sx={{
            py: 1,
            pr: 2,
            pl: level * 2 + 1,
            cursor: "pointer",
            borderRadius: "8px",
            my: 0.2,
            transition: "all 0.2s ease",
            borderLeft: isSelected ? "4px solid #6366f1" : "4px solid transparent",
            backgroundColor: isSelected
              ? alpha("#6366f1", 0.08)
              : "transparent",
            width: "max-content",
            minWidth: "100%",
            "&:hover": {
              backgroundColor: isSelected
                ? alpha("#6366f1", 0.12)
                : alpha("#000", 0.03),
            }
          }}
        >
          {/* Collapse Indicator */}
          {hasChildren ? (
            <IconButton size="small" sx={{ p: 0.5, mr: 0.5, color: "#64748b" }}>
              {isExpanded ? (
                <KeyboardArrowDownOutlined fontSize="small" />
              ) : (
                <KeyboardArrowRightOutlined fontSize="small" />
              )}
            </IconButton>
          ) : (
            <Box sx={{ width: 28 }} />
          )}

          {/* Icon indicator */}
          {isIku ? (
            <SchoolOutlined sx={{ fontSize: 18, mr: 1, color: "#3b82f6" }} />
          ) : isExpanded ? (
            <FolderOpenOutlined sx={{ fontSize: 18, mr: 1, color: "#f59e0b" }} />
          ) : (
            <FolderOutlined sx={{ fontSize: 18, mr: 1, color: "#f59e0b" }} />
          )}

          {/* Label Code & Name */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: isSelected || !isIku ? 700 : 400,
              color: isIku ? "#475569" : "#1e293b",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: isIku ? "#3b82f6" : "#6366f1", marginRight: 6 }}>
              {node.code} {node.code && node.name ? "-" : ""}
            </span>
            {node.name}
          </Typography>
        </Stack>

        {/* Children node list */}
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ display: "block" }}>
              {node.children.map(child => renderTreeItem(child, level + 1))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Page
      topPage={
        <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 1 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <ArrowBackOutlined />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Struktur Komponen Realisasi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visualisasi struktur hierarki komponen dan input target capaian realisasi program studi.
            </Typography>
          </Box>
        </Stack>
      }
    >
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {/* Left Side: Hierarchy Tree */}
        <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 200px)",
              minHeight: 500,
            }}
          >
            {/* Header / Search */}
            <Box sx={{ p: 2, borderBottom: "1px solid #f1f5f9" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1e293b", mb: 1.5 }}>
                Struktur Komponen
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Cari Komponen / IKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined fontSize="small" sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Box>

            {/* Tree Area */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
              {isTreeLoading ? (
                <Stack spacing={1}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="50%" />
                </Stack>
              ) : treeData.length > 0 ? (
                treeData.map(node => renderTreeItem(node))
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada komponen ditemukan.
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Legend */}
            <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9", bgcolor: "#f8fafc", borderRadius: "0 0 16px 16px" }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", display: "block", mb: 1 }}>
                LEGENDA
              </Typography>
              <Stack spacing={0.8}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <FolderOutlined sx={{ fontSize: 16, color: "#f59e0b" }} />
                  <Typography variant="caption" sx={{ color: "#475569" }}>
                    Orange Folder: Agregasi (Aggregated Parent)
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Circle sx={{ fontSize: 8, color: "#3b82f6" }} />
                  <Typography variant="caption" sx={{ color: "#475569" }}>
                    Blue Circle: Input Langsung (Direct Leaf Node)
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Right Side: Component Details and Input Grid */}
        <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>
          {!isProdiSelected ? (
            <Stack spacing={3}>
              {/* Header Summary Card */}
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "linear-gradient(to right, #ffffff, #fafbfd)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      label={activeComponentDetails.code}
                      sx={{
                        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                        color: "white",
                        fontWeight: 700,
                        borderRadius: "8px",
                        px: 0.5,
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      {activeComponentDetails.name}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, mb: 3 }}>
                    {activeComponentDetails.description || "Tidak ada deskripsi detail untuk komponen ini."}
                  </Typography>

                  {/* Metadata cards */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ p: 1.8, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Tipe
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          {activeComponentDetails.sourceType || "Manual"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ p: 1.8, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Periode
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          {activeComponentDetails.periodType || "Tahunan"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ p: 1.8, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Satuan
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          {activeComponentDetails.dataType === "number" ? "Persentase (%)" : "Orang / Unit"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ p: 1.8, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Breakdown Prodi
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: activeComponentDetails.hasBreakdown ? "#22c55e" : "#64748b" }}>
                          {activeComponentDetails.hasBreakdown ? "Aktif" : "Tidak"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Placeholder instruction card */}
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <IconButton sx={{ backgroundColor: alpha("#6366f1", 0.08), color: "#6366f1", p: 2, cursor: "default", "&:hover": { backgroundColor: alpha("#6366f1", 0.08) } }}>
                    <SchoolOutlined sx={{ fontSize: 40 }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    Pilih Program Studi
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "450px" }}>
                    Komponen ini memiliki breakdown per program studi. Silakan pilih salah satu Program Studi dari pohon struktur di sebelah kiri untuk melihat detail dan mengisi realisasinya.
                  </Typography>
                </Box>
              </Card>
            </Stack>
          ) : isDetailLoading ? (
            <Stack spacing={3}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "16px" }} />
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "16px" }} />
            </Stack>
          ) : (
            <Stack spacing={3}>
              {/* Prodi Detail Card */}
              {(() => {
                const metric = detailData?.result?.metric;
                const yearsData = detailData?.result?.data || [];
                return (
                  <>
                    <Card
                      sx={{
                        borderRadius: "16px",
                        border: "1px solid rgba(0,0,0,0.05)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        background: "#fff",
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, md: 8 }}>
                            <Stack spacing={2}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Chip
                                  label={metric?.code}
                                  sx={{
                                    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                    color: "white",
                                    fontWeight: 700,
                                    borderRadius: "8px",
                                    px: 1,
                                  }}
                                />
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                                  {metric?.name}
                                </Typography>
                              </Stack>
                              <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                                {metric?.description}
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {metric?.tags?.map((tag: TMetricTag) => (
                                  <Chip
                                    key={tag.id}
                                    label={tag.name}
                                    size="small"
                                    icon={<TagOutlined sx={{ fontSize: "14px !important" }} />}
                                    sx={{
                                      backgroundColor: alpha(tag.color || "#6366f1", 0.1),
                                      color: tag.color || "#6366f1",
                                      fontWeight: 600,
                                      borderRadius: "6px",
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Stack>
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={2}>
                              <Box sx={{ p: 2, borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <AnalyticsOutlined color="primary" fontSize="small" />
                                    <Typography variant="body2" color="text.secondary">Tipe</Typography>
                                  </Stack>
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{metric?.type || "-"}</Typography>
                                </Stack>
                                <Divider sx={{ my: 1.5, opacity: 0.5 }} />
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarTodayOutlined color="warning" fontSize="small" />
                                    <Typography variant="body2" color="text.secondary">Periode</Typography>
                                  </Stack>
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{metric?.periodType || "-"}</Typography>
                                </Stack>
                                <Divider sx={{ my: 1.5, opacity: 0.5 }} />
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <InfoOutlined color="info" fontSize="small" />
                                    <Typography variant="body2" color="text.secondary">Satuan</Typography>
                                  </Stack>
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{metric?.unit || "-"}</Typography>
                                </Stack>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    {/* Realization Table */}
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          borderBottom: "1px solid #f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1.5,
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <TrendingUpOutlined color="primary" />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Data Realisasi & Target (Prodi)
                          </Typography>
                        </Stack>
                      </Box>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                            <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>TAHUN</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>
                              {metric?.periodType?.toLowerCase() === "bulanan" || metric?.periodType?.toLowerCase() === "monthly" ? "REALISASI BULANAN" : "REALISASI TAHUNAN"}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {yearsData.length > 0 ? (
                            yearsData.map((yearData: TMetricYearData) => {
                              const isMonthly = metric?.periodType?.toLowerCase() === "bulanan" || metric?.periodType?.toLowerCase() === "monthly";
                              return (
                                <TableRow
                                  key={yearData.year}
                                  sx={{
                                    "&:hover": { backgroundColor: "#f8fafc", cursor: "pointer" },
                                    transition: "background-color 0.2s"
                                  }}
                                >
                                  <TableCell sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e293b" }}>
                                    {yearData.year}
                                  </TableCell>

                                  <TableCell onClick={() => !isMonthly && handleRowClick(yearData)}>
                                    {isMonthly ? (
                                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", py: 1 }}>
                                        {Array.from({ length: 12 }, (_, i) => {
                                          const monthNum = i + 1;
                                          const realization = yearData.realizations.find(r => r.month === monthNum);
                                          const idRealization = realization?.id || null;
                                          const val = realization ? Number(realization.value) : 0;
                                          return (
                                            <Box
                                              key={monthNum}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRowClickMonth(idRealization, yearData, monthNum);
                                              }}
                                              sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: 48,
                                                height: 48,
                                                borderRadius: "10px",
                                                backgroundColor: val > 0 ? alpha("#6366f1", 0.1) : "#f8fafc",
                                                border: "1px solid",
                                                borderColor: val > 0 ? alpha("#6366f1", 0.3) : "#e2e8f0",
                                                cursor: "pointer",
                                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                                "&:hover": {
                                                  transform: "translateY(-2px)",
                                                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
                                                  borderColor: "#6366f1",
                                                  backgroundColor: alpha("#6366f1", 0.15),
                                                },
                                                "&:active": {
                                                  transform: "translateY(0)",
                                                }
                                              }}
                                            >
                                              <Typography
                                                variant="caption"
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  color: val > 0 ? "#6366f1" : "#94a3b8",
                                                  fontWeight: 700,
                                                  lineHeight: 1
                                                }}
                                              >
                                                {monthNum}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  fontWeight: 800,
                                                  color: val > 0 ? "#1e1b4b" : "#cbd5e1",
                                                  mt: 0.2
                                                }}
                                              >
                                                {val}
                                              </Typography>
                                            </Box>
                                          );
                                        })}
                                      </Stack>
                                    ) : (
                                      <Stack>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {yearData.realizations.map(item => item.value).join(', ') || "-"}
                                        </Typography>
                                      </Stack>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                <Typography color="text.secondary">Belum ada data realisasi untuk prodi ini.</Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Dialog for updating */}
                    <RealizationDialog
                      open={isDialogOpen}
                      onClose={() => setIsDialogOpen(false)}
                      yearData={selectedYearData}
                      idComponent={selectedRealizationId || compositeId || ""}
                      updateRealization={updateMutation}
                      metricType={metric?.periodType || ""}
                      selectedMonth={selectedMonth}
                      prodiId={selectedNode.id}
                      dataType={metric?.dataType || ""}
                      type={metric?.type}
                      unit={metric?.unit}
                    />
                  </>
                );
              })()}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Page>
  );
};

export default RealisasiBreakdownPage;
