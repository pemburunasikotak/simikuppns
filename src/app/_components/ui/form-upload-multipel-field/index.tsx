import React from "react";
import { Box, FormControl, FormLabel, Typography, Stack, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { RestoreFromTrashOutlined, CloudUpload, Add } from "@mui/icons-material";
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
  flexShrink: 0,
});

const RemoveButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  left: "50%",
  zIndex: 10,
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

interface Props {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string[];
  error?: boolean;
  required?: boolean;
  helper?: string;
  acceptFormat?: string;
  uploadDesc?: string;
  isV2?: boolean;
  onRemove?: (index: number) => void;
}

const FormUploadMultipleField = ({
  acceptFormat = ".jpg,.jpeg,.png",
  uploadDesc = "Format Gambar PNG, JPG, JPEG\nUkuran Maksimal 10 MB",
  helper,
  required,
  error,
  label,
  name,
  onChange,
  value,
  onRemove,
}: Props) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const lengthValue = (value?.length && value.length > 0) || false;
  return (
    <FormControl required={required} fullWidth>
      <FormLabel htmlFor={name} error={!!error} required={required} sx={{ mb: 1 }}>
        {label}
      </FormLabel>
      <UploadContainer
        as="label"
        sx={{
          padding: lengthValue ? 2 : 4,
          textAlign: lengthValue ? "left" : "center",
        }}
      >
        {lengthValue ? (
          <Box
            sx={{
              overflowX: "auto",
              width: "100%",

              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                width: "max-content",
              }}
            >
              {value?.map((image, index) => (
                <ImageWrapper key={index} sx={{ flexShrink: 0 }}>
                  <img
                    src={image}
                    alt="Uploaded"
                    width={150}
                    height={150}
                    style={{
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <RemoveButton size="small" onClick={() => onRemove?.(index)}>
                    <RestoreFromTrashOutlined fontSize="small" />
                  </RemoveButton>
                </ImageWrapper>
              ))}

              <IconButton
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: "1px dashed #ccc",
                  width: 150,
                  height: 150,
                  borderRadius: 2,
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Add fontSize="large" />
                <VisuallyHiddenInput
                  id={name}
                  type="file"
                  onChange={onChange}
                  accept={acceptFormat}
                  ref={fileInputRef}
                />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 40, color: "#9e9e9e" }} />
            <Typography variant="body2" color="textSecondary" mt={1} whiteSpace="pre-line">
              {uploadDesc}
            </Typography>
            <VisuallyHiddenInput id={name} type="file" onChange={onChange} accept={acceptFormat} />
          </>
        )}
      </UploadContainer>

      <Stack direction="row" justifyContent="space-between">
        <HelperText>{uploadDesc}</HelperText>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        {helper && <HelperText error={error}>{helper}</HelperText>}
      </Stack>
    </FormControl>
  );
};

export default FormUploadMultipleField;
