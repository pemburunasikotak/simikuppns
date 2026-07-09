import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import { Page } from "@/app/_components/ui";
import { TProkerProgramPayload } from "@/api/proker/program/type";

import ProgramForm from "../../_components/form";
import useUpdateProgram from "../../_hooks/use-update-program";
import useGetProgram from "../../_hooks/use-get-program";
import { TProgramFormData } from "../../_components/form/schema";

const EditProgramPage = () => {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data: programData, isLoading } = useGetProgram(id as string);
  const mutation = useUpdateProgram(id as string);

  const [defaultValues, setDefaultValues] = useState<Partial<TProgramFormData> | null>(null);

  useEffect(() => {
    if (programData?.data) {
      const data = programData.data;
      setDefaultValues({
        title: data.title,
        code: data.code,
        description: data.description || "",
        objective: data.objective || "",
        year: data.year,
        unitId: data.unitId || "",
        // categoryId: data.categoryId || "",
        categoryName: data.categoryName || "",
        status: data.status || "DRAFT",
        startDate: data.startDate ? data.startDate.split("T")[0] : "",
        endDate: data.endDate ? data.endDate.split("T")[0] : "",
        budget: data.budget || 0,
        picId: data.picId || "",
      });
    }
  }, [programData]);

  const handleSubmit = (data: TProgramFormData) => {
    const payload: TProkerProgramPayload = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah Program", { variant: "success" });
        navigate("/proker/program");
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah Program", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Ubah Program"
      loading={isLoading}
      breadcrumbs={[
        {
          label: "Manajemen Program",
          path: "/proker/program",
        },
        {
          label: "Program",
          path: "/proker/program",
        },
        {
          label: "Ubah Program",
          path: null,
        },
      ]}
    >
      {defaultValues && (
        <ProgramForm
          loading={mutation.isPending}
          handleSubmit={handleSubmit}
          defaultValues={defaultValues as TProgramFormData}
        />
      )}
    </Page>
  );
};

export default EditProgramPage;
