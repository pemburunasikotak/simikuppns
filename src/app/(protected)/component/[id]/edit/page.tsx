import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";

import ComponentRealizationForm from "../../_components/form";
import useEditComponentRealization from "./_hooks/use-edit-component-realization";
import useGetDetailComponentRealization from "../../_hooks/use-get-detail-component-realization";
import { TComponentRealizationFormData } from "../../_components/form/schema";

const EditComponentRealizationPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();

  const detailQuery = useGetDetailComponentRealization({ id: params.id! });
  const mutation = useEditComponentRealization();

  const realization = detailQuery.data?.result;

  const handleSubmit = (data: TComponentRealizationFormData) => {
    mutation.mutate(
      {
        params: { id: params.id! },
        req: {
          idComponent: data.idComponent,
          year: data.year,
          month: data.month,
          value: data.value,
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Berhasil mengubah Realisasi Komponen", { variant: "success" });
          navigate(paths.component.list);
        },
        onError: () => {
          enqueueSnackbar("Gagal mengubah Realisasi Komponen", { variant: "error" });
        },
      },
    );
  };

  return (
    <Page
      loading={detailQuery.isLoading}
      title="Edit Realisasi Komponen"
      breadcrumbs={[
        {
          label: "Realisasi Komponen",
          path: paths.component.list,
        },
        {
          label: "Edit Realisasi",
          path: null,
        },
      ]}
    >
      <ComponentRealizationForm
        loading={mutation.isPending}
        isEdit
        handleSubmit={handleSubmit}
        defaultValues={
          realization
            ? {
              idComponent: realization.realization.idComponent,
              year: Number(realization.realization.year),
              month: Number(realization.realization.month),
              value: Number(realization.realization.value),
            }
            : {}
        }
      />
    </Page>
  );
};

export default EditComponentRealizationPage;
