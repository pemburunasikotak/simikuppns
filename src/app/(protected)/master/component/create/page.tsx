import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
import { TComponentCreateRequest } from "@/api/master/component/type";

import ComponentForm from "../_components/form";
import useCreateComponent from "./_hooks/use-create-component";
import { TComponentFormData } from "../_components/form/schema";

const CreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateComponent();

  const handleSubmit = (data: TComponentFormData) => {
    const payload: TComponentCreateRequest = data;
    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Component", { variant: "success" });
        navigate(paths.master.component.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Component", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Data Component"
      breadcrumbs={[
        {
          label: "Master Data",
          path: paths.master.component.list,
        },
        {
          label: "Component",
          path: paths.master.component.list,
        },
        {
          label: "Tambah Component",
          path: null,
        },
      ]}
    >
      <ComponentForm loading={mutation.isPending} handleSubmit={handleSubmit} defaultValues={{}} />
    </Page>
  );
};

export default CreatePage;

