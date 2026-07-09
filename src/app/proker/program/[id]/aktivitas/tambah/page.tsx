import { FC, ReactElement } from "react";
import { useParams, useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { Page } from "@/app/_components/ui";

import AktivitasForm from "../_components/form";
import { useCreateProgramActivity } from "../_hooks/use-create-program-activity";
import { TActivityFormData } from "../_components/form/schema";

const TambahAktivitasPage: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const createMutation = useCreateProgramActivity(id as string);

  const handleSubmit = (formData: TActivityFormData) => {
    const payload = {
      title: formData.title,
      description: formData.description || "",
      weight: formData.weight,
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan aktivitas", { variant: "success" });
        navigate(`/proker/program/${id}/aktivitas`);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan aktivitas", { variant: "error" });
      },
    });
  };

  const handleCancel = () => {
    navigate(`/proker/program/${id}/aktivitas`);
  };

  return (
    <Page
      title="Tambah Aktivitas"
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
          label: "Aktivitas",
          path: `/proker/program/${id}/aktivitas`,
        },
        {
          label: "Tambah",
          path: null,
        },
      ]}
    >
      <AktivitasForm 
        loading={createMutation.isPending} 
        handleSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Page>
  );
};

export default TambahAktivitasPage;
