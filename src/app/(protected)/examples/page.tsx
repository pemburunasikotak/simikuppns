import { FC, ReactElement } from "react";

import { Page } from "@/app/_components/ui";

// import { TFacilities, TFacilitiesFilter } from "@/api/master-data/facilities/type";

const Component: FC = (): ReactElement => {
  // const navigate = useNavigate();
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // const { filters, setFilter } = useFilter<TFacilitiesFilter>();
  // const query = useGetListFacilities({
  //   sort_by: "created_at",
  //   order: filters.order || "DESC",
  //   limit: 10,
  //   page: filters.page || 1,
  // });

  // const columns: GridColDef<TFacilities>[] = [
  //   { field: "id", headerName: "ID Fasilitas", width: 120 },
  //   { field: "name", headerName: "Nama Fasilitas", width: 200 },
  //   {
  //     field: "type",
  //     headerName: "Type Fasilitas",
  //     width: 300,
  //     renderCell: (params) => params.row.name,
  //   },
  //   {
  //     field: "actions",
  //     headerName: "Action",
  //     width: 150,
  //     sortable: false,
  //     filterable: false,
  //     renderCell: (params) => (
  //       <ActionButtonTable
  //         items={[
  //           {
  //             key: "edit",
  //             type: "edit",
  //             onClick: () =>
  //               navigate(generatePath(paths.master_data.facilities.edit, { id: params.row.id })),
  //           },
  //           {
  //             key: "delete",
  //             type: "delete",
  //             onClick: () => {},
  //           },
  //         ]}
  //       />
  //     ),
  //   },
  // ];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Master Data",
          path: null,
        },
        {
          label: "Fasilitas",
          path: null,
        },
      ]}
    // topPage={
    //   <Filter
    //     variants={["search"]}
    //     defaultValue={{
    //       search_value: filters.search_value,
    //     }}
    //     actions={[
    //       <Button
    //         key="add"
    //         variant="contained"
    //         startIcon={<AddOutlined />}
    //         onClick={() => navigate(paths.master_data.facilities.create)}
    //       >
    //         Tambah Fasilitas
    //       </Button>,
    //       ...(selectedIds.length
    //         ? [
    //             <Button key="delete" variant="outlined" startIcon={<DeleteOutlined />}>
    //               Delete
    //             </Button>,
    //           ]
    //         : []),
    //     ]}
    //   />
    // }
    >
      {/* <DataTable
        getRowId={(row: TFacilities) => row.id}
        loading={false}
        rows={query.data?.result.data}
        columns={columns}
        checkboxSelection
        paginationInfo={createPaginationInfo({
          per_page: 5,
          total: 10,
          page: 1,
        })}
        handleChange={setFilter}
        onRowSelectionModelChange={(ids) => setSelectedIds(ids)}
      /> */}
    </Page>
  );
};

export default Component;
