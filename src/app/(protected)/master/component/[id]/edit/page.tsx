import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";

import { Page } from "@/app/_components/ui";
import { TComponentCreateRequest } from "@/api/master/component/type";
import { paths } from "@/commons/constants/paths";

import { TComponentFormData } from "../../_components/form/schema";
import ComponentForm from "../../_components/form";
import useEditComponent from "./_hooks/use-edit-iku";
import useGetDetailComponent from "../../_hooks/use-get-detail-iku";

const EditComponentPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const query = useGetDetailComponent({ id: params.id! });

  const data = query.data?.result;

  const mutation = useEditComponent({ id: params.id! });

  const handleSubmit = (data: TComponentFormData) => {
    const payload: TComponentCreateRequest = data;

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah Component", { variant: "success" });
        navigate(paths.master.component.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah Component", { variant: "error" });
      },
    });
  };

  return (
    <Page
      loading={query.isLoading}
      title="Data IKP"
      breadcrumbs={[
        {
          label: "Master Data",
          path: paths.master.component.list,
        },
        {
          label: "IKP",
          path: paths.master.component.list,
        },
        {
          label: "Edit IKP",
          path: null,
        },
      ]}
    >
      <ComponentForm
        isEdit
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{
          code: data?.code,
          name: data?.name,
          description: data?.description,
          periodType: data?.periodType,
        }}
      />
    </Page>
  );
};

export default EditComponentPage;
