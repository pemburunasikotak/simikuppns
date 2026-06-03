import { FC, ReactElement } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import { useFilter } from "@/app/_hooks/use-filter";
import { Chip } from "@mui/material";
import dayjs from "dayjs";

import { TAuthUserItem, TGetUsersParams } from "@/api/user/type";
import useGetListUser from "./_hooks/use-get-list-user";

const Component: FC = (): ReactElement => {
  const { filters, setFilter } = useFilter<TGetUsersParams>();

  const query = useGetListUser({
    limit: filters.per_page ? Number(filters.per_page) : 10,
    page: filters.page ? Number(filters.page) : 1,
    search: filters.search,
  });

  const columns: GridColDef<TAuthUserItem>[] = [
    { field: "nip", headerName: "NIP", width: 150 },
    { field: "name", headerName: "Nama User", minWidth: 200, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    { field: "type", headerName: "Tipe", width: 130 },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? "Aktif" : "Nonaktif"}
          color={params.row.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Tanggal Dibuat",
      width: 180,
      renderCell: (params) => dayjs(params.row.createdAt).format("DD MMM YYYY HH:mm"),
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
          label: "User",
          path: null,
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari user..."}
          defaultValue={{
            search_value: filters.search || filters.search_value,
          }}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={query.data?.data || []}
        columns={columns}
        checkboxSelection
        paginationInfo={createPaginationInfo({
          per_page: filters.per_page ? Number(filters.per_page) : 10,
          total: query.data?.pagination?.total || 0,
          page: query.data?.pagination?.page || 1,
        })}
        handleChange={setFilter}
      />
    </Page>
  );
};

export default Component;
