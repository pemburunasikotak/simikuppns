import { FC, ReactElement, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import useGetListIkuProker from "./_hooks/use-get-list-iku-proker";
import { TProkerIku } from "@/api/proker/manajemenProgram/type";

import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { useFilter } from "@/app/_hooks/use-filter";

const ManajemenProgramPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { filters: filter, setFilter } = useFilter<{
    page?: number;
    per_page?: number;
    search?: string;
    search_value?: string;
  }>();

  const isSearching = Boolean(filter.search || filter.search_value);

  const { data, isLoading } = useGetListIkuProker({
    page: isSearching ? 1 : (filter.page ? Number(filter.page) : 1),
    limit: filter.per_page ? Number(filter.per_page) : 10,
    search: filter.search || filter.search_value || undefined,
  });

  const rawItems = data?.data?.items || [];

  const filteredRows = useMemo(() => {
    const searchVal = (filter.search || filter.search_value || "").trim().toLowerCase();
    if (!searchVal) return rawItems;
    return rawItems.filter(
      (item) =>
        item.code?.toLowerCase().includes(searchVal) ||
        item.name?.toLowerCase().includes(searchVal) ||
        item.description?.toLowerCase().includes(searchVal) ||
        item.type?.toLowerCase().includes(searchVal)
    );
  }, [rawItems, filter.search, filter.search_value]);

  const totalItems = useMemo(() => {
    if (isSearching) {
      const rawCount = rawItems.length;
      if (filteredRows.length < rawCount) {
        return filteredRows.length;
      }
      return data?.data?.pagination?.totalItems || filteredRows.length;
    }
    return data?.data?.pagination?.totalItems || 0;
  }, [isSearching, rawItems.length, filteredRows.length, data?.data?.pagination?.totalItems]);

  const columns: GridColDef<TProkerIku>[] = [
    { field: "code", headerName: "Kode IKU", minWidth: 150, flex: 0.5 },
    { field: "name", headerName: "Nama Indikator", minWidth: 200, flex: 1 },
    { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
    { field: "type", headerName: "Tipe", width: 150 },
    {
      field: "actions",
      headerName: "Aksi",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const actionItems = [
          {
            key: "detail",
            type: "detail" as const,
            onClick: () => {
              navigate(`/proker/manajemenProgram/${params.row.id}`);
            },
          },
        ];
        return <ActionButtonTable items={actionItems} />;
      },
    },
  ];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Proker",
          path: "/proker",
        },
        {
          label: "Manajemen Program",
          path: "/proker/manajemenProgram",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Program..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
        />
      }
    >
      <DataTable
        loading={isLoading}
        rows={filteredRows}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: filter.per_page ? Number(filter.per_page) : 10,
          total: totalItems,
          page: isSearching ? 1 : (data?.data?.pagination?.page || 1),
        })}
        handleChange={(pagination) => {
          setFilter({
            ...pagination,
            search: undefined,
            search_value: undefined,
          });
        }}
      />
    </Page>
  );
};

export default ManajemenProgramPage;
