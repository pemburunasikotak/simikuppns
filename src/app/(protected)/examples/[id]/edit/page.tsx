import { useParams } from "react-router";

import { Page } from "@/app/_components/ui";
// import { TFacilitiesRequest } from "@/api/master-data/facilities/type";
import { paths } from "@/commons/constants/paths";

import { TFacilitiesFormData } from "../../_components/form/schema";
import FacilitiesForm from "../../_components/form";
import useEditFacilities from "./_hooks/use-edit-facilities";
import useGetDetailFacilities from "../_hooks/use-get-detail-facilities";

const EditFacilitiesPage = () => {
  const params = useParams();
  // const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();
  const query = useGetDetailFacilities({ id: params.id! });

  const data = query.data?.result;

  const mutation = useEditFacilities({ id: params.id! });

  const handleSubmit = (data: TFacilitiesFormData) => {
    console.log('Data', data)
    // const payload: TFacilitiesRequest = {
    //   ...data,
    //   id: data.type.value,
    // };

    // mutation.mutate(payload, {
    //   onSuccess: () => {
    //     enqueueSnackbar("Berhasil mengubah Fasilitas", { variant: "success" });
    //     navigate(paths.master_data.facilities.list);
    //   },
    //   onError: () => {
    //     enqueueSnackbar("Gagal mengubah Fasilitas", { variant: "error" });
    //   },
    // });
  };

  return (
    <Page
      loading={query.isLoading}
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
          label: "Edit Fasilitas",
          path: null,
        },
      ]}
    >
      <FacilitiesForm
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{
          name: data?.name,
          // type: { label: data?.type.name || "", value: data?.type.id || "" },
        }}
      />
    </Page>
  );
};

export default EditFacilitiesPage;
