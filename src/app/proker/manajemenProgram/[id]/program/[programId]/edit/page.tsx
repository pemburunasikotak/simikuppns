import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";

import { Page } from "@/app/_components/ui";
import { TDefaultProgramPayload } from "@/api/proker/manajemenProgram/type";

import DefaultProgramForm from "../../../../_components/form";
import useUpdateDefaultProgram from "../../../../_hooks/use-update-default-program";
import useGetDefaultProgram from "../../../../_hooks/use-get-default-program";
import { TDefaultProgramFormData } from "../../../../_components/form/schema";

const EditDefaultProgramPage = () => {
  const { id, programId } = useParams<{ id: string; programId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: programData, isLoading } = useGetDefaultProgram(programId as string, !!programId);
  const mutation = useUpdateDefaultProgram();

  const handleSubmit = (data: TDefaultProgramFormData) => {
    if (!programId) return;

    const payload: TDefaultProgramPayload = {
      ikuId: data.ikuId.value,
      ikuCode: data.ikuCode,
      title: data.title,
      description: data.description,
      indicators: data.indicators && data.indicators.length > 0 ? data.indicators.map(ind => ({
        name: ind.name,
        unit: ind.masterUnitTypeId,
        order: ind.order,
        status: "DRAFT"
      })) : undefined,
    };

    mutation.mutate({ id: programId, payload }, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah Program", { variant: "success" });
        navigate(`/proker/manajemenProgram/${id}`);
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
      indicators: programData.data.indicators?.map(indicator => ({
        name: indicator.name,
        masterUnitTypeId: typeof indicator.masterUnitType === 'string' ? indicator.masterUnitType : indicator.masterUnitType?.id || "",
        order: indicator.order,
      })) || [],
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
          label: "Program",
          path: `/proker/manajemenProgram/${id}`,
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
        isEditMode={true}
      />
    </Page>
  );
};

export default EditDefaultProgramPage;
