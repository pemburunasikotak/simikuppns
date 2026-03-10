// import { useSnackbar } from "notistack";
// import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
// import { TFacilitiesRequest } from "@/api/master-data/facilities/type";

import FacilitiesForm from "../_components/form";
// import useCreateFacilities from "./_hooks/use-create-facilities";
import { TFacilitiesFormData } from "../_components/form/schema";

const CreatePage = () => {
  // const { enqueueSnackbar } = useSnackbar();
  // const navigate = useNavigate();

  // const mutation = useCreateFacilities();

  const handleSubmit = (data: TFacilitiesFormData) => {
    // const payload: TFacilitiesRequest = {
    //   ...data,
    // };

    // mutation.mutate(payload, {
    //   onSuccess: () => {
    //     enqueueSnackbar("Berhasil menambahkan Fasilitas", { variant: "success" });
    //     navigate(paths.master_data.facilities.list);
    //   },
    //   onError: () => {
    //     enqueueSnackbar("Gagal menambahkan Fasilitas", { variant: "error" });
    //   },
    // });
    console.log('Data', data)
  };

  return (
    <Page
      title="Data Fasilitas"
      breadcrumbs={[
        {
          label: "Master Data",
          path: paths.master_data.facilities.list,
        },
        {
          label: "Fasilitas",
          path: paths.master_data.facilities.list,
        },
        {
          label: "Tambah Fasilitas",
          path: null,
        },
      ]}
    >
      <FacilitiesForm loading={false} handleSubmit={handleSubmit} defaultValues={{}} />
    </Page>
  );
};

export default CreatePage;
