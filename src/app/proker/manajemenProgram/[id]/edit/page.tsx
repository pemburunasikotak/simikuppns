import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";

import { Page } from "@/app/_components/ui";
import { TDefaultProgramPayload } from "@/api/proker/manajemenProgram/type";

import DefaultProgramForm from "../../_components/form";
import useUpdateDefaultProgram from "../../_hooks/use-update-default-program";
import useGetDefaultProgram from "../../_hooks/use-get-default-program";
import { TDefaultProgramFormData } from "../../_components/form/schema";

const EditDefaultProgramPage = () => {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: programData, isLoading } = useGetDefaultProgram(id as string, !!id);
  const mutation = useUpdateDefaultProgram();

  const handleSubmit = (data: TDefaultProgramFormData) => {
    if (!id) return;

    const payload: TDefaultProgramPayload = {
      ikuId: data.ikuId.value,
      ikuCode: data.ikuCode,
      title: data.title,
      description: data.description,
    };

    mutation.mutate({ id, payload }, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah Program", { variant: "success" });
        navigate("/proker/manajemenProgram");
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah Program", { variant: "error" });
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const defaultValues: Partial<TDefaultProgramFormData> = programData?.data
    ? {
        ikuId: {
          value: programData.data.ikuId,
          label: programData.data.title || "Selected IKU",
        },
        ikuCode: programData.data.ikuCode,
        title: programData.data.title,
        description: programData.data.description,
      }
    : {};

  return (
    <Page
      title="Edit Program"
      breadcrumbs={[
        {
          label: "Proker",
          path: "/proker",
        },
        {
          label: "Manajemen Program",
          path: "/proker/manajemenProgram",
        },
        {
          label: "Edit Program",
          path: null,
        },
      ]}
    >
      <DefaultProgramForm
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={defaultValues}
      />
    </Page>
  );
};

export default EditDefaultProgramPage;
