import { DataTableProps } from "@/app/_components/ui/data-table";

export const createPaginationInfo = (
  params?: {
    per_page?: number;
    total?: number;
    page?: number;
  },
): DataTableProps["paginationInfo"] => {
  const perPage = params?.per_page || 50;
  const total = params?.total || 0;
  const page = params?.page || 1;
  const totalPages = Math.ceil(total / perPage) || 1;

  return {
    limit: perPage,
    total: total,
    page_size: totalPages,
    page: page,
  };
};
