import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { Page } from "@/app/_components/ui";
import { TProkerProgramPayload } from "@/api/proker/program/type";

import ProgramForm from "../_components/form";
import useCreateProgram from "../_hooks/use-create-program";
import { TProgramFormData } from "../_components/form/schema";

const CreateProgramPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateProgram();

  const handleSubmit = (data: TProgramFormData) => {
    const payload: TProkerProgramPayload = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Program", { variant: "success" });
        navigate("/proker/program");
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Program", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Data Program"
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
          label: "Tambah Program",
          path: null,
        },
      ]}
    >
      <ProgramForm loading={mutation.isPending} handleSubmit={handleSubmit} defaultValues={{ status: "DRAFT" }} />
    </Page>
  );
};

export default CreateProgramPage;
