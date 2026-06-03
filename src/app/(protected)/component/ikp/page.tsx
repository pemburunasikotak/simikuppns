import React, { useState, useEffect, useMemo } from "react";
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
  Button,
  Tabs,
  Tab,
  Collapse,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  FolderOutlined,
  FolderOpenOutlined,
  Circle,
  SearchOutlined,
  SaveOutlined,
  UndoOutlined,
  InfoOutlined,
  InsertChartOutlined,
  HistoryOutlined,
  CalculateOutlined,
  ExtensionOutlined,
  ArrowForwardIosOutlined,
  KeyboardArrowDownOutlined,
  KeyboardArrowRightOutlined,
  ListAltOutlined,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { Page } from "@/app/_components/ui";

import useGetListComponent from "./_hooks/use-get-list-component";
import useGetComponentStructure from "./_hooks/use-get-component-structure";
import useGetComponentRealization from "./_hooks/use-get-component-realization";

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

interface TProdiRealizationItem {
  prodiId: string;
  prodiName: string;
  target: number;
  realization: number;
}

// ─── Mock Data Fallbacks ──────────────────────────────────────────────────────

const MOCK_COMPONENTS = [
  {
    id: "comp-ikp1",
    code: "IKP1",
    name: "Penguatan Kualitas Lulusan Pendidikan Tinggi",
    description: "Indikator Kinerja Program untuk penguatan kualitas lulusan perguruan tinggi",
    dataType: "number",
    sourceType: "manual",
    periodType: "yearly",
    hasBreakdown: false,
    ikus: []
  },
  {
    id: "comp-ikp1.2",
    code: "IKP1.2",
    name: "Jumlah mahasiswa aktif D3 - DC",
    description: "Jumlah mahasiswa aktif Program Studi Diploma 3 Teknik Perancangan dan Konstruksi Kapal (Double Degree)",
    dataType: "number",
    sourceType: "manual",
    periodType: "yearly",
    hasBreakdown: true,
    ikus: [
      {
        id: "iku-1.1",
        code: "IKU1.1",
        name: "Angka Efisiensi Edukasi perguruan tinggi (AEE PT)"
      },
      {
        id: "iku-1.3",
        code: "IKU1.3",
        name: "Persentase mahasiswa program Diploma yang berkegiatan di luar prodi"
      }
    ]
  },
  {
    id: "comp-ikp1.2.1",
    code: "IKP1.2.1",
    name: "Mendapat Pekerjaan Dengan Masa Tunggu < 6 Bulan, Gaji > 1,2x UMP",
    description: "Mengukur persentase lulusan D3 yang mendapat pekerjaan dalam waktu kurang dari 6 bulan dengan gaji di atas 1,2 kali UMP",
    dataType: "number",
    sourceType: "manual",
    periodType: "yearly",
    hasBreakdown: true,
    ikus: [
      {
        id: "iku-1.2",
        code: "IKU1.2",
        name: "Persentase lulusan D3/D4 yang langsung bekerja setelah lulus"
      }
    ]
  },
  {
    id: "comp-ikp1.2.2",
    code: "IKP1.2.2",
    name: "Mendapat Pekerjaan Dengan Masa tunggu < 1 thn , Gaji > 1,2x UMP",
    description: "Mengukur persentase lulusan D3 yang mendapat pekerjaan dalam waktu kurang dari 1 tahun dengan gaji di atas 1,2 kali UMP",
    dataType: "number",
    sourceType: "manual",
    periodType: "yearly",
    hasBreakdown: true,
    ikus: []
  },
  {
    id: "comp-ikp1.3",
    code: "IKP1.3",
    name: "Jumlah mahasiswa aktif D4",
    description: "Jumlah mahasiswa aktif program sarjana terapan (D4)",
    dataType: "number",
    sourceType: "manual",
    periodType: "yearly",
    hasBreakdown: true,
    ikus: [
      {
        id: "iku-1.3-d4",
        code: "IKU1.3",
        name: "Persentase mahasiswa program Sarjana Terapan yang berkegiatan di luar prodi"
      }
    ]
  },
  {
    id: "comp-ikp2",
    code: "IKP2",
    name: "Penguatan Kualitas Dosen Pendidikan Tinggi",
    description: "Indikator Kinerja Program untuk penguatan kualitas dosen dan tenaga pendidik",
    dataType: "number",
    sourceType: "manual",
    periodType: "yearly",
    hasBreakdown: false,
    ikus: []
  },
  {
    id: "comp-ikp2.1",
    code: "IKP2.1",
    name: "Jumlah dosen berkegiatan tridharma di luar kampus",
    description: "Dosen yang melaksanakan pengajaran, penelitian, atau pengabdian masyarakat di luar kampus",
    dataType: "number",
    sourceType: "manual",
    periodType: "yearly",
    hasBreakdown: true,
    ikus: [
      {
        id: "iku-2.1",
        code: "IKU2.1",
        name: "Persentase dosen berkegiatan di luar kampus"
      }
    ]
  }
];

const MOCK_PRODI_REALIZATIONS: TProdiRealizationItem[] = [
  { prodiId: "p1", prodiName: "D4 Teknik Keselamatan & Kesehatan Kerja (K3)", target: 120, realization: 110 },
  { prodiId: "p2", prodiName: "D4 Teknik Pengelasan", target: 100, realization: 95 },
  { prodiId: "p3", prodiName: "D4 Teknik Perancangan & Konstruksi Kapal", target: 100, realization: 90 },
  { prodiId: "p4", prodiName: "D4 Teknik Permesinan Kapal", target: 50, realization: 50 },
  { prodiId: "p5", prodiName: "D4 Teknik Perpipaan", target: 50, realization: 40 },
];

const IKPStructurePage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  // State
  const [selectedYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<{ id: string; code: string; name: string; type: "component" | "iku" }>({
    id: "comp-ikp1.2.1",
    code: "IKP1.2.1",
    name: "Mendapat Pekerjaan Dengan Masa Tunggu < 6 Bulan, Gaji > 1,2x UMP",
    type: "component"
  });
  const [activeTab, setActiveTab] = useState<number>(0);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "IKP1": true,
    "IKP1.2": true,
  });

  // Table form state for Prodi targets and realizations
  const [tableRows, setTableRows] = useState<TProdiRealizationItem[]>(MOCK_PRODI_REALIZATIONS);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Queries
  const { data: compListData, isLoading: isCompListLoading } = useGetListComponent({ limit: 100 });
  const { data: structData } = useGetComponentStructure(selectedNode.id, selectedYear);
  const { data: realizationData, isLoading: isRealizationLoading } = useGetComponentRealization(selectedNode.id, selectedYear);

  // Combine live data components and fallback mock
  const componentsList = useMemo(() => {
    const apiComponents = compListData?.result?.data || [];
    return apiComponents.length > 0 ? apiComponents : MOCK_COMPONENTS;
  }, [compListData]);

  // Construct hierarchy tree based on component code structure
  const treeData = useMemo(() => {
    const nodeMap: Record<string, TreeNode> = {};
    
    // 1. Create component nodes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentsList.forEach((comp: any) => {
      nodeMap[comp.code] = {
        id: comp.id,
        code: comp.code,
        name: comp.name,
        description: comp.description,
        type: "component",
        ikus: comp.ikus || [],
        children: []
      };
    });
    
    const roots: TreeNode[] = [];
    
    // 2. Link children to parents based on dot notation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentsList.forEach((comp: any) => {
      const node = nodeMap[comp.code];
      const code = comp.code;
      const lastDotIndex = code.lastIndexOf('.');
      
      if (lastDotIndex > 0) {
        const parentCode = code.substring(0, lastDotIndex);
        const parentNode = nodeMap[parentCode];
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // 3. Append related IKU metrics as sub-children (leaf nodes)
    const appendIkuLeaves = (node: TreeNode) => {
      if (node.ikus && node.ikus.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.ikus.forEach((iku: any) => {
          node.children.push({
            id: iku.id,
            code: iku.code,
            name: iku.name,
            type: "iku",
            children: []
          });
        });
      }
      node.children.forEach(appendIkuLeaves);
    };

    roots.forEach(appendIkuLeaves);

    // 4. Apply search query filter recursively
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
      
      return filterTree(roots);
    }
    
    return roots;
  }, [componentsList, searchQuery]);

  // Set initial selected node from first element if default is not available
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (componentsList.length > 0 && selectedNode.id === "comp-ikp1.2.1" && !componentsList.some((c: any) => c.id === "comp-ikp1.2.1")) {
      const first = componentsList[0];
      setSelectedNode({
        id: first.id,
        code: first.code,
        name: first.name,
        type: "component"
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsList]);

  // Sync details from structure or realization queries or load mock
  const activeComponentDetails = useMemo(() => {
    const liveDetails = structData?.result;
    if (liveDetails) return liveDetails;

    // Search inside mock components list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const foundMock = componentsList.find((c: any) => c.id === selectedNode.id);
    return foundMock || {
      id: selectedNode.id,
      code: selectedNode.code,
      name: selectedNode.name,
      description: "Informasi detail komponen indikator.",
      dataType: "number",
      sourceType: "manual",
      periodType: "yearly",
      hasBreakdown: true
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, [structData, selectedNode, componentsList]) as any;

  // Sync realization rows state
  useEffect(() => {
    const liveRealization = realizationData?.result;
    if (liveRealization && liveRealization.prodis && liveRealization.prodis.length > 0) {
      setTableRows(liveRealization.prodis);
    } else {
      // Return default mock rows
      setTableRows(MOCK_PRODI_REALIZATIONS);
    }
  }, [realizationData, selectedNode]);

  // Expand parent node helper
  const toggleExpand = (code: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  // Handle cell text edits in the target/realization inputs
  const handleInputChange = (index: number, field: "target" | "realization", val: string) => {
    const numericVal = parseFloat(val) || 0;
    setTableRows(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: numericVal
      };
      return next;
    });
  };

  // Perform calculations for target and realization sum total
  const totals = useMemo(() => {
    const totalTarget = tableRows.reduce((acc, row) => acc + row.target, 0);
    const totalRealization = tableRows.reduce((acc, row) => acc + row.realization, 0);
    const percentage = totalTarget > 0 ? (totalRealization / totalTarget) * 100 : 0;
    return {
      target: totalTarget,
      realization: totalRealization,
      percentage: parseFloat(percentage.toFixed(2))
    };
  }, [tableRows]);

  // Save edits form submission
  const handleSaveRows = async () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSaving(false);
      enqueueSnackbar(`Data Realisasi IKP untuk ${selectedNode.code} berhasil disimpan!`, { variant: "success" });
    }, 1000);
  };

  // Reset values to mock data
  const handleResetRows = () => {
    setTableRows(MOCK_PRODI_REALIZATIONS);
    enqueueSnackbar("Input berhasil di-reset ke data awal.", { variant: "info" });
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
            pr: 1,
            pl: level * 2 + 1,
            cursor: "pointer",
            borderRadius: "8px",
            my: 0.2,
            transition: "all 0.2s ease",
            borderLeft: isSelected ? "4px solid #6366f1" : "4px solid transparent",
            backgroundColor: isSelected 
              ? alpha("#6366f1", 0.08) 
              : "transparent",
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
            <Circle sx={{ fontSize: 10, mr: 1.5, color: "#3b82f6" }} />
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
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ color: isIku ? "#3b82f6" : "#6366f1", marginRight: 6 }}>{node.code}</span>
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
        <Box sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
            Struktur Komponen IKP
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualisasi struktur hierarki IKP dan input target capaian realisasi program studi.
          </Typography>
        </Box>
      }
    >
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {/* Left Side: Hierarchy Tree (Width 4/12) */}
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
                Struktur IKP
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Cari IKP / IKU..."
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
              {isCompListLoading ? (
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

            {/* Legend / Legenda */}
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
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "#94a3b8", width: 16, textAlign: "center" }}>
                    -
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#475569" }}>
                    Gray Dash: Belum Terisi (No Target / Realization)
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Right Side: Component Details and Input Grid (Width 8/12) */}
        <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>
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

            {/* Tabs & Tab Content */}
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* Tab Selector */}
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, val) => setActiveTab(val)}
                  sx={{
                    px: 2,
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      py: 2,
                    }
                  }}
                >
                  <Tab label="Input Realisasi" icon={<InsertChartOutlined fontSize="small" />} iconPosition="start" />
                  <Tab label="Riwayat Realisasi" icon={<HistoryOutlined fontSize="small" />} iconPosition="start" />
                  <Tab label="Struktur IKP" icon={<ListAltOutlined fontSize="small" />} iconPosition="start" />
                  <Tab label="Perhitungan" icon={<CalculateOutlined fontSize="small" />} iconPosition="start" />
                </Tabs>
              </Box>

              {/* Tab Panels */}
              <Box sx={{ p: 3 }}>
                {/* 1. INPUT REALISASI PANEL */}
                {activeTab === 0 && (
                  <Stack spacing={3}>
                    {/* Information alert box */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        bgcolor: alpha("#6366f1", 0.05),
                        border: `1px solid ${alpha("#6366f1", 0.1)}`,
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <InfoOutlined color="primary" sx={{ mt: 0.3 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e1b4b" }}>
                          Informasi Pengisian
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#475569", display: "block", mt: 0.5 }}>
                          Anda sedang mengedit nilai target dan realisasi program studi IKP tahun <strong>{selectedYear}</strong>. 
                          Capaian dan total akan terhitung secara otomatis. Jangan lupa menekan tombol "Simpan Realisasi" untuk menyimpan perubahan.
                        </Typography>
                      </Box>
                    </Box>

                    {/* Table View */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                      <Table size="medium">
                        <TableHead sx={{ bgcolor: "#f8fafc" }}>
                          <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#64748b", width: 60 }}>NO</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>PROGRAM STUDI</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#64748b", width: 140 }}>TARGET</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#64748b", width: 140 }}>REALISASI</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#64748b", width: 120 }}>CAPAIAN</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {isRealizationLoading ? (
                            <TableRow>
                              <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "8px" }} />
                              </TableCell>
                            </TableRow>
                          ) : tableRows.map((row, idx) => {
                            const percent = row.target > 0 ? (row.realization / row.target) * 100 : 0;
                            return (
                              <TableRow key={row.prodiId} sx={{ "&:hover": { bgcolor: "#fcfcfc" } }}>
                                <TableCell align="center" sx={{ fontWeight: 500, color: "#64748b" }}>
                                  {idx + 1}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                                  {row.prodiName}
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={row.target}
                                    onChange={(e) => handleInputChange(idx, "target", e.target.value)}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
                                      },
                                      width: 110,
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={row.realization}
                                    onChange={(e) => handleInputChange(idx, "realization", e.target.value)}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
                                      },
                                      width: 110,
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, color: percent >= 90 ? "#16a34a" : "#dc2626" }}>
                                  {percent.toFixed(2)}%
                                </TableCell>
                              </TableRow>
                            );
                          })}

                          {/* TOTAL ROW */}
                          <TableRow sx={{ bgcolor: "#fafbfd", borderTop: "2px solid #e2e8f0" }}>
                            <TableCell colSpan={2} sx={{ fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>
                              Total Capaian
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800, color: "#0f172a" }}>
                              {totals.target}
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800, color: "#0f172a" }}>
                              {totals.realization}
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800, color: totals.percentage >= 90 ? "#16a34a" : "#dc2626" }}>
                              {totals.percentage}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Actions Panel */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<UndoOutlined />}
                        onClick={handleResetRows}
                        sx={{
                          textTransform: "none",
                          borderRadius: "10px",
                          fontWeight: 700,
                          borderColor: "#cbd5e1",
                          color: "#64748b",
                        }}
                      >
                        Reset Data
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveOutlined />}
                        onClick={handleSaveRows}
                        disabled={isSaving}
                        sx={{
                          textTransform: "none",
                          borderRadius: "10px",
                          fontWeight: 700,
                          px: 4,
                          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
                        }}
                      >
                        {isSaving ? "Menyimpan..." : "Simpan Realisasi"}
                      </Button>
                    </Stack>
                  </Stack>
                )}

                {/* 2. RIWAYAT REALISASI PANEL */}
                {activeTab === 1 && (
                  <Stack spacing={2} sx={{ py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      Riwayat Pembaruan Realisasi
                    </Typography>
                    <Divider />
                    <Stack spacing={2} sx={{ pl: 1 }}>
                      {[
                        { date: "03 Juni 2026, 12:45", user: "Tjunian PPNS", desc: "Melakukan update realisasi target D4 Teknik Permesinan Kapal menjadi 50 orang." },
                        { date: "01 Juni 2026, 09:12", user: "Admin Jurusan", desc: "Memasukkan inisialisasi target untuk 5 program studi di tahun ajaran 2026." },
                        { date: "15 Mei 2026, 14:02", user: "Sistem Simiku", desc: "Melakukan sinkronisasi data dari portal data akademik pusat." }
                      ].map((log, i) => (
                        <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                          <Box sx={{ width: 10, height: 10, bgcolor: "#6366f1", borderRadius: "50%", mt: 0.6 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                              {log.date} • {log.user}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#334155", mt: 0.5 }}>
                              {log.desc}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                )}

                {/* 3. STRUKTUR IKP PANEL */}
                {activeTab === 2 && (
                  <Stack spacing={2} sx={{ py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      Visualisasi Hubungan Indikator Kinerja
                    </Typography>
                    <Divider />
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: "12px", bgcolor: "#fcfcfc" }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <ExtensionOutlined color="primary" />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          IKP Parent: {selectedNode.code}
                        </Typography>
                      </Stack>
                      <Box sx={{ pl: 3, borderLeft: "2px dashed #cbd5e1" }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Indikator Utama Terkait (IKU):
                        </Typography>
                        {activeComponentDetails.ikus && activeComponentDetails.ikus.length > 0 ? (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          activeComponentDetails.ikus.map((iku: any) => (
                            <Stack key={iku.id} direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                              <ArrowForwardIosOutlined sx={{ fontSize: 10, color: "#3b82f6" }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#3b82f6" }}>
                                {iku.code} - {iku.name}
                              </Typography>
                            </Stack>
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                            Tidak ada IKU terkait langsung.
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Stack>
                )}

                {/* 4. PERHITUNGAN PANEL */}
                {activeTab === 3 && (
                  <Stack spacing={2} sx={{ py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      Metode dan Rumus Perhitungan Capaian
                    </Typography>
                    <Divider />
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: "12px", bgcolor: "#f8fafc" }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
                        Formula Capaian Akhir:
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "monospace", fontSize: "1.1rem", color: "#6366f1", textAlign: "center", mb: 2 }}>
                        Capaian (%) = (Total Realisasi / Total Target) × 100%
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Keterangan:</strong>
                        <br />
                        - <strong>Total Realisasi</strong> adalah jumlah seluruh realisasi dari program studi yang memiliki data breakdown.
                        <br />
                        - <strong>Total Target</strong> adalah jumlah seluruh target dari program studi yang memiliki data breakdown.
                      </Typography>
                    </Paper>
                  </Stack>
                )}
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
};

export default IKPStructurePage;
