import { TTransactionStatus } from "@/api/transactions/type";
import { ChipProps } from "@/app/_components/ui/chip";
import { Nullable } from "@/commons/types/common";

const getTransactionStatus = (status: Nullable<TTransactionStatus>): ChipProps => {
  switch (status) {
    case "success":
      return { label: "Berhasil", color: "rgba(79, 196, 8, 1)", bg: "rgba(79, 196, 8, 0.12)" };
    case "pending":
      return { label: "Menunggu", color: "rgba(253, 154, 86, 1)", bg: "rgba(253, 154, 86, 0.2)" };
    case "cancel":
      return { label: "Batal", color: "rgba(0, 182, 155, 1)", bg: "rgba(0, 182, 155, 0.2)" };
    default:
      return { label: status || "", color: undefined, bg: undefined };
  }
};

export default getTransactionStatus;
