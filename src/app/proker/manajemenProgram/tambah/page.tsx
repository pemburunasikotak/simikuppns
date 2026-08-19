import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { Page } from "@/app/_components/ui";
import { TDefaultProgramPayload } from "@/api/proker/manajemenProgram/type";
import DefaultProgramForm from "../_components/form";
import useCreateDefaultProgram from "../_hooks/use-create-default-program";
import { TDefaultProgramFormData } from "../_components/form/schema";

const CreateDefaultProgramPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateDefaultProgram();

  const handleSubmit = (data: TDefaultProgramFormData) => {
    const payload: TDefaultProgramPayload = {
      ikuId: data.ikuId?.value || "",
      ikuCode: data.ikuCode || "",
      title: data.title,
      description: data.description,
      indicators: data.indicators && data.indicators.length > 0 ? data.indicators.map(ind => ({
        name: ind.name,
        masterUnitTypeId: ind.masterUnitTypeId,
        category: ind.category,
        order: ind.order,
        status: "DRAFT",
      })) : undefined,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Program", { variant: "success" });
        navigate(-1);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Program", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Tambah Program"
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
          label: "Tambah Program",
          path: null,
        },
      ]}
    >
      <DefaultProgramForm loading={mutation.isPending} handleSubmit={handleSubmit} />
    </Page>
  );
};

export default CreateDefaultProgramPage;
