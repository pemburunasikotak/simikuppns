import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
} from "@mui/material";
import {
  FolderOutlined,
  ExpandMore,
  ExpandLess,
  DescriptionOutlined,
  AddOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import useGetListIkuProker from "@/app/proker/manajemenProgram/_hooks/use-get-list-iku-proker";
import useGetAssignmentStructure from "../_hooks/use-get-assignment-structure";
import ModalAssignUnit from "./modal-assign-unit";

export default function StructureView() {
  const [selectedIkuId, setSelectedIkuId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignIndicatorId, setAssignIndicatorId] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState("2026");
  const [filterIku, setFilterIku] = useState("SEMUA");
  const [filterProgram, setFilterProgram] = useState("SEMUA");
  const [filterUnit, setFilterUnit] = useState("SEMUA");

  const { data: ikuResponse, isLoading: isLoadingIku } = useGetListIkuProker({
    page: 1,
    limit: 100,
  });

  const rawIkus = ikuResponse?.data?.items || [];
  const ikuTypes = Array.from(new Set(rawIkus.map(i => i.type).filter(Boolean)));
  const ikuUnits = Array.from(new Set(rawIkus.map(i => i.unit).filter(Boolean)));
  const filteredIkus = rawIkus.filter((iku) => {
    const matchType = filterIku === "SEMUA" || iku.type === filterIku;
    const matchUnit = filterUnit === "SEMUA" || iku.unit === filterUnit;
    return matchType && matchUnit;
  });
  useEffect(() => {
    if (filteredIkus.length > 0 && !selectedIkuId) {
      setSelectedIkuId(filteredIkus[0].id);
    }
  }, [filteredIkus, selectedIkuId]);
  const { data: structureResponse, isLoading: isLoadingStructure } = useGetAssignmentStructure({
    year: filterYear,
    ...(selectedIkuId && { ikuId: selectedIkuId }),
  });
  const structureItems = structureResponse?.items || structureResponse?.data?.items || [];
  const currentStructure = structureItems.find(item => item.iku?.id === selectedIkuId) || structureItems[0];
  const programs = currentStructure?.programs || [];
  const selectedIkuDetail = currentStructure?.iku || rawIkus.find(iku => iku.id === selectedIkuId);
  const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({});

  const toggleProgram = (id: string) => {
    setExpandedPrograms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetFilter = () => {
    setFilterYear("2026");
    setFilterIku("SEMUA");
    setFilterProgram("SEMUA");
    setFilterUnit("SEMUA");
  };

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2} sx={{ bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)', border: "1px solid #E0E0E0" }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.primary">Struktur IKU - Program - Indikator - Unit</Typography>
          <Typography variant="body2" color="text.secondary">Lihat struktur IKU, Program, Indikator dan Assignment ke Unit</Typography>
        </Box>
        <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center" >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel shrink>Tahun</InputLabel>
            <Select
              value={filterYear}
              label="Tahun"
              onChange={(e) => setFilterYear(e.target.value)}
              sx={{ bgcolor: 'white', borderRadius: 2, '.MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' } }}
              displayEmpty
            >
              <MenuItem value="2026">2026</MenuItem>
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel shrink>IKU</InputLabel>
            <Select
              value={filterIku}
              label="IKU"
              onChange={(e) => setFilterIku(e.target.value)}
              sx={{ bgcolor: 'white', borderRadius: 2, '.MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' } }}
              displayEmpty
            >
              <MenuItem value="SEMUA">SEMUA</MenuItem>
              {ikuTypes.map(t => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel shrink>Program</InputLabel>
            <Select
              value={filterProgram}
              label="Program"
              onChange={(e) => setFilterProgram(e.target.value)}
              sx={{ bgcolor: 'white', borderRadius: 2, '.MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' } }}
              displayEmpty
            >
              <MenuItem value="SEMUA">SEMUA</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel shrink>Unit</InputLabel>
            <Select
              value={filterUnit}
              label="Unit"
              onChange={(e) => setFilterUnit(e.target.value)}
              sx={{ bgcolor: 'white', borderRadius: 2, '.MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' } }}
              displayEmpty
            >
              <MenuItem value="SEMUA">SEMUA</MenuItem>
              {ikuUnits.map(u => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshOutlined />}
            onClick={handleResetFilter}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              color: 'primary.main',
              borderColor: 'primary.main',
              height: 40,
              px: 2
            }}
          >
            Reset Filter
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ border: "1px solid #E0E0E0", borderRadius: 2, height: '100%', overflow: 'hidden' }}>
            <Box p={2} borderBottom="1px solid #E0E0E0" display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">Daftar IKU</Typography>
              <Button size="small" startIcon={<AddOutlined />} sx={{ textTransform: 'none' }}>Tambah IKU</Button>
            </Box>
            <List component="nav" sx={{ p: 1, maxHeight: 600, overflowY: 'auto' }}>
              {isLoadingIku ? (
                <Box p={2} display="flex" justifyContent="center">
                  <CircularProgress size={24} />
                </Box>
              ) : filteredIkus.length === 0 ? (
                <Box p={2}>
                  <Typography variant="body2" color="textSecondary">Tidak ada data IKU yang cocok dengan filter</Typography>
                </Box>
              ) : (
                filteredIkus.map((iku) => (
                  <ListItemButton
                    key={iku.id}
                    selected={selectedIkuId === iku.id}
                    onClick={() => setSelectedIkuId(iku.id)}
                    sx={{ borderRadius: 1, mb: 0.5, bgcolor: selectedIkuId === iku.id ? 'primary.50' : 'transparent' }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FolderOutlined color={selectedIkuId === iku.id ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2" fontWeight={selectedIkuId === iku.id ? "bold" : "medium"}>{iku.name}</Typography>}
                      secondary={<Typography variant="caption" color="textSecondary" noWrap>{iku.description}</Typography>}
                    />
                  </ListItemButton>
                ))
              )}
            </List>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper elevation={0} sx={{ border: "1px solid #E0E0E0", borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedIkuDetail ? (
              <>
                <Box p={2} borderBottom="1px solid #E0E0E0" display="flex" justifyContent="space-between" alignItems="center" bgcolor="primary.50" sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box bgcolor="primary.main" color="white" p={1} borderRadius={1} display="flex" alignItems="center" justifyContent="center">
                      <FolderOutlined />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">{selectedIkuDetail.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{selectedIkuDetail.description}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" gap={2}>
                    <Box textAlign="center" bgcolor="white" p={1} borderRadius={1} border="1px solid #E0E0E0" minWidth={100}>
                      <Typography variant="caption" color="textSecondary" display="block">Total Program</Typography>
                      <Typography variant="h6" fontWeight="bold">{currentStructure?.totalPrograms || programs.length || 0}</Typography>
                    </Box>
                    <Box textAlign="center" bgcolor="white" p={1} borderRadius={1} border="1px solid #E0E0E0" minWidth={100}>
                      <Typography variant="caption" color="textSecondary" display="block">Total Indikator</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {currentStructure?.totalIndicators || programs.reduce((acc, curr) => acc + (curr.indicators?.length || 0), 0) || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box flexGrow={1} overflow="auto">
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell width="35%"><strong>Program / Indikator</strong></TableCell>
                          <TableCell width="35%"><strong>Deskripsi</strong></TableCell>
                          <TableCell width="30%"><strong>Assignment ke Unit</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isLoadingStructure ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                              <CircularProgress size={24} />
                            </TableCell>
                          </TableRow>
                        ) : programs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                              <Typography variant="body2" color="textSecondary">Belum ada program untuk IKU ini.</Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          programs.map((program, index) => {
                            const isExpanded = expandedPrograms[program.id];
                            return (
                              <React.Fragment key={program.id}>
                                <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => toggleProgram(program.id)}>
                                  <TableCell sx={{ borderBottom: 'none' }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      {isExpanded ? <ExpandMore fontSize="small" color="action" /> : <ExpandLess fontSize="small" color="action" />}
                                      <FolderOutlined fontSize="small" color="warning" />
                                      <Typography variant="body2" fontWeight="bold">{index + 1}. {program.title}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: 'none' }}>
                                    <Typography variant="body2" color="textSecondary">{program.description}</Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: 'none' }} />
                                </TableRow>
                                {isExpanded && program.indicators && program.indicators.length > 0 && program.indicators.map((indicator, indIndex) => (
                                  <TableRow key={indicator.id} sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell sx={{ pl: 6 }}>
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <DescriptionOutlined fontSize="small" color="primary" />
                                        <Typography variant="body2">{index + 1}.{indIndex + 1} {indicator.name}</Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" color="textSecondary">Satuan: {indicator.unit}</Typography>
                                    </TableCell>
                                    <TableCell>
                                      {indicator.isAssigned && indicator.assignedUnits && indicator.assignedUnits.length > 0 ? (
                                        <Box display="flex" gap={1} flexWrap="wrap">
                                          {indicator.assignedUnits.map((u, idx) => (
                                            <Chip
                                              key={idx}
                                              label={u.unitName}
                                              size="small"
                                              color="success"
                                              variant="outlined"
                                            />
                                          ))}
                                        </Box>
                                      ) : (
                                        <Box display="flex" gap={1} alignItems="center">
                                          <Chip
                                            label="Belum diassign ke unit"
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            sx={{ bgcolor: '#fff5f5' }}
                                          />
                                          <Button
                                            size="small"
                                            variant="text"
                                            sx={{ textTransform: 'none' }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setAssignIndicatorId(indicator.id);
                                              setAssignModalOpen(true);
                                            }}
                                          >
                                            Assign Unit
                                          </Button>
                                        </Box>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {isExpanded && (!program.indicators || program.indicators.length === 0) && (
                                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell colSpan={3} sx={{ pl: 6 }}>
                                      <Typography variant="caption" color="textSecondary" fontStyle="italic">Belum ada indikator</Typography>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            ) : (
              <Box p={4} display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="body1" color="textSecondary">Pilih IKU untuk melihat detail</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ModalAssignUnit
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        indicatorId={assignIndicatorId}
        ikuId={selectedIkuId}
        period={parseInt(filterYear, 10) || 2026}
      />
    </Box>
  );
}
