import { uploadVideos } from '@/api/api';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { TErrorResponse } from "@/commons/types/response";

const useUploadVideo = () => {
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationKey: ['upload-video'],
        mutationFn: uploadVideos,
        onSuccess: () => { },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.errors, { variant: 'error' });
        },
    });
};

export default useUploadVideo;
