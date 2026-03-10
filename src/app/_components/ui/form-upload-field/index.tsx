import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Typography,
  Stack,
  ButtonProps,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { RestoreFromTrashOutlined, CloudUpload } from "@mui/icons-material";
import HelperText from "../helper-text";

const VisuallyHiddenInput = styled("input")({
  opacity: 0,
  position: "absolute",
  width: "100%",
  height: "100%",
  cursor: "pointer",
});

const ImageWrapper = styled(Box)({
  position: "relative",
  width: 150,
  height: 150,
  borderRadius: 8,
  overflow: "hidden",
  marginRight: 8,
});

const RemoveButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(255,255,255,0.7)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
  },
});

const UploadContainer = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  border: "2px dashed #c4c4c4",
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: "center",
  position: "relative",
  cursor: "pointer",
  backgroundColor: "#fafafa",
  transition: "border-color 0.3s",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

interface UploadProps extends ButtonProps {
  error?: boolean;
}

const Upload = styled(Button, {
  shouldForwardProp: (prop) => prop !== "error",
})<UploadProps>(({ theme }) => ({
  backgroundColor: theme.palette.text.disabled,
  width: "150px",
}));

interface Props {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  error?: boolean;
  required?: boolean;
  helper?: string;
  acceptFormat?: string;
  uploadDesc?: string;
  isV2?: boolean;
  onRemove?: () => void;
}

const FormUploadField = ({
  acceptFormat = ".jpg,.jpeg,.png",
  uploadDesc = "Format Gambar PNG, JPG, JPEG\nUkuran Maksimal 10 MB",
  helper,
  required,
  error,
  label,
  name,
  onChange,
  value,
  isV2 = false,
  onRemove,
}: Props) => {
  return (
    <FormControl required={required} fullWidth>
      <FormLabel htmlFor={name} error={!!error} required={required} sx={{ mb: 1 }}>
        {label}
      </FormLabel>
      {isV2 ? (
        <UploadContainer
          as="label"
          sx={{ padding: value ? 2 : 4, textAlign: value ? "left" : "center" }}
        >
          {value ? (
            <ImageWrapper>
              <img
                src={value}
                alt={"Image Upload"}
                width={150}
                height={150}
                style={{
                  cursor: "pointer",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <RemoveButton size="small" onClick={onRemove}>
                <RestoreFromTrashOutlined fontSize="small" />
              </RemoveButton>
            </ImageWrapper>
          ) : (
            <>
              <CloudUpload sx={{ fontSize: 40, color: "#9e9e9e" }} />
              <Typography variant="body2" color="textSecondary" mt={1} whiteSpace="pre-line">
                {uploadDesc}
              </Typography>
              <VisuallyHiddenInput
                id={name}
                type="file"
                onChange={onChange}
                accept={acceptFormat}
              />
            </>
          )}
        </UploadContainer>
      ) : (
        // )}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Upload error={error} component="label" variant="contained">
            Browser
            <VisuallyHiddenInput id={name} type="file" onChange={onChange} accept={acceptFormat} />
          </Upload>

          <HelperText>{value}</HelperText>
        </Box>
      )}
      <Stack direction="row" justifyContent="space-between">
        <HelperText>{uploadDesc}</HelperText>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        {helper && <HelperText error={error}>{helper}</HelperText>}
      </Stack>
    </FormControl>
  );
};

export default FormUploadField;
