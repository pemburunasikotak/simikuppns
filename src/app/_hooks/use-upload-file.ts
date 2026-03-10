import { uploadFile } from '@/api/api';
// import { TUploadFileResponse } from '@/api/type';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { TErrorResponse } from "@/commons/types/response";
import { queryKeys } from '@/commons/constants/query-key';

const useUploadFile = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: [queryKeys.upload_file],
    mutationFn: uploadFile,
    onSuccess: () => {},
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.errors, { variant: 'error' });
    },
  });
};

export default useUploadFile;
