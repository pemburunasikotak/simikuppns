import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
import { TPeriodCreateRequest } from "@/api/period/type";

import PeriodForm from "../_components/form";
import useCreatePeriod from "./_hooks/use-create-period";
import { TPeriodFormData } from "../_components/form/schema";

const CreatePeriodPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreatePeriod();

  const handleSubmit = (data: TPeriodFormData) => {
    const payload: TPeriodCreateRequest = {
      year: data.year,
      periodType: data.periodType,
      periodValue: data.periodValue,
      periodName: data.periodName,
      level: data.level,
      parentId: data.parentId ?? null,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Periode", { variant: "success" });
        navigate(paths.period.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Periode", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Tambah Periode"
      breadcrumbs={[
        {
          label: "Periode",
          path: paths.period.list,
        },
        {
          label: "Tambah Periode",
          path: null,
        },
      ]}
    >
      <PeriodForm
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{}}
      />
    </Page>
  );
};

export default CreatePeriodPage;
