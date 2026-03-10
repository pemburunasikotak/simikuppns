import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";

import { Page } from "@/app/_components/ui";
import { TTransactionRequest } from "@/api/transactions/type";
import { paths } from "@/commons/constants/paths";

import { TTransactionFormData } from "../../_components/form/schema";
import TransactionForm from "../../_components/form";
import useGetDetailTransaction from "../_hooks/use-get-detail-transaction";
import useEditTransaction from "./_hooks/use-edit-transaction";

const CreateTransactionPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const query = useGetDetailTransaction({ id: params.id! });

  const data = query.data?.result;

  const mutation = useEditTransaction({ id: params.id! });

  const handleSubmit = (data: TTransactionFormData) => {
    const payload: TTransactionRequest = {
      ...data,
      customerName: data.customerName ?? "",
      customerEmail: data.customerEmail ?? "",
      customerWhatsapp: data.customerWhatsapp ?? "",
      bookingDate: data.bookingDate ?? "",
      totalPrice: data.totalPrice ?? "",
      status: data.status ?? "",
      customerAddress: data.customerAddress ?? "",
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah Transaksi", { variant: "success" });
        navigate(paths.transaction.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah Transaksi", { variant: "error" });
      },
    });
  };

  return (
    <Page
      loading={query.isLoading}
      title="Data Transaksi"
      breadcrumbs={[
        {
          label: "Transaksi",
          path: "/transactions",
        },
        {
          label: "Edit Transaksi",
          path: null,
        },
      ]}
    >
      <TransactionForm
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{
          customerName: data?.customerName || "",
          customerEmail: data?.customerEmail,
          customerWhatsapp: data?.customerWhatsapp,
          customerAddress: data?.customerAddress,
          bookingDate: data?.bookingDate,
          totalPrice: data?.totalPrice,
          status: data?.status,
        }}
      />
    </Page>
  );
};

export default CreateTransactionPage;
