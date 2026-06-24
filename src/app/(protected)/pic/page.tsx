import { FC, ReactElement } from "react";
import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import { useFilter } from "@/app/_hooks/use-filter";
import { TGetUsersParams, TPICItem } from "@/api/user/type";
import useGetListPic from "./_hooks/use-get-list-pic";
import { Chip, Box, Typography, Tooltip, Stack, alpha } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

const PicPage: FC = (): ReactElement => {
  const { filters, setFilter } = useFilter<TGetUsersParams>();

  const query = useGetListPic({
    limit: filters.per_page ? Number(filters.per_page) : 10,
    page: filters.page ? Number(filters.page) : 1,
    search: (filters.search_value as string) || (filters.search as string),
  });

  const columns: GridColDef<TPICItem>[] = [
    {
      field: "name",
      headerName: "Nama PIC",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "ikus",
      headerName: "IKU ditugaskan",
      minWidth: 250,
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        const ikus = params.row.ikus || [];
        if (ikus.length === 0) return <Typography variant="caption" color="text.secondary">-</Typography>;
        return (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: "4px", py: 1 }}>
            {ikus.map((iku) => (
              <Tooltip key={iku.id} title={iku.name} arrow>
                <Chip
                  label={iku.code}
                  size="small"
                  sx={{
                    backgroundColor: alpha("#1976d2", 0.08),
                    color: "#1976d2",
                    fontWeight: 600,
                    borderRadius: "4px",
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
        );
      },
    },
    {
      field: "components",
      headerName: "Komponen ditugaskan",
      minWidth: 300,
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        const components = params.row.components || [];
        if (components.length === 0) return <Typography variant="caption" color="text.secondary">-</Typography>;
        return (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: "4px", py: 1 }}>
            {components.map((comp) => {
              const label = comp.prodi ? `${comp.code} (${comp.prodi.name})` : comp.code;
              return (
                <Tooltip key={comp.id} title={comp.name} arrow>
                  <Chip
                    label={label}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: alpha("#2e7d32", 0.3),
                      color: "#2e7d32",
                      backgroundColor: alpha("#2e7d32", 0.04),
                      fontWeight: 500,
                      borderRadius: "4px",
                    }}
                  />
                </Tooltip>
              );
            })}
          </Stack>
        );
      },
    },
  ];

  return (
    <Page
      breadcrumbs={[
        {
          label: "User Management",
          path: null,
        },
        {
          label: "PIC",
          path: null,
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"PIC..."}
          defaultValue={{
            search_value: filters.search || filters.search_value,
          }}
          debounceDelay={1000}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={query.data?.result?.data || []}
        columns={columns}
        getRowHeight={() => "auto"}
        paginationInfo={createPaginationInfo({
          per_page: filters.per_page ? Number(filters.per_page) : 10,
          total: query.data?.result?.total || 0,
          page: query.data?.result?.currentPage || 1,
        })}
        handleChange={setFilter}
      />
    </Page>
  );
};

export default PicPage;
