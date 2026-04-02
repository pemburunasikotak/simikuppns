import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";

import PeriodForm from "../../_components/form";
import useEditPeriod from "./_hooks/use-edit-period";
import useGetDetailPeriod from "../../_hooks/use-get-detail-period";
import { TPeriodFormData } from "../../_components/form/schema";

const EditPeriodPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();

  const detailQuery = useGetDetailPeriod({ id: params.id! });
  const mutation = useEditPeriod();

  const period = detailQuery.data?.result;

  const handleSubmit = (data: TPeriodFormData) => {
    mutation.mutate(
      {
        params: { id: params.id! },
        req: {
          year: data.year,
          periodType: data.periodType,
          periodValue: data.periodValue,
          periodName: data.periodName,
          level: data.level,
          parentId: data.parentId ?? null,
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Berhasil mengubah Periode", { variant: "success" });
          navigate(paths.period.list);
        },
        onError: () => {
          enqueueSnackbar("Gagal mengubah Periode", { variant: "error" });
        },
      },
    );
  };

  return (
    <Page
      loading={detailQuery.isLoading}
      title="Edit Periode"
      breadcrumbs={[
        {
          label: "Periode",
          path: paths.period.list,
        },
        {
          label: "Edit Periode",
          path: null,
        },
      ]}
    >
      <PeriodForm
        loading={mutation.isPending}
        isEdit
        handleSubmit={handleSubmit}
        defaultValues={
          period
            ? {
                year: period.year,
                periodType: period.periodType,
                periodValue: period.periodValue,
                periodName: period.periodName,
                level: period.level,
                parentId: period.parentId,
              }
            : {}
        }
      />
    </Page>
  );
};

export default EditPeriodPage;
