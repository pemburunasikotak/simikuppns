import { FC, useState, useMemo } from "react";
import {
  Stack,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  Typography,
  Box,
  alpha,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { useFilter } from "@/app/_hooks/use-filter";
import TabPanel from "./tab-panel";
import useGetUnitPrograms from "../_hooks/use-get-unit-programs";
import { TUnitProgramItem } from "@/api/proker/unit/type";

interface ProgramTabProps {
  unitId: string;
  value: number;
  index: number;
}

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatValue = (value?: unknown) =>
  value !== null && value !== undefined && value !== "" ? String(value) : "-";

const ProgramTab: FC<ProgramTabProps> = ({ unitId, value, index }) => {
  const { filters, setFilter } = useFilter<Record<string, unknown>>();

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isLoading } = useGetUnitPrograms(unitId, selectedYear);

  const programsData = useMemo<TUnitProgramItem[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
      const r = data as Record<string, unknown>;
      if (Array.isArray(r.data)) return r.data as TUnitProgramItem[];
      if (r.data && typeof r.data === "object") {
        const d = r.data as Record<string, unknown>;
        if (Array.isArray(d.data)) return d.data as TUnitProgramItem[];
        if (Array.isArray(d.items)) return d.items as TUnitProgramItem[];
      }
      if (Array.isArray(r.items)) return r.items as TUnitProgramItem[];
    }
    return [];
  }, [data]);

  const filteredPrograms = useMemo(() => {
    if (!searchQuery.trim()) return programsData;
    const q = searchQuery.toLowerCase();
    return programsData.filter((item) => {
      const codeMatch = item.program.code?.toLowerCase().includes(q);
      const titleMatch = item.program.title?.toLowerCase().includes(q);
      const descMatch = item.program.description?.toLowerCase().includes(q);
      const objMatch = item.program.objective?.toLowerCase().includes(q);
      return codeMatch || titleMatch || descMatch || objMatch;
    });
  }, [programsData, searchQuery]);

  type TDataRow = TUnitProgramItem & { id: string };

  const rows: TDataRow[] = useMemo(() => {
    return filteredPrograms.map((item) => ({
      ...item,
      id: item.program.id,
    }));
  }, [filteredPrograms]);

  const columns: GridColDef<TDataRow>[] = [
    {
      field: "code",
      headerName: "Kode",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.program.code || "-"}
          size="small"
          sx={{
            backgroundColor: alpha("#1976d2", 0.08),
            color: "#1976d2",
            fontWeight: 700,
            borderRadius: "6px",
          }}
        />
      ),
    },
    {
      field: "title",
      headerName: "Nama Program",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {params.row.program.title}
          </Typography>
          {params.row.program.description && (
            <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ maxWidth: 300 }}>
              {params.row.program.description}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "objective",
      headerName: "Objective",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => formatValue(params.row.program.objective),
    },
    {
      field: "year",
      headerName: "Tahun",
      width: 90,
      renderCell: (params) => formatValue(params.row.program.year),
    },
    {
      field: "indikator",
      headerName: "Indikator",
      minWidth: 240,
      flex: 1.5,
      renderCell: (params) => {
        const indicators = params.row.indikator || [];
        if (indicators.length === 0) return <Typography variant="caption" color="text.secondary">-</Typography>;

        return (
          <Tooltip
            title={
              <Box sx={{ p: 0.5 }}>
                {indicators.map((ind, idx) => (
                  <Box key={ind.id || idx} sx={{ mb: 1, "&:last-child": { mb: 0 } }}>
                    <Typography variant="caption" fontWeight={700} display="block">
                      • {ind.name} ({ind.category || "TUSI"})
                    </Typography>
                    <Typography variant="caption" color="grey.300" display="block">
                      Target Q1: {ind.targetQ1 ?? 0} | Q2: {ind.targetQ2 ?? 0} | Q3: {ind.targetQ3 ?? 0} | Q4: {ind.targetQ4 ?? 0}
                    </Typography>
                    <Typography variant="caption" color="primary.light" display="block">
                      Anggaran: {formatCurrency(ind.budget)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            }
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%", overflow: "hidden" }}>
              {indicators.slice(0, 2).map((ind) => (
                <Chip
                  key={ind.id}
                  label={ind.name}
                  size="small"
                  variant="outlined"
                  sx={{ maxWidth: 140 }}
                />
              ))}
              {indicators.length > 2 && (
                <Chip
                  label={`+${indicators.length - 2}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
            </Stack>
          </Tooltip>
        );
      },
    },
    // {
    //   field: "actions",
    //   headerName: "Aksi",
    //   width: 100,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (params) => (
    //     <ActionButtonTable
    //       items={[
    //         {
    //           key: "detail",
    //           type: "detail",
    //           onClick: () => {
    //             navigate(`/proker/program/${params.row.program.id}`);
    //           },
    //         },
    //       ]}
    //     />
    //   ),
    // },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, 2026];
  const uniqueYears = Array.from(new Set(yearOptions)).sort((a, b) => b - a);

  return (
    <TabPanel value={value} index={index}>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            Daftar Program Unit
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              select
              size="small"
              label="Tahun"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              sx={{ minWidth: 120 }}
            >
              {uniqueYears.map((yr) => (
                <MenuItem key={yr} value={yr}>
                  {yr}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              placeholder="Cari program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 220 }}
            />
          </Stack>
        </Stack>

        <DataTable
          loading={isLoading}
          rows={rows}
          columns={columns}
          paginationInfo={createPaginationInfo({
            per_page: filters.limit ? Number(filters.limit) : 50,
            total: rows.length,
            page: filters.page ? Number(filters.page) : 1,
          })}
          handleChange={setFilter}
        />
      </Stack>
    </TabPanel>
  );
};

export default ProgramTab;
