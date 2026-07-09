import { FC, ReactElement } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useSnackbar } from "notistack";
import { Page } from "@/app/_components/ui";

import AktivitasForm from "../../_components/form";
import { useUpdateProgramActivity } from "../../_hooks/use-update-program-activity";
import { TActivityFormData } from "../../_components/form/schema";
import { TProkerAktivitas } from "@/api/proker/aktivitas/type";

const EditAktivitasPage: FC = (): ReactElement => {
  const { id, activityId } = useParams<{ id: string; activityId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useLocation();

  const activityData: TProkerAktivitas | undefined = state?.activity;

  // State activity data passed from previous page

  const updateMutation = useUpdateProgramActivity();

  const handleSubmit = (formData: TActivityFormData) => {
    const payload = {
      title: formData.title,
      description: formData.description || "",
      weight: formData.weight,
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
    };

    updateMutation.mutate(
      { id: activityId as string, payload },
      {
        onSuccess: () => {
          enqueueSnackbar("Berhasil mengubah aktivitas", { variant: "success" });
          navigate(`/proker/program/${id}/aktivitas`);
        },
        onError: () => {
          enqueueSnackbar("Gagal mengubah aktivitas", { variant: "error" });
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(`/proker/program/${id}/aktivitas`);
  };

  const defaultValues = activityData ? {
    title: activityData.title,
    description: activityData.description || "",
    weight: activityData.weight || 0,
    startDate: activityData.startDate ? activityData.startDate.split("T")[0] : "",
    endDate: activityData.endDate ? activityData.endDate.split("T")[0] : "",
  } : undefined;

  return (
    <Page
      title="Edit Aktivitas"
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
          label: "Edit",
          path: null,
        },
      ]}
    >
      <AktivitasForm 
        loading={updateMutation.isPending} 
        handleSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
      />
    </Page>
  );
};

export default EditAktivitasPage;
