import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { useState } from "react";

import { Page } from "@/app/_components/ui";
import { TProkerProgramPayload } from "@/api/proker/program/type";
import { uploadProkerDocument } from "@/api/proker/program/api";

import ProgramForm from "../_components/form";
import useCreateProgram from "../_hooks/use-create-program";
import { TProgramFormData } from "../_components/form/schema";

const CreateProgramPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateProgram();

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (data: TProgramFormData) => {
    setIsUploading(true);
    try {
      const indicators = await Promise.all(
        (data.indicators || []).map(async (ind) => {
          let propsalUrl = ind.propsal;
          let rabUrl = ind.rab;

          if (ind.propsal instanceof File) {
            propsalUrl = await uploadProkerDocument(ind.propsal, "PROPOSAL");
          }
          if (ind.rab instanceof File) {
            rabUrl = await uploadProkerDocument(ind.rab, "RAB");
          }

          return {
            ...ind,
            propsal: propsalUrl,
            rab: rabUrl,
            proposalDocumentId: propsalUrl,
            rabDocumentId: rabUrl,
          };
        })
      );

      const payload: TProkerProgramPayload = {
        ...data,
        indicators,
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
    } catch {
      enqueueSnackbar("Gagal mengupload dokumen", { variant: "error" });
    } finally {
      setIsUploading(false);
    }
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
      <ProgramForm loading={mutation.isPending || isUploading} handleSubmit={handleSubmit} defaultValues={{ status: "DRAFT" }} />
    </Page>
  );
};

export default CreateProgramPage;
