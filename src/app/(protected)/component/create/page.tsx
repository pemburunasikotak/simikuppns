import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
import { TComponentRealizationCreateRequest } from "@/api/master/component-realization/type";

import ComponentRealizationForm from "../_components/form";
import useCreateComponentRealization from "./_hooks/use-create-component-realization";
import { TComponentRealizationFormData } from "../_components/form/schema";

const CreateComponentRealizationPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateComponentRealization();

  const handleSubmit = (data: TComponentRealizationFormData) => {
    const payload: TComponentRealizationCreateRequest = {
      idComponent: data.idComponent,
      idPeriod: data.idPeriod,
      value: data.value,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Realisasi Komponen", { variant: "success" });
        navigate(paths.component.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Realisasi Komponen", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Tambah Realisasi Komponen"
      breadcrumbs={[
        {
          label: "Realisasi Komponen",
          path: paths.component.list,
        },
        {
          label: "Tambah Realisasi",
          path: null,
        },
      ]}
    >
      <ComponentRealizationForm
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{}}
      />
    </Page>
  );
};

export default CreateComponentRealizationPage;
