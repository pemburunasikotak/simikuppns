import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
import { TIKUCreateRequest } from "@/api/master/iku/type";

import IKUForm from "../_components/form";
import useCreateIKU from "./_hooks/use-create-iku";
import { TIKUFormData } from "../_components/form/schema";

const CreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateIKU();


  const handleSubmit = (data: TIKUFormData) => {
    const payload: TIKUCreateRequest = data;
    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan IKU", { variant: "success" });
        navigate(paths.master.iku.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan IKU", { variant: "error" });
      },
    });
  };

  return (
    <Page
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
          label: "Tambah IKU",
          path: null,
        },
      ]}
    >
      <IKUForm loading={mutation.isPending} handleSubmit={handleSubmit} defaultValues={{}} />
    </Page>
  );
};

export default CreatePage;
