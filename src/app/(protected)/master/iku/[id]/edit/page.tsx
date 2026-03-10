import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";

import { Page } from "@/app/_components/ui";
import { TIKUCreateRequest } from "@/api/master/iku/type";
import { paths } from "@/commons/constants/paths";

import { TIKUFormData } from "../../_components/form/schema";
import IKUForm from "../../_components/form";
import useEditIKU from "./_hooks/use-edit-iku";
import useGetDetailIKU from "../../_hooks/use-get-detail-iku";

const EditIKUPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const query = useGetDetailIKU({ id: params.id! });

  const data = query.data?.result;

  const mutation = useEditIKU({ id: params.id! });

  const handleSubmit = (data: TIKUFormData) => {
    const payload: TIKUCreateRequest = data;

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah IKU", { variant: "success" });
        navigate(paths.master.iku.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah IKU", { variant: "error" });
      },
    });
  };

  return (
    <Page
      loading={query.isLoading}
      title="Data IKU"
      breadcrumbs={[
        {
          label: "Master Data",
          path: paths.master.iku.list,
        },
        {
          label: "IKU",
          path: paths.master.iku.list,
        },
        {
          label: "Edit IKU",
          path: null,
        },
      ]}
    >
      <IKUForm
        isEdit
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{
          code: data?.code,
          name: data?.name,
          description: data?.description,
        }}
      />
    </Page>
  );
};

export default EditIKUPage;
