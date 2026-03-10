import {
  TTransactionFilter,
  TTransactionPaginateResponse,
} from "./type";
export const getListTransaction = (params: TTransactionFilter): Promise<TTransactionPaginateResponse> => {
  console.error('MASUK',params);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: {
      data: [
        {
          id: "1",
          name: "John Doe",
          no_whatapps: "1234567890",
          package: "Wedding Package A",
          event_date: "2023-10-01",
          updated_at: "2023-10-02T12:00:00Z",
          total: "1000000",
        },
        {
          id: "2",
          name: "Jane Smith",
          no_whatapps: "0987654321",
          package: "Wedding Package B",
          event_date: "2023-10-05",
          updated_at: "2023-10-03T15:30:00Z",
          total: "1500000",
        },
        {
          id: "3",
          name: "Alice Johnson",
          no_whatapps: "1122334455",
          package: "Wedding Package C",
          event_date: "2023-10-10",
          updated_at: "2023-10-04T09:45:00Z",
          total: "2000000",
        },
        {
          id: "4",
          name: "Bob Brown",
          no_whatapps: "5566778899",
          package: "Wedding Package D",
          event_date: "2023-10-15",
          updated_at: "2023-10-05T11:20:00Z",
          total: "2500000",
        },
        {
          id: "5",
          name: "Bob Brown1",
          no_whatapps: "5566778899",
          package: "Wedding Package D",
          event_date: "2023-10-15",
          updated_at: "2023-10-05T11:20:00Z",
          total: "2500000",
        },
      ],
      currentPage: 1,
      total: 10,
      totalPage: 4,
      hasPreviousPage: false,
      hasNextPage: true,
    },
  });
};