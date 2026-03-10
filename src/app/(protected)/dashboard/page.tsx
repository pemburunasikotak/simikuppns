import { FC, ReactElement } from "react";
import { Page } from "@/app/_components/ui";
// import { TFacilitiesFilter } from "@/api/examples/type";
// import { useNavigate } from "react-router";
// import { useFilter } from "@/app/_hooks/use-filter";
import { Card, Grid, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

const Component: FC = (): ReactElement => {
  // const { signout } = useSession();
  // const navigate = useNavigate();
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // console.log("selectedIds", selectedIds);
  // const { filters } = useFilter<TFacilitiesFilter>();
  // const query = useGetListTransaction({
  //   sort_by: "created_at",
  //   order: filters.order || "DESC",
  //   limit: 10,
  //   page: filters.page || 1,
  // });

  // const handleLogout = () => {
  //   signout();
  // };

  // const columns: GridColDef<TFacilities>[] = [
  //   { field: "id", headerName: "ID Booking", width: 120 },
  //   { field: "customerName", headerName: "Nama Lengkap", width: 200 },
  //   { field: "customerWhatsapp", headerName: "No. Whatsapp", width: 200 },
  //   { field: "package", headerName: "Paket", minWidth: 200, flex: 1 },
  //   { field: "bookingDate", headerName: "Tanggal Acara", width: 200 },
  //   { field: "totalPrice", headerName: "Total Transaksi", width: 200 },
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
  //               navigate(generatePath(paths.transaction.edit, { id: params.row.id })),
  //           },
  //           {
  //             key: "delete",
  //             type: "delete",
  //             onClick: () => { },
  //           },
  //         ]}
  //       />
  //     ),
  //   },
  // ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const series = [
    { label: "Grafik Batang", data: [4, 1, 2, 3, 5, 6, 2, 4, 3, 5, 1, 6], color: "#D1FADF" },
  ];

  return (
    <Page>
      {/* <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Grafik Batang"
            value="Rp. 25.000.000"
            icon={<MonetizationOn />}
            iconBgColor="#27AE60"
            trendValue="20%"
            isUp={true}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Total Pengguna"
            value="100.000"
            icon={<ShoppingCart />}
            iconBgColor="#EB5757"
            trendValue="10%"
            isUp={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Total Vendor"
            value="1.000"
            icon={<Inventory2 />}
            iconBgColor="#F2C94C"
            trendValue="20%"
            isUp={true}
          />
        </Grid>
      </Grid> */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: 'column' }}>
          <Card style={{ padding: 10 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Grafik Batang</Typography>
            <BarChart
              xAxis={[
                {
                  data: months,
                  scaleType: "band",
                },
              ]}
              series={series}
              height={300}
              barLabel="value"
              borderRadius={4}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: 'column' }}>
          <Card style={{ padding: 10 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Chart PIE</Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "Chatering", color: "#6BCB77" },
                    { id: 1, value: 15, label: "Perlengkapan", color: "#4D96FF" },
                    { id: 2, value: 20, label: "Foto & Video", color: "#A66DD4" },
                    { id: 3, value: 25, label: "WO", color: "#FFD93D" },
                    { id: 4, value: 30, label: "Rias", color: "#FF6B57" },
                  ],
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 4,
                  cornerRadius: 8,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={400}
              height={330}
            />
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Component;
