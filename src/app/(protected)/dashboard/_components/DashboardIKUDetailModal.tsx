import React, { useState, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography, Box,
  Grid, Card, CircularProgress, Tabs, Tab, TextField, InputAdornment,
  Chip, LinearProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SearchIcon from '@mui/icons-material/Search';
import { formatDateTimeWIB } from '@/utils/date';
import DataTable from '@/app/_components/ui/data-table';
import { GridColDef } from '@mui/x-data-grid';
import { TDashboardIKUDetailResponse, TProdiDetail, TFormulaDetail, TProdiComponentValue, TProdiStep } from '@/api/dashboard/type';

interface Props {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: boolean;
  data: TDashboardIKUDetailResponse | null | undefined;
}

const DashboardIKUDetailModal: React.FC<Props> = ({ open, onClose, loading, error, data }) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProdi, setSelectedProdi] = useState<TProdiDetail | null>(null);

  const formulas = useMemo(() => data?.result?.formulas || [], [data]);

  const result = data?.result

  // Set default active tab when data is loaded
  React.useEffect(() => {
    if (formulas.length > 0 && !activeTab) {
      setActiveTab(formulas[0].prodiLevel);
    }
  }, [formulas, activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('CEK', event)
    setActiveTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACHIEVED':
        return '#22c55e'; // Green
      case 'NOT_ACHIEVED':
        return '#ef4444'; // Red
      default:
        return '#f59e0b'; // Orange
    }
  };

  const currentLevelData = useMemo(() => {
    if (!activeTab || !formulas) return [];
    const formula = formulas.find((f: TFormulaDetail) => f.prodiLevel === activeTab);
    return formula?.prodis || [];
  }, [activeTab, formulas]);

  const filteredProdis = useMemo(() => {
    return currentLevelData.filter((prodi: TProdiDetail) =>
      prodi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prodi.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentLevelData, searchQuery]);

  const columns: GridColDef[] = [
    {
      field: 'no',
      headerName: 'No',
      width: 60,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.prodiId) + 1,
    },
    {
      field: 'name',
      headerName: 'Program Studi',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'level',
      headerName: 'Jenjang',
      width: 100,
    },
    {
      field: 'calculatedValue',
      headerName: 'Nilai AEE',
      width: 250,
      renderCell: (params) => {
        if (params.row.status === 'EXCLUDED') {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
              <Typography variant="body2" color="error">0,00 %</Typography>
            </Box>
          );
        }

        const value = params.value ?? 0;
        const color = value >= 80 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 70 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
              <Typography variant="body2" fontWeight={500}>
                {value.toFixed(2).replace('.', ',')} %
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(value, 100)}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                bgcolor: '#f1f5f9',
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 }
              }}
            />
          </Box>
        );
      },
    },
    {
      field: 'aksi',
      headerName: 'Aksi',
      width: 80,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => setSelectedProdi(params.row)}
          sx={{
            fontSize: '0.7rem',
            padding: '2px 10px',
            minWidth: 'auto',
            textTransform: 'none',
            borderRadius: 1.5,
            lineHeight: 1.5
          }}
        >
          Detail
        </Button>
      )
    }
  ];

  if (!open) return null;


  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3, bgcolor: '#f8fafc' } }}>
        <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#ffffff', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ bgcolor: '#3b82f6', color: 'white', px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 'bold' }}>
              {result?.iku?.code || '-'}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>
                {result?.iku?.name || 'Memuat...'}
              </Typography>
              {result && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, color: '#64748b' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">{result.period?.label} {result.period?.year}</Typography>
                  </Box>
                  <Typography variant="body2" color="primary">{result.iku?.type === 'IKU_UTAMA' ? 'IKU Utama' : 'IKU Spekta'}</Typography>
                  <Typography variant="body2">Unit: {result.iku?.unit === 'percentage' ? 'Persentase (%)' : result.iku?.unit}</Typography>
                </Box>
              )}
            </Box>
          </Box>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: '#94a3b8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : error || !result ? (
            <Typography color="error" textAlign="center" py={5}>Gagal memuat data detail IKU.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* SECTION 1: NILAI AKHIR */}
              <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none', mt: 2 }}>
                <Grid container spacing={3} >
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Nilai Akhir</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mt: 1 }}>
                      <Typography variant="h3" fontWeight="bold" sx={{ color: '#0f172a' }}>
                        {result.summary?.calculatedValue?.toFixed(2).replace('.', ',')} %
                      </Typography>
                      {result.summary?.status && (
                        <Chip
                          label={result.summary.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(result.summary.status),
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: 1
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: '#64748b' }}>
                      Target <br />
                      <strong style={{ color: '#0f172a' }}>{result.summary?.target?.toFixed(2).replace('.', ',')} %</strong>
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', borderLeft: { md: '1px solid #e2e8f0' }, pl: { md: 4 } }}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CalendarTodayIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">Dihitung pada</Typography>
                              <Typography variant="body2" fontWeight={500} sx={{ color: '#0f172a' }}>
                                {result.period?.calculatedAt ? formatDateTimeWIB(result.period.calculatedAt) : '-'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CalendarTodayIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">Evaluasi pada</Typography>
                              <Typography variant="body2" fontWeight={500} sx={{ color: '#0f172a' }}>
                                {result.period?.evaluatedAt ? formatDateTimeWIB(result.period.evaluatedAt) : '-'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CalculateIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">Versi Formula</Typography>
                              <Typography variant="body2" fontWeight={500} sx={{ color: '#0f172a' }}>
                                {result.period?.formulaVersion || '-'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* SECTION 2: PERHITUNGAN BERDASARKAN JENJANG */}
              {formulas && formulas.length > 0 && (
                <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalculateIcon sx={{ color: '#3b82f6' }} />
                    <Typography variant="h6" fontWeight="bold">Perhitungan Berdasarkan Jenjang</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Nilai diperoleh dari formula bertingkat dengan mengacu pada masing-masing jenjang.
                  </Typography>

                  <Grid container spacing={2}>
                    {formulas.map((formula: TFormulaDetail, idx: number) => {
                      const colors = [
                        { bg: '#f3e8ff', text: '#9333ea' }, // Purple
                        { bg: '#eff6ff', text: '#3b82f6' }, // Blue
                        { bg: '#dcfce7', text: '#16a34a' }, // Green
                        { bg: '#ffedd5', text: '#ea580c' }, // Orange
                      ];
                      const color = colors[idx % colors.length];

                      return (
                        <Grid size={{ xs: 12, md: 6, lg: 3 }} key={formula.formulaId}>
                          <Box sx={{
                            bgcolor: color.bg,
                            borderRadius: 2,
                            p: 2.5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ bgcolor: color.text, color: 'white', borderRadius: '50%', p: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AccountBalanceIcon sx={{ fontSize: 16 }} />
                              </Box>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: color.text }}>
                                {formula.formulaName}
                              </Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: color.text, mt: 1 }}>
                              {formula.result?.toFixed(2).replace('.', ',')} %
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Card>
              )}

              {/* SECTION 3: NILAI BERDASARKAN PROGRAM STUDI */}
              <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccountBalanceIcon sx={{ color: '#3b82f6' }} />
                  <Typography variant="h6" fontWeight="bold">Nilai Berdasarkan Program Studi</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Rincian nilai AEE untuk setiap program studi pada masing-masing jenjang.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 3, gap: 2 }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                      minHeight: 36,
                      '& .MuiTabs-indicator': { display: 'none' },
                      '& .MuiTab-root': {
                        minHeight: 36,
                        py: 0.5,
                        px: 3,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        mr: 1,
                        bgcolor: '#f1f5f9',
                        color: '#64748b',
                        '&.Mui-selected': {
                          bgcolor: '#3b82f6',
                          color: 'white',
                        }
                      }
                    }}
                  >
                    {formulas.map((f: TFormulaDetail) => (
                      <Tab key={f.prodiLevel} label={f.prodiLevel} value={f.prodiLevel} />
                    ))}
                  </Tabs>

                  <TextField
                    size="small"
                    placeholder="Cari program studi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 300 } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: 'white' }
                    }}
                  />
                </Box>

                <DataTable
                  rows={filteredProdis}
                  columns={columns}
                  getRowId={(row) => row.prodiId}
                  hidePagination={false}
                  sx={{
                    border: 0,
                    '& .MuiDataGrid-columnHeaders': {
                      bgcolor: '#f8fafc',
                      borderBottom: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid #f1f5f9',
                    },
                  }}
                />
              </Card>

            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* PRODI DETAIL DIALOG */}
      <Dialog
        open={Boolean(selectedProdi)}
        onClose={() => setSelectedProdi(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">Detail Program Studi</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedProdi?.code} - {selectedProdi?.name}
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedProdi(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProdi && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Component Values */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>Component Values</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Kode</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Nilai</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProdi.componentValues?.length ? (
                        selectedProdi.componentValues.map((comp: TProdiComponentValue, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{comp.code}</TableCell>
                            <TableCell>
                              <Chip size="small" label={comp.source} sx={{ bgcolor: '#f1f5f9' }} />
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{comp.value}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">Tidak ada data komponen</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Steps */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>Langkah Perhitungan (Steps)</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Seq</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ekspresi</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Hasil</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProdi.steps?.length ? (
                        selectedProdi.steps.map((step: TProdiStep, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{step.sequence}</TableCell>
                            <TableCell>
                              <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                {step.expression}
                              </code>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              {step.result?.toFixed(4).replace('.', ',')}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">Tidak ada langkah perhitungan</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardIKUDetailModal;
